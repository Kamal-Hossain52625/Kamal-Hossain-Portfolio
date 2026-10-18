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
  ChevronLeft,
  ChevronRight,
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
  Maximize2,
  CheckCircle2,
  Database,
  Server,
  Zap,
  Award,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { getStoredProfileImage, subscribeToProfileImage, isUserAdmin } from '../lib/storage';
import {
  getStoredAboutPhotos,
  subscribeToAboutPhotos,
  getStoredCvDocument,
  subscribeToCvDocument
} from '../lib/aboutStorage';
import { getStoredCertifications, subscribeToCertifications } from '../lib/certificatesStorage';
import { AboutWorkPhoto, CvDocument, Certification } from '../types';
import CvModal from './CvModal';
import CertificateViewerModal from './CertificateViewerModal';

// Authentic SVG Brand Logos for Section 01.5
function LaravelBrandLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path
        fill="#FF2D20"
        d="M109.8 33.4L80.9 16.7c-1.8-1-4-1-5.8 0L24.6 46.1c-1.8 1-2.9 3-2.9 5v45.9c0 2 1.1 3.9 2.9 5l20.4 11.8c1.8 1 4 1 5.8 0l59-34.1c1.8-1 2.9-3 2.9-5V38.4c0-2-1.1-3.9-2.9-5zM47.9 105.7l-18.4-10.6V56.2l18.4 10.6v38.9zm3.5-44.9l-18.4-10.6 44.9-25.9 18.4 10.6-44.9 25.9zm53.4 19.3l-50 28.9V70.1l50-28.9v40.9z"
      />
    </svg>
  );
}

function ReactBrandLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 115 102" className={className} fill="none">
      <ellipse cx="57.5" cy="51" rx="52" ry="20" stroke="#61DAFB" strokeWidth="6" />
      <ellipse cx="57.5" cy="51" rx="52" ry="20" stroke="#61DAFB" strokeWidth="6" transform="rotate(60 57.5 51)" />
      <ellipse cx="57.5" cy="51" rx="52" ry="20" stroke="#61DAFB" strokeWidth="6" transform="rotate(120 57.5 51)" />
      <circle cx="57.5" cy="51" r="10" fill="#61DAFB" />
    </svg>
  );
}

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
  isMasteryExpanded: externalMasteryExpanded,
  onToggleMasteryExpand,
}: {
  isExpandedOnMobile?: boolean;
  onToggleExpandMobile?: (expanded: boolean) => void;
  isMasteryExpanded?: boolean;
  onToggleMasteryExpand?: (expanded: boolean) => void;
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

  // Dual-Pillar Mastery (Backend Laravel & Frontend React) collapse / expand state: default to FALSE (normally hidden)
  const [internalMasteryExpanded, setInternalMasteryExpanded] = useState<boolean>(false);
  const isMasteryExpanded = externalMasteryExpanded !== undefined ? externalMasteryExpanded : internalMasteryExpanded;

  useEffect(() => {
    if (externalMasteryExpanded !== undefined) {
      setInternalMasteryExpanded(externalMasteryExpanded);
    }
  }, [externalMasteryExpanded]);

  const handleToggleMastery = (expanded: boolean) => {
    setInternalMasteryExpanded(expanded);
    if (onToggleMasteryExpand) {
      onToggleMasteryExpand(expanded);
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

  // Personal Certifications (PDF, JPEG, PNG) - synced from storage/cloud
  const [aboutCertifications, setAboutCertifications] = useState<Certification[]>(getStoredCertifications);
  const [selectedCertViewer, setSelectedCertViewer] = useState<Certification | null>(null);

  // Mobile carousel slide state for Work Photos
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);

  const handlePrevSlide = () => {
    setMobileSlideIndex((prev) => (prev > 0 ? prev - 1 : workPhotos.length - 1));
  };

  const handleNextSlide = () => {
    setMobileSlideIndex((prev) => (prev < workPhotos.length - 1 ? prev + 1 : 0));
  };

  // Mobile carousel slide state for Section 01.5 (Dual-Pillar: Laravel Backend & React Frontend)
  const [pillarSlideIndex, setPillarSlideIndex] = useState<0 | 1>(0);

  const handlePrevPillarSlide = () => {
    setPillarSlideIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNextPillarSlide = () => {
    setPillarSlideIndex((prev) => (prev === 1 ? 0 : 1));
  };

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

    const unsubCerts = subscribeToCertifications((certs) => {
      setAboutCertifications(certs);
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

    const handleCertsUpdate = (e: any) => {
      if (e.detail) setAboutCertifications(e.detail);
      else setAboutCertifications(getStoredCertifications());
    };

    window.addEventListener('portfolio_profile_image_updated', handlePhotoUpdate);
    window.addEventListener('portfolio_about_photos_updated', handlePhotosUpdate);
    window.addEventListener('portfolio_cv_updated', handleCvUpdate);
    window.addEventListener('portfolio_certifications_updated', handleCertsUpdate);

    return () => {
      unsubCloud();
      unsubPhotos();
      unsubCv();
      unsubCerts();
      window.removeEventListener('portfolio_profile_image_updated', handlePhotoUpdate);
      window.removeEventListener('portfolio_about_photos_updated', handlePhotosUpdate);
      window.removeEventListener('portfolio_cv_updated', handleCvUpdate);
      window.removeEventListener('portfolio_certifications_updated', handleCertsUpdate);
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
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
              01 // ARCHITECTURAL PHILOSOPHY
            </span>
            <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
              FULL-STACK SPECIALIST
            </span>
          </div>
          <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
            Laravel Backend & React Frontend Synergy
          </h2>
        </div>

        {/* Primary Story & Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Block: Bio narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-sans text-xl md:text-2xl font-bold text-white tracking-wide leading-relaxed">
              Hello, I am Kamal. I bridge the gap between heavy enterprise backend architecture and responsive, intuitive user interfaces.
            </h3>
            
            <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed tracking-wide font-light">
              My engineering core is anchored in two industry-defining technologies: <strong className="text-red-400 font-semibold">Laravel for enterprise backend infrastructure & API design</strong>, and <strong className="text-sky-300 font-semibold">React for modular, reactive, and pixel-perfect client experiences</strong>.
            </p>
            
            <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed tracking-wide font-light">
              I avoid sluggish monolithic templates. Instead, I build decoupled systems: a rock-solid, secure Laravel backend (leveraging Eloquent ORM, optimized MySQL/PostgreSQL schemas, queues, and Redis caching) communicating seamlessly with an ultra-fast React & TypeScript frontend that renders instantaneously with fluid spring micro-interactions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 font-mono">
              <div className="p-4 border border-red-500/25 rounded-2xl bg-gradient-to-br from-red-950/20 via-white/5 to-black/40 backdrop-blur-md">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-[10px] font-extrabold uppercase tracking-wider">BACKEND EXPERTISE</span>
                </div>
                <span className="text-white text-xs font-bold block">Laravel 11 & PHP 8.3</span>
                <span className="text-white/50 text-[10px] mt-0.5 block">RESTful APIs • Eloquent • MySQL • Redis</span>
              </div>
              <div className="p-4 border border-sky-400/25 rounded-2xl bg-gradient-to-br from-sky-950/20 via-white/5 to-black/40 backdrop-blur-md">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-sky-300 text-[10px] font-extrabold uppercase tracking-wider">FRONTEND EXPERTISE</span>
                </div>
                <span className="text-white text-xs font-bold block">React 19 & TypeScript</span>
                <span className="text-white/50 text-[10px] mt-0.5 block">SPAs • Tailwind CSS • Motion • Vite</span>
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
              <div className="flex flex-col gap-3 font-sans">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-xs text-white/40">Name</span>
                  <span className="text-xs font-semibold text-white">Kamal Hossain</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-xs text-white/40">Primary Specialization</span>
                  <span className="text-xs font-bold text-orange-400">Laravel & React Architect</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-xs text-white/40">Core Stack</span>
                  <span className="text-xs font-mono text-white/80">Laravel 11 • React 19 • MySQL</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-xs text-white/40">Available Email</span>
                  <a href="mailto:kamalhossainm5443@gmail.com" className="text-xs font-semibold text-white hover:text-orange-400 transition-colors">
                    kamalhossainm5443@gmail.com
                  </a>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-xs text-white/40">Clearance & Status</span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                    ● VERIFIED ACTIVE ARCHITECT
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 01.5 // CORE DUAL-PILLAR SPECIALIZATION: BACKEND & FRONTEND */}
        {/* ========================================================= */}
        <div id="mastery-section" className="mb-24">
          {!isMasteryExpanded ? (
            /* COLLAPSED / NORMALLY HIDDEN STATE */
            <div className="relative border border-white/10 hover:border-orange-500/40 rounded-3xl bg-gradient-to-r from-red-950/20 via-white/5 to-sky-950/20 backdrop-blur-2xl p-6 md:p-8 shadow-2xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
                      01.5 // CORE DUAL-PILLAR ARCHITECTURE
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
                      NORMALLY COLLAPSED
                    </span>
                  </div>

                  <h3 className="font-sans text-2xl md:text-3xl text-white font-bold tracking-tight uppercase italic flex items-center gap-3">
                    <span>Backend Laravel & Frontend React Mastery</span>
                  </h3>

                  <p className="text-white/60 text-xs md:text-sm max-w-2xl leading-relaxed">
                    How I architect modern full-stack systems: pairing Laravel’s battle-tested server-side power with React’s ultra-fluid client reactivity. Tap to expand the complete technical breakdown.
                  </p>

                  {/* Quick Tech Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Laravel 11 Backend (98%)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-300 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      React 19 Frontend (98%)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 font-mono text-[10px]">
                      Full-Stack REST Architecture
                    </span>
                  </div>
                </div>

                {/* Tactile High-Conversion Expand Button */}
                <button
                  onClick={() => handleToggleMastery(true)}
                  className="w-full lg:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:to-orange-700 text-black font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(249,115,22,0.25)] hover:shadow-[0_6px_30px_rgba(249,115,22,0.4)] active:scale-[0.98] transition-all cursor-pointer group shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                  <span>EXPAND MASTERY SECTION</span>
                  <ChevronDown className="w-4 h-4 text-black animate-bounce" />
                </button>
              </div>
            </div>
          ) : (
            /* EXPANDED / VISIBLE STATE */
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
                        01.5 // CORE DUAL-PILLAR ARCHITECTURE
                      </span>
                      <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
                        PRODUCTION-TESTED
                      </span>
                    </div>
                    <h3 className="font-sans text-2xl md:text-4xl text-white font-bold tracking-tight uppercase italic">
                      Backend Laravel & Frontend React Mastery
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm max-w-2xl leading-relaxed">
                      How I architect modern full-stack systems: pairing Laravel’s battle-tested server-side power with React’s ultra-fluid client reactivity.
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleMastery(false)}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-orange-400" />
                    <span>COLLAPSE MASTERY</span>
                  </button>
                </div>

                {/* 1. Desktop View: 2-Card Grid (Hidden on Mobile) */}
                <div className="hidden md:grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* PILLAR 1: BACKEND (LARAVEL & PHP) */}
            <div className="relative group border border-red-500/30 hover:border-red-500/60 rounded-3xl bg-gradient-to-br from-red-950/20 via-[#0e0e14]/90 to-black/95 backdrop-blur-2xl p-7 md:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-red-500/20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      <LaravelBrandLogo className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] font-extrabold text-red-400 uppercase tracking-widest">
                          BACKEND CORE
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                          98% PROFICIENCY
                        </span>
                      </div>
                      <h4 className="font-sans text-xl md:text-2xl font-bold text-white tracking-wide">
                        Laravel 11 & PHP 8.3
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-6 font-light">
                  Formulating scalable, secure, and low-latency RESTful APIs, transactional relational databases, and asynchronous task workers.
                </p>

                {/* Key Capabilities List */}
                <div className="flex flex-col gap-3.5 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">RESTful API & Resource Engineering</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Clean API resource controllers, automated Form Request validation, rate limiting, and standardized JSON schemas.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">Eloquent ORM & Database Mastery</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Complex polymorphic relations, eager loading to prevent N+1 queries, schema migrations, and indexing on MySQL/PostgreSQL.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">Authentication & API Security</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Laravel Sanctum & JWT token management, Role-Based Access Control (RBAC), CSRF protection, and SQL sanitization.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">Queues, Caching & Cron Scheduling</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Redis cache layer, asynchronous queue jobs, automated scheduled CRON tasks, and external payment webhook listeners.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-5 border-t border-red-500/15 flex flex-wrap gap-1.5">
                {['Laravel 11', 'PHP 8.3', 'Eloquent ORM', 'RESTful APIs', 'MySQL', 'PostgreSQL', 'Redis', 'Sanctum / JWT', 'Queues & Jobs'].map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* PILLAR 2: FRONTEND (REACT & TYPESCRIPT) */}
            <div className="relative group border border-sky-400/30 hover:border-sky-400/60 rounded-3xl bg-gradient-to-br from-sky-950/20 via-[#0e0e14]/90 to-black/95 backdrop-blur-2xl p-7 md:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-sky-400/20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                      <ReactBrandLogo className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">
                          FRONTEND CORE
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
                          98% PROFICIENCY
                        </span>
                      </div>
                      <h4 className="font-sans text-xl md:text-2xl font-bold text-white tracking-wide">
                        React 19 & TypeScript
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-6 font-light">
                  Crafting modern, ultra-responsive client web applications with zero cumulative layout shift and tactile micro-interactions.
                </p>

                {/* Key Capabilities List */}
                <div className="flex flex-col gap-3.5 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">Component-Driven Architecture</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Modular, reusable, and type-safe components built with React 19, strict TypeScript interfaces, and pristine structure.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">Reactive State & Seamless API Sync</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Custom hooks, client-side caching, optimistic UI updates, debounced search filtering, and resilient error boundaries.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">Responsive Tailwind Design Systems</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Pixel-perfect styling across all mobile, tablet, and desktop viewports with bespoke glassmorphic dark palettes.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs md:text-sm block">Tactile Motion & Spring Micro-Interactions</strong>
                      <span className="text-white/60 text-xs leading-relaxed">
                        Fluid 60 FPS transitions via Motion, smooth carousels, SVG chart visualizations, and interactive canvas graphics.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-5 border-t border-sky-400/15 flex flex-wrap gap-1.5">
                {['React 19', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite', 'Custom Hooks', 'Single Page Apps', 'Responsive UI'].map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-300 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* 2. Mobile View: Interactive Slide / Carousel System (Visible only on Mobile) */}
          <div className="block md:hidden">
            <div className="flex flex-col gap-4">
              {/* Top Mobile Slide Navigator Toolbar */}
              <div className="flex items-center justify-between px-2 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-md">
                {/* Tab Switcher Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
                  <button
                    onClick={() => setPillarSlideIndex(0)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      pillarSlideIndex === 0
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${pillarSlideIndex === 0 ? 'bg-red-500 animate-pulse' : 'bg-white/30'}`} />
                    Laravel
                  </button>

                  <button
                    onClick={() => setPillarSlideIndex(1)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      pillarSlideIndex === 1
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${pillarSlideIndex === 1 ? 'bg-sky-400 animate-pulse' : 'bg-white/30'}`} />
                    React
                  </button>
                </div>

                {/* Arrow Navigation */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevPillarSlide}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-orange-500/20 border border-white/15 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    aria-label="Previous pillar slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextPillarSlide}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-orange-500/20 border border-white/15 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    aria-label="Next pillar slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Swipeable Slide Card */}
              <div className="overflow-hidden relative touch-pan-y">
                <AnimatePresence mode="wait">
                  {pillarSlideIndex === 0 ? (
                    <motion.div
                      key="pillar-slide-laravel"
                      initial={{ opacity: 0, x: 35 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -35 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, { offset, velocity }) => {
                        if (offset.x < -35 || velocity.x < -200) {
                          setPillarSlideIndex(1);
                        }
                      }}
                      className="border border-red-500/35 rounded-3xl bg-gradient-to-br from-red-950/25 via-[#0e0e14]/95 to-black/95 backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b border-red-500/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                              <LaravelBrandLogo className="w-7 h-7" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-mono text-[9px] font-extrabold text-red-400 uppercase tracking-widest">
                                  BACKEND CORE
                                </span>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                                  98%
                                </span>
                              </div>
                              <h4 className="font-sans text-lg font-bold text-white tracking-wide">
                                Laravel 11 & PHP 8.3
                              </h4>
                            </div>
                          </div>
                        </div>

                        <p className="text-white/70 text-xs leading-relaxed mb-5 font-light">
                          Formulating scalable, secure, and low-latency RESTful APIs, relational databases, and asynchronous task workers.
                        </p>

                        {/* Capabilities */}
                        <div className="flex flex-col gap-3 mb-5">
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">RESTful API & Resource Engineering</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Clean API resource controllers, Form Request validation, rate limiting & JSON schemas.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">Eloquent ORM & Database Mastery</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Complex relations, eager loading (no N+1 queries), migrations & indexing on MySQL/PostgreSQL.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">Authentication & API Security</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Laravel Sanctum & JWT token management, RBAC, CSRF protection & SQL sanitization.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">Queues, Caching & Cron Scheduling</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Redis cache layer, asynchronous queue jobs, automated scheduled CRON tasks & webhook listeners.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="pt-4 border-t border-red-500/15 flex flex-wrap gap-1.5">
                        {['Laravel 11', 'PHP 8.3', 'Eloquent ORM', 'RESTful APIs', 'MySQL', 'PostgreSQL', 'Redis', 'Sanctum'].map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pillar-slide-react"
                      initial={{ opacity: 0, x: 35 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -35 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, { offset, velocity }) => {
                        if (offset.x > 35 || velocity.x > 200) {
                          setPillarSlideIndex(0);
                        }
                      }}
                      className="border border-sky-400/35 rounded-3xl bg-gradient-to-br from-sky-950/25 via-[#0e0e14]/95 to-black/95 backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b border-sky-400/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                              <ReactBrandLogo className="w-7 h-7" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-mono text-[9px] font-extrabold text-sky-400 uppercase tracking-widest">
                                  FRONTEND CORE
                                </span>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
                                  98%
                                </span>
                              </div>
                              <h4 className="font-sans text-lg font-bold text-white tracking-wide">
                                React 19 & TypeScript
                              </h4>
                            </div>
                          </div>
                        </div>

                        <p className="text-white/70 text-xs leading-relaxed mb-5 font-light">
                          Crafting modern, ultra-responsive client web applications with zero cumulative layout shift and tactile micro-interactions.
                        </p>

                        {/* Capabilities */}
                        <div className="flex flex-col gap-3 mb-5">
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">Component-Driven Architecture</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Modular, reusable, and type-safe components built with React 19 and strict TypeScript interfaces.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">Reactive State & Seamless API Sync</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Custom hooks, client-side caching, optimistic UI updates, debounced search & error boundaries.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">Responsive Tailwind Design Systems</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Pixel-perfect styling across all viewports with luxury glassmorphic dark palettes.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-white text-xs block">Tactile Motion & Micro-Interactions</strong>
                              <span className="text-white/60 text-[11px] leading-relaxed">
                                Fluid 60 FPS transitions via Motion, smooth carousels, SVG charts & canvas graphics.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="pt-4 border-t border-sky-400/15 flex flex-wrap gap-1.5">
                        {['React 19', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite', 'Custom Hooks', 'SPAs', 'Responsive UI'].map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-400/20 text-sky-300 font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Navigation Dots & Swipe Hint */}
              <div className="flex flex-col items-center gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPillarSlideIndex(0)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      pillarSlideIndex === 0
                        ? 'w-7 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label="Go to Laravel Backend slide"
                  />
                  <button
                    onClick={() => setPillarSlideIndex(1)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      pillarSlideIndex === 1
                        ? 'w-7 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label="Go to React Frontend slide"
                  />
                </div>
                <span className="text-[10px] font-mono text-white/40 tracking-wider">
                  ← Swipe left/right or tap buttons to slide →
                </span>
              </div>
            </div>
          </div>

          {/* Full-Stack Integration Connector Ribbon (No Gemini/Sparkles logo) */}
          <div className="mt-8 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-red-950/20 via-white/5 to-sky-950/20 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest block">
                  THE FULL-STACK CONNECTION
                </span>
                <p className="font-sans text-xs md:text-sm text-white/80">
                  Laravel provides the bulletproof database & API foundation; React delivers the instantaneous client application.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-white/60 shrink-0">
              <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">Laravel REST API</span>
              <span>↔</span>
              <span className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-300">React Client SPA</span>
            </div>
          </div>

          {/* Bottom Collapse Button */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                handleToggleMastery(false);
                const el = document.getElementById('mastery-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white/80 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
            >
              <ChevronUp className="w-4 h-4 text-orange-400" />
              <span>COLLAPSE MASTERY (HIDE SECTION)</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    )}
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
              <span>{workPhotos.length} VERIFIED WORK EXPERIENCES</span>
            </div>
          </div>

          {/* 1. Desktop View: 3-Card Grid (Hidden on Mobile) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* 2. Mobile View: Interactive Carousel / Slide System (Visible only on Mobile) */}
          <div className="block md:hidden">
            {workPhotos.length > 0 && (() => {
              const currentMobilePhoto = workPhotos[mobileSlideIndex] || workPhotos[0];
              const MobileCatIcon =
                currentMobilePhoto.category === 'office'
                  ? Building2
                  : currentMobilePhoto.category === 'coding'
                  ? Code2
                  : Rocket;

              const mobileBadge =
                currentMobilePhoto.category === 'office'
                  ? 'OFFICE WORK & COLLABORATION'
                  : currentMobilePhoto.category === 'coding'
                  ? 'DEEP CODING CRAFTSMANSHIP'
                  : 'NEW PROJECT INNOVATION';

              return (
                <div className="flex flex-col gap-4">
                  {/* Top Mobile Slide Navigator Toolbar */}
                  <div className="flex items-center justify-between px-2 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                        MOMENT {mobileSlideIndex + 1} / {workPhotos.length}
                      </span>
                    </div>

                    {/* Previous / Next Arrow Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevSlide}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-orange-500/20 border border-white/15 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextSlide}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-orange-500/20 border border-white/15 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Swipeable Slide Card */}
                  <div className="overflow-hidden relative touch-pan-y">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentMobilePhoto.id || mobileSlideIndex}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, { offset, velocity }) => {
                          if (offset.x < -40 || velocity.x < -250) {
                            handleNextSlide();
                          } else if (offset.x > 40 || velocity.x > 250) {
                            handlePrevSlide();
                          }
                        }}
                        onClick={() => setSelectedLightboxPhoto(currentMobilePhoto)}
                        className="group relative border border-white/15 hover:border-orange-500/40 rounded-2xl bg-white/5 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing"
                      >
                        {/* Picture Frame */}
                        <div className="relative h-56 w-full rounded-xl overflow-hidden bg-black/60 mb-5 border border-white/10 select-none">
                          <img
                            src={currentMobilePhoto.imageUrl}
                            alt={currentMobilePhoto.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-black/30 pointer-events-none" />

                          {/* Top-Left Category Badge */}
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5 z-10 shadow-lg">
                            <MobileCatIcon className="w-3.5 h-3.5 text-orange-400" />
                            <span>{mobileBadge}</span>
                          </div>

                          {/* Top-Right View Indicator */}
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-orange-400 border border-orange-500/40 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-xl z-10">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Tap to View</span>
                          </div>

                          {/* Bottom Status Tag */}
                          <div className="absolute bottom-3 left-3 bg-[#0c0c0f]/90 border border-white/10 px-2.5 py-0.5 rounded text-[8px] font-mono tracking-widest text-white/70 flex items-center gap-1.5 z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {currentMobilePhoto.date || 'ACTIVE RECORD'}
                          </div>
                        </div>

                        {/* Narrative & Details */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">
                            {currentMobilePhoto.subtitle}
                          </span>
                          <h4 className="font-sans text-lg font-bold text-white">
                            {currentMobilePhoto.title}
                          </h4>

                          {/* Tag Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-1 pt-2.5 border-t border-white/5">
                            {currentMobilePhoto.tags?.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Location Footer */}
                          {currentMobilePhoto.location && (
                            <div className="mt-1 text-[9px] font-mono text-white/40 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-orange-400/70" />
                              <span>{currentMobilePhoto.location}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom Navigation Dots & Swipe Hint */}
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      {workPhotos.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setMobileSlideIndex(dotIdx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            dotIdx === mobileSlideIndex
                              ? 'w-7 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                              : 'w-2 bg-white/20 hover:bg-white/40'
                          }`}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-white/40 tracking-wider">
                      ← Swipe left/right or tap arrows to slide →
                    </span>
                  </div>
                </div>
              );
            })()}
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

        {/* ========================================================= */}
        {/* 03.5 // VERIFIED PERSONAL CERTIFICATES (PDF, JPEG, PNG)   */}
        {/* ========================================================= */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase block mb-2">
                03.5 // VERIFIED CREDENTIALS & CERTIFICATIONS
              </span>
              <h3 className="font-sans text-2xl md:text-4xl text-white font-bold tracking-tight uppercase italic">
                Personal Certificates ({aboutCertifications.length})
              </h3>
              <p className="text-white/50 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
                Authentic certifications in Laravel Backend, React Frontend, Cloud & System Architecture. Uploaded and managed from backend (PDF, JPEG, PNG).
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isUserAdmin() && (
                <a
                  href="/admin"
                  className="px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 shadow-md"
                  title="Upload, change, or edit personal certificates in Admin Dashboard"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>MANAGE IN BACKEND</span>
                </a>
              )}
            </div>
          </div>

          {/* Grid of Personal Certificates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutCertifications.map((cert) => {
              const isPdf =
                cert.fileType === 'pdf' ||
                cert.fileDataUrl?.startsWith('data:application/pdf') ||
                cert.fileName?.toLowerCase().endsWith('.pdf');
              const hasFile = Boolean(cert.fileDataUrl);

              return (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCertViewer(cert)}
                  className="group relative border border-white/10 hover:border-orange-500/40 rounded-2xl bg-white/5 hover:bg-white/[0.08] backdrop-blur-xl p-5 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 mb-3.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <Award className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-wider truncate">
                          {cert.issuer}
                        </span>
                      </div>
                      <span
                        className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                          isPdf
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : hasFile
                            ? 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                            : 'bg-white/10 text-white/50 border-white/10'
                        }`}
                      >
                        {cert.fileType?.toUpperCase() || (hasFile ? 'DOCUMENT' : 'CREDENTIAL')}
                      </span>
                    </div>

                    {/* Document Preview Frame */}
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/60 mb-3.5 border border-white/10 flex items-center justify-center select-none group-hover:border-orange-500/30 transition-all">
                      {hasFile ? (
                        isPdf ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center">
                            <FileText className="w-9 h-9 text-orange-400 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-mono font-bold text-white truncate max-w-[180px]">
                              {cert.fileName || 'PDF Certificate'}
                            </span>
                            <span className="text-[9px] font-mono text-white/40 mt-0.5">
                              {cert.fileSize || 'PDF Document'}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={cert.fileDataUrl}
                            alt={cert.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          />
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center text-white/40">
                          <Award className="w-8 h-8 mb-1 opacity-50" />
                          <span className="text-xs font-mono">Verified Credential</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-orange-500 text-black font-mono text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-all scale-90 group-hover:scale-100">
                          <Eye className="w-3.5 h-3.5" /> Preview Document
                        </span>
                      </div>
                    </div>

                    <h4 className="font-sans text-sm font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-2 leading-snug mb-2">
                      {cert.title}
                    </h4>

                    <div className="flex flex-col gap-0.5 font-mono text-[9px] text-white/40">
                      <div>DATE: <span className="text-white/60">{cert.date}</span></div>
                      <div>ID: <span className="text-white/60">{cert.credentialId}</span></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> SECURE_RECORD
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCertViewer(cert);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-orange-500/20 text-white/70 hover:text-orange-300 border border-white/10 hover:border-orange-500/30 text-[9px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>VIEW</span>
                    </button>
                  </div>
                </div>
              );
            })}
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

        {/* Certificate Lightbox Viewer Modal (PDF, JPEG, PNG) */}
        {selectedCertViewer && (
          <CertificateViewerModal
            isOpen={Boolean(selectedCertViewer)}
            onClose={() => setSelectedCertViewer(null)}
            cert={selectedCertViewer}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
