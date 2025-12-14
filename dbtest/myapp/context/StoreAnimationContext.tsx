import React, { createContext, useContext, useState } from 'react';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

type StoreView = 'brands' | 'categories' | 'clothes' | 'wishlist';

interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
}

interface StoreAnimationContextType {
    translateY: SharedValue<number>;
    maxSnapPoint: SharedValue<number>;
    showBackdrop: SharedValue<boolean>;
    openStore: (view?: StoreView) => void;
    requestedView: StoreView | null;
    setRequestedView: (view: StoreView | null) => void;
    notification: NotificationState;
    showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideNotification: () => void;
}

const StoreAnimationContext = createContext<StoreAnimationContextType | undefined>(undefined);

export function StoreAnimationProvider({ children }: { children: React.ReactNode }) {
    const translateY = useSharedValue(0);
    const maxSnapPoint = useSharedValue(-1); // -1 means no limit (use default 70%)
    const showBackdrop = useSharedValue(true); // true by default
    const [requestedView, setRequestedView] = useState<StoreView | null>(null);
    const [notification, setNotification] = useState<NotificationState>({
        message: '',
        type: 'success',
        visible: false,
    });

    const openStore = (view: StoreView = 'brands') => {
        setRequestedView(view);
    };

    const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setNotification({ message, type, visible: true });
        // Auto-hide after 3 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, visible: false }));
    };

    return (
        <StoreAnimationContext.Provider value={{
            translateY,
            maxSnapPoint,
            showBackdrop,
            openStore,
            requestedView,
            setRequestedView,
            notification,
            showNotification,
            hideNotification
        }}>
            {children}
        </StoreAnimationContext.Provider>
    );
}

export function useStoreAnimation() {
    const context = useContext(StoreAnimationContext);
    if (context === undefined) {
        throw new Error('useStoreAnimation must be used within a StoreAnimationProvider');
    }
    return context;
}
