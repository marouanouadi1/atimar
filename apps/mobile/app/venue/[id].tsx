import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@atimar/theme';
import {
  getCourtsByVenue,
  getReviewsByVenue,
  getVenueById,
  sportLabel,
} from '@atimar/data';
import { formatPrice, formatRating, pluralize } from '@atimar/utils';
import type { Review } from '@atimar/types';
import {
  AvailabilityBadge,
  Button,
  Card,
  CourtHero,
  DetailStat,
  Divider,
  FilterChip,
  Icon,
  IconButton,
  RatingBadge,
  SectionTitle,
  SportTag,
  textStyle,
} from '@atimar/ui-native';
import { useAppState } from '@/state/AppState';

type Tab = 'info' | 'courts' | 'reviews';

export default function VenueDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavVenue, toggleFavVenue } = useAppState();
  const [tab, setTab] = useState<Tab>('info');

  const venue = id ? getVenueById(id) : undefined;

  if (!venue) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top + theme.spacing.xxxl }]}>
        <Text style={textStyle('title', 'ink')}>Struttura non trovata</Text>
        <Button variant="ghost" onPress={() => router.back()}>Torna indietro</Button>
      </View>
    );
  }

  const courts = getCourtsByVenue(venue.id);
  const reviews = getReviewsByVenue(venue.id);
  const isFav = isFavVenue(venue.id);
  const primaryCourt = courts[0];

  const requestBooking = (courtId?: string) =>
    router.push({
      pathname: '/booking/request',
      params: { venueId: venue.id, courtId: courtId ?? primaryCourt?.id ?? '' },
    });

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + theme.layout.ctaHeight + theme.spacing.xxxl }}
      >
        {/* Hero */}
        <CourtHero heroKind={venue.heroKind} sportId={venue.sportIds[0] ?? 'padel'} height={280} rounded={false} />
        <View style={[styles.heroControls, { top: insets.top + theme.spacing.sm }]}>
          <IconButton name="chevron-back" tone="glass" onPress={() => router.back()} accessibilityLabel="Indietro" />
          <IconButton
            name={isFav ? 'heart' : 'heart-outline'}
            tone="glass"
            active={isFav}
            onPress={() => toggleFavVenue(venue.id)}
            accessibilityLabel="Preferito"
          />
        </View>

        {/* Detail card overlapping the hero */}
        <View style={styles.bodyPad}>
          <Card style={styles.detailCard}>
            <View style={styles.detailTop}>
              <SportTag label={sportLabel(venue.sportIds[0] ?? '')} sportId={venue.sportIds[0] ?? 'padel'} />
              <AvailabilityBadge state={venue.open ? 'open' : 'closed'} label={venue.open ? 'Aperto ora' : 'Chiuso'} />
            </View>
            <Text style={textStyle('h2', 'ink')}>{venue.name}</Text>
            <View style={styles.detailMeta}>
              <RatingBadge value={venue.rating} count={venue.reviewsCount} showCount />
              <Text style={textStyle('caption', 'muted')}>· {venue.distance}</Text>
            </View>
            <View style={styles.addressRow}>
              <Icon name="location-outline" size={theme.iconSizes.sm} color="subtle" />
              <Text style={textStyle('caption', 'muted')}>{venue.address}</Text>
            </View>
          </Card>

          {/* Tabs */}
          <View style={styles.tabs}>
            <FilterChip label="Info" variant="segment" active={tab === 'info'} onPress={() => setTab('info')} />
            <FilterChip label="Campi" variant="segment" active={tab === 'courts'} onPress={() => setTab('courts')} />
            <FilterChip label="Recensioni" variant="segment" active={tab === 'reviews'} onPress={() => setTab('reviews')} />
          </View>

          {tab === 'info' ? (
            <InfoTab venue={venue} courtCount={courts.length} />
          ) : tab === 'courts' ? (
            <CourtsTab
              courts={courts.map((c, i) => ({ ...c, free: i % 3 !== 1 }))}
              onRequest={requestBooking}
            />
          ) : (
            <ReviewsTab rating={venue.rating} count={venue.reviewsCount} reviews={reviews} />
          )}
        </View>
      </ScrollView>

      {/* Fixed CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.md }]}>
        <Button variant="lime" icon onPress={() => requestBooking()}>
          Richiedi disponibilità
        </Button>
      </View>
    </View>
  );
}

/* ------------------------------- Info tab ------------------------------- */

function InfoTab({ venue, courtCount }: { venue: NonNullable<ReturnType<typeof getVenueById>>; courtCount: number }) {
  return (
    <View style={styles.section}>
      <Text style={textStyle('body', 'text')}>{venue.description}</Text>

      <View style={styles.statsRow}>
        <DetailStat icon="grid-outline" value={String(courtCount)} label="Campi" />
        <DetailStat icon="navigate-outline" value={venue.distance} label="Distanza" />
        <DetailStat icon={venue.indoor ? 'home-outline' : 'sunny-outline'} value={venue.indoor ? 'Indoor' : 'Outdoor'} label="Tipo" />
        <DetailStat icon="star-outline" value={formatRating(venue.rating)} label="Rating" />
      </View>

      <View style={styles.subsection}>
        <SectionTitle>Servizi</SectionTitle>
        <View style={styles.amenities}>
          {venue.amenities.map((a) => (
            <View key={a} style={styles.amenity}>
              <Icon name="checkmark-circle" size={theme.iconSizes.sm} color="success" />
              <Text style={textStyle('caption', 'text')}>{a}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ------------------------------ Courts tab ------------------------------ */

interface CourtRow {
  id: string;
  name: string;
  sport: string;
  surface: string;
  pricePerHour: number;
  free: boolean;
}

function CourtsTab({ courts, onRequest }: { courts: CourtRow[]; onRequest: (courtId: string) => void }) {
  return (
    <View style={styles.section}>
      {courts.map((court) => (
        <Pressable key={court.id} onPress={() => onRequest(court.id)}>
          <Card style={styles.courtRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={textStyle('bodyStrong', 'ink')}>{court.name}</Text>
              <Text style={textStyle('caption', 'muted')}>{court.sport} · {court.surface}</Text>
            </View>
            <View style={styles.courtRight}>
              <AvailabilityBadge state={court.free ? 'free' : 'busy'} />
              <Text style={textStyle('bodyStrong', 'primary')}>{formatPrice(court.pricePerHour)}</Text>
            </View>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

/* ----------------------------- Reviews tab ----------------------------- */

function ReviewsTab({ rating, count, reviews }: { rating: number; count: number; reviews: Review[] }) {
  return (
    <View style={styles.section}>
      <Card style={styles.reviewSummary}>
        <Text style={styles.bigRating}>{formatRating(rating)}</Text>
        <View style={{ gap: 2 }}>
          <RatingBadge value={rating} />
          <Text style={textStyle('caption', 'muted')}>{pluralize(count, 'recensione', 'recensioni')}</Text>
        </View>
      </Card>

      {reviews.length === 0 ? (
        <Text style={textStyle('caption', 'muted')}>Ancora nessuna recensione.</Text>
      ) : (
        reviews.map((r) => (
          <View key={r.id} style={styles.review}>
            <View style={styles.reviewHead}>
              <Text style={textStyle('bodyStrong', 'ink')}>{r.name}</Text>
              <Text style={textStyle('small', 'subtle')}>{r.when}</Text>
            </View>
            <RatingBadge value={r.rating} />
            <Text style={textStyle('caption', 'text')}>{r.text}</Text>
            <Divider />
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  missing: { flex: 1, alignItems: 'center', gap: theme.spacing.lg, backgroundColor: theme.colors.bg },
  heroControls: {
    position: 'absolute',
    left: theme.layout.screenPadX,
    right: theme.layout.screenPadX,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyPad: {
    paddingHorizontal: theme.layout.screenPadX,
    gap: theme.spacing.lg,
  },
  detailCard: {
    marginTop: -theme.spacing.xxxl,
    gap: theme.spacing.sm,
  },
  detailTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailMeta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.pill,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  section: { gap: theme.spacing.md },
  subsection: { gap: theme.spacing.sm },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chip,
  },
  courtRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  courtRight: { alignItems: 'flex-end', gap: theme.spacing.xs },
  reviewSummary: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg },
  bigRating: { color: theme.colors.ink, fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  review: { gap: theme.spacing.xs },
  reviewHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.layout.screenPadX,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.overlays.glass,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.line,
  },
});
