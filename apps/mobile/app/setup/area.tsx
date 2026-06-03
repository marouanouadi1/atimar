import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@atimar/theme';
import { getCourtListItems } from '@atimar/data';
import {
  Button,
  FormInput,
  Header,
  MapPreview,
  RangeSlider,
  ScreenContainer,
  ScreenTitle,
  textStyle,
} from '@atimar/ui-native';
import { useAppState } from '@/state/AppState';

export default function AreaStep() {
  const router = useRouter();
  const { prefs, setPrefs } = useAppState();
  const [location, setLocation] = useState(prefs.area.location);
  const [radius, setRadius] = useState(prefs.area.radius);
  const courts = getCourtListItems();

  const onContinue = () => {
    setPrefs({ area: { location: location.trim() || prefs.area.location, radius } });
    router.push('/setup/availability');
  };

  return (
    <ScreenContainer
      header={<Header onBack={() => router.back()} step={2} total={4} />}
      footer={<Button onPress={onContinue}>Continua</Button>}
    >
      <View style={styles.body}>
        <ScreenTitle title="Dove vuoi giocare?" subtitle="Imposta la tua zona e quanto sei disposto a spostarti." size="h1" />
        <MapPreview courts={courts} radius={radius} height={240} />
        <FormInput
          label="La tua zona"
          icon="location-outline"
          value={location}
          onChangeText={setLocation}
          placeholder="Indirizzo o quartiere"
          autoCapitalize="words"
        />
        <View style={styles.radiusBlock}>
          <View style={styles.radiusRow}>
            <Text style={textStyle('bodyStrong', 'ink')}>Raggio di ricerca</Text>
            <Text style={textStyle('bodyStrong', 'primary')}>{radius} km</Text>
          </View>
          <RangeSlider value={radius} min={1} max={50} onChange={setRadius} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.xl, paddingTop: theme.spacing.sm },
  radiusBlock: { gap: theme.spacing.sm },
  radiusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
