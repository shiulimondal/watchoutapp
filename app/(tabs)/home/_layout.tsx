import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="MovieDetails" options={{ headerShown: false }} />
      <Stack.Screen name="SeriesDetails" options={{ headerShown: false }} />
    </Stack>
  );
}
