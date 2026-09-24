/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ShieldCheck, HeartHandshake, Code, LayoutDashboard, Cpu } from 'lucide-react';
import { getStoredProfileImage } from '../lib/storage';

interface ManifestoItem {
  id: string;
  topic: string;
  icon: any;
  badPractice: {
    title: string;
    description: string;
  };
  goodPractice: {
    title: string;
    description: string;
  };
}

const manifestoItems: ManifestoItem[] = [
  {
    id: 'visual-noise',
    topic: 'Information Density',
    icon: LayoutDashboard,
    badPractice: {
      title: 'Visual Clutter & Technical Larping',
      description: 'Clogging margins with fake terminal logs, server stats, IP addresses, and ping states. It distracts users, acts as low-value "AI slop", and feels highly amateur.'
    },
    goodPractice: {
      title: 'Editorial Minimalism & Luxury Rhythm',
      description: 'Letting content breathe with generous padding, striking custom typography, and high-contrast styling. Information is structured hierarchically so clients digest it effortlessly.'
    }
  },
  {
    id: 'interaction',
    topic: 'Transitions & Feedback',
    icon: Code,
    badPractice: {
      title: 'Static Links & Jarring Popups',
      description: 'Standard elements that snap on hover or show intrusive alerts. Users feel disconnected, navigation is rigid, and overall mobile response is sluggish.'
    },
    goodPractice: {
      title: 'Spring-Physics Motion & Active States',
      description: 'Micro-animations that react instantly. Links slide, buttons adapt weight, cursors expand contextually. The portfolio acts as a cohesive tactile canvas.'
    }
  },
  {
    id: 'performance',
    topic: 'Asset Rendering',
    icon: Cpu,
    badPractice: {
      title: 'Uncompressed Stock Images',
      description: 'Loading 4MB generic stock photos as project cards. It destroys Lighthouse scores, blocks thread compilation, and causes flickering upon viewport scrolling.'
    },
    goodPractice: {
      title: 'Bespoke Vector Graphics & Pre-loading',
      description: 'Rendering interactive layouts in React using Canvas, SVGs, and WebGL elements. No massive downloads, perfect crispness on Retina displays, and instantaneous load speeds.'
    }
  }
];

