import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { storeData } from '../constants/storeData';
import { useStoreAnimation } from '../context/StoreAnimationContext';
import { useWishlist } from '../app/context/WishlistContext';

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

    const SNAP_POINT_50 = -SCREEN_HEIGHT * 0.5;
    const SNAP_POINT_70 = -SCREEN_HEIGHT * 0.7;

    const scrollTo = useCallback((destination: number) => {
        'worklet';
        translateY.value = withSpring(destination, {
            damping: 50,
            stiffness: 200,
            mass: 1
        });
    }, []);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            const maxLimit = maxSnapPoint.value === -1 ? SNAP_POINT_70 : maxSnapPoint.value;
            translateY.value = Math.max(translateY.value, maxLimit - 50);
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
    };

    const navigateToCategory = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setCurrentView('clothes');
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
        addToWishlist(item);
        Alert.alert('Added to Wishlist', `${item.name} has been added to your wishlist!`);
    };

    const getTitle = () => {
        if (currentView === 'brands') return 'Browse Brands';
        if (currentView === 'categories') {
            const brand = storeData.brands.find(b => b.id === selectedBrandId);
            return brand?.name || 'Categories';
        }
        if (currentView === 'clothes') {
            const categories = selectedBrandId ? storeData.categories[selectedBrandId] : [];
            const category = categories?.find((c: any) => c.id === selectedCategoryId);
            return category?.name || 'Clothes';
        }
        return 'Store';
    };

    const renderContent = () => {
        if (currentView === 'brands') {
            return (
                <View style={styles.grid}>
                    {storeData.brands.map((brand) => (
                        <TouchableOpacity
                            key={brand.id}
                            style={styles.card}
                            onPress={() => navigateToBrand(brand.id)}
                        >
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
                    {categories.map((category) => (
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
                        {clothes.map((item) => (
                            <View key={item.id} style={styles.itemCard}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemPrice}>{item.price}</Text>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
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

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        bounces={false}
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    >
                        {renderContent()}
                    </ScrollView>
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
});
