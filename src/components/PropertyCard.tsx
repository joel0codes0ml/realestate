import React from 'react';
import { Property } from '../types';
import { Heart, Eye, MapPin, Maximize2, BedDouble, Bath, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onQuickView: (property: Property) => void;
  onScheduleVisit: (property: Property) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onQuickView,
  onScheduleVisit,
  isCompared,
  onToggleCompare,
}) => {
  // Format currency in millions or thousands
  const formatKES = (value: number) => {
    if (value >= 1000000) {
      return `KES ${(value / 1000000).toFixed(1)}M`;
    }
    return `KES ${value.toLocaleString()}`;
  };

  const formatUSD = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      id={`property-card-${property.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Target yields badge */}
      {property.featured && (
        <div className="absolute top-4 left-4 z-10 bg-gold-500 text-slate-900 font-display font-semibold text-xs tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-gold-200">
          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-ping"></span>
          Premium Investment
        </div>
      )}

      {/* Media elements */}
      <div className="relative aspect-[4/3] overflow-hidden group bg-slate-100">
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Dark gradient mapping over image to increase text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80"></div>

        {/* Favorite & compare triggers */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={() => onToggleFavorite(property.id)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md border ${
              isFavorite
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-slate-900/60 border-white/20 text-white hover:text-gold-200 hover:bg-slate-900'
            }`}
            aria-label="Add to Favorites"
          >
            <Heart size={16} fill={isFavorite ? '#FFFFFF' : 'none'} />
          </button>

          <button
            onClick={() => onToggleCompare(property)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md border ${
              isCompared
                ? 'bg-gold-500 border-gold-500 text-slate-950'
                : 'bg-slate-900/60 border-white/20 text-white hover:text-gold-200 hover:bg-slate-900'
            }`}
            title="Add to Comparison"
          >
            {isCompared ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
          </button>
        </div>

        {/* Status Badge rent/sale */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-slate-900/80 backdrop-blur-md border border-white/15 text-gold-200 font-display font-medium text-[10px] tracking-widest uppercase px-3 py-1 rounded-sm">
            For {property.type === 'sale' ? 'Sale' : 'Rent'}
          </span>
        </div>

        {/* ROI / Yield Info */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end">
          <div className="bg-slate-900/90 backdrop-blur-md rounded px-2.5 py-1 border border-gold-500/30 text-right">
            <span className="block text-[8px] text-slate-400 font-display uppercase tracking-widest leading-none">Net Yield</span>
            <span className="text-sm font-bold text-gold-500 font-display leading-none">{property.rentalYield}% p.a.</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono tracking-wide mb-2 uppercase">
            <MapPin size={12} className="text-gold-500" />
            <span>{property.location}</span>
          </div>

          <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-1 mb-2 hover:text-gold-500 transition-colors duration-200">
            {property.title}
          </h3>

          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>
        </div>

        <div>
          {/* Key Amenities row */}
          <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-slate-100 mb-5 text-center text-slate-600 bg-slate-50/50 rounded-xl px-2">
            <div className="flex flex-col items-center justify-center">
              <BedDouble size={16} className="text-gold-500 mb-1" />
              <span className="text-xs font-semibold text-slate-900">
                {property.bedrooms === 'Studio' ? 'Studio' : `${property.bedrooms} Bed`}
              </span>
              <span className="text-[9px] text-slate-400 font-display uppercase tracking-wider">Layout</span>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-slate-150">
              <Bath size={16} className="text-gold-500 mb-1" />
              <span className="text-xs font-semibold text-slate-900">{property.bathrooms} Bath</span>
              <span className="text-[9px] text-slate-400 font-display uppercase tracking-wider">Restrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Maximize2 size={16} className="text-gold-500 mb-1" />
              <span className="text-xs font-semibold text-slate-900">{property.sizeSqFt} sqft</span>
              <span className="text-[9px] text-slate-400 font-display uppercase tracking-wider">Total Area</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-end justify-between gap-2 mb-5">
            <div>
              <span className="block text-[10px] uppercase font-display tracking-widest text-slate-400">Guaranteed Value</span>
              <div className="flex flex-col">
                <span className="text-xl font-display font-extrabold text-slate-900">
                  {formatKES(property.price)}
                </span>
                <span className="text-xs font-medium text-gold-600">
                  ~ {formatUSD(property.priceUSD)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-mono">Appreciation</span>
              <span className="text-xs font-bold text-success font-display">+{property.appreciationRate}% Annually</span>
            </div>
          </div>

          {/* CTA Action button grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onQuickView(property)}
              className="bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-700 font-display font-semibold text-xs tracking-wider uppercase py-3 rounded-lg border border-slate-200 transition-all duration-300 flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-slate-300"
            >
              <Eye size={12} />
              Quick View
            </button>
            <button
              onClick={() => onScheduleVisit(property)}
              className="bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-display font-semibold text-xs tracking-wider uppercase py-3 rounded-lg border border-slate-905 shadow-md shadow-slate-950/10 hover:shadow-gold-500/20 transition-all duration-300 flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-gold-500"
            >
              Book Viewing
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
