import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem("userId");
            if (id) {
                setUserId(id);
            }
        };
        getUserId();
    }, []);

    const handleAvatarPress = () => {
        if (!userId) {
            Alert.alert("Error", "User ID not found. Please log in again.");
            return;
        }
        router.push({
            pathname: "/auth/uploadAvatarScreen",
            params: { userId }
        });
    };

    return (
        <ImageBackground
            source={require("./assets/images/welcome-bg.jpg")}
            style={styles.bg}
            resizeMode="cover"
            blurRadius={3}
        >
            <LinearGradient
                colors={[
                    "rgba(128,0,255,0.7)",
                    "rgba(255,0,128,0.7)",
                    "rgba(0,128,255,0.7)",
                ]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, Fashionista! 👋</Text>
                        <Text style={styles.subtitle}>Ready to style your look?</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={handleAvatarPress}
                    >
                        <Ionicons name="person-circle-outline" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Wishlist Card */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "timing", duration: 500 }}
                        style={styles.card}
                    >
                        <TouchableOpacity
                            style={styles.cardTouch}
                            onPress={() => router.push("/wishlist" as any)}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={["#FF416C", "#FF4B2B"]}
                                style={styles.cardGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="heart-outline" size={50} color="#fff" />
                                <Text style={styles.cardTitle}>My Wishlist</Text>
                                <Text style={styles.cardDesc}>Your favorite picks</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>

                    {/* Create Avatar Card */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "timing", duration: 500, delay: 200 }}
                        style={styles.card}
                    >
                        <TouchableOpacity
                            style={styles.cardTouch}
                            onPress={handleAvatarPress}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={["#11998e", "#38ef7d"]}
                                style={styles.cardGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="person-add-outline" size={50} color="#fff" />
                                <Text style={styles.cardTitle}>Create Avatar</Text>
                                <Text style={styles.cardDesc}>Digitize your look</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        width,
        height,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    greeting: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        marginTop: 5,
    },
    profileButton: {
        padding: 5,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 20,
    },
    card: {
        height: 140, // Reduced height to fit 3 cards
        borderRadius: 25,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    cardTouch: {
        flex: 1,
    },
    cardGradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 8,
    },
    cardDesc: {
        fontSize: 13,
        color: "rgba(255,255,255,0.9)",
        marginTop: 4,
    },
});
