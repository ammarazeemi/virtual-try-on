import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storeData } from '../../constants/storeData';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function BrandsScreen() {
    const router = useRouter();
    const translateY = useSharedValue(0);

    // Swipe down to close
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationY > 0) {
                translateY.value = e.translationY;
            }
        })
        .onEnd((e) => {
            if (e.translationY > 120) {
                router.back();
            } else {
                translateY.value = withTiming(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleBrandPress = (brandId: string) => {
        router.push({
            pathname: '/store/categories',
            params: { brandId },
        });
    };

    const renderBrandCard = ({ item, index }: any) => (
        <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
            style={styles.cardWrapper}
        >
            <TouchableOpacity
                style={styles.card}
                onPress={() => handleBrandPress(item.id)}
                activeOpacity={0.9}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.brandImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.imageOverlay}
                    />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.brandName}>{item.name}</Text>
                    <Text style={styles.brandDescription}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                <LinearGradient
                    colors={[
                        'rgba(128, 0, 255, 0.8)',
                        'rgba(255, 0, 128, 0.85)',
                        'rgba(0, 128, 255, 0.85)',
                    ]}
                    style={styles.container}
                >
                    <SafeAreaView style={styles.safeArea}>
                        {/* Header */}
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 500 }}
                            style={styles.header}
                        >
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoIcon}>🧥</Text>
                                <Text style={styles.logoText}>VirtualFit Store</Text>
                            </View>
                            <Text style={styles.subtitle}>Choose Your Brand</Text>
                            <Text style={styles.swipeHint}>⬇️ Swipe down to close</Text>
                        </MotiView>

                        {/* Brands Grid */}
                        <FlatList
                            data={storeData.brands}
                            renderItem={renderBrandCard}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </SafeAreaView>
                </LinearGradient>
            </Animated.View>
        </GestureDetector>
    );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoIcon: {
        fontSize: 32,
        marginRight: 8,
    },
    logoText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
    },
    swipeHint: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    cardWrapper: {
        width: cardWidth,
        margin: 8,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 150,
    },
    brandImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    cardContent: {
        padding: 12,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    brandDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 16,
    },
});
