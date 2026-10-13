/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import AiCreativeLab from './components/AiCreativeLab';
import Experience from './components/Experience';
import Services from './components/Services';
import Certifications from './components/Certifications';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ScrollDownButton from './components/ScrollDownButton';
import { isUserAdmin } from './lib/storage';
import { Zap, Briefcase, Layout, Award, ChevronDown } from 'lucide-react';

function getCurrentRoute(): 'portfolio' | 'admin' | 'login' {
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (pathname.includes('/admin') || hash === '#admin') return 'admin';
  if (pathname.includes('/login') || hash === '#login') return 'login';
  return 'portfolio';
}

export default function App() {
  const [route, setRoute] = useState<'portfolio' | 'admin' | 'login'>(getCurrentRoute);
  const [isAdmin, setIsAdmin] = useState<boolean>(isUserAdmin);
  const [loading, setLoading] = useState(() => getCurrentRoute() === 'portfolio');
  const [inquiryTopic, setInquiryTopic] = useState('');

  // Visibility states for secondary / LESS VIEW sections
  // Default is FALSE (display: none on home page so users can scroll to bottom quickly)
  // When clicked from navbar or launcher, the selected section becomes visible (display: block)
  const [visibleSections, setVisibleSections] = useState<{
    skills: boolean;
    experience: boolean;
    services: boolean;
    certifications: boolean;
  }>({
    skills: false,
    experience: false,
    services: false,
    certifications: false,
  });

  const [showAllProjectsMobile, setShowAllProjectsMobile] = useState<boolean>(false);
  const [expandCertificationsMobile, setExpandCertificationsMobile] = useState<boolean>(true);
  const [expandManifestoMobile, setExpandManifestoMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getCurrentRoute());
      setIsAdmin(isUserAdmin());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('portfolio_auth_changed', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('portfolio_auth_changed', handleRouteChange);
    };
  }, []);

  // Listen to hash on mount to unhide target section if direct linked
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (['skills', 'experience', 'services', 'certifications', 'certs'].includes(hash)) {
        handleNavigateSection(window.location.hash);
      }
    }
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setRoute(getCurrentRoute());
    setIsAdmin(isUserAdmin());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setInquiryTopic(serviceTitle);
  };

  // Handler when clicking navbar or external section links
  const handleNavigateSection = (href: string) => {
    const targetId = href.replace('#', '').toLowerCase();

    if (targetId === 'skills') {
      setVisibleSections((prev) => ({ ...prev, skills: true }));
    } else if (targetId === 'experience') {
      setVisibleSections((prev) => ({ ...prev, experience: true }));
    } else if (targetId === 'services') {
      setVisibleSections((prev) => ({ ...prev, services: true }));
    } else if (targetId === 'certifications' || targetId === 'certs') {
      setVisibleSections((prev) => ({ ...prev, certifications: true }));
      setExpandCertificationsMobile(true);
    } else if (targetId === 'projects') {
      setShowAllProjectsMobile(true);
    } else if (targetId === 'manifesto' || targetId === 'manifesto-panel') {
      setExpandManifestoMobile(true);
    }

    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCloseSection = (sec: 'skills' | 'experience' | 'services' | 'certifications') => {
    setVisibleSections((prev) => ({ ...prev, [sec]: false }));
  };

  // If visiting /admin or /login
  if (route === 'admin' || route === 'login') {
    return (
      <div className="relative min-h-screen bg-[#070709] font-sans text-white overflow-x-hidden selection:bg-orange-500/20">
        <CustomCursor />
        {isAdmin ? (
          <AdminDashboard
            onBackToPortfolio={() => navigateTo('/')}
            onLogout={() => navigateTo('/login')}
          />
        ) : (
          <AdminLogin
            onSuccess={() => navigateTo('/admin')}
            onBackToPortfolio={() => navigateTo('/')}
          />
        )}
      </div>
    );
  }

  // Otherwise, render Public Portfolio
  return (
    <>
      {/* Luxury Preloader */}
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          id="app-viewport"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative min-h-screen bg-luxury-black font-sans text-white overflow-x-hidden selection:bg-orange-500/20"
        >
          {/* Custom Interactive Glow Cursor Blob */}
          <CustomCursor />

          {/* Core Sticky Header menu */}
          <Navbar onNavigateSection={handleNavigateSection} />

          {/* Section Viewports Block */}
          <main>
            {/* Cinematic Hero Segment */}
            <Hero />

            {/* Immersive Bio narrative & Manifesto Audit (tap to expand on mobile) */}
            <About
              isExpandedOnMobile={expandManifestoMobile}
              onToggleExpandMobile={(expanded) => setExpandManifestoMobile(expanded)}
            />

            {/* Skills grid (display: none on home page by default, viewed when clicked in Navbar) */}
            <Skills
              isVisible={visibleSections.skills}
              onClose={() => handleCloseSection('skills')}
            />

            {/* Projects with interactive mockups & Case study modals (Core Home Feature) */}
            <Projects
              showAllOnMobile={showAllProjectsMobile}
              onToggleShowAllMobile={(show) => setShowAllProjectsMobile(show)}
            />

            {/* Generative AI Media Studio (Gemini Flash Image & Code Lab) */}
            <AiCreativeLab />

            {/* Career chronicle timeline (display: none on home page by default, viewed when clicked in Navbar) */}
            <Experience
              isVisible={visibleSections.experience}
              onClose={() => handleCloseSection('experience')}
            />

            {/* Client services with callback wires (display: none on home page by default, viewed when clicked in Navbar) */}
            <Services
              onSelectService={handleSelectServiceForInquiry}
              isVisible={visibleSections.services}
              onClose={() => handleCloseSection('services')}
            />

            {/* Industry Certifications credentials (display: none on home page by default, viewed when clicked in Navbar) */}
            <Certifications
              isVisible={visibleSections.certifications}
              onClose={() => handleCloseSection('certifications')}
              isExpandedOnMobile={expandCertificationsMobile}
              onToggleExpandMobile={(expanded) => setExpandCertificationsMobile(expanded)}
            />

            {/* Ultra-compact quick-launcher strip (Minimal height, allows one-tap expand on-demand while scrolling) */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 border-t border-white/5 my-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-white/50 font-mono text-[10px] uppercase font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>EXPAND ON-DEMAND ARCHIVES:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleNavigateSection('#skills')}
                  className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    visibleSections.skills
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <Zap className="w-3 h-3 text-orange-400" />
                  Tech Stack {visibleSections.skills ? '(Visible)' : ''}
                </button>

                <button
                  onClick={() => handleNavigateSection('#experience')}
                  className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    visibleSections.experience
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <Briefcase className="w-3 h-3 text-blue-400" />
                  Experience {visibleSections.experience ? '(Visible)' : ''}
                </button>

                <button
                  onClick={() => handleNavigateSection('#services')}
                  className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    visibleSections.services
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <Layout className="w-3 h-3 text-purple-400" />
                  Services {visibleSections.services ? '(Visible)' : ''}
                </button>

                <button
                  onClick={() => handleNavigateSection('#certifications')}
                  className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    visibleSections.certifications
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <Award className="w-3 h-3 text-orange-400" />
                  Certifications {visibleSections.certifications ? '(Visible)' : ''}
                </button>
              </div>
            </div>

            {/* Dynamic Quote slider testimonial reviews */}
            <Testimonials />

            {/* Validated message transmitter channels */}
            <Contact inquiryTopic={inquiryTopic} />
          </main>

          {/* Brand double-height signature and clock */}
          <Footer onNavigateSection={handleNavigateSection} />

          {/* Floating Scroll-Down action button with up-down bobbing animation */}
          <ScrollDownButton />
        </motion.div>
      )}
    </>
  );
}
