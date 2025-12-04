import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { storeData } from '../../constants/storeData';
import SuccessModal from '../../components/SuccessModal';

type Params = { brandId: string; categoryId: string };

export default function ClothesScreen() {
    const router = useRouter();
    const { brandId, categoryId } = useLocalSearchParams<Params>();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');

    const brand = storeData.brands.find((b) => b.id === brandId);
    const category = storeData.categories[categoryId];
    const clothesList = storeData.clothes[brandId]?.[categoryId] || [];

    const handleTryOn = (itemName: string) => {
        setSelectedItem(itemName);
        setModalVisible(true);
    };

    const handleBack = () => {
        router.back();
    };

    const renderClothingItem = ({ item, index }: any) => (
        <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 80 }}
            style={styles.itemCard}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
            </View>

            <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>

                <TouchableOpacity
                    style={styles.tryOnButton}
                    onPress={() => handleTryOn(item.name)}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#8b5cf6', '#ec4899']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Try On</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </MotiView>
    );

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
                {/* Header */}
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
                        <Text style={styles.brandName}>{brand?.name}</Text>
                        <Text style={styles.categoryName}>{category?.name}</Text>
                    </View>
                </MotiView>

                {/* Clothes List */}
                {clothesList.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No items available in this category</Text>
                    </View>
                ) : (
                    <FlatList
                        data={clothesList}
                        renderItem={renderClothingItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>

            <SuccessModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                itemName={selectedItem}
            />
        </LinearGradient>
    );
}

const { width } = Dimensions.get('window');

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
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    categoryName: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    itemCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 20,
        marginBottom: 16,
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
        height: 200,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    itemContent: {
        padding: 16,
    },
    itemName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
    },
    itemDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
        marginBottom: 10,
    },
    itemPrice: {
        fontSize: 22,
        fontWeight: '700',
        color: '#8b5cf6',
        marginBottom: 14,
    },
    tryOnButton: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        textAlign: 'center',
    },
});
