/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { skillCategoriesData } from '../data';
import { Check, Cpu, Award, Zap, Server, ShieldCheck } from 'lucide-react';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('frontend');
  const activeCategory = skillCategoriesData.find((cat) => cat.id === selectedCategory) || skillCategoriesData[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return <Zap className="w-5 h-5 text-orange-500" />;
      case 'backend':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'devops':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      default:
        return <Cpu className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section 
      id="skills" 
      className="relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden bg-grid-pattern"
    >
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
              02 // EXPERTISE RADAR
            </span>
            <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
              Tech Stack & Tooling
            </h2>
          </div>
          <p className="max-w-md text-white/40 font-sans text-xs md:text-sm leading-relaxed font-light">
            Multi-threaded architectures, highly optimized canvas render loops, and strict type safety mechanisms. Selected elements represent active core workflows.
          </p>
        </div>

        {/* Dynamic Interactive Bento Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Category Selectors (Bento Card Layout) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {skillCategoriesData.map((category) => {
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[160px] ${
                    isSelected 
                      ? 'bg-white/10 border-white/20 shadow-2xl' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Active background subtle glow */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl pointer-events-none" />
                  )}

                  <div className="flex justify-between items-start w-full relative z-10">
                    <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-white/10">
                      {getCategoryIcon(category.id)}
                    </div>
                    
                    {isSelected && (
                      <span className="text-[9px] font-mono font-bold tracking-widest text-orange-400 uppercase flex items-center gap-1">
                        <Check className="w-3 h-3" /> SELECTED
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 mt-auto">
                    <h3 className="font-sans text-sm md:text-base font-bold text-white tracking-wide">
                      {category.name}
                    </h3>
                    <p className="font-sans text-[11px] text-white/50 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Visual Skill Progress Panels */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-3xl h-full shadow-2xl flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase font-bold">
                    CORE PROFICIENCIES // {activeCategory.name}
                  </span>
                  <Award className="w-4 h-4 text-orange-500" />
                </div>

                {/* Grid of active skills */}
                <div className="flex flex-col gap-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedCategory}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                      {activeCategory.skills.map((skill, index) => (
                        <div 
                          key={skill.name}
                          className="p-4 border border-white/5 bg-white/5 rounded-xl flex flex-col justify-between gap-3 group hover:border-white/10 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-sans text-xs md:text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                              {skill.name}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-orange-400">
                              {skill.level}%
                            </span>
                          </div>

                          {/* Skill bar progress */}
                          <div className="h-[2px] w-full bg-zinc-950 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.9, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full bg-gradient-to-r from-orange-500 via-blue-500 to-white"
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Systems highlights footer card */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-[9px] tracking-widest font-extrabold uppercase">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  STRICT DEVELOPMENT STANDARDS COMPLIANT
                </div>
                <div className="text-[10px] text-white/40 font-mono">
                  Lighthouse speed metric: <span className="text-orange-400 font-semibold">TBT &lt; 50ms</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
