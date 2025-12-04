import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { storeData } from '../../constants/storeData';

type Params = { brandId: string };

export default function CategoriesScreen() {
    const router = useRouter();
    const { brandId } = useLocalSearchParams<Params>();

    const brand = storeData.brands.find((b) => b.id === brandId);

    if (!brand) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Brand not found</Text>
            </View>
        );
    }

    const handleCategoryPress = (categoryId: string) => {
        router.push({
            pathname: '/store/clothes',
            params: { brandId, categoryId },
        });
    };

    const handleBack = () => {
        router.back();
    };

    const renderCategoryCard = ({ item, index }: any) => {
        const category = storeData.categories[item];

        return (
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 400, delay: index * 100 }}
                style={styles.cardWrapper}
            >
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleCategoryPress(item)}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['rgba(139, 92, 246, 0.15)', 'rgba(236, 72, 153, 0.15)']}
                        style={styles.cardGradient}
                    >
                        <Text style={styles.categoryIcon}>
                            {item === 'mens' ? '👔' : item === 'womens' ? '👗' : item === 'kids' ? '👶' : '👜'}
                        </Text>
                        <Text style={styles.categoryName}>{category.name}</Text>
                        <Text style={styles.categoryDescription}>{category.description}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Explore</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </MotiView>
        );
    };

    return (
        <LinearGradient
            colors={[
                'rgba(128, 0, 255, 0.8)',
                'rgba(255, 0, 128, 0.85)',
                'rgba(0, 128, 255, 0.85)',
            ]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header with Back Button */}
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500 }}
                    style={styles.header}
                >
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.brandName}>{brand.name}</Text>
                        <Text style={styles.subtitle}>Select a Collection</Text>
                    </View>
                </MotiView>

                {/* Categories Grid */}
                <FlatList
                    data={brand.categories}
                    renderItem={renderCategoryCard}
                    keyExtractor={(item) => item}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </LinearGradient>
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
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerContent: {
        alignItems: 'center',
    },
    brandName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
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
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
    cardGradient: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        minHeight: 180,
        justifyContent: 'center',
    },
    categoryIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
        textAlign: 'center',
    },
    categoryDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 12,
    },
    badge: {
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0515',
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
    },
});
