import React, { useCallback, useState, ComponentType } from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView as RNScrollView, Alert } from 'react-native';
import { GestureDetector, Gesture, ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { storeData } from '../constants/storeData';
import { useStoreAnimation } from '../context/StoreAnimationContext';
import { useWishlist } from '../app/context/WishlistContext';
import { API_URL } from '../config/apiConfig';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GlobalStoreSheet() {
    const router = useRouter();
    const { translateY, maxSnapPoint, showBackdrop } = useStoreAnimation();
    const { addToWishlist } = useWishlist();
    const context = useSharedValue({ y: 0 });
    const isOpen = useSharedValue(false);

    const [currentView, setCurrentView] = useState<'brands' | 'categories' | 'clothes'>('brands');
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // State for store data
    const [storeData, setStoreData] = useState<any>({ brands: [], categories: {}, clothes: {} });
    const [loading, setLoading] = useState(true);

    // Fetch store data
    React.useEffect(() => {
        const fetchStoreData = async () => {
            try {
                console.log("Fetching store data from:", `${API_URL}/store/data`);
                // Add timeout to fetch
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

                const response = await fetch(`${API_URL}/store/data`, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Store data fetched successfully:", JSON.stringify(data, null, 2));
                    if (data.brands && data.brands.length > 0) {
                        console.log("Brands found:", data.brands.length);
                        setStoreData(data);
                    } else {
                        console.warn("No brands found in store data");
                    }
                } else {
                    console.error("Failed to fetch store data:", response.status);
                    Alert.alert("Error", "Failed to load store data. Server returned " + response.status);
                }
            } catch (error: any) {
                console.error("Error fetching store data:", error);
                if (error.name === 'AbortError') {
                    Alert.alert("Error", "Request timed out. Check your network connection.");
                } else {
                    Alert.alert("Error", "Could not connect to server. " + error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, []);

    const SNAP_POINT_50 = -SCREEN_HEIGHT * 0.3;
    const SNAP_POINT_70 = -SCREEN_HEIGHT * 0.7;

    const scrollRef = React.useRef<any>(null);
    const scrollOffset = useSharedValue(0);

    const scrollTo = useCallback((destination: number) => {
        'worklet';
        translateY.value = withSpring(destination, {
            damping: 50,
            stiffness: 200,
            mass: 1
        });
    }, []);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;
    });
    const gesture = Gesture.Pan()
        .manualActivation(false)
        .activeOffsetX([-20, 20])
        .simultaneousWithExternalGesture(scrollRef)
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            const newY = event.translationY + context.value.y;
            const maxLimit = maxSnapPoint.value === -1 ? SNAP_POINT_70 : maxSnapPoint.value;
            if (event.translationY < 0) {
                translateY.value = Math.max(newY, maxLimit);
            }
            else {
                if (scrollOffset.value <= 0) {
                    translateY.value = Math.min(newY, 0);
                }
                else {
                    translateY.value = maxLimit;
                }
            }
        })
        .onEnd((event) => {
            const velocityY = event.velocityY;
            const currentY = translateY.value;

            const maxLimit = maxSnapPoint.value === -1 ? SNAP_POINT_70 : maxSnapPoint.value;
            const SNAP_POINTS = maxLimit === SNAP_POINT_50
                ? [0, SNAP_POINT_50]
                : [0, SNAP_POINT_50, SNAP_POINT_70];

            let dest = SNAP_POINTS[0];

            if (Math.abs(velocityY) > 500) {
                if (velocityY < 0) {
                    if (maxLimit === SNAP_POINT_50) {
                        dest = SNAP_POINT_50;
                    } else {
                        if (currentY > SNAP_POINT_50) dest = SNAP_POINT_50;
                        else dest = SNAP_POINT_70;
                    }
                } else {
                    if (currentY < SNAP_POINT_50) dest = SNAP_POINT_50;
                    else dest = 0;
                }
            } else {
                let minDistance = Number.MAX_VALUE;
                for (const point of SNAP_POINTS) {
                    const distance = Math.abs(currentY - point);
                    if (distance < minDistance) {
                        minDistance = distance;
                        dest = point;
                    }
                }
            }

            scrollTo(dest);
            isOpen.value = dest !== 0;
        });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const rBackdropStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isOpen.value && showBackdrop.value ? 0.7 : 0),
            zIndex: isOpen.value ? 1 : -1,
        };
    });

    const closeSheet = useCallback(() => {
        scrollTo(0);
        isOpen.value = false;
        setTimeout(() => {
            setCurrentView('brands');
            setSelectedBrandId(null);
            setSelectedCategoryId(null);
        }, 300);
    }, []);

    const handleBack = () => {
        if (currentView === 'clothes') {
            setCurrentView('categories');
            setSelectedCategoryId(null);
        } else if (currentView === 'categories') {
            setCurrentView('brands');
            setSelectedBrandId(null);
        } else {
            closeSheet();
        }
    };

    const navigateToBrand = (brandId: string) => {
        setSelectedBrandId(brandId);
        setCurrentView('categories');
        expandSheet();
    };

    const navigateToCategory = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setCurrentView('clothes');
        expandSheet();
    };

    const handleUploadClothes = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need gallery access to upload clothes.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            Alert.alert('Upload Feature', 'Upload functionality will be implemented with backend integration.');
            console.log('Selected image:', result.assets[0].uri);
        }
    };

    const handleAddToWishlist = (item: any) => {
        console.log("handleAddToWishlist clicked for:", item);
        try {
            addToWishlist(item);
            Alert.alert('Added to Wishlist', `${item.name} has been added to your wishlist!`);
        } catch (e) {
            console.error("Error in handleAddToWishlist:", e);
            Alert.alert("Error", "Failed to add to wishlist");
        }
    };

    const handleTryOn = (item: any) => {
        Alert.alert("Success", `${item.name} is applied!`);
    };

    const getTitle = () => {
        if (currentView === 'brands') return 'Browse Brands';
        if (currentView === 'categories') {
            const brand = storeData.brands.find((b: any) => b.id === selectedBrandId);
            return brand?.name || 'Categories';
        }
        if (currentView === 'clothes') {
            const categories = selectedBrandId ? storeData.categories[selectedBrandId] : [];
            const category = categories?.find((c: any) => c.id === selectedCategoryId);
            return category?.name || 'Clothes';
        }
        return 'Store';
    };
    // Function to expand the sheet to 70% when navigating
    const expandSheet = useCallback(() => {
        'worklet'; // Ensure this is callable from worklets if needed, but here it's fine outside.
        scrollTo(SNAP_POINT_70);
    }, [scrollTo, SNAP_POINT_70]); // Add this new function


    const renderContent = () => {
        if (loading) {
            return (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>Loading store data...</Text>
                </View>
            );
        }

        if (currentView === 'brands') {
            return (
                <View style={styles.grid}>
                    {storeData.brands.map((brand: any) => (
                        <TouchableOpacity
                            key={brand.id}
                            style={styles.card}
                            onPress={() => navigateToBrand(brand.id)}
                        >
                            {brand.image ? (
                                <Image source={{ uri: brand.image }} style={styles.brandstyle} />
                            ) : (
                                <View style={styles.brandstyle} />
                            )}
                            <Text style={styles.brandName}>{brand.name}</Text>
                            <Text style={styles.brandDesc}>{brand.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        if (currentView === 'categories') {
            const categories = selectedBrandId ? storeData.categories[selectedBrandId] || [] : [];

            return (
                <View style={styles.listContainer}>
                    {categories.map((category: any) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.listItem}
                            onPress={() => navigateToCategory(category.id)}
                        >
                            <View style={styles.listItemContent}>
                                <Text style={styles.listItemTitle}>{category.name}</Text>
                                <Text style={styles.listItemSubtitle}>{category.description}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        if (currentView === 'clothes') {
            const clothes = (selectedBrandId && selectedCategoryId)
                ? storeData.clothes[selectedBrandId]?.[selectedCategoryId] || []
                : [];

            return (
                <>
                    <View style={styles.grid}>
                        {clothes.map((item: any) => (
                            <View key={item.id} style={styles.itemCard}>
                                {item.image ? (
                                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                                ) : (
                                    <View style={[styles.itemImage, { backgroundColor: '#444' }]} />
                                )}
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemPrice}>{item.price}</Text>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                    <TouchableOpacity
                                        style={styles.tryOnButton}
                                        onPress={() => handleTryOn(item)}
                                    >
                                        <Text style={styles.tryOnButtonText}>Try On</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={styles.addToWishlistButton}
                                    onPress={() => handleAddToWishlist(item)}
                                >
                                    <Ionicons name="heart-outline" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleUploadClothes}
                    >
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.uploadButtonText}>Add Clothes</Text>
                    </TouchableOpacity>
                </>
            );
        }
    };

    return (
        <>
            <Animated.View style={[styles.backdrop, rBackdropStyle]} />
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            {currentView !== 'brands' ? (
                                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={24} color="#fff" />
                                </TouchableOpacity>
                            ) : (
                                <Ionicons name="bag-handle" size={24} color="#FF69B4" />
                            )}
                            <Text style={styles.title}>{getTitle()}</Text>
                        </View>
                        <View style={styles.headerButtons}>
                            <TouchableOpacity onPress={() => router.push('/wishlist' as any)} style={styles.wishlistButton}>
                                <Ionicons name="heart-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
                                <Ionicons name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <GestureHandlerScrollView
                        ref={scrollRef}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        bounces={false}
                        contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
                    >
                        {renderContent()}
                    </GestureHandlerScrollView>
                </Animated.View>
            </GestureDetector>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        backgroundColor: '#1a1a1a',
        position: 'absolute',
        top: SCREEN_HEIGHT - 60,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        zIndex: 1000,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#444',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    wishlistButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    card: {
        width: '47%',
        backgroundColor: '#2a2a2a',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    brandstyle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
        backgroundColor: '#444',
        resizeMode: 'cover',
    },
    brandName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    brandDesc: {
        fontSize: 12,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 16,
    },
    listContainer: {
        gap: 10,
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2a2a2a',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    listItemSubtitle: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 2,
    },
    itemCard: {
        width: '47%',
        backgroundColor: '#2a2a2a',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    itemImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#333',
    },
    itemInfo: {
        padding: 10,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    itemName: {
        fontSize: 12,
        color: '#ccc',
        marginTop: 4,
    },
    addToWishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 105, 180, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8E2DE2',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 15,
        borderRadius: 15,
        gap: 10,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    tryOnButton: {
        backgroundColor: '#4CAF50',
        marginTop: 8,
        paddingVertical: 6,
        borderRadius: 12,
        alignItems: 'center',
    },
    tryOnButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
