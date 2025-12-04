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
    categories: { [key: string]: Category };
    clothes: { [brandId: string]: { [categoryId: string]: ClothingItem[] } };
}

// Store Data
export const storeData: StoreData = {
    brands: [
        {
            id: 'nike',
            name: 'Nike',
            description: 'Just Do It - Athletic wear and sportswear',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
            categories: ['mens', 'womens', 'kids', 'accessories']
        },
        {
            id: 'adidas',
            name: 'Adidas',
            description: 'Impossible is Nothing - Performance sportswear',
            image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop',
            categories: ['mens', 'womens', 'kids', 'accessories']
        },
        {
            id: 'zara',
            name: 'Zara',
            description: 'Contemporary fashion for the modern individual',
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=500&fit=crop',
            categories: ['mens', 'womens', 'kids']
        },
        {
            id: 'hm',
            name: 'H&M',
            description: 'Fashion and quality at the best price',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=500&fit=crop',
            categories: ['mens', 'womens', 'kids', 'accessories']
        },
        {
            id: 'gucci',
            name: 'Gucci',
            description: 'Luxury Italian fashion and leather goods',
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop',
            categories: ['mens', 'womens', 'accessories']
        }
    ],

    categories: {
        mens: {
            id: 'mens',
            name: "Men's Collection",
            description: 'Premium clothing for men'
        },
        womens: {
            id: 'womens',
            name: "Women's Collection",
            description: 'Elegant fashion for women'
        },
        kids: {
            id: 'kids',
            name: "Kids Collection",
            description: 'Comfortable clothing for children'
        },
        accessories: {
            id: 'accessories',
            name: 'Accessories',
            description: 'Complete your look'
        }
    },

    clothes: {
        nike: {
            mens: [
                {
                    id: 'nike-mens-1',
                    name: 'Air Max Performance Tee',
                    description: 'Breathable athletic t-shirt with Dri-FIT technology',
                    price: '$45',
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
                    category: 'T-Shirt'
                },
                {
                    id: 'nike-mens-2',
                    name: 'Tech Fleece Joggers',
                    description: 'Premium joggers with modern fit and comfort',
                    price: '$95',
                    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&h=500&fit=crop',
                    category: 'Pants'
                },
                {
                    id: 'nike-mens-3',
                    name: 'Windrunner Jacket',
                    description: 'Iconic chevron design with weather protection',
                    price: '$120',
                    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
                    category: 'Jacket'
                }
            ],
            womens: [
                {
                    id: 'nike-womens-1',
                    name: 'Pro Training Top',
                    description: 'Fitted top for high-performance workouts',
                    price: '$50',
                    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
                    category: 'Top'
                },
                {
                    id: 'nike-womens-2',
                    name: 'Yoga Luxe Leggings',
                    description: 'Ultra-soft fabric for yoga and training',
                    price: '$75',
                    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=500&fit=crop',
                    category: 'Leggings'
                }
            ],
            kids: [
                {
                    id: 'nike-kids-1',
                    name: 'Youth Sportswear Set',
                    description: 'Comfortable set for active kids',
                    price: '$55',
                    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop',
                    category: 'Set'
                }
            ],
            accessories: [
                {
                    id: 'nike-acc-1',
                    name: 'Classic Sports Cap',
                    description: 'Adjustable cap with swoosh logo',
                    price: '$25',
                    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop',
                    category: 'Cap'
                }
            ]
        },
        adidas: {
            mens: [
                {
                    id: 'adidas-mens-1',
                    name: 'Essentials 3-Stripes Tee',
                    description: 'Classic tee with iconic 3-stripes',
                    price: '$40',
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
                    category: 'T-Shirt'
                },
                {
                    id: 'adidas-mens-2',
                    name: 'Tiro Track Pants',
                    description: 'Tapered fit training pants',
                    price: '$65',
                    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&h=500&fit=crop',
                    category: 'Pants'
                }
            ],
            womens: [
                {
                    id: 'adidas-womens-1',
                    name: 'Training Crop Top',
                    description: 'Supportive crop with moisture management',
                    price: '$45',
                    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
                    category: 'Top'
                }
            ],
            kids: [
                {
                    id: 'adidas-kids-1',
                    name: 'Kids Tracksuit',
                    description: 'Comfortable tracksuit for everyday wear',
                    price: '$60',
                    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop',
                    category: 'Set'
                }
            ],
            accessories: [
                {
                    id: 'adidas-acc-1',
                    name: 'Training Backpack',
                    description: 'Spacious backpack with multiple compartments',
                    price: '$55',
                    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
                    category: 'Bag'
                }
            ]
        },
        zara: {
            mens: [
                {
                    id: 'zara-mens-1',
                    name: 'Textured Knit Sweater',
                    description: 'Contemporary sweater with modern fit',
                    price: '$70',
                    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop',
                    category: 'Sweater'
                },
                {
                    id: 'zara-mens-2',
                    name: 'Slim Fit Chinos',
                    description: 'Versatile chinos for any occasion',
                    price: '$60',
                    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop',
                    category: 'Pants'
                }
            ],
            womens: [
                {
                    id: 'zara-womens-1',
                    name: 'Flowing Midi Dress',
                    description: 'Elegant dress for special occasions',
                    price: '$85',
                    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
                    category: 'Dress'
                },
                {
                    id: 'zara-womens-2',
                    name: 'High-Waisted Trousers',
                    description: 'Tailored trousers with modern silhouette',
                    price: '$65',
                    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop',
                    category: 'Pants'
                }
            ],
            kids: [
                {
                    id: 'zara-kids-1',
                    name: 'Denim Jacket',
                    description: 'Classic denim jacket for kids',
                    price: '$50',
                    image: 'https://images.unsplash.com/photo-1562095241-8c6714fd4178?w=500&h=500&fit=crop',
                    category: 'Jacket'
                }
            ]
        },
        hm: {
            mens: [
                {
                    id: 'hm-mens-1',
                    name: 'Regular Fit Polo',
                    description: 'Classic polo in soft cotton',
                    price: '$25',
                    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop',
                    category: 'Polo'
                },
                {
                    id: 'hm-mens-2',
                    name: 'Slim Fit Jeans',
                    description: 'Modern fit jeans in durable denim',
                    price: '$40',
                    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
                    category: 'Jeans'
                }
            ],
            womens: [
                {
                    id: 'hm-womens-1',
                    name: 'Ribbed Tank Top',
                    description: 'Essential tank in soft jersey',
                    price: '$15',
                    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
                    category: 'Top'
                },
                {
                    id: 'hm-womens-2',
                    name: 'Wide Leg Pants',
                    description: 'Comfortable wide-leg style',
                    price: '$35',
                    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop',
                    category: 'Pants'
                }
            ],
            kids: [
                {
                    id: 'hm-kids-1',
                    name: 'Printed Sweatshirt',
                    description: 'Fun sweatshirt for everyday wear',
                    price: '$20',
                    image: 'https://images.unsplash.com/photo-1519482816300-1490fdf2c2bd?w=500&h=500&fit=crop',
                    category: 'Sweatshirt'
                }
            ],
            accessories: [
                {
                    id: 'hm-acc-1',
                    name: 'Canvas Tote Bag',
                    description: 'Eco-friendly shopping bag',
                    price: '$10',
                    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop',
                    category: 'Bag'
                }
            ]
        },
        gucci: {
            mens: [
                {
                    id: 'gucci-mens-1',
                    name: 'GG Webbing Polo',
                    description: 'Luxury polo with signature GG webbing',
                    price: '$650',
                    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop',
                    category: 'Polo'
                },
                {
                    id: 'gucci-mens-2',
                    name: 'Tailored Wool Blazer',
                    description: 'Premium blazer in Italian wool',
                    price: '$2,400',
                    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop',
                    category: 'Blazer'
                }
            ],
            womens: [
                {
                    id: 'gucci-womens-1',
                    name: 'Silk Blouse',
                    description: 'Elegant silk blouse with bow detail',
                    price: '$980',
                    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&h=500&fit=crop',
                    category: 'Blouse'
                },
                {
                    id: 'gucci-womens-2',
                    name: 'Pleated Midi Skirt',
                    description: 'Designer skirt in premium fabric',
                    price: '$1,200',
                    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=500&fit=crop',
                    category: 'Skirt'
                }
            ],
            accessories: [
                {
                    id: 'gucci-acc-1',
                    name: 'GG Marmont Belt',
                    description: 'Iconic double G buckle leather belt',
                    price: '$420',
                    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
                    category: 'Belt'
                },
                {
                    id: 'gucci-acc-2',
                    name: 'Leather Crossbody Bag',
                    description: 'Compact bag with chain strap',
                    price: '$1,800',
                    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop',
                    category: 'Bag'
                }
            ]
        }
    }
};
