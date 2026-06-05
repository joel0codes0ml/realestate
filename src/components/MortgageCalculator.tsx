import React, { useState, useMemo } from 'react';
import { Landmark, AlertCircle, Percent, Receipt, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

export const MortgageCalculator: React.FC = () => {
  // Inputs
  const [propertyPrice, setPropertyPrice] = useState(24500000); // 24.5M default KES
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // 20% down
  const [interestRate, setInterestRate] = useState(11.5); // 11.5% KES loan avg
  const [loanTerm, setLoanTerm] = useState(15); // 15 years

  // Format Helpers
  const formatKES = (val: number) => {
    if (val >= 1000000) {
      return `KES ${(val / 1000000).toFixed(2)}M`;
    }
    return `KES ${val.toLocaleString()}`;
  };

  // Calculations
  const downPaymentKES = useMemo(() => {
    return (propertyPrice * downPaymentPercent) / 100;
  }, [propertyPrice, downPaymentPercent]);

  const loanPrincipal = useMemo(() => {
    return propertyPrice - downPaymentKES;
  }, [propertyPrice, downPaymentKES]);

  const calculations = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      const monthlyPayment = loanPrincipal / numberOfPayments;
      const totalPayments = loanPrincipal;
      const totalInterest = 0;
      return { monthlyPayment, totalPayments, totalInterest };
    }

    const monthlyPayment =
      (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalCostOfOwnership = monthlyPayment * numberOfPayments;
    const totalInterest = Math.max(0, totalCostOfOwnership - loanPrincipal);

    return {
      monthlyPayment,
      totalPayments: totalCostOfOwnership,
      totalInterest,
    };
  }, [loanPrincipal, interestRate, loanTerm]);

  // SVG Chart Angles (Donut representation)
  const chartProps = useMemo(() => {
    const total = loanPrincipal + calculations.totalInterest;
    if (total === 0) return { principalDash: 0, interestDash: 314, principalPct: 0, interestPct: 0 };
    
    const principalPct = (loanPrincipal / total) * 100;
    const interestPct = (calculations.totalInterest / total) * 100;

    const totalCircumference = 2 * Math.PI * 40; // ~251.3
    const principalDash = (principalPct / 100) * totalCircumference;
    const interestDash = totalCircumference - principalDash;

    return {
      principalDash,
      interestDash,
      principalPct: Math.round(principalPct),
      interestPct: Math.round(interestPct),
      totalCircumference
    };
  }, [loanPrincipal, calculations.totalInterest]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Inputs Column - 7/12 */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gold-500/10 p-2.5 rounded-xl text-gold-600">
              <Landmark size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-display font-bold text-gold-500 uppercase tracking-widest leading-none">
                FINANCIAL DESIGN TOOL
              </span>
              <h3 className="text-xl font-display font-black text-slate-900 mt-1">
                Luxury Mortgage Amortizer
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Input property value details to calculate monthly servicing schedules and amortization lifetimes through Exodus banking relationships.
          </p>

          <div className="space-y-6">
            {/* Price slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-display font-bold text-slate-700 uppercase tracking-wide">
                  Property Valuations
                </label>
                <span className="font-display font-extrabold text-sm text-slate-900">
                  {formatKES(propertyPrice)}
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="120000000"
                step="500000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>KES 5.0M</span>
                <span>KES 120.0M</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-display font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  Down Payment
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-500 lowercase">
                    {downPaymentPercent}% equity
                  </span>
                </label>
                <span className="font-display font-extrabold text-sm text-slate-900">
                  {formatKES(downPaymentKES)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>10% Minimum</span>
                <span>50% maximum</span>
              </div>
            </div>

            {/* Interest Rates & Terms in Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interest spec */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-xs font-display font-bold text-slate-700 uppercase tracking-wide">
                    Bank Interest Rate
                  </label>
                  <span className="font-display font-extrabold text-sm text-slate-900">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="18.0"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>6.0%</span>
                  <span>18.0%</span>
                </div>
              </div>

              {/* Term years */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-xs font-display font-bold text-slate-700 uppercase tracking-wide">
                    Loan Amortization
                  </label>
                  <span className="font-display font-extrabold text-sm text-slate-900">
                    {loanTerm} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>5 Yrs</span>
                  <span>25 Yrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory trust note */}
        <div className="mt-8 border border-slate-150 p-4 rounded-2xl bg-slate-50 flex items-start gap-3">
          <AlertCircle size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
          <p className="text-[10.5px] leading-relaxed text-slate-500">
            <strong>Exodus Advisory:</strong> Nairobi interest values frequently scale depending on currency definitions. Diaspora mortgages can be issued in **USD/GBP** at special rates of **6.2% - 8.5%**. Contact our designated finance officer to secure private banking rates.
          </p>
        </div>
      </div>

      {/* Outputs / Donut Visual Column - 5/12 */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
        {/* Subtle background luxury accent */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center sm:text-left">
          <span className="text-[9px] uppercase font-display tracking-widest text-slate-400 font-bold">
            ESTIMATED REPAYMENT SCHEDULE
          </span>
          <h4 className="text-[10px] text-gold-500 font-mono uppercase tracking-wide mt-1">
            Standard monthly service
          </h4>

          {/* Large dynamic price presentation */}
          <div className="my-5">
            <span className="block text-[11px] text-slate-350 uppercase tracking-widest">Monthly Installments</span>
            <p className="text-3xl font-display font-black text-white mt-1">
              {formatKES(calculations.monthlyPayment)}
            </p>
            <span className="text-xs text-gold-200/80 font-medium">
              ~ ${(calculations.monthlyPayment / 130).toFixed(0)} USD / month
            </span>
          </div>

          <div className="border-t border-white/10 my-5 pt-5 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Down Payment</span>
              <span className="font-semibold text-white">{formatKES(downPaymentKES)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Loan Principal Amount Range</span>
              <span className="font-semibold text-white">{formatKES(loanPrincipal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Interest Accrued</span>
              <span className="font-semibold text-gold-500">{formatKES(calculations.totalInterest)}</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Donut Graph (D3 styled) */}
        <div className="flex items-center gap-5 my-3 bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1E293B"
                strokeWidth="10"
              />
              {/* Principal portion */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#C8A96A" // Gold for principal
                strokeWidth="10"
                strokeDasharray={`${chartProps.principalDash} ${chartProps.totalCircumference}`}
              />
              {/* Interest portion */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#334155" // Slate for interest
                strokeWidth="10"
                strokeDashoffset={`-${chartProps.principalDash}`}
                strokeDasharray={`${chartProps.interestDash} ${chartProps.totalCircumference}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <span className="text-[10px] font-mono leading-none font-bold text-slate-300">
                {chartProps.principalPct}%<br/>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 font-sans">Eq.</span>
              </span>
            </div>
          </div>
          
          <div className="flex-grow space-y-1 text-[11px] self-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gold-500"></span>
              <span className="text-slate-300 font-medium">Principal: {chartProps.principalPct}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700"></span>
              <span className="text-slate-300 font-medium">Interest: {chartProps.interestPct}%</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-gold-500 hover:bg-gold-600 font-display font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-xl text-slate-950 mt-4 transition-colors cursor-pointer shadow-lg shadow-gold-500/10">
          Request Bank Pre-Qualification
        </button>
      </div>
    </div>
  );
};
