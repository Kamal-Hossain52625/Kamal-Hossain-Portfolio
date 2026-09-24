/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { testimonialsData } from '../data';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
      className="relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden"
    >
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-16">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
            07 // STAKEHOLDER DEPOSITIONS
          </span>
          <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
            Client & Recruiter Words
          </h2>
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

      </div>
    </section>
  );
}
