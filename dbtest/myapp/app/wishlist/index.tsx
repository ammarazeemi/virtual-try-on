import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWishlist } from "../context/WishlistContext";

const { width } = Dimensions.get("window");

export default function WishlistPage() {
    const router = useRouter();
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <LinearGradient
            colors={["#8E2DE2", "#4A00E0"]}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Wishlist</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Wishlist Items */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {wishlist.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="heart-outline" size={80} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>Your wishlist is empty</Text>
                            <Text style={styles.emptySubtext}>
                                Add items from the store to see them here
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {wishlist.map((item) => (
                                <View key={item.id} style={styles.itemCard}>
                                    {typeof item.image === 'string' ? (
                                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                                    ) : (
                                        <View style={[styles.itemImage, { backgroundColor: '#ccc' }]} />
                                    )}
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.itemPrice}>{item.price}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeFromWishlist(item.id)}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#FF4B4B" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 100,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        color: "rgba(255,255,255,0.7)",
        marginTop: 10,
        textAlign: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    itemCard: {
        width: (width - 60) / 2,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 15,
        marginBottom: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    itemImage: {
        width: "100%",
        height: 150,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    itemInfo: {
        padding: 10,
    },
    itemName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFD700",
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 12,
    },
});
