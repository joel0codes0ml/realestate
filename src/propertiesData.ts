import { Property, Testimonial, FloorPlan, Blog } from './types';

export const propertiesData: Property[] = [
  {
    id: 'prop-1',
    title: 'The Crown Penthouse & Residence',
    description: 'An architectural masterpiece located in the heart of Westlands, offering panoramic views of the Nairobi skyline, double-height ceilings, bespoke fixtures, and unparalleled privacy. Includes fully smart-automated lighting, security, and climate systems.',
    location: 'Westlands, Nairobi',
    price: 32000000,
    priceUSD: 246000,
    type: 'sale',
    category: 'Luxury Apartment',
    bedrooms: 3,
    bathrooms: 4,
    sizeSqFt: 3450,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Gym', 'High-Speed Lifts', 'Co-working Spaces', '24/7 Security', 'Parking', 'Smart Home Features', 'High-Speed Internet'],
    featured: true,
    rentalYield: 9.8,
    appreciationRate: 14.2,
    ROI: 72.5,
    coordinates: 'VX26+7M Nairobi'
  },
  {
    id: 'prop-2',
    title: 'Amani Heights Twin Suites',
    description: 'Perfect for savvy investors and young professionals. Located in upscale Kilimani, these twin executive spaces feature spacious living areas, private work alcoves, modern American kitchens, and deep private balconies.',
    location: 'Kilimani, Nairobi',
    price: 14500000,
    priceUSD: 111500,
    type: 'sale',
    category: '1 Bedroom',
    bedrooms: 1,
    bathrooms: 1,
    sizeSqFt: 1100,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Gym', 'High-Speed Lifts', 'Children\'s Play Area', '24/7 Security', 'Parking', 'High-Speed Internet'],
    featured: true,
    rentalYield: 8.5,
    appreciationRate: 11.5,
    ROI: 60.0,
    coordinates: 'VX26+7M Nairobi'
  },
  {
    id: 'prop-3',
    title: 'Zara Crest Obsidian Studio',
    description: 'High-density luxury living. Fully optimized obsidian palette studio designed with bespoke custom storage space, multi-functional folding furniture potential, floor-to-ceiling windows, and top-of-the-line appliances. Ideal for short-term AirBnB rentals.',
    location: 'Kileleshwa, Nairobi',
    price: 8200000,
    priceUSD: 63000,
    type: 'sale',
    category: 'Studio',
    bedrooms: 'Studio',
    bathrooms: 1,
    sizeSqFt: 550,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Gym', 'High-Speed Lifts', 'Co-working Spaces', '24/7 Security', 'Parking', 'High-Speed Internet', 'Smart Home Features'],
    featured: true,
    rentalYield: 11.2,
    appreciationRate: 10.8,
    ROI: 68.2,
    coordinates: 'VX26+7M Nairobi'
  },
  {
    id: 'prop-4',
    title: 'The Grand Sanctuary Mansion',
    description: 'An elite multi-generational manor home in Nairobi\'s premier diplomat suburb, Karen. Set on 1.2 acres of fully landscaped gardens, this residence enjoys high security, a grand foyer, private swimming pool, professional chef kitchen, and master wing with deep closets.',
    location: 'Karen, Nairobi',
    price: 115000000,
    priceUSD: 885000,
    type: 'sale',
    category: 'Family Home',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqFt: 7800,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Gym', 'Children\'s Play Area', '24/7 Security', 'Parking', 'Landscaped Gardens', 'Smart Home Features'],
    featured: false,
    rentalYield: 6.8,
    appreciationRate: 15.5,
    ROI: 78.0,
    coordinates: 'VX26+7M Nairobi'
  },
  {
    id: 'prop-5',
    title: 'Lavington Crest Contemporary Villa',
    description: 'An exquisite modern townhome inside a secure gated compound of just 4 villas. Designed with a striking stone-and-glass exterior, magnificent cathedral windows, soundproofing, and a private rooftop garden bar perfect for hosting.',
    location: 'Lavington, Nairobi',
    price: 68000000,
    priceUSD: 523000,
    type: 'sale',
    category: 'Family Home',
    bedrooms: 4,
    bathrooms: 5,
    sizeSqFt: 4600,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Gym', 'Children\'s Play Area', '24/7 Security', 'Parking', 'Landscaped Gardens', 'High-Speed Internet'],
    featured: true,
    rentalYield: 7.2,
    appreciationRate: 13.0,
    ROI: 66.5,
    coordinates: 'VX26+7M Nairobi'
  },
  {
    id: 'prop-6',
    title: 'Luxury Oak Suite Westlands',
    description: 'A beautiful, fully furnished high-end residential workspace apartment in the commercial hub of Westlands. Elegant wooden parquet floors, custom-designed gold brass features, open-plan dining, and floor-to-ceiling double glazing.',
    location: 'Westlands, Nairobi',
    price: 180000, // Monthly rent
    priceUSD: 1400,
    type: 'rent',
    category: '2 Bedroom', // Modified category to support standard types
    bedrooms: 2,
    bathrooms: 2,
    sizeSqFt: 1850,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Gym', 'High-Speed Lifts', 'Co-working Spaces', '24/7 Security', 'Parking', 'High-Speed Internet'],
    featured: false,
    rentalYield: 9.4,
    appreciationRate: 12.5,
    ROI: 61.2,
    coordinates: 'VX26+7M Nairobi'
  },
  {
    id: 'prop-7',
    title: 'Nairobi Nexus Commercial Pavilion',
    description: 'A fully-customizable luxury commercial floor in Westlands\' landmark tower. Equipped with dedicated ultra-fast redundant fiber lines, modern co-working bays, biometric access controls, multiple glass boardrooms, and private CEO executive offices.',
    location: 'Westlands, Nairobi',
    price: 135000000,
    priceUSD: 1038000,
    type: 'sale',
    category: 'Commercial Property',
    bedrooms: 'Studio', // Or custom indicator
    bathrooms: 4,
    sizeSqFt: 8500,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Co-working Spaces', 'High-Speed Lifts', '24/7 Security', 'Parking', 'High-Speed Internet', 'Smart Home Features'],
    featured: false,
    rentalYield: 11.5,
    appreciationRate: 15.0,
    ROI: 80.0,
    coordinates: 'VX26+7M Nairobi'
  },
  {
    id: 'prop-8',
    title: 'Kileleshwa Vista Duplex',
    description: 'Gorgeously elevated dual-level condo in premium Kileleshwa. Highlights include heavy soundproofing between floors, designer custom brass faucets, premium walk-in dry bar, dedicated private parking bays, and direct elevator entry directly to your foyer.',
    location: 'Kileleshwa, Nairobi',
    price: 24500000,
    priceUSD: 188500,
    type: 'sale',
    category: 'Luxury Apartment',
    bedrooms: 2,
    bathrooms: 3,
    sizeSqFt: 2200,
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop'
    ],
    amenities: ['Gym', 'High-Speed Lifts', 'Children\'s Play Area', '24/7 Security', 'Parking', 'High-Speed Internet'],
    featured: true,
    rentalYield: 8.9,
    appreciationRate: 11.8,
    ROI: 63.8,
    coordinates: 'VX26+7M Nairobi'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Michael Mwangi',
    role: 'Diaspora Investor',
    company: 'Cardiology Group (Texas, USA)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: 'As an investor living in Texas, finding a transparent and professional agency in Nairobi was incredibly difficult until I met Exodus Realty. They helped me purchase two units at The Crown, handled all construction documentation, and now manage the rentals flawlessly. The 9.8% rental yield is exactly what they promised.',
    rating: 5,
    investmentOutcome: 'Purchased 2 Premium Penthouses • 10.1% Net Yield'
  },
  {
    id: 'test-2',
    name: 'Wanjiku Kamau',
    role: 'Tech Consultant & First-time Homeowner',
    company: 'Fintech Alliance Ltd',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    content: 'I purchased my first 1-bedroom apartment in Kilimani through Exodus Realty. Their mortgage advisory helped me secure 80% financing within two weeks. Their transparency, professional site visits, and attention to detail saved me millions in potential delays. I am extremely happy in my new luxury home!',
    rating: 5,
    investmentOutcome: 'Acquired 1-Bedroom Home • KES 1.2M Equity Gain in Year 1'
  },
  {
    id: 'test-3',
    name: 'The Salim Family',
    role: 'Luxury Estate Clients',
    company: 'Salim & Sons Enterprises',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
    content: 'Finding a secure, elegant, multi-generational family home in Karen felt like searching for a needle in a haystack. But Exodus Realty understood our specific privacy requirements immediately. They coordinated an private VIP tour of The Grand Sanctuary. Incredible secure transaction team!',
    rating: 5,
    investmentOutcome: 'Purchased Custom Gated Villa • 15.5% Property Appreciation Rate'
  }
];

