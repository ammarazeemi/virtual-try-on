import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WishlistProvider } from "./context/WishlistContext";
import { StoreAnimationProvider } from "../context/StoreAnimationContext";
import GlobalStoreSheet from "../components/StoreSheet";

export default function RootLayout() {
  const segments = useSegments() as string[];

  // Check if we are on the index page or in the auth group
  // segments is empty array [] for index page
  // segments[0] is '(auth)' for auth group
  // BUT we want to show it on avatarResultScreen which is in auth group

  const isIndex = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');
  const isAuthGroup = segments[0] === '(auth)' || segments[0] === 'auth';
  const isAvatarResult = segments.includes('avatarResultScreen');

  const hideStoreSheet = isIndex || (isAuthGroup && !isAvatarResult);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreAnimationProvider>
        <WishlistProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="home" />
            <Stack.Screen name="wishlist" />
          </Stack>
          {!hideStoreSheet && <GlobalStoreSheet />}
          <StatusBar style="auto" />
        </WishlistProvider>
      </StoreAnimationProvider>
    </GestureHandlerRootView>
  );
}
//export default function RootLayout() {
//  return (
//    <>
//      <Stack screenOptions={{ headerShown: false }}>
//        {/* 👇 Ye tumhara default home (Welcome page) hai */}
//        <Stack.Screen name="index" />
//        {/* <Stack.Screen name="auth/login" /> */}
//        <Stack.Screen name="auth" />
//        {/* 👇 Optional: modal screen */}
//        {/* <Stack.Screen
//          name="modal"
//          options={{ presentation: "modal", title: "Modal" }}
//        /> */}
//      </Stack>
//
//      <StatusBar style="auto" />
//    </>
//  );
//}