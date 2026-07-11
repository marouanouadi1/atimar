import { Stack } from "expo-router";
import { View } from "react-native";
import { WebHeader } from "@/components/layout/WebHeader";

export default function SetupLayout() {
  return (
    <View style={{ flex: 1 }}>
      <WebHeader />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
