import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Sparkles, Building2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  { text: "Do you have listings with AirBnB approvals?", key: "airbnb" },
  { text: "What are the common diaspora payment steps?", key: "diaspora" },
  { text: "Is there any site visit fee on weekends?", key: "site_visit" },
  { text: "Show flagship Kilimani/Westlands properties", key: "westlands" }
];

const AUTORESPONSES: Record<string, string> = {
  airbnb: "Most of our developments in Kileleshwa & Kilimani (like Zara Crest and Amani Heights) are fully zonate-approved and secure for AirBnB services, yielding up to 11.2% net annual earnings due to high tourist/consultant density!",
  diaspora: "Yes, 60% of our portfolio belongs to Diaspora buyers. Legal property agreements are signed entirely digitally. Booking reservation deposits of 10% secure your unit, and secure installments can be wired straight to client escrow accounts.",
  site_visit: "All Exodus Realty site visits are entirely FREE and include private, chauffeur-driven pick-up from any residency in Nairobi (including JKIA airport for diaspora arrivals), 7 days a week. Let us know a preferred hour!",
  westlands: "Our current benchmark is 'The Crown Residences, Westlands' - an ultra-luxury complex with 2-3 bed penthouses, custom high-speed elevators, smart systems, and expected annual value growths of up to 14.2%!"
};

export const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: "Welcome to Exodus Realty Inc. I am Sarah Kakai, your dedicated Investment Specialist. How may I assist you with Nairobi properties today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Show a pulsing greeting notification after 4 seconds if not opened
    const timer = setTimeout(() => {
      // Could show a notification cue on screen
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (text: string, customKey?: string) => {
    if (!text.trim()) return;

    const userMsgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);

    // Handle trigger responses
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let responseText = "Thank you for reaching out to Exodus! A premium advisor has been paged. Please provide your phone number/WhatsApp below so we can share custom floor brochures, or dial 0746 087766 for instant help.";
      
      if (customKey && AUTORESPONSES[customKey]) {
        responseText = AUTORESPONSES[customKey];
      } else {
        const normalized = text.toLowerCase();
        if (normalized.includes('airbnb') || normalized.includes('short term')) {
          responseText = AUTORESPONSES.airbnb;
        } else if (normalized.includes('diaspora') || normalized.includes('abroad') || normalized.includes('usa')) {
          responseText = AUTORESPONSES.diaspora;
        } else if (normalized.includes('visit') || normalized.includes('tour') || normalized.includes('viewing')) {
          responseText = AUTORESPONSES.site_visit;
        } else if (normalized.includes('westlands') || normalized.includes('kilimani') || normalized.includes('karen')) {
          responseText = "Our core catalog covers Kilimani, Westlands, Lavington, and Karen with units ranging from compact 1-Bed models starting at KES 14.5M, up to massive 1.2 acre estates in Karen starting at KES 115M.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'ai',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const msgCopy = inputText;
    setInputText('');
    handleSendMessage(msgCopy);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full sm:w-[380px] h-[500px] flex flex-col overflow-hidden mb-4"
          >
            {/* Header Banner */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                {/* Advisor Profile Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-gold-500/30 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                      alt="Concierge Sarah"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Glowing online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-slate-900 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">Sarah Kakai</h4>
                    <span className="text-[8px] bg-gold-550 text-slate-950 font-extrabold px-1.5 py-0.2 rounded">ADVISOR</span>
                    <style>{`.bg-gold-550 { background-color: #d1b476; }`}</style>
                  </div>
                  <span className="text-[10px] text-slate-400">Senior Investment Concierge</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body Scroll Container */}
            <div ref={chatScrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] flex flex-col">
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-150 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-1 self-end font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-150 rounded-2xl rounded-tl-none p-3 flex gap-1 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts tray */}
            {messages.length < 4 && (
              <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-1.5 flex-shrink-0">
                <span className="text-[8px] text-slate-400 font-display font-medium tracking-widest uppercase block mb-1">
                  Click a popular investment topic:
                </span>
                <div className="flex flex-wrap gap-1">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.key}
                      onClick={() => handleSendMessage(prompt.text, prompt.key)}
                      className="text-[10px] bg-slate-55 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer"
                    >
                      <style>{`.bg-slate-55 { background-color: #fafbfc; } .hover\\:border-slate-350:hover { border-color: #A0ABBA; }`}</style>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2 flex-shrink-0">
              <input
                type="text"
                placeholder="Type your property question..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 p-4 rounded-full shadow-2xl relative border border-slate-800 transition-all cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        {/* Animated badge notify indicator */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-gold-500 text-slate-950 text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce border border-slate-900">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
};
