// Store Data Types
export interface Brand {
    id: string;
    name: string;
    description: string;
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
    image: string;
    category: string;
}

export interface StoreData {
    brands: Brand[];
    categories: { [key: string]: Category[] };
    clothes: { [brandId: string]: { [categoryId: string]: ClothingItem[] } };
}

// Placeholder image function
const getPlaceholderImage = (brand: string, category: string, index: number) => {
    return `https://via.placeholder.com/300x400/333333/FFFFFF?text=${brand}+${category}+${index}`;
};

// Store Data with Placeholder Images (Real images disabled for now)
export const storeData: StoreData = {
    brands: [
        {
            id: 'nike',
            name: 'Nike',
            description: 'Just Do It - Athletic wear and sportswear',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
            categories: ['shirts', 'pants']
        },
        {
            id: 'adidas',
            name: 'Adidas',
            description: 'Impossible is Nothing - Performance sportswear',
            image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop',
            categories: ['shirts', 'pants']
        },
        {
            id: 'levis',
            name: "Levi's",
            description: 'Quality Never Goes Out of Style',
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
            categories: ['shirts', 'pants']
        }
    ],

    categories: {
        nike: [
            { id: 'shirts', name: 'Shirts', description: 'Nike athletic shirts and tops' },
            { id: 'pants', name: 'Pants', description: 'Nike athletic pants and bottoms' }
        ],
        adidas: [
            { id: 'shirts', name: 'Shirts', description: 'Adidas performance shirts' },
            { id: 'pants', name: 'Pants', description: 'Adidas performance pants' }
        ],
        levis: [
            { id: 'shirts', name: 'Shirts', description: "Levi's classic shirts" },
            { id: 'pants', name: 'Pants', description: "Levi's denim and pants" }
        ]
    },

    clothes: {
        nike: {
            shirts: [
                { id: 'nike-shirt-1', name: 'Nike Athletic Shirt 1', description: 'Premium athletic wear', price: '$45', image: getPlaceholderImage('Nike', 'Shirt', 1), category: 'shirts' },
                { id: 'nike-shirt-2', name: 'Nike Athletic Shirt 2', description: 'Premium athletic wear', price: '$48', image: getPlaceholderImage('Nike', 'Shirt', 2), category: 'shirts' },
                { id: 'nike-shirt-3', name: 'Nike Athletic Shirt 3', description: 'Premium athletic wear', price: '$50', image: getPlaceholderImage('Nike', 'Shirt', 3), category: 'shirts' },
                { id: 'nike-shirt-4', name: 'Nike Athletic Shirt 4', description: 'Premium athletic wear', price: '$52', image: getPlaceholderImage('Nike', 'Shirt', 4), category: 'shirts' },
                { id: 'nike-shirt-5', name: 'Nike Athletic Shirt 5', description: 'Premium athletic wear', price: '$55', image: getPlaceholderImage('Nike', 'Shirt', 5), category: 'shirts' },
                { id: 'nike-shirt-6', name: 'Nike Athletic Shirt 6', description: 'Premium athletic wear', price: '$58', image: getPlaceholderImage('Nike', 'Shirt', 6), category: 'shirts' }
            ],
            pants: [
                { id: 'nike-pants-1', name: 'Nike Athletic Pants 1', description: 'Premium athletic wear', price: '$65', image: getPlaceholderImage('Nike', 'Pants', 1), category: 'pants' },
                { id: 'nike-pants-2', name: 'Nike Athletic Pants 2', description: 'Premium athletic wear', price: '$68', image: getPlaceholderImage('Nike', 'Pants', 2), category: 'pants' },
                { id: 'nike-pants-3', name: 'Nike Athletic Pants 3', description: 'Premium athletic wear', price: '$70', image: getPlaceholderImage('Nike', 'Pants', 3), category: 'pants' },
                { id: 'nike-pants-4', name: 'Nike Athletic Pants 4', description: 'Premium athletic wear', price: '$72', image: getPlaceholderImage('Nike', 'Pants', 4), category: 'pants' },
                { id: 'nike-pants-5', name: 'Nike Athletic Pants 5', description: 'Premium athletic wear', price: '$75', image: getPlaceholderImage('Nike', 'Pants', 5), category: 'pants' },
                { id: 'nike-pants-6', name: 'Nike Athletic Pants 6', description: 'Premium athletic wear', price: '$78', image: getPlaceholderImage('Nike', 'Pants', 6), category: 'pants' }
            ]
        },
        adidas: {
            shirts: [
                { id: 'adidas-shirt-1', name: 'Adidas Performance Shirt 1', description: 'High-performance sportswear', price: '$42', image: getPlaceholderImage('Adidas', 'Shirt', 1), category: 'shirts' },
                { id: 'adidas-shirt-2', name: 'Adidas Performance Shirt 2', description: 'High-performance sportswear', price: '$45', image: getPlaceholderImage('Adidas', 'Shirt', 2), category: 'shirts' },
                { id: 'adidas-shirt-3', name: 'Adidas Performance Shirt 3', description: 'High-performance sportswear', price: '$47', image: getPlaceholderImage('Adidas', 'Shirt', 3), category: 'shirts' },
                { id: 'adidas-shirt-4', name: 'Adidas Performance Shirt 4', description: 'High-performance sportswear', price: '$50', image: getPlaceholderImage('Adidas', 'Shirt', 4), category: 'shirts' },
                { id: 'adidas-shirt-5', name: 'Adidas Performance Shirt 5', description: 'High-performance sportswear', price: '$52', image: getPlaceholderImage('Adidas', 'Shirt', 5), category: 'shirts' },
                { id: 'adidas-shirt-6', name: 'Adidas Performance Shirt 6', description: 'High-performance sportswear', price: '$55', image: getPlaceholderImage('Adidas', 'Shirt', 6), category: 'shirts' }
            ],
            pants: [
                { id: 'adidas-pants-1', name: 'Adidas Performance Pants 1', description: 'High-performance sportswear', price: '$62', image: getPlaceholderImage('Adidas', 'Pants', 1), category: 'pants' },
                { id: 'adidas-pants-2', name: 'Adidas Performance Pants 2', description: 'High-performance sportswear', price: '$65', image: getPlaceholderImage('Adidas', 'Pants', 2), category: 'pants' },
                { id: 'adidas-pants-3', name: 'Adidas Performance Pants 3', description: 'High-performance sportswear', price: '$68', image: getPlaceholderImage('Adidas', 'Pants', 3), category: 'pants' },
                { id: 'adidas-pants-4', name: 'Adidas Performance Pants 4', description: 'High-performance sportswear', price: '$70', image: getPlaceholderImage('Adidas', 'Pants', 4), category: 'pants' },
                { id: 'adidas-pants-5', name: 'Adidas Performance Pants 5', description: 'High-performance sportswear', price: '$72', image: getPlaceholderImage('Adidas', 'Pants', 5), category: 'pants' },
                { id: 'adidas-pants-6', name: 'Adidas Performance Pants 6', description: 'High-performance sportswear', price: '$75', image: getPlaceholderImage('Adidas', 'Pants', 6), category: 'pants' }
            ]
        },
        levis: {
            shirts: [
                { id: 'levis-shirt-1', name: "Levi's Classic Shirt 1", description: 'Timeless denim style', price: '$55', image: getPlaceholderImage('Levis', 'Shirt', 1), category: 'shirts' },
                { id: 'levis-shirt-2', name: "Levi's Classic Shirt 2", description: 'Timeless denim style', price: '$58', image: getPlaceholderImage('Levis', 'Shirt', 2), category: 'shirts' },
                { id: 'levis-shirt-3', name: "Levi's Classic Shirt 3", description: 'Timeless denim style', price: '$60', image: getPlaceholderImage('Levis', 'Shirt', 3), category: 'shirts' },
                { id: 'levis-shirt-4', name: "Levi's Classic Shirt 4", description: 'Timeless denim style', price: '$62', image: getPlaceholderImage('Levis', 'Shirt', 4), category: 'shirts' },
                { id: 'levis-shirt-5', name: "Levi's Classic Shirt 5", description: 'Timeless denim style', price: '$65', image: getPlaceholderImage('Levis', 'Shirt', 5), category: 'shirts' },
                { id: 'levis-shirt-6', name: "Levi's Classic Shirt 6", description: 'Timeless denim style', price: '$68', image: getPlaceholderImage('Levis', 'Shirt', 6), category: 'shirts' }
            ],
            pants: [
                { id: 'levis-pants-1', name: "Levi's Denim Pants 1", description: 'Classic denim jeans', price: '$80', image: getPlaceholderImage('Levis', 'Pants', 1), category: 'pants' },
                { id: 'levis-pants-2', name: "Levi's Denim Pants 2", description: 'Classic denim jeans', price: '$82', image: getPlaceholderImage('Levis', 'Pants', 2), category: 'pants' },
                { id: 'levis-pants-3', name: "Levi's Denim Pants 3", description: 'Classic denim jeans', price: '$85', image: getPlaceholderImage('Levis', 'Pants', 3), category: 'pants' },
                { id: 'levis-pants-4', name: "Levi's Denim Pants 4", description: 'Classic denim jeans', price: '$88', image: getPlaceholderImage('Levis', 'Pants', 4), category: 'pants' },
                { id: 'levis-pants-5', name: "Levi's Denim Pants 5", description: 'Classic denim jeans', price: '$90', image: getPlaceholderImage('Levis', 'Pants', 5), category: 'pants' },
                { id: 'levis-pants-6', name: "Levi's Denim Pants 6", description: 'Classic denim jeans', price: '$92', image: getPlaceholderImage('Levis', 'Pants', 6), category: 'pants' }
            ]
        }
    }
};
