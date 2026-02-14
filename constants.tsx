
import { WasteItem, TrendingIdea } from './types';

export const COLORS = {
  primary: '#2D5A27',
  secondary: '#A3E635',
  accent: '#F0FDF4',
  danger: '#EF4444',
  warning: '#F59E0B'
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Plastic': 'blue',
  'Organic': 'emerald',
  'E-Waste': 'orange',
  'Metal': 'amber',
  'Paper': 'slate',
  'Glass': 'indigo'
};

export const MOCK_PRODUCTS: WasteItem[] = [
  {
    id: '1',
    title: 'Pressed Plastic Bales',
    category: 'Plastic',
    price: 15450.00,
    quantity: 10,
    unit: 'Bales',
    description: 'High-quality HDPE plastic bales, sorted and cleaned.',
    image: 'https://www.makabale.com/media/159/IMG_3258-1.jpg',
    sellerId: 's1',
    location: 'Downtown Hub',
    rating: 4.8,
    distance: 2.4
  },
  {
    id: '2',
    title: 'Assorted Glass Bottles',
    category: 'Glass',
    price: 3250.50,
    quantity: 50,
    unit: 'kg',
    description: 'Clear and brown glass bottles ready for crushing.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzzZXXkgX4LnJJkheDVgH0mlKxClcnEeRrrQ&s',
    sellerId: 's2',
    location: 'East Industrial',
    rating: 4.5,
    distance: 8.1
  },
  {
    id: '3',
    title: 'Cardboard Sheets',
    category: 'Paper',
    price: 1800.00,
    quantity: 100,
    unit: 'Sheets',
    description: 'Corrugated cardboard, 100% recyclable material.',
    image: 'https://bcbox.ca/wp-content/uploads/2024/08/industrial-uses-of-cardboard-sheets.jpg',
    sellerId: 's1',
    location: 'North Depot',
    rating: 4.2,
    distance: 12.5
  },
  {
    id: '4',
    title: 'Aluminum Scrap',
    category: 'Metal',
    price: 26500.00,
    quantity: 20,
    unit: 'kg',
    description: 'Mixed aluminum scrap from household electronics.',
    image: 'https://www.globalscraps.com/upload/category/1628492232Aluminum-scrap.jpg',
    sellerId: 's3',
    location: 'South Yard',
    rating: 4.9,
    distance: 4.7
  },
  {
    id: '5',
    title: 'Old Circuit Boards',
    category: 'E-Waste',
    price: 42000.00,
    quantity: 5,
    unit: 'kg',
    description: 'Recoverable electronic components for gold/copper extraction.',
    image: 'https://i.sstatic.net/sIri0.jpg',
    sellerId: 's4',
    location: 'West Processing',
    rating: 4.7,
    distance: 18.2
  },
  {
    id: '6',
    title: 'Organic Compost Mix',
    category: 'Organic',
    price: 450.00,
    quantity: 500,
    unit: 'kg',
    description: 'Premium organic waste prepared for high-yield composting.',
    image: 'https://www.promixgardening.com/sites/promix/files/promix-premium-organic-garden-mix-03.png',
    sellerId: 's5',
    location: 'Rural Node A',
    rating: 4.6,
    distance: 35.0
  }
];

export const TRENDING_IDEAS: TrendingIdea[] = [
  {
    id: 't1',
    title: 'Bottle Cap Mosaic',
    description: 'Create stunning wall art using colorful plastic bottle caps.',
    image: 'https://images.artwanted.com/large/10/69368_1086110.jpg',
    tags: ['Art', 'Plastic', 'DIY'],
    likes: 1240
  },
  {
    id: 't2',
    title: 'Compost bin from Wood',
    description: 'Turn old pallet wood into a high-performance composting system.',
    image: 'https://cdn.ecommercedns.uk/files/4/243484/4/35303874/wooden-compost-bin-uk.png',
    tags: ['Garden', 'Organic'],
    likes: 890
  },
  {
    id: 't3',
    title: 'Tire Seating',
    description: 'Convert old car tires into durable, trendy outdoor furniture.',
    image: 'https://i.etsystatic.com/18129822/r/il/92ccc9/4670524669/il_570xN.4670524669_qny9.jpg',
    tags: ['Furniture', 'Rubber'],
    likes: 2105
  }
];