export const floorPlansData: FloorPlan[] = [
  {
    id: 'fp-1',
    unitType: 'Studio',
    areaSqFt: 550,
    dimensions: '22ft x 25ft',
    startingPriceKES: 8200000,
    expectedRentKES: 65000,
    yieldPercent: 11.2,
    description: 'Cleverly partitioned luxury microbox with a premium glass partition divider separating the custom sleep sanctuary from the executive kitchen and dynamic workspace.',
    image: 'studio-plan'
  },
  {
    id: 'fp-2',
    unitType: '1 Bedroom',
    areaSqFt: 1100,
    dimensions: '33ft x 33ft',
    startingPriceKES: 14500000,
    expectedRentKES: 110000,
    yieldPercent: 8.5,
    description: 'Fully optimized single suite possessing an expansive double ensuite setup with double-glazed doors opening into a massive breezy terrace overlooking parklands.',
    image: '1bed-plan'
  },
  {
    id: 'fp-3',
    unitType: '2 Bedroom',
    areaSqFt: 1850,
    dimensions: '37ft x 50ft',
    startingPriceKES: 24500000,
    expectedRentKES: 180000,
    yieldPercent: 8.9,
    description: 'A luxurious dual master-bedroom layout with deep walk-in closets, central culinary island kitchen, built-in staff quarters, and dedicated laundry room.',
    image: '2bed-plan'
  },
  {
    id: 'fp-4',
    unitType: 'Luxury Penthouse',
    areaSqFt: 3450,
    dimensions: '50ft x 69ft',
    startingPriceKES: 32000000,
    expectedRentKES: 280000,
    yieldPercent: 9.8,
    description: 'Stunning double-height crown penthouse with 3 complete master wings, a private pool, an elegant private cinema parlor, study, and direct luxury express cargo elevators.',
    image: 'penthouse-plan'
  }
];

