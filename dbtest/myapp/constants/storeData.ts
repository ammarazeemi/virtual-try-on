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
    image: number; 
    category: string;
}

export interface StoreData {
    brands: Brand[];
    categories: { [key: string]: Category[] };
    clothes: { [brandId: string]: { [categoryId: string]: ClothingItem[] } };
}

// ❌ The getPlaceholderImage function is REMOVED as it cannot be used with require()

// ⚠️ YOUR ACTION REQUIRED:
// You must manually define a variable for every local image and use require() 
// with a static path string. Replace the placeholder '0' in the data below
// with the actual imported variable (e.g., image: nikeShirt1).


// EXAMPLE OF WHAT YOUR IMPORTS SHOULD LOOK LIKE:
const nikeShirt1 = require('../assets/store/NIKE/SHIRTS/image_1.png');
const nikeShirt2 = require('../assets/store/NIKE/SHIRTS/image_2.png');
const nikeShirt3 = require('../assets/store/NIKE/SHIRTS/image_3.png');
const nikeShirt4 = require('../assets/store/NIKE/SHIRTS/image_4.png');
const nikeShirt5 = require('../assets/store/NIKE/SHIRTS/image_5.png');
const nikeShirt6 = require('../assets/store/NIKE/SHIRTS/image_6.png');

const nikePants1 = require('../assets/store/NIKE/PANTS/image_1.png');
const nikePants2 = require('../assets/store/NIKE/PANTS/image_2.png');
const nikePants3 = require('../assets/store/NIKE/PANTS/image_3.png');
const nikePants4 = require('../assets/store/NIKE/PANTS/image_4.png');
const nikePants5 = require('../assets/store/NIKE/PANTS/image_5.png');
const nikePants6 = require('../assets/store/NIKE/PANTS/image_6.png');

const addidasShirt1 = require('../assets/store/ADIDAS/SHIRTS/image_1.png');
const addidasShirt2 = require('../assets/store/ADIDAS/SHIRTS/image_2.png');
const addidasShirt3 = require('../assets/store/ADIDAS/SHIRTS/image_3.png');
const addidasShirt4 = require('../assets/store/ADIDAS/SHIRTS/image_4.png');
const addidasShirt5 = require('../assets/store/ADIDAS/SHIRTS/image_5.png');
const addidasShirt6 = require('../assets/store/ADIDAS/SHIRTS/image_6.png');

const addidasPants1 = require('../assets/store/ADIDAS/PANTS/image_1.png');
const addidasPants2 = require('../assets/store/ADIDAS/PANTS/image_2.png');
const addidasPants3 = require('../assets/store/ADIDAS/PANTS/image_3.png');
const addidasPants4 = require('../assets/store/ADIDAS/PANTS/image_4.png');
const addidasPants5 = require('../assets/store/ADIDAS/PANTS/image_5.png');
const addidasPants6 = require('../assets/store/ADIDAS/PANTS/image_6.png');

const levisShirt1 = require('../assets/store/LEVIS/SHIRTS/image_1.png');
const levisShirt2 = require('../assets/store/LEVIS/SHIRTS/image_2.png');
const levisShirt3 = require('../assets/store/LEVIS/SHIRTS/image_3.png');
const levisShirt4 = require('../assets/store/LEVIS/SHIRTS/image_4.png');
const levisShirt5 = require('../assets/store/LEVIS/SHIRTS/image_5.png');
const levisShirt6 = require('../assets/store/LEVIS/SHIRTS/image_6.png');

const levisPants1 = require('../assets/store/LEVIS/PANTS/image_1.png');
const levisPants2 = require('../assets/store/LEVIS/PANTS/image_2.png');
const levisPants3 = require('../assets/store/LEVIS/PANTS/image_3.png');
const levisPants4 = require('../assets/store/LEVIS/PANTS/image_4.png');
const levisPants5 = require('../assets/store/LEVIS/PANTS/image_5.png');
const levisPants6 = require('../assets/store/LEVIS/PANTS/image_6.png');



