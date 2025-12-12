import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingItem } from '../../constants/storeData';

interface WishlistContextType {
    wishlist: ClothingItem[];
    addToWishlist: (item: ClothingItem) => void;
    removeFromWishlist: (itemId: string) => void;
    isInWishlist: (itemId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<ClothingItem[]>([]);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const storedWishlist = await AsyncStorage.getItem('wishlist');
            console.log("Loaded wishlist from storage:", storedWishlist);
            if (storedWishlist) {
                const parsed = JSON.parse(storedWishlist);
                if (Array.isArray(parsed)) {
                    // Sanitize data: Filter out items where image is not a string (legacy data)
                    const validItems = parsed.filter(item => typeof item.image === 'string' && item.image.startsWith('http'));
                    console.log(`Loaded ${parsed.length} items, ${validItems.length} valid.`);
                    setWishlist(validItems);

                    // Update storage if we filtered out items
                    if (validItems.length !== parsed.length) {
                        saveWishlist(validItems);
                    }
                } else {
                    console.error("Stored wishlist is not an array:", parsed);
                    setWishlist([]); // Reset if corrupted
                }
            }
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        }
    };

    const saveWishlist = async (newWishlist: ClothingItem[]) => {
        try {
            console.log("Saving wishlist:", newWishlist.length, "items");
            await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
        } catch (error) {
            console.error('Failed to save wishlist:', error);
        }
    };

    const addToWishlist = (item: ClothingItem) => {
        console.log("addToWishlist called with:", item);
        if (!item || !item.id) {
            console.error("Invalid item passed to addToWishlist");
            return;
        }
        if (!isInWishlist(item.id)) {
            const newWishlist = [...wishlist, item];
            setWishlist(newWishlist);
            saveWishlist(newWishlist);
        } else {
            console.log("Item already in wishlist");
        }
    };

    const removeFromWishlist = (itemId: string) => {
        const newWishlist = wishlist.filter((item) => item.id !== itemId);
        setWishlist(newWishlist);
        saveWishlist(newWishlist);
    };

    const isInWishlist = (itemId: string) => {
        return wishlist.some((item) => item.id === itemId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
