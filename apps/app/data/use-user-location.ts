import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import type { GeoPoint } from "@atimar/types";

export type UserLocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "unavailable"
  | "error";

let cachedLocation: GeoPoint | null = null;

function toGeoPoint(coords: { latitude: number; longitude: number }): GeoPoint {
  return { lat: coords.latitude, lng: coords.longitude };
}

function isWebGeolocationAvailable(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.geolocation !== "undefined"
  );
}

function getWebPosition(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!isWebGeolocationAvailable()) {
      reject(new Error("Geolocalizzazione non disponibile in questo browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(toGeoPoint(position.coords)),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        maximumAge: 5 * 60_000,
        timeout: 12_000,
      },
    );
  });
}

async function getNativePosition(): Promise<GeoPoint | null> {
  const current = await Location.getForegroundPermissionsAsync();
  const permission =
    current.status === Location.PermissionStatus.GRANTED
      ? current
      : await Location.requestForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return toGeoPoint(position.coords);
}

export function useUserLocation() {
  const [location, setLocation] = useState<GeoPoint | null>(cachedLocation);
  const [status, setStatus] = useState<UserLocationStatus>(
    cachedLocation ? "granted" : "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const nextLocation =
        process.env.EXPO_OS === "web"
          ? await getWebPosition()
          : await getNativePosition();

      if (!nextLocation) {
        setStatus("denied");
        return;
      }

      cachedLocation = nextLocation;
      setLocation(nextLocation);
      setStatus("granted");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossibile recuperare la posizione.";
      setError(message);
      setStatus(
        process.env.EXPO_OS === "web" && !isWebGeolocationAvailable()
          ? "unavailable"
          : "error",
      );
    }
  }, []);

  useEffect(() => {
    if (cachedLocation) return;

    let active = true;

    async function hydrateGrantedLocation() {
      if (process.env.EXPO_OS === "web") {
        const permissions =
          typeof navigator !== "undefined" ? navigator.permissions : undefined;
        if (!permissions?.query || !isWebGeolocationAvailable()) return;

        try {
          const result = await permissions.query({
            name: "geolocation" as PermissionName,
          });
          if (!active) return;
          if (result.state === "denied") setStatus("denied");
          if (result.state === "granted") void requestLocation();
        } catch {
          // Some browsers expose geolocation but not the permissions query.
        }
        return;
      }

      const permission = await Location.getForegroundPermissionsAsync();
      if (!active) return;
      if (permission.status === Location.PermissionStatus.DENIED) {
        setStatus("denied");
      } else if (permission.status === Location.PermissionStatus.GRANTED) {
        void requestLocation();
      }
    }

    void hydrateGrantedLocation();

    return () => {
      active = false;
    };
  }, [requestLocation]);

  return {
    location,
    status,
    error,
    hasLocation: location != null,
    requestLocation,
  };
}
