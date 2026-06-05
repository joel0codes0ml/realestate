import React, { useState } from 'react';
import { floorPlansData } from '../propertiesData';
import { LayoutGrid, Maximize, Landmark, Check, Coins } from 'lucide-react';
import { motion } from 'motion/react';

// Specific Room lists for SVG hovering labels
const ROOMS_DATA: Record<string, Array<{ name: string; size: string; coords: string }>> = {
  'fp-1': [ // Studio
    { name: 'Kitchen & Dinette', size: "8' x 10'", coords: "10,10 90,10 90,40 10,40" },
    { name: 'Primary Bed Suite', size: "12' x 14'", coords: "100,10 190,10 190,90 100,90" },
    { name: 'Bathroom Suite', size: "6' x 8'", coords: "10,50 90,50 90,90 10,90" }
  ],
  'fp-2': [ // 1 Bedroom
    { name: 'Gourmet Kitchen', size: "10' x 12'", coords: "10,10 90,10 90,50 10,50" },
    { name: 'Living & Dining Area', size: "14' x 18'", coords: "100,10 190,10 190,110 100,110" },
    { name: 'Master Bedroom', size: "12' x 15'", coords: "10,60 90,60 90,110 10,110" }
  ],
  'fp-3': [ // 2 Bedroom
    { name: 'Master Wing A', size: "15' x 16'", coords: "10,10 90,10 90,70 10,70" },
    { name: 'Kitchen Island', size: "12' x 14'", coords: "100,10 190,10 190,50 100,50" },
    { name: 'Living Lounge Space', size: "16' x 20'", coords: "100,60 190,60 190,110 100,110" },
    { name: 'Guest Bedroom B', size: "12' x 13'", coords: "10,80 90,80 90,110 10,110" }
  ],
  'fp-4': [ // Luxury Penthouse
    { name: 'Grand Foyer', size: "10' x 12'", coords: "10,10 60,10 60,40 10,40" },
    { name: 'Master Bedroom Wing A', size: "18' x 22'", coords: "70,10 190,10 190,70 70,70" },
    { name: 'Living Pavillion Room', size: "24' x 28'", coords: "70,80 190,80 190,120 70,120" },
    { name: 'Suite Wing B', size: "14' x 16'", coords: "10,50 60,50 60,120 10,120" }
  ]
};

