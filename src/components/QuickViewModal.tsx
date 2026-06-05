import React, { useState } from 'react';
import { Property } from '../types';
import { X, Calendar, MessageSquare, Phone, Mail, User, ShieldCheck, MapPin, Sparkles, Building, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickViewModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  if (!property || !isOpen) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    budget: `${(property.price / 1000000).toFixed(1)}M KES`,
    interest: 'Immediate Purchase',
    message: `Hi Exodus Realty, I am deeply interested in "${property.title}" located in ${property.location}. Please schedule a priority site visit and email me the full brochure.`
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!formData.date) errors.date = 'Preferred date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Form submission mock to localStorage first to simulate real-world save!
      const existingInquiries = JSON.parse(localStorage.getItem('exodus_inquiries') || '[]');
      existingInquiries.push({
        id: `inq-${Date.now()}`,
        propertyId: property.id,
        propertyTitle: property.title,
        timestamp: new Date().toISOString(),
        ...formData
      });
      localStorage.setItem('exodus_inquiries', JSON.stringify(existingInquiries));

      setFormSubmitted(true);
      setTimeout(() => {
        // Keep screen open or allow close
      }, 5000);
    }
  };

  const formatKES = (value: number) => {
    return `KES ${value.toLocaleString()}`;
  };

  const formatUSD = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[88vh] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row border border-slate-100"
        >
          {/* Close Trigger */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-all duration-200 border border-white/20"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Left Media Column - Images Slider (50% block) */}
          <div className="w-full md:w-1/2 bg-slate-950 relative flex flex-col justify-between h-[300px] md:h-auto min-h-[300px]">
            {/* Main view slider */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <img
                src={property.images[activeImageIndex]}
                alt={`${property.title} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            </div>

            {/* Slider triggers */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-10"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Top Indicator overlay */}
            <div className="z-10 absolute top-4 left-4">
              <span className="bg-gold-500 text-slate-950 text-[10px] font-display font-black tracking-widest uppercase px-3.5 py-1.5 rounded">
                EXODUS EXCLUSIVE
              </span>
            </div>

            {/* Bottom Carousel Navigation overlay */}
            <div className="z-10 p-6 mt-auto">
              {/* Carousel Indicator indicators */}
              <div className="flex gap-1.5 mb-3">
                {property.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex ? 'w-8 bg-gold-500' : 'w-2 bg-white/40'
                    }`}
                  ></button>
                ))}
              </div>

              {/* Neighborhood / Region Label */}
              <h2 className="text-white font-display font-extrabold text-2xl tracking-tight mb-2">
                {property.title}
              </h2>
              <div className="flex items-center gap-2 text-gold-200 text-sm">
                <MapPin size={14} />
                <span>{property.location}</span>
                <span className="text-white/30">•</span>
                <span>{property.category}</span>
              </div>
            </div>
          </div>

          {/* Right Scrollable Column - Specs & Lead Form (50% block) */}
          <div className="w-full md:w-1/2 flex flex-col h-[calc(85vh-300px)] md:h-auto max-h-[85vh] md:max-h-[88vh]">
            <div className="p-6 md:p-8 overflow-y-auto flex-grow self-stretch">
              <div className="mb-6">
                <span className="text-xs uppercase font-display text-gold-500 font-bold tracking-wider block mb-1">
                  Financial Structure
                </span>
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900">
                    {formatKES(property.price)}
                  </h3>
                  <span className="text-sm font-semibold text-slate-500">
                    ({formatUSD(property.priceUSD)})
                  </span>
                </div>
                {property.type === 'rent' && <span className="text-xs text-slate-500 font-mono">Per Calendar Month</span>}
              </div>

              {/* Specifications pills */}
              <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <span className="block text-[10px] text-slate-400 font-display uppercase tracking-wider">Bedrooms</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {property.bedrooms === 'Studio' ? 'Micro-Studio' : `${property.bedrooms} Beds`}
                  </p>
                </div>
                <div className="text-center border-x border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-display uppercase tracking-wider">Bathrooms</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{property.bathrooms} Baths</p>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] text-slate-400 font-display uppercase tracking-wider">Floor Area</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{property.sizeSqFt} sqft</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="font-display font-bold text-sm text-slate-900 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <Building size={14} className="text-gold-500" />
                  Property Overview
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Dynamic Investment metrics banner */}
              <div className="mb-6 grid grid-cols-2 gap-3 bg-slate-950 text-white p-4 rounded-xl border border-gold-500/20 relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 text-white/5 pointer-events-none">
                  <Sparkles size={80} />
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase tracking-widest">Expected Rental Yield</span>
                  <p className="text-lg font-display font-extrabold text-gold-500">
                    {property.rentalYield}% Net p.a.
                  </p>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <span className="block text-[9px] text-slate-400 uppercase tracking-widest">5-Yr Appreciation ROI</span>
                  <p className="text-lg font-display font-extrabold text-success">
                    +{property.ROI}% Est.
                  </p>
                </div>
              </div>

              {/* Highlights/Amenities */}
              <div className="mb-8">
                <h4 className="font-display font-bold text-sm text-slate-900 mb-3.5 uppercase tracking-wide">
                  Signature Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5"
                    >
                      <ShieldCheck size={12} className="text-success" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core site map pointer */}
              <div className="mb-8 border border-slate-100 p-4 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gold-500" />
                  <span className="text-xs font-bold text-slate-900 font-display uppercase tracking-widest">Location Coordinates</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-150">
                  <span className="text-xs font-mono text-slate-600 font-medium">Google Maps Ref: VX26+7M Nairobi</span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent('VX26+7M Nairobi')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-gold-600 hover:text-gold-700 font-bold tracking-wider uppercase underline-offset-4 decoration-gold-500 hover:underline"
                  >
                    View Map
                  </a>
                </div>
              </div>

              {/* Contact Lead Reservation box */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-display font-bold text-sm text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Calendar size={14} className="text-gold-500" />
                  Priority Site Booking & Inquiry
                </h4>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-success/5 border border-success/30 text-slate-900 p-6 rounded-2xl flex flex-col items-center text-center"
                  >
                    <div className="bg-success text-white p-2 rounded-full mb-3 shadow-lg shadow-success/20">
                      <Check size={24} strokeWidth={3} />
                    </div>
                    <span className="font-display font-bold text-base text-slate-900 mb-1">Inquiry Recorded Successfully!</span>
                    <p className="text-xs text-slate-600 max-w-sm">
                      An Exodus Realty premier property advisor will contact you within **15 minutes** on <strong className="text-slate-900">{formData.phone}</strong> to confirm your site tour. A full brochure has been sent to <strong className="text-slate-900">{formData.email}</strong>.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div>
                        <label className="block text-[10px] font-display font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Full Name *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <User size={14} />
                          </span>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 ${
                              formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-gold-200 focus:border-gold-500'
                            }`}
                          />
                        </div>
                        {formErrors.name && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.name}</span>}
                      </div>

                      {/* Phone input */}
                      <div>
                        <label className="block text-[10px] font-display font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">
                            +254
                          </span>
                          <input
                            type="tel"
                            placeholder="746 087766"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`w-full pl-14 pr-3 py-2.5 bg-white border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 ${
                              formErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-gold-200 focus:border-gold-500'
                            }`}
                          />
                        </div>
                        {formErrors.phone && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.phone}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email input */}
                      <div>
                        <label className="block text-[10px] font-display font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail size={14} />
                          </span>
                          <input
                            type="email"
                            placeholder="investor@domain.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 ${
                              formErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-gold-200 focus:border-gold-500'
                            }`}
                          />
                        </div>
                        {formErrors.email && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.email}</span>}
                      </div>

                      {/* Site selection date */}
                      <div>
                        <label className="block text-[10px] font-display font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Preferred Site Tour Date *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Calendar size={14} />
                          </span>
                          <input
                            type="date"
                            value={formData.date}
                            min={new Date().toISOString().split('T')[0]} // Block previous dates
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 ${
                              formErrors.date ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-gold-200 focus:border-gold-500'
                            }`}
                          />
                        </div>
                        {formErrors.date && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.date}</span>}
                      </div>
                    </div>

                    {/* Rich text message */}
                    <div>
                      <label className="block text-[10px] font-display font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Your Custom Requirements & Message
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-4 text-slate-400">
                          <MessageSquare size={14} />
                        </span>
                        <textarea
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-200 focus:border-gold-500 focus:ring-offset-0"
                        ></textarea>
                      </div>
                    </div>

                    {/* Submit callback */}
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-display font-bold text-xs tracking-wider uppercase py-4 rounded-xl shadow-lg hover:shadow-gold-500/10 transition-all duration-300 flex items-center justify-center gap-2 border border-slate-950 mt-2 cursor-pointer"
                    >
                      <Calendar size={14} />
                      Submit Private Site View request
                    </button>

                    {/* Phone links secondary fallback */}
                    <div className="flex gap-2.5 items-center justify-center pt-3 text-slate-400 text-[10px] font-medium font-mono">
                      <span>Or Call directly:</span>
                      <a href="tel:0746087766" className="text-slate-900 hover:text-gold-600 font-bold">
                        0746 087766
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
