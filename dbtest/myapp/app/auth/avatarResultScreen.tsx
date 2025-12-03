import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import API from "../../config/apiConfig";
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

type Params = { userId: string; avatarPath: string };

export default function AvatarResultScreen() {
  const router = useRouter();
  const { userId, avatarPath } = useLocalSearchParams<Params>();
  const [saving, setSaving] = useState(false);

  const displayUrl = `${API.aapi}/${avatarPath}`;

  // -------------------------------------
  // 🔥 SWIPE UP GESTURE (Expo Router version)
  // -------------------------------------
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY < -120) {
        // 👇 Expo Router navigation
        //router.push();
      } else {
        translateY.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // SAVE AVATAR
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

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
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

          <View style={styles.card}>
            <Text style={styles.title}>✨ Your Avatar is Ready!</Text>

            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: displayUrl }}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
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
  avatarImage: { width: "100%", height: "100%" },
});
