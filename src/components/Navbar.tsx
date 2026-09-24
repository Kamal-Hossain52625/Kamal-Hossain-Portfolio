/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

const navLinks = [
  { label: 'HOME', href: '#hero' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'SERVICES', href: '#services' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      try {
        const formatter = new Intl.DateTimeFormat('en-US', options);
        setTimeStr(formatter.format(now));
      } catch (e) {
        setTimeStr(now.toLocaleTimeString());
      }
    };

    updateTime();
    const timerInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    // Scroll state for blur styling
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    // Intersection observer for section tracking
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Trigger near middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Track sections
    navLinks.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });

    // Also track hero
    const heroSection = document.querySelector('#hero');
    if (heroSection) observer.observe(heroSection);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        id="navbar"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 font-sans ${
          isScrolled 
            ? 'bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Brand Signifier */}
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
            className="flex flex-col select-none group"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-xl md:text-2xl font-bold text-white tracking-tighter group-hover:text-orange-400 transition-colors">
                Kamal<span className="text-orange-500 font-bold">.</span>H
              </span>
              <span className="text-[9px] font-mono border border-white/10 px-1.5 py-0.5 rounded text-white/50 font-semibold tracking-wider uppercase mt-1">
                v2.0
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/40 tracking-[0.25em] uppercase font-bold mt-0.5 hidden sm:inline">
              CREATIVE UI ENGINEER // GLASS
            </span>
          </a>

          {/* Center Navigation Links: Desktop */}
          <nav className="hidden lg:flex items-center gap-8 bg-white/5 border border-white/10 px-8 py-2.5 rounded-full backdrop-blur-xl shadow-lg">
            {navLinks.map((link) => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId;
              
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`relative text-[10px] font-mono tracking-widest transition-colors duration-300 font-bold ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveLine"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Section: Digital Clock and Hire CTA */}
          <div className="hidden sm:flex items-center gap-4 md:gap-5">
            
            {/* Digital Clock in Navbar */}
            <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full select-none backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
                <span className="text-white/40 hidden md:inline">DHAKA</span>
                <span>{timeStr || '12:00:00 PM'}</span>
                <span className="text-[9px] text-orange-400 font-semibold">(GMT+6)</span>
              </span>
            </div>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
              className="group relative flex items-center gap-1.5 bg-white hover:bg-zinc-100 text-black font-mono text-[10px] font-extrabold tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:scale-[1.03]"
            >
              HIRE ME
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Hamburguer trigger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="sm:hidden flex items-center gap-1.5 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-mono font-bold text-white tracking-wider">
                {timeStr ? timeStr.split(' ')[0] : '12:00'}
              </span>
            </div>

            <button
              id="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-luxury-border rounded-full hover:bg-zinc-900 text-gold-200 transition-all cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Sliding Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[73px] z-30 bg-[#0c0c0e]/95 backdrop-blur-3xl border-b border-white/10 flex flex-col p-8 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => {
                const targetId = link.href.replace('#', '');
                const isActive = activeSection === targetId;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className={`text-xs font-mono tracking-[0.2em] font-bold py-2 ${
                      isActive ? 'text-orange-400' : 'text-zinc-400 hover:text-white'
                    } transition-colors`}
                  >
                    {link.label}
                  </a>
                );
              })}
              
              <div className="h-[1px] bg-white/10 w-1/2 mx-auto my-2" />

              <div className="flex flex-col gap-4 items-center mt-2">
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                  className="w-full max-w-[200px] bg-white hover:bg-zinc-200 text-black font-mono text-xs font-extrabold tracking-widest py-3 rounded-full text-center shadow-lg"
                >
                  TALK WITH ME
                </a>
                
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 select-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  ATS & RECRUITER VERIFIED PROFILE
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
