import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/tokens';
import { getCourtsByVenue, getSlotsForCourt, getVenueById } from '@atimar/data';
import type { Booking } from '@atimar/types';
import {
  Button,
  FormInput,
  Header,
  ScreenContainer,
  SectionTitle,
  textStyle,
} from '@/ui';
import { useAppState } from '@/state/AppState';

const ITALIAN_DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

function buildDates(): { iso: string; label: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = i === 0 ? 'Oggi' : i === 1 ? 'Domani' : `${ITALIAN_DAYS[d.getDay()]} ${d.getDate()}`;
    return { iso, label };
  });
}

export default function BookingRequest() {
  const router = useRouter();
  const { venueId, courtId } = useLocalSearchParams<{ venueId: string; courtId?: string }>();
  const { user, addBooking } = useAppState();

  const venue = venueId ? getVenueById(venueId) : undefined;
  const courts = venueId ? getCourtsByVenue(venueId) : [];
  const dates = useMemo(buildDates, []);

  const [courtSel, setCourtSel] = useState(courtId || courts[0]?.id || '');
  const [dateSel, setDateSel] = useState(dates[0]?.iso ?? '');
  const [slotSel, setSlotSel] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');

  const slots = useMemo(
    () => (courtSel && dateSel ? getSlotsForCourt(courtSel, dateSel) : []),
    [courtSel, dateSel],
  );
  const slot = slots.find((s) => s.id === slotSel);

  if (!venue) {
    return (
      <ScreenContainer header={<Header onBack={() => router.back()} title="Richiesta" />}>
        <Text style={textStyle('body', 'muted')}>Struttura non disponibile.</Text>
      </ScreenContainer>
    );
  }

  const onSubmit = () => {
    if (!slot) return;
    const booking: Booking = {
      id: `b-${Date.now()}`,
      userId: user?.email ?? 'me',
      venueId: venue.id,
      courtId: courtSel,
      date: dateSel,
      slot: { start: slot.start, end: slot.end },
      status: 'requested',
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    router.replace({
      pathname: '/booking/confirm',
      params: { venueId: venue.id, courtId: courtSel, date: dateSel, start: slot.start, end: slot.end },
    });
  };

  return (
    <ScreenContainer
      header={<Header onBack={() => router.back()} title={venue.name} />}
      footer={
        <Button variant="lime" icon disabled={!slot} onPress={onSubmit}>
          Invia richiesta
        </Button>
      }
    >
      <View style={styles.body}>
        <View style={styles.section}>
          <SectionTitle>Campo</SectionTitle>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {courts.map((c) => {
              const active = c.id === courtSel;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => { setCourtSel(c.id); setSlotSel(undefined); }}
                  style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
                >
                  <Text style={textStyle('caption', active ? 'ink' : 'text')}>{c.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle>Data</SectionTitle>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {dates.map((d) => {
              const active = d.iso === dateSel;
              return (
                <Pressable
                  key={d.iso}
                  onPress={() => { setDateSel(d.iso); setSlotSel(undefined); }}
                  style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
                >
                  <Text style={textStyle('caption', active ? 'ink' : 'text')}>{d.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle>Orario</SectionTitle>
          <View style={styles.slots}>
            {slots.map((s) => {
              const busy = s.status === 'busy';
              const active = s.id === slotSel;
              return (
                <Pressable
                  key={s.id}
                  disabled={busy}
                  onPress={() => setSlotSel(s.id)}
                  style={[
                    styles.slot,
                    busy ? styles.slotBusy : active ? styles.pillActive : styles.pillIdle,
                  ]}
                >
                  <Text style={textStyle('caption', busy ? 'subtle' : active ? 'ink' : 'text')}>
                    {s.start}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Nota (opzionale)</SectionTitle>
          <FormInput
            value={note}
            onChangeText={setNote}
            placeholder="Aggiungi un messaggio per la struttura…"
            autoCapitalize="sentences"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.xl, paddingTop: theme.spacing.sm },
  section: { gap: theme.spacing.sm },
  row: { gap: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  pill: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
  },
  slot: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    minWidth: 72,
    alignItems: 'center',
  },
  pillIdle: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  pillActive: {
    backgroundColor: theme.colors.lime,
    borderWidth: 1,
    borderColor: theme.colors.lime,
  },
  slotBusy: {
    backgroundColor: theme.colors.chip,
    borderWidth: 1,
    borderColor: theme.colors.line,
    opacity: 0.6,
  },
});