// ... continue for all 36 clothing items


// --- Store Data with Corrected Image Types (using '0' as a numeric placeholder) ---
export const storeData: StoreData = {
    brands: [
        {
            id: 'nike',
            name: 'Nike',
            description: 'Just Do It - Athletic wear and sportswear',
            image: 'https://static.vecteezy.com/system/resources/previews/020/336/719/non_2x/nike-logo-nike-icon-free-free-vector.jpg',
            categories: ['shirts', 'pants']
        },
        {
            id: 'adidas',
            name: 'Adidas',
            description: 'Impossible is Nothing - Performance sportswear',
            image: 'https://static.vecteezy.com/system/resources/previews/019/136/411/non_2x/adidas-logo-adidas-icon-free-free-vector.jpg',
            categories: ['shirts', 'pants']
        },
        {
            id: 'levis',
            name: "Levi's",
            description: 'Quality Never Goes Out of Style',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/023/871/660/small_2x/levis-logo-brand-symbol-white-design-clothes-fashion-illustration-with-black-background-free-vector.jpg',
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
                // Replaced getPlaceholderImage(...) with '0' (the required number type)
                { id: 'nike-shirt-1', name: 'Nike Athletic Shirt 1', description: 'Premium athletic wear', price: '$45', image: nikeShirt1, category: 'shirts' }, 
                { id: 'nike-shirt-2', name: 'Nike Athletic Shirt 2', description: 'Premium athletic wear', price: '$48', image: nikeShirt2, category: 'shirts' },
                { id: 'nike-shirt-3', name: 'Nike Athletic Shirt 3', description: 'Premium athletic wear', price: '$50', image: nikeShirt3, category: 'shirts' },
                { id: 'nike-shirt-4', name: 'Nike Athletic Shirt 4', description: 'Premium athletic wear', price: '$52', image: nikeShirt4, category: 'shirts' },
                { id: 'nike-shirt-5', name: 'Nike Athletic Shirt 5', description: 'Premium athletic wear', price: '$55', image: nikeShirt5, category: 'shirts' },
                { id: 'nike-shirt-6', name: 'Nike Athletic Shirt 6', description: 'Premium athletic wear', price: '$58', image: nikeShirt6, category: 'shirts' }
            ],
            pants: [
                { id: 'nike-pants-1', name: 'Nike Athletic Pants 1', description: 'Premium athletic wear', price: '$65', image: nikePants1, category: 'pants' },
                { id: 'nike-pants-2', name: 'Nike Athletic Pants 2', description: 'Premium athletic wear', price: '$68', image: nikePants2, category: 'pants' },
                { id: 'nike-pants-3', name: 'Nike Athletic Pants 3', description: 'Premium athletic wear', price: '$70', image: nikePants3, category: 'pants' },
                { id: 'nike-pants-4', name: 'Nike Athletic Pants 4', description: 'Premium athletic wear', price: '$72', image: nikePants4, category: 'pants' },
                { id: 'nike-pants-5', name: 'Nike Athletic Pants 5', description: 'Premium athletic wear', price: '$75', image: nikePants5, category: 'pants' },
                { id: 'nike-pants-6', name: 'Nike Athletic Pants 6', description: 'Premium athletic wear', price: '$78', image: nikePants6, category: 'pants' }
            ]
        },
        adidas: {
            shirts: [
                { id: 'adidas-shirt-1', name: 'Adidas Performance Shirt 1', description: 'High-performance sportswear', price: '$42', image: addidasShirt1, category: 'shirts' },
                { id: 'adidas-shirt-2', name: 'Adidas Performance Shirt 2', description: 'High-performance sportswear', price: '$45', image: addidasShirt2, category: 'shirts' },
                { id: 'adidas-shirt-3', name: 'Adidas Performance Shirt 3', description: 'High-performance sportswear', price: '$47', image: addidasShirt3, category: 'shirts' },
                { id: 'adidas-shirt-4', name: 'Adidas Performance Shirt 4', description: 'High-performance sportswear', price: '$50', image: addidasShirt4, category: 'shirts' },
                { id: 'adidas-shirt-5', name: 'Adidas Performance Shirt 5', description: 'High-performance sportswear', price: '$52', image: addidasShirt5, category: 'shirts' },
                { id: 'adidas-shirt-6', name: 'Adidas Performance Shirt 6', description: 'High-performance sportswear', price: '$55', image: addidasShirt6, category: 'shirts' }
            ],
            pants: [
                { id: 'adidas-pants-1', name: 'Adidas Performance Pants 1', description: 'High-performance sportswear', price: '$62', image: addidasPants1, category: 'pants' },
                { id: 'adidas-pants-2', name: 'Adidas Performance Pants 2', description: 'High-performance sportswear', price: '$65', image: addidasPants2, category: 'pants' },
                { id: 'adidas-pants-3', name: 'Adidas Performance Pants 3', description: 'High-performance sportswear', price: '$68', image: addidasPants3, category: 'pants' },
                { id: 'adidas-pants-4', name: 'Adidas Performance Pants 4', description: 'High-performance sportswear', price: '$70', image: addidasPants4, category: 'pants' },
                { id: 'adidas-pants-5', name: 'Adidas Performance Pants 5', description: 'High-performance sportswear', price: '$72', image: addidasPants5, category: 'pants' },
                { id: 'adidas-pants-6', name: 'Adidas Performance Pants 6', description: 'High-performance sportswear', price: '$75', image: addidasPants6, category: 'pants' }
            ]
        },
        levis: {
            shirts: [
                { id: 'levis-shirt-1', name: "Levi's Classic Shirt 1", description: 'Timeless denim style', price: '$55', image: levisShirt1, category: 'shirts' },
                { id: 'levis-shirt-2', name: "Levi's Classic Shirt 2", description: 'Timeless denim style', price: '$58', image: levisShirt2, category: 'shirts' },
                { id: 'levis-shirt-3', name: "Levi's Classic Shirt 3", description: 'Timeless denim style', price: '$60', image: levisShirt3, category: 'shirts' },
                { id: 'levis-shirt-4', name: "Levi's Classic Shirt 4", description: 'Timeless denim style', price: '$62', image: levisShirt4, category: 'shirts' },
                { id: 'levis-shirt-5', name: "Levi's Classic Shirt 5", description: 'Timeless denim style', price: '$65', image: levisShirt5, category: 'shirts' },
                { id: 'levis-shirt-6', name: "Levi's Classic Shirt 6", description: 'Timeless denim style', price: '$68', image: levisShirt6, category: 'shirts' }
            ],
            pants: [
                { id: 'levis-pants-1', name: "Levi's Denim Pants 1", description: 'Classic denim jeans', price: '$80', image: levisPants1, category: 'pants' },
                { id: 'levis-pants-2', name: "Levi's Denim Pants 2", description: 'Classic denim jeans', price: '$82', image: levisPants2, category: 'pants' },
                { id: 'levis-pants-3', name: "Levi's Denim Pants 3", description: 'Classic denim jeans', price: '$85', image: levisPants3, category: 'pants' },
                { id: 'levis-pants-4', name: "Levi's Denim Pants 4", description: 'Classic denim jeans', price: '$88', image: levisPants4, category: 'pants' },
                { id: 'levis-pants-5', name: "Levi's Denim Pants 5", description: 'Classic denim jeans', price: '$90', image: levisPants5, category: 'pants' },
                { id: 'levis-pants-6', name: "Levi's Denim Pants 6", description: 'Classic denim jeans', price: '$92', image: levisPants6, category: 'pants' }
            ]
        }
    }
};