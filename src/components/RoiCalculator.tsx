import React, { useState, useMemo } from 'react';
import { AreaChart, Coins, TrendingUp, HelpCircle, FileSpreadsheet, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const RoiCalculator: React.FC = () => {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState(14500000); // 14.5M standard unit
  const [monthlyRent, setMonthlyRent] = useState(110000); // 110k rent
  const [expRatio, setExpRatio] = useState(15); // 15% operating reserves
  const [appreciationRate, setAppreciationRate] = useState(11.5); // 11.5% annual appreciation
  const [submitted, setSubmitted] = useState(false);
  const [advisorName, setAdvisorName] = useState('');
  const [advisorPhone, setAdvisorPhone] = useState('');

  // Suffix Helpers
  const formatKES = (value: number) => {
    if (value >= 1000000) {
      return `KES ${(value / 1000000).toFixed(2)}M`;
    }
    return `KES ${value.toLocaleString()}`;
  };

  // ROI math
  const grossYield = useMemo(() => {
    return ((monthlyRent * 12) / purchasePrice) * 100;
  }, [purchasePrice, monthlyRent]);

  const netYield = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const netAnnualRent = annualRent * (1 - expRatio / 100);
    return (netAnnualRent / purchasePrice) * 100;
  }, [purchasePrice, monthlyRent, expRatio]);

  const annualCashFlow = useMemo(() => {
    return monthlyRent * 12 * (1 - expRatio / 100);
  }, [monthlyRent, expRatio]);

  // Generate 5-year appreciation values array
  const fiveYearSeries = useMemo(() => {
    const series = [];
    let curVal = purchasePrice;
    for (let i = 0; i <= 5; i++) {
      if (i === 0) {
        series.push({ year: 'Now', val: curVal });
      } else {
        curVal = curVal * (1 + appreciationRate / 100);
        series.push({ year: `Yr ${i}`, val: curVal });
      }
    }
    return series;
  }, [purchasePrice, appreciationRate]);

  const totalAppreciation = useMemo(() => {
    return fiveYearSeries[5].val - purchasePrice;
  }, [fiveYearSeries, purchasePrice]);

  const totalRoiPercent = useMemo(() => {
    const fiveYearCash = annualCashFlow * 5;
    const netReturnVal = fiveYearCash + totalAppreciation;
    return (netReturnVal / purchasePrice) * 100;
  }, [annualCashFlow, totalAppreciation, purchasePrice]);

  // SVG Chart Dimensions & Plots
  const chartPoints = useMemo(() => {
    const maxVal = fiveYearSeries[5].val;
    const minVal = purchasePrice * 0.9;
    const valRange = maxVal - minVal;

    // Map 6 points to coordinate space width=300, height=120
    const w = 300;
    const h = 120;
    const points = fiveYearSeries.map((item, index) => {
      const x = (index / 5) * w;
      // Invert Y because SVG origin is top-left
      const y = h - ((item.val - minVal) / valRange) * (h - 20) - 10;
      return { x, y, label: item.year, displayVal: formatKES(item.val) };
    });

    const pathString = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaString = `${pathString} L 300 120 L 0 120 Z`;

    return { points, pathString, areaString };
  }, [fiveYearSeries, purchasePrice]);

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advisorName.trim() && advisorPhone.trim()) {
      setSubmitted(true);
      const consultations = JSON.parse(localStorage.getItem('exodus_consultations') || '[]');
      consultations.push({
        id: `consult-${Date.now()}`,
        name: advisorName,
        phone: advisorPhone,
        purchasePrice,
        netYield: netYield.toFixed(2),
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('exodus_consultations', JSON.stringify(consultations));
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Inputs - Left Column (5/12) */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="bg-gold-500/10 p-2.5 rounded-xl text-gold-500">
              <Coins size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-display font-extrabold text-gold-500 uppercase tracking-widest leading-none">
                INVESTMENT FORECASTER
              </span>
              <h3 className="text-xl font-display font-black text-white mt-1">
                Real Estate ROI Engine
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Nairobi stands as Africa's top investment hub. Adjust parameters below to compute yields, appreciation rates, and 5-year cashflows transparently.
          </p>

          <div className="space-y-6">
            {/* Price entry */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-display font-bold text-slate-300 uppercase tracking-wide">
                  Property Value
                </label>
                <span className="font-display font-extrabold text-sm text-gold-500">
                  {formatKES(purchasePrice)}
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="60000000"
                step="500000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                <span>KES 5.0M</span>
                <span>KES 60.0M</span>
              </div>
            </div>

            {/* Monthly Rent */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-display font-bold text-slate-300 uppercase tracking-wide">
                  Monthly Rent Value
                </label>
                <span className="font-display font-extrabold text-sm text-white">
                  KES {monthlyRent.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="40000"
                max="300000"
                step="5000"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                <span>KES 40K / mo</span>
                <span>KES 300K / mo</span>
              </div>
            </div>

            {/* Expense Ratio & Appreciation Rate Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Operating Reserves
                </label>
                <select
                  value={expRatio}
                  onChange={(e) => setExpRatio(parseInt(e.target.value))}
                  className="w-full bg-slate-850 hover:bg-slate-800 border class-select border-slate-700 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                >
                  <style>{`.bg-slate-850 { background-color: #1e293b; }`}</style>
                  <option value={10}>10% (Low Maintenance)</option>
                  <option value={15}>15% (Standard Suite)</option>
                  <option value={20}>20% (Full Property Mgmt)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Appreciation rate p.a.
                </label>
                <select
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(parseFloat(e.target.value))}
                  className="w-full bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                >
                  <option value={8.0}>8.0% Moderate</option>
                  <option value={11.5}>11.5% Historical average</option>
                  <option value={14.0}>14.0% Prime Westlands</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic CTA */}
        <div className="mt-8 border border-white/5 bg-white/5 rounded-2xl p-4">
          <h4 className="text-[11px] font-display font-bold text-gold-500 tracking-wider uppercase mb-2">
            Ask for Investment Proposal Brochure
          </h4>
          {submitted ? (
            <div className="text-xs text-slate-300 flex items-center gap-1.5 py-1">
              <span className="w-5 h-5 rounded-full bg-success text-slate-950 flex items-center justify-center font-bold">✓</span>
              <span>Callback request queued! Our portfolio desks are preparing reports.</span>
            </div>
          ) : (
            <form onSubmit={handleConsultSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                className="flex-grow bg-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs border border-transparent focus:border-gold-500 focus:outline-none focus:ring-0"
              />
              <input
                type="tel"
                placeholder="Phone (WhatsApp)"
                required
                value={advisorPhone}
                onChange={(e) => setAdvisorPhone(e.target.value)}
                className="flex-grow bg-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs border border-transparent focus:border-gold-500 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-display font-bold cursor-pointer transition-colors"
              >
                Inquire
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Metrics, Graphs & Forecasting - Right Column (7/12) */}
      <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-2xl p-6 border border-slate-800/60">
        <div>
          {/* Top Row Yield Summaries */}
          <div className="grid grid-cols-3 gap-3.5 mb-6 text-center">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="block text-[8px] text-slate-400 font-display uppercase tracking-widest">Gross Yield</span>
              <p className="text-lg font-display font-black text-white mt-1">
                {grossYield.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gold-500 text-slate-950 rounded-xl p-3 border border-gold-400/20">
              <span className="block text-[8px] text-slate-950/80 font-display uppercase tracking-widest">Net Yield</span>
              <p className="text-lg font-display font-black text-slate-950 mt-1">
                {netYield.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="block text-[8px] text-slate-400 font-display uppercase tracking-widest">Net Cash annual</span>
              <p className="text-lg font-display font-black text-success mt-1">
                {formatKES(annualCashFlow)}
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-5 mb-5 flex items-center justify-between">
            <h4 className="text-xs font-display font-black text-white tracking-widest uppercase flex items-center gap-1.5">
              <TrendingUp size={14} className="text-gold-500" />
              5-Year Capital Valuation Forecast:
            </h4>
            <span className="text-[10px] text-slate-400 font-semibold font-mono">
              Composing Rate: {appreciationRate}% p.a.
            </span>
          </div>

          {/* Line Chart Area (D3 styled using custom SVG path with hover markers!) */}
          <div className="relative h-32 w-full mt-4 bg-slate-900/50 rounded-xl p-2.5 overflow-visible border border-white/5">
            <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
              {/* Grid vertical lines */}
              {chartPoints.points.map((pt, i) => (
                <g key={i}>
                  <line
                    x1={pt.x}
                    y1="10"
                    x2={pt.x}
                    y2="110"
                    stroke="#ffffff"
                    strokeOpacity="0.05"
                    strokeDasharray="2"
                  />
                  <text
                    x={pt.x}
                    y="118"
                    fill="#94a3b8"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}

              {/* Shaded Area of curve */}
              <path
                d={chartPoints.areaString}
                fill="url(#gold-gradient)"
                opacity="0.10"
              />

              {/* Main curve Line */}
              <path
                d={chartPoints.pathString}
                fill="none"
                stroke="#C8A96A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Point dots & value highlights */}
              {chartPoints.points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#C8A96A"
                    stroke="#090D16"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fill="#ffffff"
                    fontSize="6"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {pt.displayVal}
                  </text>
                </g>
              ))}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gold-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8A96A" />
                  <stop offset="100%" stopColor="#C8A96A" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Dynamic ROI bottom readout */}
        <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-left">
            <span className="block text-[8px] text-slate-400 font-display uppercase tracking-wider">Initial Purchase</span>
            <p className="text-xs font-bold text-white mt-1">{formatKES(purchasePrice)}</p>
          </div>
          <div className="text-left border-l border-white/10 pl-3">
            <span className="block text-[8px] text-slate-400 font-display uppercase tracking-wider">5-Yr Cash Flow</span>
            <p className="text-xs font-bold text-white mt-1">{formatKES(annualCashFlow * 5)}</p>
          </div>
          <div className="text-left border-l border-white/10 pl-3">
            <span className="block text-[8px] text-slate-400 font-display uppercase tracking-wider">5-Yr Equity Gain</span>
            <p className="text-xs font-bold text-white mt-1">+{formatKES(totalAppreciation)}</p>
          </div>
          <div className="text-left border-l border-white/10 pl-3">
            <span className="block text-[8px] text-gold-500 font-display uppercase tracking-wider">Estimated Total ROI</span>
            <p className="text-sm font-black text-gold-500 mt-0.5">{totalRoiPercent.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
