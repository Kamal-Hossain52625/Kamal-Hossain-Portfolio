/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Mail, ArrowDown, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { BehanceIcon, FacebookIcon } from './Footer';

interface AudienceFilter {
  id: 'all' | 'recruiter' | 'founder' | 'freelancer';
  label: string;
  tagline: string;
  badge: string;
  bullets: string[];
}

const audienceData: AudienceFilter[] = [
  {
    id: 'all',
    label: 'GENERAL PROFILE',
    badge: 'SENIOR ENGINEER & ARCHITECT',
    tagline: 'Engineering high-throughput systems and high-fidelity creative web applications.',
    bullets: ['TypeScript & Next.js Ecosystem expert', 'Complex client-side custom vectors & canvas engines', 'Secure middleware gateways & API designs']
  },
  {
    id: 'recruiter',
    label: 'RECRUITER VIEW',
    badge: 'ATS-COMPLIANT & TEAM LEAD READY',
    tagline: 'Ready to integrate seamlessly into agile teams as a Senior/Lead Software Engineer.',
    bullets: ['5+ years professional codebase experience', 'Full stack depth (Node.js, PostgreSQL, Cloud Deployments)', 'Mentored 10+ junior developers and coordinated deployments']
  },
  {
    id: 'founder',
    label: 'FOUNDER VIEW',
    badge: 'STARTUP CO-PILOT & BUILDER',
    tagline: 'Transforming napkin diagrams into production-grade, highly scalable SaaS portals.',
    bullets: ['Optimized cloud deployment structures (AWS/Docker/Cloud Run)', 'Zero-latency telemetry dashboard implementations', 'Rapid prototyper with clean maintainable structure']
  },
  {
    id: 'freelancer',
    label: 'CLIENT VIEW',
    badge: 'FREELANCE CONSULTANT & AGENCY EXPERT',
    tagline: 'Designing, developing, and launching premium bespoke sites that elevate your brand.',
    bullets: ['Awwwards-worthy fluid layouts & micro-interactions', '100% SEO, accessibility, and speed scores', 'Fixed-scope contracts with absolute transparent delivery schedules']
  }
];

