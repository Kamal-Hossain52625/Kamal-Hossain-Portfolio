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
import { isUserAdmin } from './lib/storage';
import { Zap, Briefcase, Layout, ChevronDown } from 'lucide-react';

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

  // Mobile visibility states for skills, experience, and services
  const [visibleMobileSections, setVisibleMobileSections] = useState<{
    skills: boolean;
    experience: boolean;
    services: boolean;
  }>({
    skills: false,
    experience: false,
    services: false,
  });
  const [showAllProjectsMobile, setShowAllProjectsMobile] = useState<boolean>(false);

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
      setVisibleMobileSections((prev) => ({ ...prev, skills: true }));
    } else if (targetId === 'experience') {
      setVisibleMobileSections((prev) => ({ ...prev, experience: true }));
    } else if (targetId === 'services') {
      setVisibleMobileSections((prev) => ({ ...prev, services: true }));
    } else if (targetId === 'projects') {
      setShowAllProjectsMobile(true);
    }

    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
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

            {/* Immersive Bio narrative & Manifesto Audit */}
            <About />

            {/* Mobile quick-trigger to expand skills if hidden on home */}
            {!visibleMobileSections.skills && (
              <div className="md:hidden max-w-7xl mx-auto px-6 py-4 flex justify-center">
                <button
                  onClick={() => setVisibleMobileSections((prev) => ({ ...prev, skills: true }))}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between font-mono text-xs text-white/70 hover:text-white transition-all shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold tracking-wider text-[11px] uppercase">Tech Stack & Tooling (18+ Stacks)</span>
                  </div>
                  <span className="text-[9px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">TAP TO EXPAND</span>
                </button>
              </div>
            )}

            {/* Skills grid categorizations (hidden on mobile home by default until navbar click or expansion) */}
            <Skills
              isVisibleOnMobile={visibleMobileSections.skills}
              onCloseMobile={() => setVisibleMobileSections((prev) => ({ ...prev, skills: false }))}
            />

            {/* Projects with interactive mockups & Case study modals */}
            <Projects
              showAllOnMobile={showAllProjectsMobile}
              onToggleShowAllMobile={(show) => setShowAllProjectsMobile(show)}
            />

            {/* Generative AI Media Studio (Gemini Flash Image & Veo 3 Video) */}
            <AiCreativeLab />

            {/* Mobile quick-trigger to expand experience if hidden on home */}
            {!visibleMobileSections.experience && (
              <div className="md:hidden max-w-7xl mx-auto px-6 py-4 flex justify-center">
                <button
                  onClick={() => setVisibleMobileSections((prev) => ({ ...prev, experience: true }))}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between font-mono text-xs text-white/70 hover:text-white transition-all shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold tracking-wider text-[11px] uppercase">Career Chronicle & Journey</span>
                  </div>
                  <span className="text-[9px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">TAP TO EXPAND</span>
                </button>
              </div>
            )}

            {/* Career chronicle timeline (hidden on mobile home by default until navbar click or expansion) */}
            <Experience
              isVisibleOnMobile={visibleMobileSections.experience}
              onCloseMobile={() => setVisibleMobileSections((prev) => ({ ...prev, experience: false }))}
            />

            {/* Mobile quick-trigger to expand services if hidden on home */}
            {!visibleMobileSections.services && (
              <div className="md:hidden max-w-7xl mx-auto px-6 py-4 flex justify-center">
                <button
                  onClick={() => setVisibleMobileSections((prev) => ({ ...prev, services: true }))}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between font-mono text-xs text-white/70 hover:text-white transition-all shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Layout className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold tracking-wider text-[11px] uppercase">Architecture & Client Services</span>
                  </div>
                  <span className="text-[9px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">TAP TO EXPAND</span>
                </button>
              </div>
            )}

            {/* Client services with callback wires (hidden on mobile home by default until navbar click or expansion) */}
            <Services
              onSelectService={handleSelectServiceForInquiry}
              isVisibleOnMobile={visibleMobileSections.services}
              onCloseMobile={() => setVisibleMobileSections((prev) => ({ ...prev, services: false }))}
            />

            {/* Industry Certifications credentials */}
            <Certifications />

            {/* Dynamic Quote slider testimonial reviews */}
            <Testimonials />

            {/* Validated message transmitter channels */}
            <Contact inquiryTopic={inquiryTopic} />
          </main>

          {/* Brand double-height signature and clock */}
          <Footer onNavigateSection={handleNavigateSection} />
        </motion.div>
      )}
    </>
  );
}
