/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  propertiesData,
  testimonialsData,
  blogsData,
} from './propertiesData';
import { Property, Testimonial } from './types';
import { PropertyCard } from './components/PropertyCard';
import { QuickViewModal } from './components/QuickViewModal';
import { CompareModal } from './components/CompareModal';
import { MortgageCalculator } from './components/MortgageCalculator';
import { RoiCalculator } from './components/RoiCalculator';
import { FloorPlanViewer } from './components/FloorPlanViewer';
import { LiveChat } from './components/LiveChat';
import { Popups } from './components/Popups';
import {
  Building,
  Landmark,
  ShieldCheck,
  Phone,
  Mail,
  Heart,
  Eye,
  Star,
  ChevronRight,
  MapPin,
  Sparkles,
  Menu,
  X,
  BookOpen,
  ThumbsUp,
  Award,
  Search,
  Check,
  Activity,
  Maximize2,
  Lock,
  Compass,
  ArrowRight,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AMENITIES_CATALOG = [
  { name: 'Gym', icon: '🏋️‍♂️', desc: 'Fully fitted state-of-the-art gym with yoga decks' },
  { name: 'High-Speed Lifts', icon: '🛗', desc: 'Premium luxury express elevators from Kone/Otis' },
  { name: 'Co-working Spaces', icon: '💻', desc: 'Secure soundproof business nodes and workspaces' },
  { name: 'Children\'s Play Area', icon: '🧸', desc: 'Secure interactive indoor & outdoor play zones' },
  { name: '24/7 Security', icon: '🛡️', desc: 'CCTV perimeter loops, biometric access & guard force' },
  { name: 'Parking', icon: '🚗', desc: 'Secured multi-level basement parking with EV points' },
  { name: 'Landscaped Gardens', icon: '🌿', desc: 'Tranquil garden courtyards and water features' },
  { name: 'High-Speed Internet', icon: '⚡', desc: 'Redundant high-capacity fiber backbone integrated' },
  { name: 'Smart Home Features', icon: '📱', desc: 'Biometric doors, smart climate & mood dimmers' },
];

const GALLERY_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop', category: 'Exterior', caption: 'The Crown Skyscraper Silhouette' },
  { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop', category: 'Interior', caption: 'Lounge cathedral ceiling' },
  { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop', category: 'Interior', caption: 'Gold Accent sleep sanctuary' },
  { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop', category: 'Kitchen', caption: 'Integrated marble chef platform' },
  { url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop', category: 'Amenities', caption: 'Elevated horizon swimming pool' },
  { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', category: 'Interior', caption: 'Obsidian ensuite vanity room' },
];

export default function App() {
  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lists and filtering state
  const [properties, setProperties] = useState<Property[]>(propertiesData);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  // Filter queries
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All'); // sale / rent
  const [filterBedrooms, setFilterBedrooms] = useState('All');
  const [priceMax, setPriceMax] = useState(120000000); // Up to 120M

  // Modal Triggers
  const [activeQuickView, setActiveQuickView] = useState<Property | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [siteTourProperty, setSiteTourProperty] = useState<Property | null>(null);
  const [isTourBooked, setIsTourBooked] = useState(false);
  
  // Custom reviews feedback state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialsData);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('Local Investor');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Gallery state
  const [activeGalleryCat, setActiveGalleryCat] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lead capture consultation form in header state
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Sticky Call/SMS callback state
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackInterest, setCallbackInterest] = useState('Investment Units');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  // Load favorites & comparison list
  useEffect(() => {
    const savedFavs = localStorage.getItem('exodus_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const handleToggleFavorite = (id: string) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('exodus_favorites', JSON.stringify(updated));
  };

  const handleToggleCompare = (property: Property) => {
    if (comparedProperties.some(p => p.id === property.id)) {
      setComparedProperties(comparedProperties.filter(p => p.id !== property.id));
    } else {
      if (comparedProperties.length >= 3) {
        alert("Maximum limit reaches: You can compare up to 3 luxury developments simultaneously.");
        return;
      }
      setComparedProperties([...comparedProperties, property]);
    }
  };

  // Clear filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterLocation('All');
    setFilterCategory('All');
    setFilterType('All');
    setFilterBedrooms('All');
    setPriceMax(120000000);
  };

  // Perform search filtering logic
  const filteredPropertiesList = useMemo(() => {
    return properties.filter((prop) => {
      const matchSearch =
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLoc = filterLocation === 'All' || prop.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchCat = filterCategory === 'All' || prop.category === filterCategory;
      const matchType = filterType === 'All' || prop.type === filterType;
      const matchBeds =
        filterBedrooms === 'All' ||
        (filterBedrooms === 'Studio' && prop.bedrooms === 'Studio') ||
        (filterBedrooms !== 'Studio' && prop.bedrooms === parseInt(filterBedrooms));
      const matchPrice = prop.price <= priceMax;

      return matchSearch && matchLoc && matchCat && matchType && matchBeds && matchPrice;
    });
  }, [properties, searchQuery, filterLocation, filterCategory, filterType, filterBedrooms, priceMax]);

  // Handle Review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim() && reviewContent.trim()) {
      const newReview: Testimonial = {
        id: `rev-${Date.now()}`,
        name: reviewName,
        role: reviewRole,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        content: reviewContent,
        rating: reviewRating,
        investmentOutcome: 'Verified Exodus Realty Purchaser'
      };
      setTestimonials([newReview, ...testimonials]);
      setReviewName('');
      setReviewContent('');
      setIsReviewFormOpen(false);
    }
  };

  // Handle consultation modal submission
  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (consultName.trim() && consultPhone.trim() && consultEmail.trim()) {
      const bookings = JSON.parse(localStorage.getItem('exodus_consult_bookings') || '[]');
      bookings.push({
        id: `cb-${Date.now()}`,
        name: consultName,
        phone: consultPhone,
        email: consultEmail,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('exodus_consult_bookings', JSON.stringify(bookings));
      setConsultSubmitted(true);
      setTimeout(() => {
        setConsultSubmitted(false);
        setIsConsultationOpen(false);
        setConsultName('');
        setConsultPhone('');
        setConsultEmail('');
      }, 4000);
    }
  };

  // Handle callback section submission
  const handleCallbackSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (callbackName.trim() && callbackPhone.trim()) {
      const callbacks = JSON.parse(localStorage.getItem('exodus_callback_requests') || '[]');
      callbacks.push({
        id: `call-${Date.now()}`,
        name: callbackName,
        phone: callbackPhone,
        interest: callbackInterest,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('exodus_callback_requests', JSON.stringify(callbacks));
      setCallbackSubmitted(true);
      setTimeout(() => {
        setCallbackSubmitted(false);
        setCallbackName('');
        setCallbackPhone('');
      }, 5000);
    }
  };

  // Handle site visitor scheduler
  const handleSiteTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const siteTourDate = (document.getElementById('site-visit-date-picker') as HTMLInputElement)?.value;
    const siteTourTime = (document.getElementById('site-visit-time-picker') as HTMLSelectElement)?.value;

    if (siteTourDate && siteTourProperty) {
      const tours = JSON.parse(localStorage.getItem('exodus_site_tours') || '[]');
      tours.push({
        id: `tour-${Date.now()}`,
        propertyId: siteTourProperty.id,
        propertyTitle: siteTourProperty.title,
        date: siteTourDate,
        time: siteTourTime,
        status: 'Scheduled'
      });
      localStorage.setItem('exodus_site_tours', JSON.stringify(tours));
      setIsTourBooked(true);
      setTimeout(() => {
        setIsTourBooked(false);
        setSiteTourProperty(null);
      }, 4000);
    }
  };

  // Gallery filter logic
  const filteredGalleryPhotos = useMemo(() => {
    if (activeGalleryCat === 'All') return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.filter(photo => photo.category === activeGalleryCat);
  }, [activeGalleryCat]);

  return (
    <div className="bg-[#F8FAFC] text-[#111827] font-sans antialiased selection:bg-gold-500 selection:text-slate-950">
      {/* 1. STICKY GLASSMORPHIC HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-gold-500/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="bg-gold-500 p-2.5 rounded-lg text-slate-950 shadow-md flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <Building size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block font-display font-black text-lg tracking-tight text-white group-hover:text-gold-500 transition-colors">
                EXODUS REALTY
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-gold-500 font-bold leading-none mt-0.5">
                Buy  Sell  Rent Property
              </span>
            </div>
          </a>

          {/* Desktop Sitemap Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-display font-semibold uppercase tracking-wider text-slate-300">
            <a href="#home" className="hover:text-gold-500 transition-colors">Home</a>
            <a href="#properties" className="hover:text-gold-500 transition-colors">Properties</a>
            <a href="#investment" className="hover:text-gold-500 transition-colors">Investments</a>
            <a href="#amenities" className="hover:text-gold-500 transition-colors">Amenities</a>
            <a href="#gallery" className="hover:text-gold-500 transition-colors">Gallery</a>
            <a href="#about" className="hover:text-gold-500 transition-colors">About</a>
            <a href="#blog" className="hover:text-gold-500 transition-colors">Blog</a>
            <a href="#contact" className="hover:text-gold-500 transition-colors">Contact</a>
          </nav>

          {/* CTAs Desktop Right */}
          <div className="hidden lg:flex items-center gap-3.5">
            {/* Compare Tool indicator */}
            {comparedProperties.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="bg-gold-500/10 border border-gold-500/40 hover:bg-gold-500 hover:text-slate-950 text-gold-500 font-display font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Activity size={12} className="animate-pulse" />
                Compare ({comparedProperties.length})
              </button>
            )}

            <button
              onClick={() => setIsConsultationOpen(true)}
              className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-display font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl shadow-lg shadow-gold-500/10 transition-colors cursor-pointer"
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile responsive triggers */}
          <div className="lg:hidden flex items-center gap-2">
            {comparedProperties.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="bg-gold-500 text-slate-950 font-display font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg flex items-center gap-1"
              >
                ({comparedProperties.length}) Compare
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="text-slate-300 hover:text-white p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer popup */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-slate-950 border-t border-slate-800 text-slate-300 overflow-hidden text-xs uppercase font-display font-bold tracking-widest"
            >
              <div className="p-4 space-y-4 flex flex-col">
                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5 text-white">Home</a>
                <a href="#properties" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5 text-white">Properties</a>
                <a href="#investment" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5 text-white">Investments</a>
                <a href="#amenities" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Amenities</a>
                <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Gallery</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">About</a>
                <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Blog</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2">Contact</a>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsConsultationOpen(true);
                  }}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 py-3.5 rounded-xl uppercase font-extrabold text-xs tracking-widest mt-2"
                >
                  Book Consultation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. DYNAMIC FULL-SCREEN LUXURY HERO */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 text-white py-16 overflow-hidden">
        {/* Immersive background high-res condo skyline */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop"
            alt="Nairobi High Premium Condo Skyline"
            className="w-full h-full object-cover scale-102 opacity-40 hover:scale-105 transition-transform duration-10000"
            referrerPolicy="no-referrer"
          />
          {/* Saturated deep blues onto gold mesh grading mapping to make prose extremely prominent */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60"></div>
          <div className="absolute inset-b-0 inset-x-0 h-40 bg-gradient-to-t from-[#F8FAFC] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Prose left column - 7/12 */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/35 text-gold-500 text-[10px] font-display font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md">
              <Sparkles size={12} className="text-gold-500 animate-spin-slow" />
              Nairobi’s Elite Property & Wealth Desk
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.1] tracking-tight text-white">
              Find Your Dream Home <br />
              or Next Investment <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-200 to-gold-600">
                in Premium Nairobi
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Buy, sell, rent, and invest in high-end developments with premium capital yield protections. Handled securely by Nairobi’s trusted real estate experts.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#properties"
                className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-display font-bold text-xs tracking-widest uppercase px-8 py-4.5 rounded-xl transition-all shadow-lg hover:shadow-gold-500/25 cursor-pointer flex items-center gap-2 border border-gold-500"
              >
                View Properties
                <ArrowRight size={14} />
              </a>
              <button
                onClick={() => setIsConsultationOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white hover:text-white font-display font-semibold text-xs tracking-widest uppercase px-8 py-4.5 rounded-xl transition-all border border-slate-750 backdrop-blur-sm cursor-pointer flex items-center gap-2"
              >
                <style>{`.border-slate-750 { border-color: rgba(51, 65, 85, 0.5); }`}</style>
                Book Site Visit
              </button>
            </div>

            {/* Key trust indicators footer inside hero */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl border-t border-white/10">
              <div>
                <span className="block text-xl md:text-2xl font-display font-black text-gold-500">500+</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Happy Clients</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-xl md:text-2xl font-display font-black text-gold-500">200+</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Properties Listed</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-xl md:text-2xl font-display font-black text-gold-500">98%</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Client Satisfaction</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-xl md:text-2xl font-display font-black text-gold-500">Tier A</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Nairobi Experts</span>
              </div>
            </div>
          </div>

          {/* Embedded luxury glass form - Right column (5/12) */}
          <div className="lg:col-span-12 xl:col-span-5 block lg:hidden xl:block">
            <div className="glass-panel text-white rounded-3xl p-6 md:p-8 shadow-2xl relative border border-white/15">
              <span className="text-[10px] uppercase font-display font-bold tracking-widest text-gold-500 block mb-1">
                EXODUS REAL-TIME CALLBACK
              </span>
              <h3 className="text-xl font-display font-extrabold text-white mb-2">
                Inquire on Premium Units
              </h3>
              <p className="text-slate-300 text-xs mb-6">
                Fill details to receive a complimentary return call, localized catalogs, and property brochures directly inside WhatsApp.
              </p>

              {callbackSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-success/15 border border-success/35 p-6 rounded-2xl text-center flex flex-col items-center text-slate-905"
                >
                  <style>{`.bg-success { background-color: #22C55E; }`}</style>
                  <div className="bg-success text-slate-950 p-2.5 rounded-full mb-3 font-bold font-display text-sm">
                    ✓
                  </div>
                  <span className="text-white font-bold text-sm block">Callback Request Confirmed!</span>
                  <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                    Exodus Realtors have booked a priority request. An investment desk specialist will call you in 15 minutes. Secure brochure PDFs have also been prepared.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleCallbackSectionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Joel Kabui"
                      value={callbackName}
                      onChange={(e) => setCallbackName(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-wider mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0746 087766"
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-wider mb-1">
                      Capital Investment Target
                    </label>
                    <select
                      value={callbackInterest}
                      onChange={(e) => setCallbackInterest(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-secondary-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    >
                      <option value="1 Bedroom Units">1-2 Bed Luxury Condos (Westlands/Kilimani)</option>
                      <option value="Executive Studios">Studio Suites (AirBnB High ROI)</option>
                      <option value="Holiday Villas">Karen Family Gated Compounds</option>
                      <option value="Land Commercial">Commercial Workspace Plots</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-display font-bold text-xs tracking-widest uppercase py-4 rounded-xl cursor-pointer transition-colors shadow-lg shadow-gold-500/10 border border-gold-500"
                  >
                    Request Instant Callback
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROPERTY SEARCH & ADVANCED FILTER CORE */}
      <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Search className="text-gold-500" size={18} />
            <span className="font-display font-black text-sm text-slate-905 uppercase tracking-wider">
              Filter Custom Real Estate Portfolio
            </span>
          </div>

          {/* Form grid triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* 1. Location selection */}
            <div>
              <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-widest mb-1.5">
                Neighborhood Area
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              >
                <style>{`.border-slate-205 { border-color: #cbd5e1; }`}</style>
                <option value="All">All Locations</option>
                <option value="Westlands">Westlands (Commercial & Penthouses)</option>
                <option value="Kilimani">Kilimani (Modern Residential)</option>
                <option value="Kileleshwa">Kileleshwa (Elite Condos)</option>
                <option value="Karen">Karen (High-end Gated Compounds)</option>
                <option value="Lavington">Lavington (Diplomat Suburbs)</option>
              </select>
            </div>

            {/* 2. Buy vs Rent */}
            <div>
              <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-widest mb-1.5">
                Inquire Type
              </label>
              <div className="flex bg-slate-50 border border-slate-205 rounded-xl p-1 h-11">
                <button
                  onClick={() => setFilterType('All')}
                  className={`flex-1 text-[10px] font-display font-bold uppercase rounded-lg transition-all ${
                    filterType === 'All' ? 'bg-slate-900 text-white shadow' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('sale')}
                  className={`flex-1 text-[10px] font-display font-bold uppercase rounded-lg transition-all ${
                    filterType === 'sale' ? 'bg-slate-900 text-white shadow' : 'text-slate-500'
                  }`}
                >
                  Sale
                </button>
                <button
                  onClick={() => setFilterType('rent')}
                  className={`flex-1 text-[10px] font-display font-bold uppercase rounded-lg transition-all ${
                    filterType === 'rent' ? 'bg-slate-900 text-white shadow' : 'text-slate-500'
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* 3. Floor layout Bedrooms */}
            <div>
              <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-widest mb-1.5">
                Bedrooms Layout
              </label>
              <select
                value={filterBedrooms}
                onChange={(e) => setFilterBedrooms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              >
                <option value="All">Any Bed Count</option>
                <option value="Studio">Studio Suites</option>
                <option value="1">1 Bedroom Units</option>
                <option value="2">2 Bedroom Units</option>
                <option value="3">3 Bedroom Units</option>
                <option value="4">4+ Bed mansions</option>
              </select>
            </div>

            {/* 4. Property Category */}
            <div>
              <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-widest mb-1.5">
                Unit Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:outline-none focus:border-gold-500"
              >
                <option value="All">All Categories</option>
                <option value="Studio Apartment">Studio Apartments</option>
                <option value="1 Bedroom Apartment">1 Bedroom Apartments</option>
                <option value="2 Bedroom Apartments">2 Bedroom Apartments</option>
                <option value="Luxury Apartment">Luxury Apartments</option>
                <option value="Family Home">Family Homes / Villas</option>
                <option value="Investment Property">Investment Properties</option>
                <option value="Commercial Properties">Commercial Properties</option>
              </select>
            </div>

            {/* 5. Custom Price Target slider */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-[10px] uppercase font-display font-bold text-slate-400 tracking-widest">
                  Value Ceiling
                </label>
                <span className="text-[10px] font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {priceMax >= 120000000 ? 'No Max' : `KES ${(priceMax / 1000000).toFixed(0)}M`}
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="120000000"
                step="2500000"
                value={priceMax}
                onChange={(e) => setPriceMax(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gold-500 mt-3"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 mt-6 pt-5">
            {/* Filters count read out */}
            <span className="text-xs text-slate-500 font-medium">
              We recovered <strong className="text-slate-900 font-bold">{filteredPropertiesList.length} guaranteed listings</strong> matching requirements.
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-gold-600 hover:text-gold-700 font-display font-bold uppercase tracking-wider underline underline-offset-4 decoration-gold-500 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </section>

      {/* 4. LUXURIOUS PORTFOLIO LISTS OUTLET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-10">
          <div>
            <span className="text-[10px] uppercase font-display font-bold tracking-widest text-gold-500 block mb-1">
              EXCLUSIVE LISTINGS CATALOG
            </span>
            <h2 className="text-3xl font-display font-black text-slate-901 tracking-tight">
              <style>{`.text-slate-901 { color: #0F172A; }`}</style>
              Featured Nairobi Developments
            </h2>
          </div>
          <div className="flex flex-wrap gap-1 mt-4 md:mt-0 bg-slate-100 p-1 rounded-xl">
            {['All', 'Studio Apartment', '1 Bedroom Apartment', 'Luxury Apartment', 'Family Home', 'Commercial Properties'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterCategory(t === 'All' ? 'All' : t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase tracking-wide cursor-pointer transition-all ${
                  (t === 'All' && filterCategory === 'All') || filterCategory === t
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t === 'All' ? 'All Units' : t.split(' ')[0]} {/* shortened */}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards grid */}
        {filteredPropertiesList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-display font-bold text-lg text-slate-800 mb-1">No Matching Properties Found</h3>
            <p className="text-xs text-slate-500 mb-6">We couldn't recover listings matching these filters. Try increasing your budget price ceiling or changing the layouts selection.</p>
            <button
              onClick={resetFilters}
              className="bg-slate-900 text-white font-display font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-lg hover:bg-gold-500 hover:text-slate-950 transition-colors"
            >
              View Full Portfolio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPropertiesList.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isFavorite={favorites.includes(prop.id)}
                onToggleFavorite={handleToggleFavorite}
                onQuickView={(p) => setActiveQuickView(p)}
                onScheduleVisit={(p) => setSiteTourProperty(p)}
                isCompared={comparedProperties.some(c => c.id === prop.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. INTERACTIVE RENTAL CALCULATOR & INVESTMENT AREA */}
      <section id="investment" className="bg-slate-950 py-20 border-y border-slate-900 relative overflow-hidden">
        {/* Top-mesh subtle background light */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#F1EDE4]/5 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-center mx-auto mb-16 space-y-3">
            <span className="flex items-center justify-center gap-1.5 text-[10px] font-display font-black text-gold-500 tracking-widest uppercase">
              <Award size={12} />
              Build Wealth Through Real Estate
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight leading-tight">
              Invest in High-Performing Nairobi Property Capital
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Nairobi suburbs consistently outscore international counterparts in commercial yields (up to 11.5% p.a.) and compounding appreciation margins. Use our active forecast engine below.
            </p>
          </div>

          {/* Active Calculator widget */}
          <RoiCalculator />
        </div>
      </section>

      {/* 6. WHY CHOOSE EXODUS REALTY (Premium microgrid) */}
      <section className="bg-[#F8FAFC] py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center mx-auto mb-16">
            <span className="text-[10px] font-display font-bold text-gold-550 uppercase tracking-widest block mb-1">
              THE EXODUS DIFFERENCE
            </span>
            <h2 className="text-3xl font-display font-black text-slate-905 tracking-tight">
              Why Sophisticated Investors Trust Exodus Realty Inc
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
              We don’t just list bricks; we advise capital pathways, providing guaranteed title verifications and absolute transparency to local and Diaspora portfolios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-gold-500/20 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="bg-gold-500/10 p-3 rounded-xl text-gold-600 w-11 h-11 flex items-center justify-center mb-5 border border-gold-500/10">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm mb-2 uppercase tracking-wide">Verified Listings Only</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Zero title ambiguity. Every single apartment and gated plot in our portfolio undergoes painstaking document registry audits in Kenya lands registry offices.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-gold-500/20 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="bg-gold-500/10 p-3 rounded-xl text-gold-600 w-11 h-11 flex items-center justify-center mb-5 border border-gold-500/10">
                <Landmark size={20} />
              </div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm mb-2 uppercase tracking-wide">Investment Guidance</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Bespoke wealth calculation. We map gross rental rates, management reserves, short-term AirBnB occupancies, and property tax configurations for passive security.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-gold-500/20 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="bg-gold-500/10 p-3 rounded-xl text-gold-600 w-11 h-11 flex items-center justify-center mb-5 border border-gold-500/10">
                <Sparkles size={20} />
              </div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm mb-2 uppercase tracking-wide">Property Management</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Absolute hands-free oversight. Our full-scale property management handles concierge leasing, rent collection, routine repair, and digital client payouts.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-gold-500/20 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="bg-gold-500/10 p-3 rounded-xl text-gold-600 w-11 h-11 flex items-center justify-center mb-5 border border-gold-500/10">
                <Award size={20} />
              </div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm mb-2 uppercase tracking-wide">Mortgage Assistance</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Secured bank channels. Leverage special diaspora rates at **6.2% - 8.5%** through our tight networks with tier-1 commercial lenders and mortgage desks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AMENITIES SHOWCASE */}
      <section id="amenities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center mx-auto mb-16">
            <span className="text-[10px] font-display font-bold text-gold-550 uppercase tracking-widest block mb-1">
              WORLD CLASS STANDARDS
            </span>
            <h2 className="text-3xl font-display font-black text-slate-905 tracking-tight">
              A Signature Suite of Premium Core Amenities
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
              Exodus Realty premium highrise apartments are constructed with world-class residential specifications, fully ensuring long-term rental appreciation and high-yield tenants.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 text-center">
            {AMENITIES_CATALOG.map((amenity, i) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow group cursor-default"
                title={amenity.desc}
              >
                <span className="text-2xl mb-2 filter grayscale group-hover:grayscale-0 transition-all">
                  {amenity.icon}
                </span>
                <span className="text-[10px] font-display font-bold text-slate-800 uppercase tracking-wide leading-tight line-clamp-1">
                  {amenity.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Fully Integrated Mortgage Calculator Anchor */}
          <div className="mt-16 pt-8 border-t border-slate-100">
            <MortgageCalculator />
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE FLOOR PLANS blue print segment */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloorPlanViewer />
        </div>
      </section>

      {/* 9. PORTFOLIO GALLERY (Filtrable masonry + Lightbox) */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-10">
            <div>
              <span className="text-[10px] font-display font-bold text-gold-550 uppercase tracking-widest block mb-1">
                EXODUS IMAGE ROOM SHOWCASE
              </span>
              <h2 className="text-3xl font-display font-black text-slate-905 tracking-tight">
                Luxury Developments Gallery
              </h2>
            </div>
            {/* Gallery Category Navigation Row */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-[9px] font-display font-bold uppercase tracking-wider gap-1 mt-4 md:mt-0">
              {['All', 'Interior', 'Exterior', 'Kitchen', 'Amenities'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryCat(cat)}
                  className={`px-3.5 py-1.5 rounded uppercase font-bold tracking-widest cursor-pointer transition-all ${
                    activeGalleryCat === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry image layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredGalleryPhotos.map((photo, i) => (
              <motion.div
                key={photo.url}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setLightboxIndex(i)}
                className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-slate-100 border border-slate-100"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[9px] uppercase font-mono text-gold-400 tracking-wider">
                    {photo.category}
                  </span>
                  <h4 className="text-sm font-display font-bold text-white mt-1">
                    {photo.caption}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Lightbox Popup */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4">
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              <div className="max-w-4xl w-full max-h-[80vh] flex items-center justify-center relative">
                {/* Image element */}
                <img
                  src={filteredGalleryPhotos[lightboxIndex].url}
                  alt={filteredGalleryPhotos[lightboxIndex].caption}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[75vh] object-contain rounded-xl select-none"
                />

                {/* Left navigation */}
                {lightboxIndex > 0 && (
                  <button
                    onClick={() => setLightboxIndex(lightboxIndex - 1)}
                    className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
                  >
                    ←
                  </button>
                )}

                {/* Right navigation */}
                {lightboxIndex < filteredGalleryPhotos.length - 1 && (
                  <button
                    onClick={() => setLightboxIndex(lightboxIndex + 1)}
                    className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
                  >
                    →
                  </button>
                )}

                {/* Top/Bottom Caption label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/90 text-xs font-medium font-sans">
                  {filteredGalleryPhotos[lightboxIndex].caption} ({filteredGalleryPhotos[lightboxIndex].category})
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 10. PREMIUM TESTIMONIALS SLIDER / CORE REVIEW ADDS */}
      <section className="py-25 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-12">
            <div>
              <span className="text-[10px] font-display font-bold text-gold-550 uppercase tracking-widest block mb-1">
                DIASPORA & LOCAL SUCCESS
              </span>
              <h2 className="text-3xl font-display font-black text-slate-905 tracking-tight">
                Verified Customer Feedback & Investment Outcomes
              </h2>
            </div>
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-display font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl mt-4 md:mt-0 transition-colors"
            >
              Add Your Feedback
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-md relative flex flex-col justify-between"
              >
                <div>
                  {/* Rating block */}
                  <div className="flex items-center gap-1 text-gold-500 mb-4">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-slate-600 text-xs md:text-sm italic leading-relaxed mb-6">
                    "{test.content}"
                  </p>
                </div>

                {/* Profile block */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-205">
                    <img
                      src={test.image}
                      alt={test.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-[11px] text-slate-900 uppercase tracking-wider">
                      {test.name}
                    </h4>
                    <span className="block text-[9px] text-slate-400 font-mono">
                      {test.role} {test.company && `• ${test.company}`}
                    </span>
                    {test.investmentOutcome && (
                      <span className="block text-[8px] text-gold-600 font-bold mt-1 font-display uppercase tracking-widest leading-none">
                        {test.investmentOutcome}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive review submission modal */}
          <AnimatePresence>
            {isReviewFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsReviewFormOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100"
                >
                  <button
                    onClick={() => setIsReviewFormOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>

                  <h3 className="font-display font-black text-lg text-slate-905 mb-1 text-center">
                    Share Your Exodus Success Story
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 text-center">
                    Let first-time home buyers and Diaspora investors benefit from your verified property purchase feedback!
                  </p>

                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 text-slate-900 font-bold"
                        placeholder="John Kamau Mwangi"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-wider mb-1">
                        Investor Profile Title
                      </label>
                      <select
                        value={reviewRole}
                        onChange={(e) => setReviewRole(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 focus:outline-none focus:ring-1"
                      >
                        <option value="Diaspora Investor">Diaspora Investor</option>
                        <option value="First-Time homeowner">First-Time Homeowner</option>
                        <option value="Property Seller">Property Seller Client</option>
                        <option value="Expat Leasing Client">Expat Leasing Tenant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-display font-bold text-slate-400 tracking-wider mb-1">
                        Your honest feedback & outcome *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-gold-500"
                        placeholder="Detail your interaction. E.g., 'Exodus guided my mortgage steps for purchasing Amani Heights... net yields were impeccable!'"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-pointer shadow transition-colors"
                    >
                      Publish Verified review
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 11. ABOUT SECTION */}
      <section id="about" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images visual stack Left */}
          <div className="grid grid-cols-2 gap-4 relative">
            {/* Elegant luxury framing */}
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop"
                alt="Exodus luxury villa exterior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden translate-y-8 bg-slate-100 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=400&auto=format&fit=crop"
                alt="Exodus Karen gated lobby"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Prose right side */}
          <div className="space-y-6 text-left lg:pl-6">
            <span className="text-[10px] font-display font-bold text-gold-550 uppercase tracking-widest block mb-1">
              BUILDING WEALTH THROUGH PROPERTY
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-905 tracking-tight leading-snug">
              Nairobi's Trusted Real Estate Partner helping Clients invest with Absolute Confidence
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Exodus Realty Inc was founded on an unyielding oath: providing premium real estate, transparent document verifications, and passive wealth calculators to property buyers in Kenya and from the diaspora alike.
            </p>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Whether you are acquiring a compact high-density Obsidian studio in Kileleshwa to operate AirBnB cashflows, or sealing ownership on a 1.2-acre diplomats manor inside the forest gates of Karen, Exodus Real Estate represents your security and guidance.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-success text-slate-950 flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-xs font-bold text-slate-900">100% Secure Escrow Accounts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-success text-slate-950 flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-xs font-bold text-slate-900">Complimentary Chauffeur tours</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-success text-slate-950 flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-xs font-bold text-slate-900">Custom AirBnB Zoning permits</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-success text-slate-950 flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-xs font-bold text-slate-900">Licensed Board of Advisors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. ADVISORY LATEST ARTICLES / BLOG */}
      <section id="blog" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center mx-auto mb-16">
            <span className="text-[10px] font-display font-bold text-gold-550 uppercase tracking-widest block mb-1">
              THE EXODUS PRESS DESK
            </span>
            <h2 className="text-3xl font-display font-black text-slate-905 tracking-tight">
              Latest Property Insights & Diaspora Investment Tips
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
              Equip yourself with financial strategies, municipal tax updates, and quarterly rent yield charts from our senior analyst team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogsData.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-50 relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md rounded text-[9px] font-display font-bold uppercase tracking-widest text-gold-200 px-3 py-1 border border-white/10">
                      {blog.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-[9px] text-slate-400 font-bold font-mono uppercase">
                      {blog.date} • {blog.readTime}
                    </span>
                    <h3 className="font-display font-bold text-base text-slate-905 line-clamp-2 mt-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-3 mt-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href="#blog-link"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Full article "${blog.title}" has been curated. Download code includes digital booklet format!`);
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-display font-bold uppercase text-gold-600 hover:text-gold-700 pointer-events-auto"
                  >
                    Read advisory PDF
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. LEAD GENERATION SECTION */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden text-center sm:text-left">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
            alt="Interior premium lights"
            className="w-full h-full object-cover opacity-15"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Slogan */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-display font-black text-gold-500 tracking-widest uppercase block">
              DIASPORA ACQUISITION DESK
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black leading-tight text-white m-0">
              Ready to Secure Your Next Yield Asset in Nairobi?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Exodus Realty coordinates private client zoom calls or direct face-to-face sit visits across Kileleshwa, Westlands, and Karen. Reach out to our professional property management desk.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <ThumbsUp size={16} className="text-gold-500" />
                <span>Complimentary VIP Chauffeur</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-gold-500" />
                <span>Regulated Bank Escrow</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              {callbackSubmitted ? (
                <div className="bg-success text-slate-950 p-6 rounded-2xl text-center">
                  <span className="font-display font-black text-base uppercase tracking-wider block mb-1">Request Queued!</span>
                  <p className="text-xs text-slate-950/80">
                    Your luxury advisory request is confirmed. Pre-vetted listing brochures are being indexed. Speak with you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCallbackSubmitted(true);
                  }}
                  className="space-y-4 text-left text-xs"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase text-slate-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white"
                        placeholder="e.g. Joel Kabui"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase text-slate-400 mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        required
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white"
                        placeholder="e.g. 0746 087766"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white"
                      placeholder="e.g. investor@domain.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase text-slate-400 mb-1">Interest</label>
                      <select className="w-full bg-slate-955 border border-white/10 rounded-xl p-3 text-slate-300">
                        <style>{`.bg-slate-955 { background-color: #020617; }`}</style>
                        <option>1-Bedroom Homes</option>
                        <option>2-Bedroom Suites</option>
                        <option>Studio (AirBnB High Yield)</option>
                        <option>Family Mansion (Karen)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase text-slate-400 mb-1">Budget Range KES</label>
                      <select className="w-full bg-slate-955 border border-white/10 rounded-xl p-3 text-slate-300">
                        <option>Under 10 Million</option>
                        <option>10M - 25M KES</option>
                        <option>25M - 50M KES</option>
                        <option>Over 55 Million</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-slate-955 font-display font-extrabold uppercase tracking-widest py-4 rounded-xl cursor-pointer shadow transition-all border border-gold-550/20"
                  >
                    Request Private Callback
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 14. CONTACT CORE & GOOGLE MAPS INTEGRATION */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center mx-auto mb-16">
            <span className="text-[10px] font-display font-bold text-gold-550 uppercase tracking-widest block mb-1">
              CONNECT WITH OUR DESKS
            </span>
            <h2 className="text-3xl font-display font-black text-slate-905 tracking-tight">
              We Are Located in Nairobi, Kenya
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
              Visit our headquarters for coffee, or request diagnostic documents and contract deeds securely via WhatsApp or Call systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Contact Specs - Column 5/12 */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4 shadow-sm">
                <div className="bg-gold-500/10 p-3 rounded-xl text-gold-600 flex-shrink-0 border border-gold-200/10">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-wide">Dial our Desks</h4>
                  <p className="text-slate-600 text-sm font-bold mt-1">0746 087766</p>
                  <span className="text-[10.5px] text-slate-400 block mt-0.5 leading-tight">Monday to Sunday, 7:00 AM - 10:00 PM EAT</span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4 shadow-sm">
                <div className="bg-gold-500/10 p-3 rounded-xl text-gold-600 flex-shrink-0 border border-gold-200/10">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-wide">Deed & Brochure Inquiries</h4>
                  <p className="text-slate-600 text-sm font-bold mt-1">inquire@exodusrealty.co.ke</p>
                  <span className="text-[10.5px] text-slate-400 block mt-0.5 leading-tight">Document requests processed in 10 minutes</span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4 shadow-sm">
                <div className="bg-gold-500/10 p-3 rounded-xl text-gold-600 flex-shrink-0 border border-gold-200/10">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-wide">Headquarters Map location</h4>
                  <p className="text-slate-600 text-sm font-bold mt-1">VX26+7M Nairobi, Kenya</p>
                  <span className="text-[10.5px] text-slate-400 block mt-0.5 leading-tight">Kilimani Commercial Hub towers</span>
                </div>
              </div>

              {/* Instant Call & WhatsApp button layout */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:0746087766"
                  className="w-full bg-slate-900 hover:bg-gold-500 hover:text-slate-950 text-white font-display font-bold text-xs tracking-wider uppercase py-4 rounded-xl text-center shadow border border-slate-900 transition-colors cursor-pointer"
                >
                  Call Now Desk
                </a>
                <a
                  href={`https://wa.me/254746087766?text=${encodeURIComponent('Hi Exodus Realty, I want to inquire on custom luxury listing brochures.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#22C55E] hover:bg-green-600 text-white font-display font-bold text-xs tracking-wider uppercase py-4 rounded-xl text-center shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} fill="#FFFFFF" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Simulated Interactive Map - Column 7/12 */}
            <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl overflow-hidden relative aspect-video flex flex-col justify-between">
              {/* Maps grid visual illustration */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

              {/* Real Road outline representation using Custom SVGs */}
              <svg viewBox="0 0 400 200" className="w-full h-full absolute inset-0 opacity-20 pointer-events-none">
                {/* Horizontal main artery */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#FFFFFF" strokeWidth="6"/>
                {/* Cross street */}
                <line x1="150" y1="0" x2="150" y2="200" stroke="#FFFFFF" strokeWidth="6"/>
                <line x1="280" y1="0" x2="280" y2="200" stroke="#FFFFFF" strokeWidth="4"/>
                <circle cx="150" cy="100" r="16" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3"/>
              </svg>

              {/* Pin indicator bubble in center */}
              <div className="relative z-10 mx-auto mt-auto mb-auto bg-slate-950/90 border border-gold-500/30 p-4 rounded-2xl max-w-xs text-center backdrop-blur shadow-2xl flex flex-col items-center">
                <style>{`.text-red-500 { color: #ef4444; } @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } } .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }`}</style>
                <div className="bg-red-500 text-white p-2.5 rounded-full mb-3 shadow-lg shadow-red-500/30 animate-pulse">
                  <MapPin size={24} />
                </div>
                <h4 className="font-display font-black text-xs text-white uppercase tracking-wider">
                  EXODUS HQ TOWERS
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  VX26+7M Kilimani Residential Core, Nairobi, Kenya
                </p>
                <a
                  href="https://maps.google.com/?q=VX26+7M+Nairobi"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gold-500 text-[#111827] text-[9px] font-display font-black uppercase tracking-widest px-4 py-2 rounded-lg mt-3.5 inline-block hover:bg-gold-600 transition-colors"
                >
                  Retrieve road navigation
                </a>
              </div>

              {/* Address indicator banner */}
              <div className="relative z-10 bg-slate-950/80 p-3 rounded-xl border border-white/5 flex justify-between items-center text-[10px] font-mono select-none">
                <span>Nairobi HQ Geoloop Coordinate: -1.2921, 36.8219</span>
                <span className="text-success font-bold font-display uppercase">Active locator ✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. BRAND FOOTER DISCLAIMERS */}
      <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">
          {/* Logo Brand left column (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-gold-500 p-2.5 rounded-lg text-slate-950 shadow-md">
                <Building size={20} strokeWidth={2.5} />
              </div>
              <span className="font-display font-black text-lg tracking-tight text-white uppercase">
                EXODUS REALTY
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed pr-6 text-[11px]">
              Exodus Realty Inc. is Nairobi’s benchmark property development, investment, and boutique property management consultancy. Fully licensed under the Estate Agents Registration Board of Kenya.
            </p>
            <div className="flex gap-3 pt-2 text-slate-500 font-mono text-[10px]">
              <span>EARB License Ref No: 8746/26</span>
              <span>•</span>
              <span>Client Escrow Verified</span>
            </div>
          </div>

          {/* Quick links sitemap (2/12) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-black uppercase tracking-wider text-gold-500 text-[10px]">
              Sitemap Navigation
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#home" className="hover:text-gold-500 transition-colors">Home Landing</a></li>
              <li><a href="#properties" className="hover:text-gold-500 transition-colors">Real Estate List</a></li>
              <li><a href="#investment" className="hover:text-gold-500 transition-colors">ROI Calcs</a></li>
              <li><a href="#amenities" className="hover:text-gold-500 transition-colors">Amenities Suite</a></li>
              <li><a href="#gallery" className="hover:text-gold-500 transition-colors">Site gallery</a></li>
            </ul>
          </div>

          {/* Property categories (3/12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-black uppercase tracking-wider text-gold-500 text-[10px]">
              Prime Nairobi Suburbs
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#properties" onClick={() => setFilterLocation('Westlands')} className="hover:text-gold-500 transition-colors">Westlands Penthouses</a></li>
              <li><a href="#properties" onClick={() => setFilterLocation('Kilimani')} className="hover:text-gold-500 transition-colors">Kilimani Executive Suites</a></li>
              <li><a href="#properties" onClick={() => setFilterLocation('Kileleshwa')} className="hover:text-gold-500 transition-colors">Kileleshwa Obsidian Studios</a></li>
              <li><a href="#properties" onClick={() => setFilterLocation('Karen')} className="hover:text-gold-500 transition-colors">Karen Diplomat Gated Manors</a></li>
              <li><a href="#properties" onClick={() => setFilterLocation('Lavington')} className="hover:text-gold-500 transition-colors">Lavington Ambassador Villas</a></li>
            </ul>
          </div>

          {/* Newsletter Signup & Contacts (3/12) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-black uppercase tracking-wider text-gold-500 text-[10px]">
              Exodus Wealth Letter
            </h4>
            <span className="block text-slate-400 text-[11px] leading-relaxed">
              Sign up to receive off-market listings, construction briefs, and legal updates directly in your email inbox.
            </span>
            <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1">
              <input
                type="email"
                placeholder="investor@domain.com"
                className="flex-grow bg-transparent text-xs text-white px-2.5 outline-none focus:ring-0 placeholder-slate-500"
              />
              <button
                onClick={() => alert("Successfully added email coordinates to our list!")}
                className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-display font-bold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Join list
              </button>
            </div>
            {/* Quick call read */}
            <div className="flex gap-2.5 items-center text-slate-400 text-[10.5px]">
              <Phone size={12} className="text-gold-500" />
              <span>Direct Phone Desk: 0746 087766</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright disclaimers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-505 text-[10.5px]">
          <style>{`.text-slate-505 { color: #64748b; }`}</style>
          <span>© 2026 Exodus Realty Inc. Buy • Sell • Rent Property. All Rights Reserved.</span>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-slate-300">Deed Escrow Policy</a>
            <a href="#privacy" className="hover:text-slate-300">Privacy & CAA Regulations</a>
            <a href="#licensing" className="hover:text-slate-300">EARB Laws</a>
          </div>
        </div>
      </footer>

      {/* 16. DETAILED LIGHTBOX / INLINE MODAL WINDOWS */}

      {/* A. Quick Specification dialog modal */}
      <QuickViewModal
        property={activeQuickView}
        isOpen={activeQuickView !== null}
        onClose={() => setActiveQuickView(null)}
      />

      {/* B. Comparative properties matrix overlay */}
      <CompareModal
        comparedProperties={comparedProperties}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemoveFromCompare={(id) => setComparedProperties(comparedProperties.filter(p => p.id !== id))}
        onScheduleVisit={(p) => {
          setIsCompareOpen(false);
          setSiteTourProperty(p);
        }}
        onQuickView={(p) => {
          setIsCompareOpen(false);
          setActiveQuickView(p);
        }}
      />

      {/* C. Primary Reservation Consultation Modal form */}
      <AnimatePresence>
        {isConsultationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsConsultationOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 border border-slate-100 shadow-2xl overflow-hidden font-sans text-xs"
            >
              {/* Gold rim decoration */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-500 via-gold-200 to-gold-700"></div>

              <button
                onClick={() => setIsConsultationOpen(false)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full text-slate-500"
              >
                <X size={15} />
              </button>

              <div className="text-center mb-6">
                <div className="inline-block bg-gold-500/10 p-2.5 rounded-xl text-gold-600 mb-3 border border-gold-200/20">
                  <Activity size={20} className="animate-pulse" />
                </div>
                <h3 className="font-display font-black text-xl text-slate-905 uppercase tracking-wide">
                  Book Private Wealth consultation
                </h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                  Our portfolio advisory team conducts custom one-on-one sessions in our Nairobi offices or privately via zoom conferences.
                </p>
              </div>

              {consultSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-success/5 border border-success/30 p-6 rounded-2xl text-center text-slate-905 leading-relaxed font-medium"
                >
                  <div className="bg-success text-white p-2.5 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                    ✓
                  </div>
                  <span className="font-display font-bold text-slate-900 block">Consultation Reservation Confirmed!</span>
                  <p className="text-[11px] text-slate-600 max-w-xs mx-auto mt-2.5">
                    Your exclusive slots have been locked. Meeting credentials and brochure PDFs are being dispatched to <strong className="text-slate-900">{consultEmail}</strong>. Dialogue is secured.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] uppercase font-display font-bold text-slate-400 mb-1 tracking-wider">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      className="w-full text-slate-900 border border-slate-200 rounded-xl px-3.5 py-3 text-xs"
                      placeholder="John Kamau Mwangi"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-display font-bold text-slate-400 mb-1 tracking-wider">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={consultPhone}
                        onChange={(e) => setConsultPhone(e.target.value)}
                        className="w-full text-slate-900 border border-slate-200 rounded-xl px-3.5 py-3 text-xs"
                        placeholder="0746 087766"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-display font-bold text-slate-400 mb-1 tracking-wider">Email coordinates</label>
                      <input
                        type="email"
                        required
                        value={consultEmail}
                        onChange={(e) => setConsultEmail(e.target.value)}
                        className="w-full text-slate-900 border border-slate-200 rounded-xl px-3.5 py-3 text-xs"
                        placeholder="investor@domain.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-display font-bold text-slate-400 mb-1 tracking-wider">Your Main Investment Focus</label>
                    <select className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-600 bg-white">
                      <option>Off-Plan Investment (High appreciation margins)</option>
                      <option>Immediate rental payouts (Furnished units)</option>
                      <option>Karen Luxury Villa (Home ownership)</option>
                      <option>Diaspora legal deeds advisory</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-display font-bold text-xs uppercase tracking-widest py-4 rounded-xl cursor-pointer shadow transition-colors"
                  >
                    Lock Private Consult slot
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Site Tour Booking Schedule Confirmation Dialog */}
      <AnimatePresence>
        {siteTourProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSiteTourProperty(null)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 font-sans text-xs flex flex-col justify-between"
            >
              <button
                onClick={() => setSiteTourProperty(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"
              >
                <X size={14} />
              </button>

              <div className="text-center mb-6">
                <span className="text-[9px] uppercase font-display tracking-widest text-gold-500 font-extrabold block mb-1">
                  FREE PRIVATE VEHICLE TOUR
                </span>
                <h3 className="font-display font-black text-lg text-slate-905">
                  Schedule Your Site Tour
                </h3>
                <p className="text-slate-600 text-[11px] mt-1">
                  Choose a preferred slot to inspect <strong className="text-slate-950 font-bold">"{siteTourProperty.title}"</strong>. Our chauffeur collects you from any Nairobi zone.
                </p>
              </div>

              {isTourBooked ? (
                <div className="p-6 bg-success/5 border border-success/30 text-slate-905 rounded-xl text-center font-medium">
                  <span className="w-10 h-10 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">✓</span>
                  <span className="font-display font-bold block text-slate-900 mb-1">We are booked!</span>
                  <p className="text-[11px] text-slate-500">
                    A confirmations SMS and WhatsApp details showing private chauffeur plate numbers have been dispatched. Speak with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSiteTourSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-display font-bold text-slate-400 mb-1">Preferred Date *</label>
                    <input
                      id="site-visit-date-picker"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-slate-205 rounded-xl p-3 text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-display font-bold text-slate-400 mb-1">Preferred Hour *</label>
                    <select
                      id="site-visit-time-picker"
                      required
                      className="w-full border border-slate-205 rounded-xl p-3 text-slate-600 font-semibold bg-white"
                    >
                      <option>Morning (9:00 AM - 11:30 AM)</option>
                      <option>Midday (11:30 AM - 2:00 PM)</option>
                      <option>Afternoon (2:00 PM - 5:00 PM)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-display font-bold text-xs uppercase tracking-wider py-4 rounded-xl cursor-pointer transition-colors"
                  >
                    Confirm Chauffeur pick up
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 17. FLOATING PERSISTENT CHANNELS */}

      {/* A. Sticky Floating Call Button (Bottom-left/side) */}
      <div className="fixed bottom-24 left-6 z-40 hidden md:block">
        <motion.a
          href="tel:0746087766"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-slate-900 text-white hover:bg-gold-500 hover:text-slate-950 p-3.5 rounded-full shadow-2xl border border-slate-805 flex items-center gap-2 font-display text-[10.5px] font-black uppercase tracking-wider cursor-pointer"
        >
          <style>{`.bg-slate-805 { border-color: rgba(30, 41, 59, 0.4); }`}</style>
          <div className="w-5 h-5 rounded-full bg-gold-500 text-slate-950 flex items-center justify-center">
            <Phone size={11} fill="currentColor" />
          </div>
          Call 0746 087766
        </motion.a>
      </div>

      {/* B. Sticky Floating WhatsApp Button (Standard layout right corner above online chat) */}
      <div className="fixed bottom-24 right-6 z-45">
        <motion.a
          href={`https://wa.me/254746087766?text=${encodeURIComponent('Hi Exodus Realty Inc, I am interested in property investments in Nairobi. Please send the catalog PDFs.')}`}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#22C55E] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center border border-green-600/20 cursor-pointer"
          title="Direct WhatsApp Desk"
        >
          <MessageCircle size={22} fill="#FFFFFF" />
        </motion.a>
      </div>

      {/* C. Live Concierge Interactive Chat Bubble widget */}
      <LiveChat />

      {/* D. Conversion Intent/Automated Overlays popups */}
      <Popups />
    </div>
  );
}
