import React, { createContext, useContext } from 'react';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

interface StoreAnimationContextType {
    translateY: SharedValue<number>;
    maxSnapPoint: SharedValue<number>;
    showBackdrop: SharedValue<boolean>;
}

const StoreAnimationContext = createContext<StoreAnimationContextType | undefined>(undefined);

export function StoreAnimationProvider({ children }: { children: React.ReactNode }) {
    const translateY = useSharedValue(0);
    const maxSnapPoint = useSharedValue(-1); // -1 means no limit (use default 70%)
    const showBackdrop = useSharedValue(true); // true by default

    return (
        <StoreAnimationContext.Provider value={{ translateY, maxSnapPoint, showBackdrop }}>
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
