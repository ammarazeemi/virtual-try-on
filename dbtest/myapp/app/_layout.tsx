import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 👇 Ye tumhara default home (Welcome page) hai */}
        <Stack.Screen name="index" />
        {/* <Stack.Screen name="auth/login" /> */}
        <Stack.Screen name="auth" />
        {/* 👇 Optional: modal screen */}
        {/* <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        /> */}
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