export default function About() {
  const [activeManifesto, setActiveManifesto] = useState<string>('visual-noise');
  const activeItem = manifestoItems.find((item) => item.id === activeManifesto) || manifestoItems[0];

  // Profile image (controlled centrally via Admin Panel)
  const [profileImage, setProfileImage] = useState<string>(getStoredProfileImage);

  useEffect(() => {
    const handlePhotoUpdate = (e: any) => {
      if (e.detail !== undefined) setProfileImage(e.detail);
      else setProfileImage(getStoredProfileImage());
    };
    window.addEventListener('portfolio_profile_image_updated', handlePhotoUpdate);
    return () => window.removeEventListener('portfolio_profile_image_updated', handlePhotoUpdate);
  }, []);

  return (
    <section 
      id="about" 
      className="relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Indicator */}
        <div className="flex flex-col items-start gap-2 mb-12">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
            01 // DESIGN PHILOSOPHY
          </span>
          <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
            Immersive Storytelling
          </h2>
        </div>

        {/* Primary Story & Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Block: Bio narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-sans text-xl md:text-2xl font-bold text-white tracking-wide leading-relaxed">
              Hello, I am Kamal. I bridge the gap between complex architectural logic and breathtaking visual design.
            </h3>
            
            <p className="font-sans text-white/60 text-sm md:text-base leading-relaxed tracking-wide font-light">
              Over the last 5 years, I have engineered full-stack architectures and crafted high-end creative interfaces for clients globally. My philosophy is simple: **every line of code should run at maximum performance, and every pixel should carry artistic intent.**
            </p>
            
            <p className="font-sans text-white/60 text-sm md:text-base leading-relaxed tracking-wide font-light">
              I avoid standard templates. Instead, I build modular, highly polished ecosystems using modern front-end layers (React, TypeScript, Tailwind, and Motion) coupled with resilient background backends (Node.js, Express, PostgreSQL, Redis, and Cloud setups).
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4 font-mono">
              <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">CURRENT LOCATION</span>
                <span className="text-white text-xs font-semibold">Berlin, Germany (Remote Enabled)</span>
              </div>
              <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">INTERESTS</span>
                <span className="text-white text-xs font-semibold">Generative Art, System Security, UI Motion</span>
              </div>
            </div>
          </div>

          {/* Right Block: Luxury Portrait/Card placeholder with grid effects */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-orange-500/5 rounded-2xl blur-xl" />
            <div className="relative border border-white/10 bg-white/5 p-6 rounded-2xl backdrop-blur-2xl shadow-2xl">
              
              {/* Profile Graphic Frame */}
              <div className="relative h-72 w-full bg-zinc-950/60 rounded-xl overflow-hidden mb-6 flex items-center justify-center border border-white/10 select-none group">
                {profileImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={profileImage}
                      alt="Kamal Hossain"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-black/30 pointer-events-none" />

                    <div className="absolute bottom-3 left-3 bg-[#0c0c0f]/90 border border-white/10 px-2.5 py-1 rounded text-[8px] font-mono tracking-widest text-orange-400 flex items-center gap-1.5 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      VERIFIED PORTRAIT ACTIVE
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Custom modern vector portrait overlay */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-blue-500/20 rounded-full blur-2xl" />
                    
                    {/* Abstract graphic representing Kamal */}
                    <svg className="w-36 h-36 text-orange-500/80 z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 25C54.4183 25 58 28.5817 58 33C58 37.4183 54.4183 41 50 41C45.5817 41 42 37.4183 42 33C42 28.5817 45.5817 25 50 25ZM50 78C38.6667 78 28.85 71.8 23.63 62.5C23.77 53.67 41.33 48.83 50 48.83C58.67 48.83 76.23 53.67 76.37 62.5C71.15 71.8 61.33 78 50 78Z" fill="currentColor" stroke="rgba(249,115,22,0.5)" strokeWidth="0.5"/>
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className="animate-spin-slow origin-center" style={{ transformOrigin: '50px 50px' }} />
                    </svg>

                    <div className="absolute bottom-3 left-3 bg-[#0c0c0f]/90 border border-white/10 px-2.5 py-1 rounded text-[8px] font-mono tracking-widest text-orange-400">
                      SYSTEM LEVEL ACTIVATED
                    </div>
                  </>
                )}
              </div>

              {/* Card Meta Details */}
              <div className="flex flex-col gap-4 font-sans">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-xs text-white/40">Name</span>
                  <span className="text-xs font-semibold text-white">Kamal Hossain</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-xs text-white/40">Role</span>
                  <span className="text-xs font-semibold text-orange-400">Lead Full-Stack Architect</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-xs text-white/40">Available Email</span>
                  <a href="mailto:kamalhossainm5443@gmail.com" className="text-xs font-semibold text-white hover:text-orange-400 transition-colors">
                    kamalhossainm5443@gmail.com
                  </a>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-xs text-white/40">Security Clearance</span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/15 border border-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                    ● VERIFIED ACTIVE
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic UI/UX Audit & Manifesto Panel (CRITICAL REQUIREMENT) */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl p-6 md:p-10 relative shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
            <div>
              <span className="text-orange-500 font-mono text-[9px] tracking-widest uppercase block mb-1">INTERACTIVE AUDIT BOARD</span>
              <h3 className="font-sans text-2xl md:text-3xl text-white font-bold tracking-tight uppercase italic">
                Senior UI/UX Manifesto
              </h3>
              <p className="text-white/40 text-xs mt-1">
                Comparing common industry bad practices with my refined, production-ready methodologies.
              </p>
            </div>

            {/* Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {manifestoItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveManifesto(item.id)}
                  className={`px-4 py-2 text-[9px] font-mono tracking-widest font-bold rounded-lg uppercase cursor-pointer border transition-all ${
                    activeManifesto === item.id 
                      ? 'bg-white/10 text-white border-white/20' 
                      : 'bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {item.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Render Audit Comparative Columns */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeManifesto}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
            >
              {/* Bad Practice Column */}
              <div className="border border-rose-500/10 bg-rose-950/5 p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] tracking-wider uppercase mb-4">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    COMMON BAD DECISION
                  </div>
                  <h4 className="font-sans text-base font-bold text-rose-100 mb-2">
                    {activeItem.badPractice.title}
                  </h4>
                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    {activeItem.badPractice.description}
                  </p>
                </div>
                <div className="mt-6 text-[9px] font-mono text-rose-500/60 font-semibold">
                  STATUS: REJECTED & PURGED
                </div>
              </div>

              {/* Good Practice Column */}
              <div className="border border-emerald-500/15 bg-emerald-950/5 p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] tracking-wider uppercase mb-4">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    MY RE-ENGINEERED STANDARD
                  </div>
                  <h4 className="font-sans text-base font-bold text-emerald-100 mb-2">
                    {activeItem.goodPractice.title}
                  </h4>
                  <p className="font-sans text-xs text-white/80 leading-relaxed">
                    {activeItem.goodPractice.description}
                  </p>
                </div>
                <div className="mt-6 text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  STATUS: PRODUCTION IMPLEMENTED
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
