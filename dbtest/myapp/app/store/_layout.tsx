import { Stack } from "expo-router";

export default function StoreLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="brands" />
            <Stack.Screen name="categories" />
            <Stack.Screen name="clothes" />
        </Stack>
    );
}
