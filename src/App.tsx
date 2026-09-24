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
          <Navbar />

          {/* Section Viewports Block */}
          <main>
            {/* Cinematic Hero Segment */}
            <Hero />

            {/* Immersive Bio narrative & Manifesto Audit */}
            <About />

            {/* Skills grid categorizations */}
            <Skills />

            {/* Projects with interactive mockups & Case study modals */}
            <Projects />

            {/* Generative AI Media Studio (Gemini Flash Image & Veo 3 Video) */}
            <AiCreativeLab />

            {/* Career chronicle timeline */}
            <Experience />

            {/* Client services with callback wires */}
            <Services onSelectService={handleSelectServiceForInquiry} />

            {/* Industry Certifications credentials */}
            <Certifications />

            {/* Dynamic Quote slider testimonial reviews */}
            <Testimonials />

            {/* Validated message transmitter channels */}
            <Contact inquiryTopic={inquiryTopic} />
          </main>

          {/* Brand double-height signature and clock */}
          <Footer />
        </motion.div>
      )}
    </>
  );
}
