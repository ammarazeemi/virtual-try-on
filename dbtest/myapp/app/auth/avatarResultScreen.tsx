import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import API from "../../config/apiConfig";
import { useStoreAnimation } from "../../context/StoreAnimationContext";

type Params = { userId: string; avatarPath: string };

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AvatarResultScreen() {
  const router = useRouter();
  const { userId, avatarPath } = useLocalSearchParams<Params>();
  const [saving, setSaving] = useState(false);
  const { translateY, maxSnapPoint, showBackdrop } = useStoreAnimation();

  const displayUrl = `${API.aapi}/${avatarPath}`;

  // Set max snap point to 50% and disable backdrop for this screen
  useEffect(() => {
    maxSnapPoint.value = -SCREEN_HEIGHT * 0.5;
    showBackdrop.value = false;
    return () => {
      maxSnapPoint.value = -1; // Reset to default when leaving
      showBackdrop.value = true; // Re-enable backdrop
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("avatarName", `avatar_${userId}`);
      formData.append("avatarPath", avatarPath);

      const res = await fetch(API.SAVE_AVATAR, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Save failed");

      Alert.alert("✅ Success", "Avatar saved successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = () => {
    router.replace({
      pathname: "/auth/uploadAvatarScreen",
      params: { userId },
    });
  };

  const rScreenStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, -SCREEN_HEIGHT * 0.5],
      [1, 0.9],
      Extrapolate.CLAMP
    );

    const translateYScreen = interpolate(
      translateY.value,
      [0, -SCREEN_HEIGHT * 0.5],
      [0, translateY.value * 0.5],
      Extrapolate.CLAMP
    );

    const borderRadius = interpolate(
      translateY.value,
      [0, -SCREEN_HEIGHT * 0.5],
      [0, 20],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY: translateYScreen },
        { scale }
      ],
      borderRadius,
      overflow: 'hidden',
    };
  });

  const rGradientStyle = useAnimatedStyle(() => {
    // Inverse scale to fill the white space
    const gradientScale = interpolate(
      translateY.value,
      [0, -SCREEN_HEIGHT * 0.5],
      [1, 1.11], // 1/0.9 = 1.11 to compensate for 0.9 screen scale
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale: gradientScale }],
    };
  });

  const rAvatarStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, -SCREEN_HEIGHT * 0.5],
      [1, 0.7],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <LinearGradient
      colors={[
        "rgba(128, 0, 255, 0.8)",
        "rgba(255, 0, 128, 0.85)",
        "rgba(0, 128, 255, 0.85)",
      ]}
      style={{ flex: 1 }}
    >
      <Animated.View style={[{ flex: 1 }, rScreenStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, rGradientStyle]}>
          <LinearGradient
            colors={[
              "rgba(128, 0, 255, 0.8)",
              "rgba(255, 0, 128, 0.85)",
              "rgba(0, 128, 255, 0.85)",
            ]}
            style={styles.container}
          >
            <View style={styles.topButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton, saving && { opacity: 0.6 }]}
                disabled={saving}
                onPress={handleSave}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>💾 Save Avatar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={handleRegenerate}
              >
                <Text style={styles.buttonText}>🔄 Regenerate</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>⬆️ Swipe up to browse store</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>✨ Your Avatar is Ready!</Text>

              <Animated.View style={[styles.imageWrapper, rAvatarStyle]}>
                <Image
                  source={{ uri: displayUrl }}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  topButtons: {
    position: "absolute",
    top: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    zIndex: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  saveButton: {
    backgroundColor: "#22c55e",
    marginRight: 8,
  },
  editButton: {
    backgroundColor: "#3b82f6",
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    width: "88%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginVertical: 15,
  },
  imageWrapper: {
    width: 280,
    height: 400,
    backgroundColor: "#00000040",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  swipeHint: {
    position: "absolute",
    bottom: 40,
    width: "88%",
    alignItems: "center",
  },
  swipeHintText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  avatarImage: { width: "100%", height: "100%" },
});
