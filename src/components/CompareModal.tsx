import React from 'react';
import { Property } from '../types';
import { X, Trash2, Calendar, MapPin, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompareModalProps {
  comparedProperties: Property[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onScheduleVisit: (property: Property) => void;
  onQuickView: (property: Property) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  comparedProperties,
  isOpen,
  onClose,
  onRemoveFromCompare,
  onScheduleVisit,
  onQuickView,
}) => {
  if (!isOpen) return null;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col border border-slate-100"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-display font-extrabold tracking-widest text-gold-500 block mb-1">
                EXODUS CONCIERGE TOOL
              </span>
              <h2 className="text-2xl font-display font-black text-slate-900 flex items-center gap-2">
                Property Side-by-Side Comparison
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-mono">
                  {comparedProperties.length} / 3 Selected
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-colors border border-slate-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Comparison Grid */}
          <div className="p-6 md:p-8 overflow-x-auto flex-grow">
            {comparedProperties.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="bg-slate-50 p-6 rounded-full text-slate-300 border border-dotted border-slate-300 mb-4">
                  <Star size={40} className="stroke-[1.5]" />
                </div>
                <h3 className="font-display font-extrabold text-lg text-slate-800 mb-1">No Properties Selected</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Add up to 3 luxury developments to comparison grids using the (+) button available on property cards.
                </p>
                <button
                  onClick={onClose}
                  className="bg-slate-900 text-white font-display font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl hover:bg-gold-500 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Browse Luxury Listings
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[700px] border-collapse text-left text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 px-3 text-xs font-display font-bold uppercase tracking-wider text-slate-400 w-1/4">
                      Specification Core
                    </th>
                    {comparedProperties.map((prop) => (
                      <th key={prop.id} className="py-4 px-4 w-1/4 relative">
                        <div className="flex flex-col gap-2.5">
                          {/* Image Thumbnail */}
                          <div className="h-28 overflow-hidden rounded-xl bg-slate-50 border border-slate-150 relative">
                            <img
                              src={prop.images[0]}
                              alt={prop.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {/* Delete Trigger */}
                            <button
                              onClick={() => onRemoveFromCompare(prop.id)}
                              className="absolute top-2 right-2 p-1.5 bg-red-650/90 hover:bg-red-600 text-white hover:text-white rounded-full shadow backdrop-blur-sm transition-colors border border-red-500/20"
                              title="Remove"
                            >
                              <style>{`.bg-red-650\\/90 { background-color: rgba(239, 68, 68, 0.9); }`}</style>
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-display tracking-widest text-gold-600 font-bold block">
                              {prop.location}
                            </span>
                            <h3 className="text-sm font-display font-bold text-slate-900 line-clamp-1">
                              {prop.title}
                            </h3>
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Fill remaining empty cells if < 3 */}
                    {Array.from({ length: 3 - comparedProperties.length }).map((_, index) => (
                      <th key={`empty-${index}`} className="py-4 px-4 w-1/4">
                        <div className="h-28 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center p-4">
                          <span className="text-slate-350 text-xs font-medium block">Position Vacant</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Select another property to compare side-by-side</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900 text-xs font-medium">
                  {/* Category Row */}
                  <tr>
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      Development Type
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4 font-semibold text-slate-900">
                        {prop.category}
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* Pricing Row */}
                  <tr>
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      Investment Price
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 font-display">
                            {formatKES(prop.price)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ~ {formatUSD(prop.priceUSD)}
                          </span>
                        </div>
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* Net Rental Yield */}
                  <tr className="bg-slate-50/50">
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      Guaranteed Yield p.a.
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-gold-100 text-gold-700 rounded-md font-display font-bold text-xs border border-gold-200">
                          {prop.rentalYield}% Net
                        </span>
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* Appreciation Factor */}
                  <tr>
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      Appreciation Forecast
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4 text-success font-bold font-display">
                        +{prop.appreciationRate}% p.a.
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* ROI Rating */}
                  <tr className="bg-slate-50/50">
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      5-Yr Cumulative ROI
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4 font-bold font-display text-slate-800">
                        {prop.ROI}% Return
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* Physical Space */}
                  <tr>
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      Total Area Size
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4 font-mono font-bold text-slate-700">
                        {prop.sizeSqFt} sq ft
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* Bedroom Layout */}
                  <tr>
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      Bed/Bath Layout
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4 text-slate-700">
                        {prop.bedrooms === 'Studio' ? 'Micro-Studio' : `${prop.bedrooms} Bed`}, {prop.bathrooms} Bath
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* Key Amenities row */}
                  <tr>
                    <td className="py-4 px-3 font-display font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                      Key Amenities
                    </td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-4 px-4">
                        <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                          {prop.amenities.slice(0, 5).map((am) => (
                            <span key={am} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                              <Check size={10} className="text-success inline-shrink-0" />
                              {am}
                            </span>
                          ))}
                          {prop.amenities.length > 5 && (
                            <span className="text-[9px] text-slate-400 font-mono italic">
                              +{prop.amenities.length - 5} additional properties
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>

                  {/* Call to Actions cells */}
                  <tr>
                    <td className="py-5 px-3"></td>
                    {comparedProperties.map((prop) => (
                      <td key={prop.id} className="py-5 px-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => onScheduleVisit(prop)}
                            className="bg-slate-900 hover:bg-gold-500 hover:text-slate-950 text-white font-display font-bold text-[10px] tracking-wider uppercase py-2.5 rounded-lg border border-slate-950 shadow transition-all duration-300 flex items-center justify-center gap-1.5"
                          >
                            <Calendar size={12} />
                            Book viewing
                          </button>
                          <button
                            onClick={() => onQuickView(prop)}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-display font-medium text-[10px] tracking-wider uppercase py-2 rounded-lg border border-slate-200 transition-colors"
                          >
                            Full specifications
                          </button>
                        </div>
                      </td>
                    ))}
                    {comparedProperties.length < 3 && <td colSpan={3 - comparedProperties.length} className="bg-slate-50/20"></td>}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
