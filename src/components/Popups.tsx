import React, { useState, useEffect } from 'react';
import { X, Mail, Sparkles, Sliders, CalendarCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Popups: React.FC = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);

  // Form State
  const [exitName, setExitName] = useState('');
  const [exitPhone, setExitPhone] = useState('');
  const [exitSubmitted, setExitSubmitted] = useState(false);

  const [newsEmail, setNewsEmail] = useState('');
  const [newsSubmitted, setNewsSubmitted] = useState(false);

  useEffect(() => {
    // 1. Exit intent hook: Detects if cursor leaves the top boundary of document body
    const handleMouseLeave = (e: MouseEvent) => {
      const exitIntentStored = localStorage.getItem('exodus_exit_intent_closed');
      if (e.clientY < 15 && !exitIntentStored) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // 2. Newsletter timer: Automatic popup trigger after 15 seconds
    const timer = setTimeout(() => {
      const newsStored = localStorage.getItem('exodus_newsletter_closed');
      const newsCompleted = localStorage.getItem('exodus_newsletter_subscribed');
      if (!newsStored && !newsCompleted) {
        setShowNewsletter(true);
      }
    }, 15000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const closeExitIntent = () => {
    setShowExitIntent(false);
    localStorage.setItem('exodus_exit_intent_closed', 'true');
  };

  const closeNewsletter = () => {
    setShowNewsletter(false);
    localStorage.setItem('exodus_newsletter_closed', 'true');
  };

  const handleExitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (exitName.trim() && exitPhone.trim()) {
      setExitSubmitted(true);
      const leads = JSON.parse(localStorage.getItem('exodus_exit_leads') || '[]');
      leads.push({ id: Date.now(), name: exitName, phone: exitPhone, stamp: new Date().toISOString() });
      localStorage.setItem('exodus_exit_leads', JSON.stringify(leads));

      setTimeout(() => {
        closeExitIntent();
      }, 4000);
    }
  };

  const handleNewsletterForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setNewsSubmitted(true);
      localStorage.setItem('exodus_newsletter_subscribed', 'true');
      const subs = JSON.parse(localStorage.getItem('exodus_subscribers') || '[]');
      subs.push({ email: newsEmail, stamp: new Date().toISOString() });
      localStorage.setItem('exodus_subscribers', JSON.stringify(subs));

      setTimeout(() => {
        closeNewsletter();
      }, 3500);
    }
  };

  return (
    <>
      {/* 1. Exit Intent Lead Capture Overlay */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={closeExitIntent}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 border border-gold-200 shadow-2xl overflow-hidden font-sans"
            >
              {/* Luxury Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-500 via-gold-200 to-gold-700"></div>

              <button
                onClick={closeExitIntent}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full text-slate-500 transition-colors"
              >
                <X size={15} />
              </button>

              <div className="text-center pt-2">
                <style>{`.bg-gold-500\\/10 { background-color: rgba(200, 169, 106, 0.1); }`}</style>
                <div className="bg-gold-500/10 p-3 rounded-full text-gold-600 w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-gold-550/20">
                  <CalendarCheck size={24} />
                </div>
                <span className="text-[10px] uppercase font-display tracking-widest text-gold-600 font-extrabold block mb-1">
                  Wait, don't miss out!
                </span>
                <h3 className="text-xl font-display font-black text-slate-905 mb-2 leading-tight">
                  Secure Your Complimentary Priority Site Tour
                </h3>
                <p className="text-xs text-slate-550 max-w-sm mx-auto mb-6 leading-relaxed">
                  <style>{`.text-slate-555 { color: #64748b; }`}</style>
                  Exodus chauffeured services operates 7 days a week. Share details below to lock in a slot.
                </p>

                {exitSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-success/10 border border-success/30 text-success text-xs font-semibold rounded-xl text-slate-900"
                  >
                    🚀 Callback booked! Sarah or a lead advisor has queued your session. Speak with you shortly.
                  </motion.div>
                ) : (
                  <form onSubmit={handleExitForm} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        required
                        value={exitName}
                        onChange={(e) => setExitName(e.target.value)}
                        className="w-full text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-gold-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp/Phone Number"
                        required
                        value={exitPhone}
                        onChange={(e) => setExitPhone(e.target.value)}
                        className="w-full text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-gold-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-display font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl cursor-pointer shadow transition-colors"
                    >
                      Instant site reservation
                    </button>
                  </form>
                )}

                <span className="block mt-4 text-[9px] text-slate-400 font-mono">
                  No obligations • Privately secured transactions
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Automated Newsletter Invite Popup */}
      <AnimatePresence>
        {showNewsletter && (
          <div className="fixed bottom-6 left-6 z-40 hidden md:block max-w-[340px] font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -30 }}
              className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden"
            >
              {/* Backglow accent */}
              <div className="absolute right-0 top-0 w-16 h-16 bg-gold-500/10 rounded-full blur-2xl"></div>

              <button
                onClick={closeNewsletter}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>

              <div className="flex gap-3 mb-3">
                <div className="bg-gold-500 text-slate-950 p-2 rounded-lg self-start">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-gold-500 block">
                    Exclusive Market intel
                  </span>
                  <h4 className="text-xs font-display font-extrabold text-white mt-0.5 leading-snug">
                    Get Nairobi’s Q3 2026 Yield Reports
                  </h4>
                </div>
              </div>

              <p className="text-[10px] text-slate-405 mb-4 leading-relaxed">
                <style>{`.text-slate-405 { color: #94a3b8; }`}</style>
                Subscribe to secure off-market listings, construction updates, and localized tax guides.
              </p>

              {newsSubmitted ? (
                <div className="p-3 bg-success/15 border border-success/35 text-success text-[10px] font-semibold rounded-lg text-center">
                  Check your inbox! The full Q3 PDF has been emailed.
                </div>
              ) : (
                <form onSubmit={handleNewsletterForm} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    required
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    className="flex-grow bg-slate-800 text-white placeholder-slate-400 rounded-lg px-2.5 py-2 text-[11px] border border-transparent focus:border-gold-500 focus:outline-none focus:ring-0"
                  />
                  <button
                    type="submit"
                    className="bg-gold-500 hover:bg-gold-600 text-slate-950 px-3.5 py-2 rounded-lg text-[11px] font-display font-medium cursor-pointer transition-colors"
                  >
                    Send PDF
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
