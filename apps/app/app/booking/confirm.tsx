import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/tokens';
import { getCourtById, getVenueById } from '@atimar/data';
import {
  AvailabilityBadge,
  Button,
  Card,
  CheckBadge,
  Icon,
  ScreenContainer,
  ScreenTitle,
  textStyle,
} from '@/ui';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

export default function BookingConfirm() {
  const router = useRouter();
  const { venueId, courtId, date, start, end } = useLocalSearchParams<{
    venueId: string;
    courtId: string;
    date: string;
    start: string;
    end: string;
  }>();

  const venue = venueId ? getVenueById(venueId) : undefined;
  const court = courtId ? getCourtById(courtId) : undefined;

  return (
    <ScreenContainer
      footer={
        <Button icon onPress={() => router.replace('/home')}>
          Torna alla home
        </Button>
      }
    >
      <View style={styles.body}>
        <View style={styles.hero}>
          <CheckBadge />
          <ScreenTitle
            title="Richiesta inviata!"
            subtitle="La struttura riceverà la tua richiesta e ti risponderà a breve."
            size="h1"
            align="center"
          />
        </View>

        <Card style={styles.summary}>
          <Row icon="business-outline" label="Struttura" value={venue?.name ?? '—'} />
          <Row icon="grid-outline" label="Campo" value={court ? `${court.name} · ${court.sport}` : '—'} />
          <Row icon="calendar-outline" label="Data" value={date ? formatDate(date) : '—'} />
          <Row icon="time-outline" label="Orario" value={start && end ? `${start} – ${end}` : '—'} />
          <View style={styles.statusRow}>
            <Text style={textStyle('caption', 'subtle')}>Stato</Text>
            <AvailabilityBadge state="closed" label="In attesa" />
          </View>
        </Card>
      </View>
    </ScreenContainer>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={theme.iconSizes.md} color="primary" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={textStyle('caption', 'subtle')}>{label}</Text>
        <Text style={textStyle('bodyStrong', 'ink')}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.xxl, paddingTop: theme.spacing.xxxl },
  hero: { alignItems: 'center', gap: theme.spacing.lg },
  summary: { gap: theme.spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
