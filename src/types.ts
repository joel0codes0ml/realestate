export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number; // in KES
  priceUSD: number; // in USD for Diaspora
  type: 'sale' | 'rent';
  category: 'Studio' | '1 Bedroom' | '2 Bedroom' | 'Luxury Apartment' | 'Family Home' | 'Investment Property' | 'Commercial Property';
  bedrooms: number | 'Studio';
  bathrooms: number;
  sizeSqFt: number;
  images: string[];
  amenities: string[];
  featured: boolean;
  rentalYield: number; // e.g. 8.5 for 8.5%
  appreciationRate: number; // e.g. 12 for 12% annual
  ROI: number; // 5-year expected cumulative ROI
  coordinates?: string; // Google Maps/Location tag
  isFavorite?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  image: string;
  content: string;
  rating: number;
  investmentOutcome?: string;
}

export interface FloorPlan {
  id: string;
  unitType: 'Studio' | '1 Bedroom' | '2 Bedroom' | 'Luxury Penthouse';
  areaSqFt: number;
  dimensions: string;
  startingPriceKES: number;
  expectedRentKES: number;
  yieldPercent: number;
  description: string;
  image: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}
