import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/tokens';
import { DEFAULT_FILTERS, sportLabel } from '@atimar/data';
import type { Filtri } from '@atimar/types';
import {
  Button,
  Header,
  RangeSlider,
  ScreenContainer,
  SectionTitle,
  SportChip,
  ToggleRow,
  textStyle,
} from '@/ui';
import { useAppState } from '@/state/AppState';
import { useCampiInLista } from '@/data/hooks';
import { useUserLocation } from '@/data/use-user-location';

export default function FiltersModal() {
  const router = useRouter();
  const { filtri, setFiltri } = useAppState();
  const [draft, setDraft] = useState<Filtri>(filtri);

  const { data: campi = [] } = useCampiInLista();
  const userLocation = useUserLocation();
  const sports = useMemo(
    () => Array.from(new Set(campi.flatMap((c) => c.sportIds))),
    [campi],
  );

  const apply = () => {
    setFiltri(
      userLocation.hasLocation
        ? draft
        : { ...draft, distanzaMax: DEFAULT_FILTERS.distanzaMax },
    );
    router.back();
  };

  return (
    <ScreenContainer
      safeTop
      header={
        <Header
          onBack={() => router.back()}
          title="Filtri"
          right={
            <Pressable onPress={() => setDraft(DEFAULT_FILTERS)} hitSlop={8}>
              <Text style={textStyle('caption', 'primary')}>Reimposta</Text>
            </Pressable>
          }
        />
      }
      footer={<Button onPress={apply}>Applica</Button>}
    >
      <View style={styles.body}>
        <View style={styles.section}>
          <SectionTitle>Sport</SectionTitle>
          <View style={styles.chips}>
            <SportChip
              label="Tutti"
              active={draft.sport === 'all'}
              onPress={() => setDraft((d) => ({ ...d, sport: 'all' }))}
            />
            {sports.map((id) => (
              <SportChip
                key={id}
                label={sportLabel(id)}
                active={draft.sport === id}
                onPress={() => setDraft((d) => ({ ...d, sport: id }))}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <SectionTitle>Distanza massima</SectionTitle>
            <Text style={textStyle('caption', 'primary')}>
              {draft.distanzaMax} km
            </Text>
          </View>
          <RangeSlider
            value={draft.distanzaMax}
            min={1}
            max={50}
            disabled={!userLocation.hasLocation}
            onChange={(v) => setDraft((d) => ({ ...d, distanzaMax: v }))}
          />
          {!userLocation.hasLocation ? (
            <Pressable
              onPress={() => void userLocation.requestLocation()}
              style={styles.locationHint}
            >
              <Text style={textStyle('caption', 'ink')}>Raggio non attivo</Text>
              <Text style={textStyle('caption', 'primary')}>
                Usa la posizione per attivare il raggio
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionTitle>Disponibilità</SectionTitle>
          <ToggleRow
            label="Aperto ora"
            sub="Mostra solo i campi aperti adesso"
            icon="time-outline"
            value={draft.soloAperti}
            onValueChange={(v) => setDraft((d) => ({ ...d, soloAperti: v }))}
          />
          <ToggleRow
            label="Aperto al pubblico"
            sub="Disattiva per vedere anche le strutture non aperte al pubblico"
            icon="people-outline"
            value={draft.soloApertoAlPubblico}
            onValueChange={(v) =>
              setDraft((d) => ({ ...d, soloApertoAlPubblico: v }))
            }
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: theme.spacing.xxl,
    paddingTop: theme.spacing.sm,
    width: '100%',
    maxWidth: theme.layout.maxReading,
    alignSelf: 'center',
  },
  section: { gap: theme.spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationHint: {
    alignSelf: 'flex-start',
    gap: 2,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.tints.blueTint,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
});
