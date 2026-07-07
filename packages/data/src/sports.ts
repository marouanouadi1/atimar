/**
 * Sports, levels, days and time-of-day catalogs.
 * Icon strings are hints mapped to @expo/vector-icons in the UI layer.
 */

import type { DayLabel, Level, Sport, TimeId } from "@atimar/types";

export const SPORTS: Sport[] = [
  { id: "padel", label: "Padel", icon: "tennisball" },
  { id: "tennis", label: "Tennis", icon: "tennisball" },
  { id: "calcio", label: "Calcio", icon: "football" },
  { id: "calcio5", label: "Calcio a 5", icon: "football" },
  { id: "calcio7", label: "Calcio a 7", icon: "football" },
  { id: "calcio8", label: "Calcio a 8", icon: "football" },
  { id: "basket", label: "Basket", icon: "basketball" },
  { id: "pallavolo", label: "Pallavolo", icon: "disc" },
  { id: "beachvolley", label: "Beach Volley", icon: "disc" },
  { id: "beachtennis", label: "Beach Tennis", icon: "tennisball" },
  { id: "pickleball", label: "Pickleball", icon: "tennisball" },
  { id: "squash", label: "Squash", icon: "tennisball" },
  { id: "badminton", label: "Badminton", icon: "tennisball" },
  { id: "tennistavolo", label: "Tennistavolo", icon: "tennisball" },
  { id: "nuoto", label: "Nuoto", icon: "water" },
  { id: "running", label: "Running", icon: "walk" },
  { id: "ciclismo", label: "Ciclismo", icon: "bicycle" },
  { id: "crossfit", label: "CrossFit", icon: "barbell" },
  { id: "palestra", label: "Palestra", icon: "barbell" },
  { id: "yoga", label: "Yoga", icon: "leaf" },
  { id: "arrampicata", label: "Arrampicata", icon: "trending-up" },
  { id: "scherma", label: "Scherma", icon: "flash" },
  { id: "boxe", label: "Boxe", icon: "body" },
  { id: "mma", label: "MMA", icon: "body" },
  { id: "judo", label: "Judo", icon: "body" },
  { id: "karate", label: "Karate", icon: "body" },
  { id: "rugby", label: "Rugby", icon: "american-football" },
  { id: "baseball", label: "Baseball", icon: "baseball" },
  { id: "softball", label: "Softball", icon: "baseball" },
  { id: "hockey", label: "Hockey", icon: "snow" },
  { id: "pattinaggio", label: "Pattinaggio", icon: "snow" },
  { id: "golf", label: "Golf", icon: "golf" },
  { id: "freccette", label: "Freccette", icon: "locate" },
  { id: "biliardo", label: "Biliardo", icon: "disc" },
  { id: "bowling", label: "Bowling", icon: "ellipse" },
  { id: "ginnastica", label: "Ginnastica", icon: "body" },
  { id: "atletica", label: "Atletica", icon: "walk" },
];

export const SPORT_BY_ID: Record<string, Sport> = Object.fromEntries(
  SPORTS.map((s) => [s.id, s]),
);

/** Display label for a sport id (falls back to a capitalized id). */
export function sportLabel(sportId: string): string {
  return (
    SPORT_BY_ID[sportId]?.label ??
    sportId.charAt(0).toUpperCase() + sportId.slice(1)
  );
}

export const LEVELS: Level[] = [
  {
    id: "beginner",
    title: "Principiante",
    desc: "Sto iniziando o gioco raramente",
    icon: "leaf",
  },
  {
    id: "intermediate",
    title: "Intermedio",
    desc: "Gioco con regolarità",
    icon: "trending-up",
  },
  {
    id: "advanced",
    title: "Avanzato",
    desc: "Buon livello tecnico e agonistico",
    icon: "flame",
  },
  {
    id: "expert",
    title: "Esperto",
    desc: "Competitivo / ex agonista",
    icon: "trophy",
  },
];

export const DAYS: DayLabel[] = [
  "Lun",
  "Mar",
  "Mer",
  "Gio",
  "Ven",
  "Sab",
  "Dom",
];

export interface TimeOfDay {
  id: TimeId;
  label: string;
  range: string;
  icon: string;
}

export const TIMES: TimeOfDay[] = [
  { id: "morning", label: "Mattina", range: "06–12", icon: "partly-sunny" },
  { id: "afternoon", label: "Pomeriggio", range: "12–17", icon: "sunny" },
  { id: "evening", label: "Sera", range: "17–22", icon: "moon" },
  { id: "night", label: "Notte", range: "22–02", icon: "cloudy-night" },
];
