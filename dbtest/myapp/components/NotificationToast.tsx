import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useStoreAnimation } from '../context/StoreAnimationContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotificationToast() {
    const { notification, hideNotification } = useStoreAnimation();
    const translateY = useSharedValue(-100);

    useEffect(() => {
        if (notification.visible) {
            translateY.value = withSpring(50, { damping: 15 });
        } else {
            translateY.value = withTiming(-150, { duration: 300 });
        }
    }, [notification.visible]);

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    if (!notification.visible && translateY.value === -150) {
        return null;
    }

    const getIcon = () => {
        switch (notification.type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'info': return 'information-circle';
            default: return 'checkmark-circle';
        }
    };

    const getColors = (): [string, string, ...string[]] => {
        switch (notification.type) {
            case 'success': return ['rgba(34, 197, 94, 0.9)', 'rgba(21, 128, 61, 0.9)']; // Green
            case 'error': return ['rgba(239, 68, 68, 0.9)', 'rgba(185, 28, 28, 0.9)']; // Red
            case 'info': return ['rgba(59, 130, 246, 0.9)', 'rgba(29, 78, 216, 0.9)']; // Blue
            default: return ['rgba(34, 197, 94, 0.9)', 'rgba(21, 128, 61, 0.9)'];
        }
    };

    return (
        <Animated.View style={[styles.container, rStyle]}>
            <LinearGradient
                colors={getColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <Ionicons name={getIcon()} size={24} color="#fff" />
                    <Text style={styles.message}>{notification.message}</Text>
                </View>
                <TouchableOpacity onPress={hideNotification}>
                    <Ionicons name="close" size={20} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: 'center',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    message: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        flex: 1,
    },
});
