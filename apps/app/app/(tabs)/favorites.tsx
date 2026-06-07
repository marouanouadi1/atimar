import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/tokens';
import {
  getCourtListItemsByIds,
  getCourtsByVenue,
  getVenueById,
} from '@atimar/data';
import {
  CourtCard,
  EmptyState,
  FilterChip,
  ScreenContainer,
  VenueCard,
  textStyle,
} from '@/ui';
import { useAppState } from '@/state/AppState';

type ViewMode = 'courts' | 'venues';

export default function Favorites() {
  const router = useRouter();
  const { favorites, isFavCourt, toggleFavCourt, toggleFavVenue } = useAppState();
  const [view, setView] = useState<ViewMode>('courts');

  const courts = getCourtListItemsByIds(favorites.courtIds);
  const venues = favorites.venueIds
    .map((id) => getVenueById(id))
    .filter((v): v is NonNullable<typeof v> => v != null);

  const openVenue = (venueId: string) => router.push({ pathname: '/venue/[id]', params: { id: venueId } });

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <Text style={textStyle('h1App', 'ink')}>Preferiti</Text>

        <View style={styles.segment}>
          <FilterChip label="Campi" variant="segment" active={view === 'courts'} onPress={() => setView('courts')} />
          <FilterChip label="Strutture" variant="segment" active={view === 'venues'} onPress={() => setView('venues')} />
        </View>

        {view === 'courts' ? (
          courts.length === 0 ? (
            <EmptyState
              icon="heart-outline"
              title="Nessun campo salvato"
              desc="Tocca il cuore su un campo per ritrovarlo qui."
            />
          ) : (
            <View style={styles.list}>
              {courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  variant="compact"
                  isFav={isFavCourt(court.id)}
                  onFav={() => toggleFavCourt(court.id)}
                  onPress={() => openVenue(court.venueId)}
                />
              ))}
            </View>
          )
        ) : venues.length === 0 ? (
          <EmptyState
            icon="business-outline"
            title="Nessuna struttura salvata"
            desc="Salva una struttura per tenerla a portata di mano."
          />
        ) : (
          <View style={styles.list}>
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                courtCount={getCourtsByVenue(venue.id).length}
                isFav
                onFav={() => toggleFavVenue(venue.id)}
                onPress={() => openVenue(venue.id)}
              />
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.lg, paddingTop: theme.spacing.sm },
  segment: {
    flexDirection: 'row',
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.pill,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  list: { gap: theme.spacing.md },
});
