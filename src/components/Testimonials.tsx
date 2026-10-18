/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { testimonialsData } from '../data';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  ShieldCheck
} from 'lucide-react';

interface TestimonialsProps {
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
}

export default function Testimonials({
  isExpanded: externalExpanded,
  onToggleExpand,
}: TestimonialsProps = {}) {
  // Default to FALSE: Normally hidden/collapsed, expands on demand
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Sync external state if provided
  useEffect(() => {
    if (externalExpanded !== undefined) {
      setInternalExpanded(externalExpanded);
    }
  }, [externalExpanded]);

  const handleToggle = (expand: boolean) => {
    setInternalExpanded(expand);
    if (onToggleExpand) {
      onToggleExpand(expand);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const activeTest = testimonialsData[currentIndex];

  return (
    <section 
      id="testimonials" 
      className={`relative transition-all duration-500 bg-luxury-black border-t border-white/10 overflow-hidden ${
        isExpanded ? 'py-28' : 'py-12 md:py-16'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* ============================================================== */}
        {/* 1. COLLAPSED / NORMALLY HIDDEN STATE                            */}
        {/* ============================================================== */}
        {!isExpanded ? (
          <div className="border border-white/10 hover:border-orange-500/40 rounded-3xl bg-white/5 hover:bg-white/[0.08] backdrop-blur-2xl p-6 md:p-10 shadow-2xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
                    07 // STAKEHOLDER DEPOSITIONS
                  </span>
                  <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-emerald-400" /> 5.0 RATING • {testimonialsData.length} REVIEWS
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/50 uppercase">
                    NORMALLY COLLAPSED
                  </span>
                </div>

                <h2 className="font-sans text-2xl md:text-3xl text-white font-bold tracking-tight uppercase italic flex items-center gap-3">
                  <span>Client & Recruiter Words</span>
                </h2>

                <p className="text-white/60 text-xs md:text-sm max-w-2xl leading-relaxed italic line-clamp-2">
                  "{testimonialsData[0].text}"
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white/50 mt-1">
                  <span className="text-orange-400 font-semibold">— {testimonialsData[0].name}</span>
                  <span>({testimonialsData[0].role}, {testimonialsData[0].company})</span>
                  <span>•</span>
                  <span>+ {testimonialsData.length - 1} more reviews</span>
                </div>
              </div>

              {/* Tactile High-Conversion Expand Button */}
              <button
                onClick={() => handleToggle(true)}
                className="w-full lg:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:to-orange-700 text-black font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(249,115,22,0.25)] hover:shadow-[0_6px_30px_rgba(249,115,22,0.4)] active:scale-[0.98] transition-all cursor-pointer group shrink-0"
              >
                <MessageSquareQuote className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span>EXPAND CLIENT REVIEWS ({testimonialsData.length})</span>
                <ChevronDown className="w-4 h-4 text-black animate-bounce" />
              </button>

            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* 2. EXPANDED / VISIBLE STATE                                     */
          /* ============================================================== */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Section Header with Collapse Option */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 md:mb-16">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
                      07 // STAKEHOLDER DEPOSITIONS
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED TESTIMONIALS
                    </span>
                  </div>
                  <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
                    Client & Recruiter Words
                  </h2>
                  <p className="text-white/50 text-xs md:text-sm max-w-xl">
                    Direct feedback and recommendations from corporate partners, engineering leaders, and recruitment specialists.
                  </p>
                </div>

                {/* Top Collapse Button */}
                <button
                  onClick={() => handleToggle(false)}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-orange-400" />
                  <span>COLLAPSE REVIEWS</span>
                </button>
              </div>

              {/* Carousel Slider Panel */}
              <div className="max-w-4xl mx-auto border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-14 relative flex flex-col md:flex-row gap-10 items-center shadow-2xl">
                
                {/* Quote Graphic Icon background */}
                <div className="absolute top-6 right-8 text-orange-500/10 pointer-events-none">
                  <Quote className="w-24 h-24 stroke-[1]" />
                </div>

                {/* Left Column: Author avatar dynamic circle */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative w-20 h-20 rounded-full border-2 border-orange-500/30 p-1 flex items-center justify-center bg-zinc-950 font-sans text-2xl font-bold text-orange-400 select-none uppercase italic">
                    {activeTest.avatar}
                    {/* Spinning outer border dash effect */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-orange-400/40 animate-spin-slow pointer-events-none" />
                  </div>

                  {/* Stars rating */}
                  <div className="flex items-center gap-1 mt-4">
                    {[...Array(activeTest.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                </div>

                {/* Right Column: Quote Text sliding */}
                <div className="flex-1 flex flex-col justify-between h-full text-center md:text-left">
                  <div className="min-h-[140px] flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="font-sans italic text-base md:text-lg text-white/80 leading-relaxed font-light tracking-wide"
                      >
                        "{activeTest.text}"
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Author Title info */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-left">
                      <h4 className="font-sans text-sm font-bold text-white tracking-wide">
                        {activeTest.name}
                      </h4>
                      <p className="font-mono text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">
                        {activeTest.role} // <span className="text-orange-400">{activeTest.company}</span>
                      </p>
                    </div>

                    {/* Slider actions */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={handlePrev}
                        className="p-2.5 border border-white/10 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Previous Testimonial"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-2.5 border border-white/10 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Next Testimonial"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Collapse Button */}
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    handleToggle(false);
                    const el = document.getElementById('testimonials');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white/80 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
                >
                  <ChevronUp className="w-4 h-4 text-orange-400" />
                  <span>COLLAPSE REVIEWS (HIDE SECTION)</span>
                </button>
                <span className="text-[9px] font-mono text-white/40 tracking-wider">
                  Viewing review {currentIndex + 1} of {testimonialsData.length}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </section>
  );
}