export const FloorPlanViewer: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState('fp-2'); // 1 Bed by default
  const [hoveredRoom, setHoveredRoom] = useState<{ name: string; size: string } | null>(null);

  const selectedPlan = floorPlansData.find((fp) => fp.id === selectedPlanId) || floorPlansData[1];

  const formatKES = (value: number) => {
    if (value >= 1000000) {
      return `KES ${(value / 1000000).toFixed(1)}M`;
    }
    return `KES ${value.toLocaleString()}`;
  };

  const rooms = ROOMS_DATA[selectedPlan.id] || [];

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-150">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-display font-bold text-gold-600 uppercase tracking-widest block mb-1">
            UNIT DESIGN ARCHITECTURE
          </span>
          <h3 className="text-xl font-display font-black text-slate-905">
            Interactive Layout Specifications
          </h3>
        </div>
        {/* Toggle Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-205/60 p-1.5 rounded-xl border border-slate-200">
          <style>{`.bg-slate-205\\/60 { background-color: rgba(226, 232, 240, 0.6); }`}</style>
          {floorPlansData.map((plan) => (
            <button
              key={plan.id}
              onClick={() => {
                setSelectedPlanId(plan.id);
                setHoveredRoom(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-display font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                selectedPlanId === plan.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {plan.unitType}
            </button>
          ))}
        </div>
      </div>

      {/* Amortized content body split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Specification Column - 5/12 */}
        <div className="lg:col-span-5 flex flex-col justify-between self-stretch bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
          <div>
            <span className="text-[9px] uppercase font-display tracking-widest text-slate-400 font-bold">
              ESTIMATED SPEC SHEET
            </span>
            <h4 className="text-xl font-display font-extrabold text-slate-900 mt-1.5 mb-3">
              {selectedPlan.unitType} Unit
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {selectedPlan.description}
            </p>

            {/* High end stats list */}
            <div className="space-y-4 border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Maximize size={12} className="text-gold-500" /> Total Area Dimensions
                </span>
                <span className="font-mono text-slate-800 font-bold">{selectedPlan.areaSqFt} sq ft ({selectedPlan.dimensions})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Landmark size={12} className="text-gold-500" /> Starting Value
                </span>
                <span className="font-display text-slate-900 font-extrabold">{formatKES(selectedPlan.startingPriceKES)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Coins size={12} className="text-gold-500" /> Target Monthly Rent
                </span>
                <span className="font-bold text-success font-display">KES {selectedPlan.expectedRentKES.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Check size={12} className="text-success" /> Guaranteed Premium Yield
                </span>
                <span className="px-2 py-0.5 bg-gold-100 text-gold-700 font-bold rounded text-[10px]">
                  {selectedPlan.yieldPercent}% / year
                </span>
              </div>
            </div>
          </div>

          {/* Interactive room inspector bubble */}
          <div className="border border-slate-150 p-4 rounded-xl bg-slate-50">
            <h5 className="text-[9px] font-display font-black text-slate-450 tracking-widest uppercase mb-1">
              Active Floor Inspector
            </h5>
            <style>{`.text-slate-450 { color: #64748b; }`}</style>
            {hoveredRoom ? (
              <motion.div
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <span className="text-xs font-bold text-slate-900">
                  {hoveredRoom.name}
                </span>
                <span className="text-xs font-mono font-semibold bg-gold-200/50 text-gold-750 px-2.5 py-1 rounded">
                  <style>{`.text-gold-750 { color: #855d14; }`}</style>
                  {hoveredRoom.size}
                </span>
              </motion.div>
            ) : (
              <span className="text-xs text-slate-400 italic">
                Hover cursor over vector blueprints on the right to inspect dynamic room shapes and specific measurements.
              </span>
            )}
          </div>
        </div>

        {/* Right Interactive Vector Grid Column - 7/12 */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-inner min-h-[340px] relative overflow-hidden">
          {/* Subtle graph grid background in canvas */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          {/* Vector Map Canvas (SVG drawing based on active coordinates) */}
          <svg
            viewBox="0 0 200 130"
            className="w-full max-w-[420px] h-auto overflow-visible relative z-10"
          >
            {/* Outline box */}
            <rect
              x="5"
              y="5"
              width="190"
              height="120"
              fill="none"
              stroke="#A0ABBA"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Room Polygons */}
            {rooms.map((room) => {
              const matchesHover = hoveredRoom?.name === room.name;
              return (
                <polygon
                  key={room.name}
                  points={room.coords}
                  fill={matchesHover ? 'rgba(200, 169, 106, 0.25)' : 'rgba(255, 255, 255, 0.04)'}
                  stroke={matchesHover ? '#C8A96A' : '#ffffff'}
                  strokeWidth={matchesHover ? '1.5' : '0.75'}
                  strokeOpacity={matchesHover ? '1' : '0.3'}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredRoom({ name: room.name, size: room.size })}
                  onMouseLeave={() => setHoveredRoom(null)}
                />
              );
            })}

            {/* Room Labels inside polygons */}
            {rooms.map((room) => {
              // Extract text center from coords (naive approximation based on bounding box)
              const pointsArr = room.coords.split(' ').map((p) => p.split(',').map(Number));
              const xs = pointsArr.map((p) => p[0]);
              const ys = pointsArr.map((p) => p[1]);
              const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
              const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

              return (
                <text
                  key={room.name}
                  x={cx}
                  y={cy}
                  fill={hoveredRoom?.name === room.name ? '#C8A96A' : '#94A3B8'}
                  fontSize="5"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="pointer-events-none select-none transition-colors duration-200"
                >
                  {room.name.split(' ')[0]} {/* shortened */}
                </text>
              );
            })}
          </svg>

          {/* Compass Rose accent */}
          <div className="absolute right-4 bottom-4 flex items-center gap-1.5 text-slate-500 font-mono text-[9px] pointer-events-none select-none">
            <svg className="w-5 h-5 animate-spin-slow rotate-45" viewBox="0 0 24 24" fill="none">
              <style>{`.animate-spin-slow { animation: spin 20s linear infinite; }`}</style>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
              <path d="M12 2 L14 10 L12 8 L10 10 Z" fill="currentColor"/>
              <path d="M12 22 L14 14 L12 16 L10 14 Z" fill="currentColor"/>
            </svg>
            <span>Nairobi North</span>
          </div>
        </div>
      </div>
    </div>
  );
};
