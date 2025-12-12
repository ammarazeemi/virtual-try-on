// Store Data Types
export interface Brand {
    id: string;
    name: string;
    description: string;
    // Brand image remains a string for remote URLs
    image: string;
    categories: string[];
}

export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface ClothingItem {
    id: string;
    name: string;
    description: string;
    price: string;
    // ⭐ IMPORTANT: Changed type from string to number for local assets
    image: string;
    category: string;
}

export interface StoreData {
    brands: Brand[];
    categories: { [key: string]: Category[] };
    clothes: { [brandId: string]: { [categoryId: string]: ClothingItem[] } };
}

// Empty store data as we fetch from backend
export const storeData: StoreData = {
    brands: [],
    categories: {},
    clothes: {}
};