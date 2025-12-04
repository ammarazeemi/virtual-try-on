import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    itemName?: string;
}

export default function SuccessModal({ visible, onClose, itemName }: SuccessModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <MotiView
                    from={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 300 }}
                    style={styles.modalContainer}
                >
                    <TouchableOpacity activeOpacity={1}>
                        <LinearGradient
                            colors={['rgba(139, 92, 246, 0.2)', 'rgba(236, 72, 153, 0.2)']}
                            style={styles.modalContent}
                        >
                            <MotiView
                                from={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                    loop: true,
                                    type: 'timing',
                                    duration: 1500
                                }}
                            >
                                <Text style={styles.icon}>✨</Text>
                            </MotiView>

                            <Text style={styles.title}>Clothes Applied Successfully!</Text>
                            <Text style={styles.message}>
                                {itemName ? `"${itemName}" has been ` : 'Your selected outfit has been '}
                                saved to your virtual wardrobe.
                            </Text>

                            <TouchableOpacity style={styles.button} onPress={onClose}>
                                <LinearGradient
                                    colors={['#8b5cf6', '#ec4899']}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>
            </TouchableOpacity>
        </Modal>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
    },
    modalContent: {
        backgroundColor: 'rgba(26, 15, 46, 0.95)',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(139, 92, 246, 0.5)',
        shadowColor: '#8b5cf6',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 10,
    },
    icon: {
        fontSize: 64,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#b8a9d4',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
