import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@atimar/theme';
import {
  BenefitRow,
  Button,
  Header,
  ScreenContainer,
  ScreenTitle,
  StepProgress,
  textStyle,
} from '@atimar/ui-native';

const BENEFITS = [
  { icon: 'options', title: 'Match personalizzati', desc: 'Campi e orari adatti ai tuoi sport e al tuo livello.' },
  { icon: 'bulb', title: 'Suggerimenti migliori', desc: 'Scopri le strutture più vicine e meglio recensite.' },
  { icon: 'time', title: 'Risparmia tempo', desc: 'Richiedi disponibilità in pochi tocchi, senza chiamate.' },
];

export default function SetupIntro() {
  const router = useRouter();

  return (
    <ScreenContainer
      header={
        <Header
          onBack={() => router.back()}
          right={
            <Pressable onPress={() => router.push('/setup/sports')} hitSlop={8}>
              <Text style={textStyle('caption', 'muted')}>Salta</Text>
            </Pressable>
          }
        />
      }
      footer={
        <View style={styles.footer}>
          <StepProgress step={3} total={3} variant="dots" />
          <Button icon onPress={() => router.push('/setup/sports')}>
            Iniziamo
          </Button>
        </View>
      }
    >
      <View style={styles.body}>
        <ScreenTitle
          title="Personalizza ATIMAR"
          subtitle="Bastano pochi passaggi per ricevere consigli su misura per te."
          size="h1"
        />
        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <BenefitRow key={b.title} icon={b.icon} title={b.title} desc={b.desc} />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.xxl, paddingTop: theme.spacing.lg },
  benefits: { gap: theme.spacing.xl },
  footer: { gap: theme.spacing.md, alignItems: 'center' },
});