export const blogsData: Blog[] = [
  {
    id: 'blog-1',
    title: 'Why Nairobi Real Estate is Africa’s Premier Safe Haven for Diaspora Investors',
    excerpt: 'Detailed analysis of Nairobi’s high rental yields (up to 11.5%) and how dollar-denominated assets provide hedge protection against international inflationary peaks.',
    content: 'The Nairobi real estate market is expanding rapidly due to urbanization, infrastructure progress (such as the Nairobi Expressway), and the rising presence of international conglomerates. For diaspora investors, locking in capital in prime areas like Westlands, Kilimani, and Karen secures massive capital appreciation while collecting passive rental income in hard currencies.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=400&auto=format&fit=crop',
    category: 'Investment Advisory',
    date: 'June 1, 2026',
    readTime: '6 min read',
    slug: 'nairobi-real-estate-safe-haven'
  },
  {
    id: 'blog-2',
    title: 'How to Calculate & Predict Your Custom Rental Yield & Capital Appreciation',
    excerpt: 'A comprehensive formulas and variables list showing how professional developers forecast long-term equity growth and rental cashflows.',
    content: 'Success in property investments rests entirely on numerical analysis. Learn how to calculate gross rental yield, net rental yield, and factoring maintenance reserves. We explain the historical 12% average annual property value appreciation across Lavington, Westlands, and Kileleshwa developments.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop',
    category: 'Finance Guide',
    date: 'May 18, 2026',
    readTime: '4 min read',
    slug: 'how-to-calculate-rental-yield'
  },
  {
    id: 'blog-3',
    title: 'A Spotlight on Nairobi’s High-Growth Suburbs for 2026/2027 Investments',
    excerpt: 'We dissect why specific sectors of Kilimani and Westlands are shifting toward luxury high-density apartments with premium amenity cores.',
    content: 'High-earning young professionals and corporate expatriates are altering the leasing terrain in Nairobi. Tenants now actively seek Gym, Lifts, and secure Co-working features directly within their residential tower. Gaining early access to these developments ensures immediate cash flow.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop',
    category: 'Market Trends',
    date: 'April 22, 2026',
    readTime: '5 min read',
    slug: 'high-growth-suburbs-nairobi'
  }
];