export default function Hero() {
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'recruiter' | 'founder' | 'freelancer'>('all');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background interactive mesh canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; opacity: number }[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.15,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw dynamic glowing blobs
      const gradient = ctx.createRadialGradient(width * 0.3, height * 0.4, 10, width * 0.3, height * 0.4, width * 0.5);
      gradient.addColorStop(0, 'rgba(197, 168, 128, 0.04)');
      gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render drifting constellation
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 168, 128, ${p.opacity})`;
        ctx.fill();

        // Connect particles near each other
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineOpacity = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = `rgba(197, 168, 128, ${lineOpacity})`;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        if (mouseX !== -1000) {
          const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
          if (mouseDist < 160) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            const mouseLineOpacity = (1 - mouseDist / 160) * 0.15;
            ctx.strokeStyle = `rgba(197, 168, 128, ${mouseLineOpacity})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const currentAudienceData = audienceData.find((a) => a.id === selectedAudience) || audienceData[0];

  const handleScrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col justify-center items-center bg-luxury-black text-white px-6 md:px-12 py-24 overflow-hidden bg-grid-pattern"
    >
      {/* Animated interactive canvas layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-auto z-1" 
      />

      {/* Decorative luxury gradient background glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      
      {/* Background radial overlay to focus center */}
      <div className="absolute inset-0 bg-radial-gradient opacity-80 pointer-events-none select-none z-0" />

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col items-center justify-center text-center mt-6">
        
        {/* Availability Badge */}
        

        {/* Large Cinematic Title */}
        <div className="relative mb-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-sans text-[48px] sm:text-[75px] md:text-[105px] leading-[0.85] font-black tracking-tighter uppercase mb-2 italic text-white select-none">
              KAMAL<br/>
              <span className="text-transparent border-t border-b border-white/20 px-2" style={{ WebkitTextStroke: '1.5px white', msTextStroke: '1.5px white' }}>HOSSAIN</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-sm sm:text-base md:text-lg font-mono text-orange-500 tracking-[0.35em] font-semibold uppercase mt-5">
              Senior Software Architect
            </h2>
          </motion.div>
        </div>

        {/* Description / Introduction Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl text-white/60 font-sans text-sm md:text-base leading-relaxed tracking-wide mb-10 text-center font-light"
        >
          Redefining the digital landscape through award-winning design systems and high-performance engineering. Helping brands, founders, and teams scale with beautiful glass architectures.
        </motion.p>

        {/* Dynamic Recruiter/Founder/Freelancer filter menu (FLEXIBLE USER INTENT) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl mb-12 flex flex-col items-center gap-6"
        >
          {/* Menu Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-2.5 p-1.5 bg-white/5 border border-white/10 rounded-2xl md:rounded-full backdrop-blur-xl shadow-2xl">
            {audienceData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedAudience(tab.id)}
                className={`relative px-4 py-2.5 text-[9px] md:text-[10px] font-mono tracking-widest font-extrabold rounded-xl md:rounded-full transition-all duration-300 uppercase cursor-pointer ${
                  selectedAudience === tab.id 
                    ? 'text-white' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {selectedAudience === tab.id && (
                  <motion.div
                    layoutId="heroFilterBg"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl md:rounded-full shadow-lg"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Render Target Profile Dynamic Card */}
          <div className="w-full max-w-3xl min-h-[170px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedAudience}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl text-left flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="inline-block px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest mb-3.5">
                    {currentAudienceData.badge}
                  </div>
                  <h3 className="font-sans text-base md:text-lg font-semibold text-white tracking-wide mb-3 leading-snug">
                    {currentAudienceData.tagline}
                  </h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-2 md:border-l md:border-white/10 md:pl-8">
                  {currentAudienceData.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <span className="font-sans text-xs text-white/70 leading-relaxed">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA Button Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <button
            onClick={handleScrollToProjects}
            className="group w-full sm:w-auto relative flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-100 font-mono text-[10px] font-extrabold tracking-widest px-8 py-4.5 rounded-full transition-all duration-300 cursor-pointer shadow-2xl hover:scale-[1.04]"
          >
            EXPLORE THE CASE STUDIES
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 font-mono text-[10px] font-extrabold tracking-widest px-8 py-4.5 rounded-full transition-all duration-300 hover:scale-[1.04] text-white"
          >
            INITIATE COLLABORATION
          </a>
        </motion.div>

        {/* Social Icons & Bottom Meta details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-full mt-16 pt-8 border-t border-luxury-border/35 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* Social links */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <a 
              href="https://github.com/Kamal-Hossain52625" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 sm:p-3 border border-luxury-border rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-md bg-[#070709]"
              aria-label="GitHub Profile"
              title="GitHub Profile: Kamal-Hossain52625"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/in/kamal-hossain-4087a7297" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 sm:p-3 border border-luxury-border rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-md bg-[#070709]"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile: Kamal Hossain"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://www.behance.net/kamalhossain66/" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 sm:p-3 border border-luxury-border rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-md bg-[#070709]"
              aria-label="Behance Profile"
              title="Behance Portfolio: kamalhossain66"
            >
              <BehanceIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=100005506395614" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 sm:p-3 border border-luxury-border rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-md bg-[#070709]"
              aria-label="Facebook Profile"
              title="Facebook Profile: Kamal Hossain"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a 
              href="mailto:kamalhossainm5443@gmail.com" 
              className="p-2.5 sm:p-3 border border-luxury-border rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-md bg-[#070709]"
              aria-label="Send Email"
              title="Email: kamalhossainm5443@gmail.com"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Stats Highlights */}
          <div className="flex items-center gap-8 text-left font-mono">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">5+</span>
              <span className="text-[9px] text-zinc-500 tracking-wider">YEARS EXP</span>
            </div>
            <div className="h-6 w-[1px] bg-luxury-border" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">40+</span>
              <span className="text-[9px] text-zinc-500 tracking-wider">PROJECTS COMPLETED</span>
            </div>
            <div className="h-6 w-[1px] bg-luxury-border" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient-gold tracking-tight">100%</span>
              <span className="text-[9px] text-zinc-500 tracking-wider">CLIENT RATING</span>
            </div>
          </div>

          {/* Scroll Down Hint indicator */}
          <button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 group cursor-pointer text-zinc-500 hover:text-gold-300 transition-colors"
          >
            <span className="text-[9px] font-mono tracking-widest font-semibold">SCROLL DOWN</span>
            <ArrowDown className="w-3 h-3 group-hover:translate-y-1 transition-transform animate-bounce" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
