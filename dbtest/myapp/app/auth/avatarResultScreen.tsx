import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
  ScrollView,
} from "react-native";
import API from "../../config/apiConfig";
import { storeData } from "../../constants/storeData";

type Params = { userId: string; avatarPath: string };

export default function AvatarResultScreen() {
  const router = useRouter();
  const { userId, avatarPath } = useLocalSearchParams<Params>();
  const [saving, setSaving] = useState(false);

  const displayUrl = `${API.aapi}/${avatarPath}`;

  // Store panel state
  const [storeVisible, setStoreVisible] = useState(false);
  const storeTranslateY = useRef(new Animated.Value(1000)).current;

  // Store content state
  const [currentView, setCurrentView] = useState<'brands' | 'categories' | 'clothes'>('brands');
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Main screen PanResponder (swipe up to show store)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -120 && !storeVisible) {
          // Swipe up - show store
          setStoreVisible(true);
          Animated.timing(storeTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Store panel PanResponder (swipe down to close)
  const storePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          storeTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          // Swipe down - close store
          Animated.timing(storeTranslateY, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setStoreVisible(false);
            setCurrentView('brands');
            setSelectedBrand(null);
            setSelectedCategory('');
          });
        } else {
          // Snap back
          Animated.timing(storeTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <View style={{ flex: 1 }}>
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

            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: displayUrl }}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>

        {/* Sliding Store Panel */}
        {storeVisible && (
          <Animated.View
            {...storePanResponder.panHandlers}
            style={[
              styles.storePanel,
              { transform: [{ translateY: storeTranslateY }] }
            ]}
          >
            <View style={styles.storeHeader}>
              {currentView !== 'brands' && (
                <TouchableOpacity
                  onPress={() => {
                    if (currentView === 'categories') {
                      setCurrentView('brands');
                    } else if (currentView === 'clothes') {
                      setCurrentView('categories');
                    }
                  }}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.storeTitle}>
                {currentView === 'brands' ? '🛍️ Brands' :
                  currentView === 'categories' ? selectedBrand?.name :
                    storeData.categories[selectedCategory]?.name}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  Animated.timing(storeTranslateY, {
                    toValue: 1000,
                    duration: 300,
                    useNativeDriver: true,
                  }).start(() => {
                    setStoreVisible(false);
                    setCurrentView('brands');
                  });
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
              {/* Brands View */}
              {currentView === 'brands' && (
                <View style={styles.gridContainer}>
                  {storeData.brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.id}
                      style={styles.gridItem}
                      onPress={() => {
                        setSelectedBrand(brand);
                        setCurrentView('categories');
                      }}
                    >
                      <View style={styles.gridItemContent}>
                        <Text style={styles.gridItemIcon}>🏷️</Text>
                        <Text style={styles.gridItemTitle}>{brand.name}</Text>
                        <Text style={styles.gridItemDesc} numberOfLines={2}>{brand.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Categories View */}
              {currentView === 'categories' && selectedBrand && (
                <View style={styles.gridContainer}>
                  {selectedBrand.categories.map((catId: string) => {
                    const cat = storeData.categories[catId];
                    return (
                      <TouchableOpacity
                        key={catId}
                        style={styles.gridItem}
                        onPress={() => {
                          setSelectedCategory(catId);
                          setCurrentView('clothes');
                        }}
                      >
                        <View style={styles.gridItemContent}>
                          <Text style={styles.gridItemIcon}>
                            {catId === 'mens' ? '👔' : catId === 'womens' ? '👗' : catId === 'kids' ? '👶' : '👜'}
                          </Text>
                          <Text style={styles.gridItemTitle}>{cat.name}</Text>
                          <Text style={styles.gridItemDesc}>{cat.description}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Clothes View */}
              {currentView === 'clothes' && selectedBrand && selectedCategory && (
                <View style={styles.clothesList}>
                  {(storeData.clothes[selectedBrand.id]?.[selectedCategory] || []).map((item) => (
                    <View key={item.id} style={styles.clothesItem}>
                      <View style={styles.clothesInfo}>
                        <Text style={styles.clothesName}>{item.name}</Text>
                        <Text style={styles.clothesDesc} numberOfLines={2}>{item.description}</Text>
                        <Text style={styles.clothesPrice}>{item.price}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.tryOnButton}
                        onPress={() => Alert.alert('✅ Success!', `"${item.name}" applied to your avatar!`)}
                      >
                        <Text style={styles.tryOnButtonText}>Try On</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </View>
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
  storePanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    backgroundColor: "#1a0f2e",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  storeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  scrollContent: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  gridItem: {
    width: "48%",
    marginBottom: 15,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
  },
  gridItemContent: {
    padding: 15,
    alignItems: "center",
  },
  gridItemIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  gridItemDesc: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  clothesList: {
    paddingHorizontal: 10,
  },
  clothesItem: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  clothesInfo: {
    marginBottom: 10,
  },
  clothesName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  clothesDesc: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 6,
  },
  clothesPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8b5cf6",
  },
  tryOnButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  tryOnButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  avatarImage: { width: "100%", height: "100%" },
});
