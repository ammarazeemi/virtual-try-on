import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="resetPassword" />
      <Stack.Screen name="verify-otp" />

      <Stack.Screen name="uploadAvatarScreen" />
      {/* <Stack.Screen name="avatarProcessingScreen" /> */}
      <Stack.Screen name="avatarResultScreen" />
      {/* <Stack.Screen name="resetPassword" /> */}
    </Stack>
  );
}
