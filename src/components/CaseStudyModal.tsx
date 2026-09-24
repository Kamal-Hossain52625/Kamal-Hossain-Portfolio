/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Github, ExternalLink, ShieldCheck, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';
import { Project } from '../types';

interface CaseStudyModalProps {
  project: Project;
  onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  
  // Disable body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/85 backdrop-blur-xl">
      
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Main Glass Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0d0d10] border border-luxury-border rounded-2xl p-6 md:p-10 shadow-2xl z-10 no-scrollbar select-text"
      >
        
        {/* Absolute header sticky tools */}
        <div className="sticky top-0 right-0 flex justify-end pb-4 bg-gradient-to-b from-[#0d0d10] via-[#0d0d10] to-transparent z-20">
          <button
            onClick={onClose}
            className="p-2 border border-luxury-border bg-black/60 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            aria-label="Close Case Study"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Layout Body */}
        <div className="flex flex-col gap-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-luxury-border/50 pb-8">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-gold-400 font-extrabold uppercase">
                DETAILED CASE STUDY // {project.category}
              </span>
              <h2 className="font-serif italic text-3xl md:text-5xl text-gold-100 font-bold tracking-tight mt-1.5">
                {project.title}
              </h2>
              <p className="text-zinc-400 text-sm md:text-base tracking-wide mt-2">
                {project.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-luxury-border bg-black/50 hover:bg-zinc-900 font-mono text-[9px] font-extrabold tracking-widest px-4.5 py-3 rounded-full transition-colors"
              >
                <Github className="w-4 h-4" /> SOURCE CODE
              </a>
              <a
                href={project.liveDemo}
                className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-luxury-black hover:from-gold-600 hover:to-gold-700 font-mono text-[9px] font-extrabold tracking-widest px-4.5 py-3 rounded-full transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> LIVE DEMO
              </a>
            </div>
          </div>

          {/* Project Cover Image (if custom image set) */}
          {project.image && (project.image.startsWith('http') || project.image.startsWith('data:image') || project.image.startsWith('/')) && (
            <div className="relative w-full aspect-video md:aspect-[21/9] max-h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-[9px] font-mono text-white/80 font-bold uppercase tracking-wider">
                FLAGSHIP SHOWCASE // {project.title}
              </div>
            </div>
          )}

          {/* Core Metrics highlight row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.metrics.map((metric, idx) => (
              <div 
                key={idx} 
                className="p-5 border border-luxury-border bg-[#050507]/40 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 font-extrabold tracking-widest uppercase block mb-1">
                    {metric.label}
                  </span>
                  <span className="font-serif italic text-xl md:text-2xl font-bold text-gradient-gold">
                    {metric.value}
                  </span>
                </div>
                <TrendingUp className="w-5 h-5 text-gold-400 opacity-30" />
              </div>
            ))}
          </div>

          {/* Deep Description narrative */}
          <div className="flex flex-col gap-2 font-sans text-sm leading-relaxed text-zinc-300">
            <h3 className="text-white font-bold text-base uppercase font-mono tracking-widest mb-1">
              ARCHITECTURAL OVERVIEW
            </h3>
            <p>{project.longDescription}</p>
          </div>

          {/* Challenge Solution split columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch border-t border-b border-luxury-border/50 py-8">
            
            {/* The Challenge */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] tracking-wider uppercase font-extrabold">
                <X className="w-4 h-4 shrink-0" />
                THE CHALLENGE
              </div>
              <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed">
                {project.caseStudy.challenge}
              </p>
            </div>

            {/* The Solution */}
            <div className="flex flex-col gap-4 md:border-l md:border-luxury-border/50 md:pl-8">
              <div className="flex items-center gap-2 text-gold-400 font-mono text-[10px] tracking-wider uppercase font-extrabold">
                <Lightbulb className="w-4 h-4 shrink-0 animate-pulse" />
                THE SOLUTION & CRITERIA
              </div>
              <p className="font-sans text-xs md:text-sm text-zinc-300 leading-relaxed">
                {project.caseStudy.solution}
              </p>
            </div>

          </div>

          {/* Key Feature List */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase font-mono tracking-[0.2em] mb-4">
              CORE FUNCTIONAL IMPLEMENTATIONS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              {project.features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="p-3 border border-luxury-border/50 bg-[#070709]/50 rounded-lg flex items-start gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-zinc-300 leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantified Business Results */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase font-mono tracking-[0.2em] mb-4">
              QUANTIFIED OUTCOMES
            </h3>
            <div className="flex flex-col gap-3 font-sans">
              {project.caseStudy.results.map((res, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-xs text-zinc-300">
                    {res}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
