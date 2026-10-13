/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  HeartHandshake,
  Code,
  LayoutDashboard,
  Cpu,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Building2,
  Code2,
  Rocket,
  Eye,
  FileText,
  HardDrive,
  Clock,
  Layers,
  X,
  Maximize2
} from 'lucide-react';
import { getStoredProfileImage, subscribeToProfileImage } from '../lib/storage';
import {
  getStoredAboutPhotos,
  subscribeToAboutPhotos,
  getStoredCvDocument,
  subscribeToCvDocument
} from '../lib/aboutStorage';
import { AboutWorkPhoto, CvDocument } from '../types';
import CvModal from './CvModal';

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

export default function About({
  isExpandedOnMobile,
  onToggleExpandMobile,
}: {
  isExpandedOnMobile?: boolean;
  onToggleExpandMobile?: (expanded: boolean) => void;
} = {}) {
  const [activeManifesto, setActiveManifesto] = useState<string>('visual-noise');
  const activeItem = manifestoItems.find((item) => item.id === activeManifesto) || manifestoItems[0];

  // Mobile collapse / expand state: default to false (compact / less mode)
  const [internalExpandedMobile, setInternalExpandedMobile] = useState<boolean>(false);
  const isManifestoExpanded = isExpandedOnMobile !== undefined ? isExpandedOnMobile : internalExpandedMobile;

  const handleToggleManifesto = (expanded: boolean) => {
    setInternalExpandedMobile(expanded);
    if (onToggleExpandMobile) {
      onToggleExpandMobile(expanded);
    }
  };

  // Profile image (controlled centrally via Admin Panel)
  const [profileImage, setProfileImage] = useState<string>(getStoredProfileImage);

  // Real-world work photos state (Office, Coding, New Projects) - synced from storage/cloud
  const [workPhotos, setWorkPhotos] = useState<AboutWorkPhoto[]>(getStoredAboutPhotos);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<AboutWorkPhoto | null>(null);

  // Curriculum Vitae (CV) state - synced from storage/cloud
  const [cvDoc, setCvDoc] = useState<CvDocument>(getStoredCvDocument);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  useEffect(() => {
    const unsubCloud = subscribeToProfileImage((cloudImg) => {
      setProfileImage(cloudImg);
    });

    const unsubPhotos = subscribeToAboutPhotos((photos) => {
      setWorkPhotos(photos);
    });

    const unsubCv = subscribeToCvDocument((doc) => {
      setCvDoc(doc);
    });

    const handlePhotoUpdate = (e: any) => {
      if (e.detail !== undefined) setProfileImage(e.detail);
      else setProfileImage(getStoredProfileImage());
    };

    const handlePhotosUpdate = (e: any) => {
      if (e.detail) setWorkPhotos(e.detail);
      else setWorkPhotos(getStoredAboutPhotos());
    };

    const handleCvUpdate = (e: any) => {
      if (e.detail) setCvDoc(e.detail);
      else setCvDoc(getStoredCvDocument());
    };

    window.addEventListener('portfolio_profile_image_updated', handlePhotoUpdate);
    window.addEventListener('portfolio_about_photos_updated', handlePhotosUpdate);
    window.addEventListener('portfolio_cv_updated', handleCvUpdate);

    return () => {
      unsubCloud();
      unsubPhotos();
      unsubCv();
      window.removeEventListener('portfolio_profile_image_updated', handlePhotoUpdate);
      window.removeEventListener('portfolio_about_photos_updated', handlePhotosUpdate);
      window.removeEventListener('portfolio_cv_updated', handleCvUpdate);
    };
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

        {/* ========================================================= */}
        {/* 02 // WORK & CRAFTSMANSHIP: OFFICE, CODING & NEW PROJECTS */}
        {/* ========================================================= */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase block mb-2">
                02 // REAL-WORLD MOMENTS & WORK ETHIC
              </span>
              <h3 className="font-sans text-2xl md:text-4xl text-white font-bold tracking-tight uppercase italic">
                Office, Deep Code & Project Innovation
              </h3>
              <p className="text-white/50 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
                Authentic glimpses into day-to-day office teamwork, late-night code craftsmanship, and architectural launches.
              </p>
            </div>

            <div className="flex items-center gap-2 text-white/40 font-mono text-xs self-start md:self-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3 VERIFIED WORK EXPERIENCES</span>
            </div>
          </div>

          {/* 3-Card Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workPhotos.map((photo, idx) => {
              const CategoryIcon =
                photo.category === 'office'
                  ? Building2
                  : photo.category === 'coding'
                  ? Code2
                  : Rocket;

              const categoryBadge =
                photo.category === 'office'
                  ? 'OFFICE WORK & COLLABORATION'
                  : photo.category === 'coding'
                  ? 'DEEP CODING CRAFTSMANSHIP'
                  : 'NEW PROJECT INNOVATION';

              return (
                <div
                  key={photo.id || idx}
                  onClick={() => setSelectedLightboxPhoto(photo)}
                  className="group relative border border-white/10 hover:border-orange-500/40 rounded-2xl bg-white/5 hover:bg-white/[0.08] backdrop-blur-xl p-5 transition-all duration-300 flex flex-col justify-between shadow-xl overflow-hidden cursor-pointer active:scale-[0.99]"
                >
                  {/* Picture Frame */}
                  <div className="relative h-56 w-full rounded-xl overflow-hidden bg-black/60 mb-5 border border-white/10 select-none">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-black/30 pointer-events-none" />

                    {/* Top-Left Category Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5 z-10 shadow-lg">
                      <CategoryIcon className="w-3.5 h-3.5 text-orange-400" />
                      <span>{categoryBadge}</span>
                    </div>

                    {/* Top-Right View Indicator */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white/80 group-hover:text-orange-400 group-hover:border-orange-500/40 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/15 transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-xl z-10">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View</span>
                    </div>

                    {/* Bottom Status Tag */}
                    <div className="absolute bottom-3 left-3 bg-[#0c0c0f]/90 border border-white/10 px-2.5 py-0.5 rounded text-[8px] font-mono tracking-widest text-white/70 flex items-center gap-1.5 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {photo.date || 'ACTIVE RECORD'}
                    </div>
                  </div>

                  {/* Narrative & Details - Heading only */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-orange-400/90 font-bold uppercase tracking-widest">
                      {photo.subtitle}
                    </span>
                    <h4 className="font-sans text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                      {photo.title}
                    </h4>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-1 pt-2.5 border-t border-white/5">
                      {photo.tags?.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Location Footer */}
                    {photo.location && (
                      <div className="mt-1 text-[9px] font-mono text-white/40 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-orange-400/70" />
                        <span>{photo.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 03 // CURRICULUM VITAE (CV)                                */}
        {/* ========================================================= */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase block mb-2">
                03 // CURRICULUM VITAE
              </span>
              <h3 className="font-sans text-2xl md:text-4xl text-white font-bold tracking-tight uppercase italic">
                Curriculum Vitae (CV)
              </h3>
            </div>
          </div>

          {/* Luxury Executive CV Display Card */}
          <div className="relative border border-white/15 bg-white/5 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Metadata & Tactile Action Buttons */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider block">
                      OFFICIAL DOSSIER
                    </span>
                    <h4 className="font-sans text-xl md:text-2xl font-bold text-white">
                      Curriculum Vitae (CV)
                    </h4>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED CV
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-orange-400" /> {cvDoc.fileSize}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> {cvDoc.uploadedAt}
                  </span>
                  {cvDoc.isCustomUploaded && (
                    <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold">
                      Cloud Synchronized
                    </span>
                  )}
                </div>

                {/* Primary Action Button: View Fullscreen CV Only */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsCvModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-[0_4px_20px_rgba(249,115,22,0.25)]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>VIEW FULLSCREEN CV</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Embedded Interactive PDF Document Preview Frame */}
              <div className="lg:col-span-5 relative group">
                <div className="relative border border-white/15 rounded-2xl bg-[#14141c] overflow-hidden shadow-2xl">
                  {/* Browser/Document Chrome Bar */}
                  <div className="h-9 bg-[#1a1a24] border-b border-white/10 px-4 flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] font-mono text-white/50 tracking-wider truncate max-w-[200px]">
                      {cvDoc.fileName}
                    </span>
                    <button
                      onClick={() => setIsCvModalOpen(true)}
                      className="text-white/60 hover:text-white"
                      title="Expand to Fullscreen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Document Viewport Frame */}
                  <div className="relative h-64 md:h-72 w-full bg-white overflow-hidden">
                    {cvDoc.pdfDataUrl ? (
                      <iframe
                        src={`${cvDoc.pdfDataUrl}#toolbar=0&navpanes=0&view=FitH`}
                        title="CV Document Preview"
                        className="w-full h-full border-none pointer-events-none select-none"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-4">
                        <FileText className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-mono">No PDF uploaded</span>
                      </div>
                    )}

                    {/* Tactile Click Overlay to expand */}
                    <div
                      onClick={() => setIsCvModalOpen(true)}
                      className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors cursor-pointer flex items-center justify-center group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 px-4 py-2 rounded-xl bg-black/90 border border-orange-500/50 text-orange-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all">
                        <Eye className="w-4 h-4" /> Click To Expand Fullscreen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic UI/UX Audit & Manifesto Panel (CRITICAL REQUIREMENT) */}
        <div id="manifesto-panel" className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl p-6 md:p-10 relative shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange-500 font-mono text-[9px] tracking-widest uppercase">
                  04 // INTERACTIVE AUDIT BOARD
                </span>
                {/* Mobile mode indicator chip */}
                <span className="md:hidden text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border bg-white/5 text-orange-400 border-orange-500/30">
                  {isManifestoExpanded ? 'FULL VIEW' : 'COMPACT VIEW'}
                </span>
              </div>
              <h3 className="font-sans text-2xl md:text-3xl text-white font-bold tracking-tight uppercase italic flex items-center gap-3">
                <span>Senior UI/UX Manifesto</span>
              </h3>
              <p className="text-white/40 text-xs mt-1">
                Comparing common industry bad practices with my refined, production-ready methodologies.
              </p>
            </div>

            {/* Desktop & Expanded Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {manifestoItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveManifesto(item.id);
                  }}
                  className={`px-4 py-2 text-[9px] font-mono tracking-widest font-bold rounded-lg uppercase cursor-pointer border transition-all ${
                    activeManifesto === item.id 
                      ? 'bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)]' 
                      : 'bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {item.topic}
                </button>
              ))}

              {/* Quick toggle chip on mobile */}
              <button
                onClick={() => handleToggleManifesto(!isManifestoExpanded)}
                className="md:hidden ml-auto px-3 py-2 text-[9px] font-mono font-bold uppercase rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                {isManifestoExpanded ? (
                  <>LESS <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>EXPAND <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DESKTOP VIEW: Always shows full side-by-side audit        */}
          {/* ========================================================= */}
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeManifesto}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-8 items-stretch"
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

          {/* ========================================================= */}
          {/* MOBILE VIEW: "Less" by default, Tap to Expand to show full */}
          {/* ========================================================= */}
          <div className="md:hidden flex flex-col gap-4">
            {!isManifestoExpanded ? (
              /* LESS STATE: Shows a compact summary preview with prominent TAP TO EXPAND button */
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/50 px-1">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> RE-ENGINEERED STANDARD PREVIEW
                  </span>
                  <span className="text-white/40">LESS MODE</span>
                </div>

                {/* Compact Good Standard Highlight Card */}
                <div className="border border-emerald-500/20 bg-emerald-950/10 p-5 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{activeItem.topic} STANDARD</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      PRODUCTION
                    </span>
                  </div>

                  <h4 className="font-sans text-sm font-bold text-emerald-100 mb-1.5">
                    {activeItem.goodPractice.title}
                  </h4>
                  <p className="font-sans text-xs text-white/70 line-clamp-2 leading-relaxed">
                    {activeItem.goodPractice.description}
                  </p>
                </div>

                {/* High-visibility tactile TAP TO EXPAND Button */}
                <button
                  onClick={() => handleToggleManifesto(true)}
                  className="w-full mt-2 py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-white/5 to-orange-500/20 hover:from-orange-500/30 hover:to-orange-500/30 border border-orange-500/40 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-[0_4px_20px_rgba(249,115,22,0.15)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-extrabold tracking-wider">
                      VIEW FULL MANIFESTO AUDIT
                    </span>
                  </div>
                  <span className="text-[10px] text-orange-400 font-extrabold bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30 flex items-center gap-1">
                    TAP TO EXPAND <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  </span>
                </button>
                <span className="text-[9px] font-mono text-white/40 text-center tracking-wider">
                  Currently showing less • Tap to reveal comparative bad vs good design audits
                </span>
              </div>
            ) : (
              /* EXPANDED STATE: Full comparative audit columns + Show Less toggle */
              <AnimatePresence>
                <div className="flex flex-col gap-4">
                  <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> FULL MANIFESTO UNLOCKED ({manifestoItems.length} TOPICS)
                    </span>
                    <button
                      onClick={() => handleToggleManifesto(false)}
                      className="text-[9px] font-mono bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-white/90 cursor-pointer font-bold flex items-center gap-1"
                    >
                      SHOW LESS <ChevronUp className="w-3 h-3" />
                    </button>
                  </div>

                  <motion.div
                    key={activeManifesto}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4"
                  >
                    {/* Bad Practice Column */}
                    <div className="border border-rose-500/20 bg-rose-950/10 p-5 rounded-2xl">
                      <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] tracking-wider uppercase mb-3">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        COMMON BAD DECISION
                      </div>
                      <h4 className="font-sans text-sm font-bold text-rose-100 mb-2">
                        {activeItem.badPractice.title}
                      </h4>
                      <p className="font-sans text-xs text-white/70 leading-relaxed">
                        {activeItem.badPractice.description}
                      </p>
                      <div className="mt-4 text-[9px] font-mono text-rose-500/80 font-bold">
                        STATUS: REJECTED & PURGED
                      </div>
                    </div>

                    {/* Good Practice Column */}
                    <div className="border border-emerald-500/20 bg-emerald-950/10 p-5 rounded-2xl">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] tracking-wider uppercase mb-3">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        MY RE-ENGINEERED STANDARD
                      </div>
                      <h4 className="font-sans text-sm font-bold text-emerald-100 mb-2">
                        {activeItem.goodPractice.title}
                      </h4>
                      <p className="font-sans text-xs text-white/80 leading-relaxed">
                        {activeItem.goodPractice.description}
                      </p>
                      <div className="mt-4 text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        STATUS: PRODUCTION IMPLEMENTED
                      </div>
                    </div>
                  </motion.div>

                  {/* Bottom Collapse Button */}
                  <div className="mt-1 flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        handleToggleManifesto(false);
                        const el = document.getElementById('manifesto-panel');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
                    >
                      <ChevronUp className="w-4 h-4 text-orange-400" />
                      <span>SHOW LESS (COMPACT VIEW)</span>
                    </button>
                    <span className="text-[9px] font-mono text-white/40 tracking-wider">
                      Viewing {activeItem.topic} audit • Tap to return to compact view
                    </span>
                  </div>
                </div>
              </AnimatePresence>
            )}
          </div>

        </div>

      </div>

      {/* Modals for Photo Editing and Fullscreen CV Preview */}
      <AnimatePresence>
        {/* Read-Only Work Photo Lightbox Modal */}
        {selectedLightboxPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedLightboxPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d12] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between p-4 md:px-6 md:py-4 border-b border-white/10 bg-[#14141a]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded bg-black/70 border border-white/15 text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    {selectedLightboxPhoto.category === 'office' ? (
                      <Building2 className="w-3.5 h-3.5" />
                    ) : selectedLightboxPhoto.category === 'coding' ? (
                      <Code2 className="w-3.5 h-3.5" />
                    ) : (
                      <Rocket className="w-3.5 h-3.5" />
                    )}
                    <span>{selectedLightboxPhoto.category.toUpperCase()} MOMENT</span>
                  </div>
                  {selectedLightboxPhoto.date && (
                    <span className="text-[10px] font-mono text-white/50 hidden sm:inline">
                      {selectedLightboxPhoto.date}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedLightboxPhoto(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Close viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Body with Scroll */}
              <div className="overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
                {/* Full Aspect Image Frame */}
                <div className="relative w-full max-h-[55vh] rounded-2xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center">
                  <img
                    src={selectedLightboxPhoto.imageUrl}
                    alt={selectedLightboxPhoto.title}
                    className="w-full h-auto max-h-[55vh] object-contain"
                  />
                </div>

                {/* Narrative Details - Heading only */}
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-widest block mb-1">
                      {selectedLightboxPhoto.subtitle}
                    </span>
                    <h3 className="font-sans text-xl md:text-2xl font-bold text-white">
                      {selectedLightboxPhoto.title}
                    </h3>
                  </div>

                  {/* Metadata and Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {selectedLightboxPhoto.tags?.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {selectedLightboxPhoto.location && (
                      <div className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-orange-400/80" />
                        <span>{selectedLightboxPhoto.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Read-Only CV Viewer Modal (Upload and Download disabled on frontend) */}
        {isCvModalOpen && (
          <CvModal
            isOpen={isCvModalOpen}
            onClose={() => setIsCvModalOpen(false)}
            cv={cvDoc}
            allowUpload={false}
            allowDownload={false}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
