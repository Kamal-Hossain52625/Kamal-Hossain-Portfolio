/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Mail, ArrowDown, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { BehanceIcon, FacebookIcon } from './Footer';
import { getStoredProfileImage, subscribeToProfileImage } from '../lib/storage';

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
    badge: 'LARAVEL & REACT FULL-STACK SPECIALIST',
    tagline: 'Architecting rock-solid Laravel backends and high-performance React frontend applications.',
    bullets: [
      'Laravel 11 Backend: RESTful APIs, Eloquent ORM, queued jobs & database optimization',
      'React 19 Frontend: modern hooks, TypeScript, fluid animation & zero-delay UI',
      'Full-Stack Synergy: Seamless API-first integration, Sanctum auth & production architecture'
    ]
  },
  {
    id: 'recruiter',
    label: 'RECRUITER VIEW',
    badge: 'EXPERIENCED LARAVEL & REACT DEVELOPER',
    tagline: 'Battle-tested expertise in PHP/Laravel backend architecture and React modern ecosystems.',
    bullets: [
      'Deep mastery of MVC, service repositories, Eloquent indexing, and API lifecycles',
      'Production React specialist (clean code, reusable component libraries, TypeScript)',
      'Agile delivery: Git workflows, database migrations, CI/CD and team leadership'
    ]
  },
  {
    id: 'founder',
    label: 'FOUNDER VIEW',
    badge: 'END-TO-END PRODUCT BUILDER',
    tagline: 'Transforming napkin diagrams into scalable Laravel + React production platforms.',
    bullets: [
      'Full-cycle engineering: schema design, API endpoints, payment integration & responsive UI',
      'Rapid time-to-market with maintainable architecture (Docker, Redis, Cloud SQL)',
      'Optimized for high-concurrency traffic and frictionless customer onboarding'
    ]
  },
  {
    id: 'freelancer',
    label: 'CLIENT VIEW',
    badge: 'FULL-STACK CONSULTANT & DELIVERER',
    tagline: 'Complete turnkey web solutions: bulletproof Laravel backends + bespoke React web apps.',
    bullets: [
      'Custom Laravel admin panels, business logic, secure auth & 3rd-party integrations',
      'High-conversion, ultra-responsive React interfaces with luxury micro-interactions',
      'Fixed-scope delivery with clear milestones, clean documentation, and ongoing support'
    ]
  }
];

// Official Developer Tool SVG Marks with Authentic Brand Palettes
function PhpLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <ellipse cx="64" cy="64" rx="60" ry="34" fill="#4F5B93" />
      <path
        fill="#FFFFFF"
        d="M38.5 73.8l2.6-14.7c.3-1.6 1.7-2.9 3.3-2.9h6.8c3.9 0 6.5 2.1 5.9 5.8-.7 4.1-3.9 6.2-7.8 6.2h-4.3l-1 5.6h-5.5zm8.5-8.8h2.3c1.7 0 2.7-.8 3-2.3.3-1.4-.4-2.1-2-2.1h-2.5l-.8 4.4zm16.7 8.8l4.4-24.9h5.5l-1.9 10.9h6.1c3.9 0 6.5 2.1 5.9 5.8-.7 4.1-3.9 6.2-7.8 6.2H71l-1 5.6h-5.5l-.8-3.6zm10.7-8.8h2.3c1.7 0 2.7-.8 3-2.3.3-1.4-.4-2.1-2-2.1h-2.5l-.8 4.4zm15.7 8.8l2.6-14.7c.3-1.6 1.7-2.9 3.3-2.9h6.8c3.9 0 6.5 2.1 5.9 5.8-.7 4.1-3.9 6.2-7.8 6.2H96l-1 5.6h-5.5zm8.5-8.8h2.3c1.7 0 2.7-.8 3-2.3.3-1.4-.4-2.1-2-2.1h-2.5l-.8 4.4z"
      />
    </svg>
  );
}

function LaravelLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path
        fill="#FF2D20"
        d="M109.8 33.4L80.9 16.7c-1.8-1-4-1-5.8 0L24.6 46.1c-1.8 1-2.9 3-2.9 5v45.9c0 2 1.1 3.9 2.9 5l20.4 11.8c1.8 1 4 1 5.8 0l59-34.1c1.8-1 2.9-3 2.9-5V38.4c0-2-1.1-3.9-2.9-5zM47.9 105.7l-18.4-10.6V56.2l18.4 10.6v38.9zm3.5-44.9l-18.4-10.6 44.9-25.9 18.4 10.6-44.9 25.9zm53.4 19.3l-50 28.9V70.1l50-28.9v40.9z"
      />
    </svg>
  );
}

function ReactLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 115 102" className={className} fill="none">
      <ellipse cx="57.5" cy="51" rx="52" ry="20" stroke="#61DAFB" strokeWidth="6" />
      <ellipse cx="57.5" cy="51" rx="52" ry="20" stroke="#61DAFB" strokeWidth="6" transform="rotate(60 57.5 51)" />
      <ellipse cx="57.5" cy="51" rx="52" ry="20" stroke="#61DAFB" strokeWidth="6" transform="rotate(120 57.5 51)" />
      <circle cx="57.5" cy="51" r="10" fill="#61DAFB" />
    </svg>
  );
}

function NodeLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path fill="#68A063" d="M64 4.5l52 30v60l-52 30-52-30v-60l52-30z" />
      <path fill="#1a1a1a" d="M64 12l45 26v52l-45 26-45-26V38l45-26z" />
      <path fill="#68A063" d="M64 26l32.5 18.8v37.5L64 101.1 31.5 82.3V44.8L64 26z" />
      <path
        fill="#FFFFFF"
        d="M64 44c-11 0-20 4.5-20 10 0 4.2 5.3 7.8 13 9.3v-5.2c-4.4-1.1-7-3-7-4.1 0-2.8 6.3-5 14-5s14 2.2 14 5c0 1.1-2.6 3-7 4.1v5.2c7.7-1.5 13-5.1 13-9.3 0-5.5-9-10-20-10z"
      />
    </svg>
  );
}

function TypeScriptLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className}>
      <rect width="128" height="128" rx="20" fill="#3178C6" />
      <path
        fill="#FFFFFF"
        d="M26 44h36v11H46.5v43h-15V55H26V44zm45.8 28.5c2.3 4 6.2 6.8 11.2 6.8 4.2 0 6.8-2 6.8-5.2 0-3.5-2.8-4.8-8.2-7-8.2-3.2-12.8-6.5-12.8-13.8 0-8 6.5-14 16.5-14 6.8 0 12.2 2.8 15.2 7.8l-7.2 6.5c-1.8-3-4.5-4.8-8-4.8-3.5 0-5.5 1.8-5.5 4.2 0 2.8 2.2 4 7.5 6 9.2 3.8 13.8 7.5 13.8 15 0 8.8-6.8 14.8-17.5 14.8-8.8 0-14.8-4-17.8-10.2l8-6.9z"
      />
    </svg>
  );
}

function NextjsLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <circle cx="64" cy="64" r="62" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
      <path
        fill="#FFFFFF"
        d="M78 88.5L46.8 48.2H38v39.8h9.8V60.7l27.2 35c1.1-.6 2.1-1.3 3-2zM75.2 48.2h9.8v25.5h-9.8z"
      />
    </svg>
  );
}

function TailwindLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path
        fill="#38BDF8"
        d="M64 24c-19.2 0-31.2 9.6-36 28.8 7.2-9.6 15.6-13.2 25.2-10.8 5.48 1.37 9.39 5.34 13.73 9.74C74 58.71 82.16 67 100 67c19.2 0 31.2-9.6 36-28.8-7.2 9.6-15.6 13.2-25.2 10.8-5.48-1.37-9.39-5.34-13.73-9.74C90 32.29 81.84 24 64 24zM28 67c-19.2 0-31.2 9.6-36 28.8 7.2-9.6 15.6-13.2 25.2-10.8 5.48 1.37 9.39 5.34 13.73 9.74C38 101.71 46.16 110 64 110c19.2 0 31.2-9.6 36-28.8-7.2 9.6-15.6 13.2-25.2 10.8-5.48-1.37-9.39-5.34-13.73-9.74C54 75.29 45.84 67 28 67z"
      />
    </svg>
  );
}

function DockerLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path
        fill="#2496ED"
        d="M117.5 59.8c-1.3-.9-5.5-3.3-13.4-1.8-.7-4.9-3.8-9.2-8.5-11.8l-3.3-1.8-2 3.1c-3.7 5.7-4.4 12.7-2 18.8-2.6 1.4-6.3 2.6-10.7 2.6H13.6c-1.8 0-3.3 1.5-3.3 3.3 0 11.2 3.5 21.8 10.1 30.7 9.8 13.1 24.8 20.3 42.1 20.3 36.8 0 66.8-22.1 69.1-57.8 0-.4 0-.8-.1-1.2 2.6-1.5 5.5-3.6 6-6.5zm-59.9-7.3h10.9v10.9H57.6V52.5zm-14.5 0H54v10.9H43.1V52.5zm-14.5 0h10.9v10.9H28.6V52.5zm14.5-14.5H54v10.9H43.1V38zm14.5 0h10.9v10.9H57.6V38zm14.5 0H83v10.9H72.1V38zm0 14.5H83v10.9H72.1V52.5zm-43.5 0H39.5v10.9H28.6V52.5z"
      />
    </svg>
  );
}

interface OrbitTool {
  id: string;
  name: string;
  role: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  positionStyle: React.CSSProperties;
  angleLabel: string;
}

// 1. Inner Orbit Tools (Clockwise rotation, 24 seconds for 360°)
// ⚛️ TypeScript (Top - 0°)
// 🔴 Next.js (Right - 90°)
// 🟢 Node.js (Bottom - 180°)
// 🟣 Docker (Left - 270°)
const innerOrbitTools: OrbitTool[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    role: 'Type Safe',
    color: '#3178C6',
    glowColor: 'rgba(49, 120, 198, 0.85)',
    icon: <TypeScriptLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '0°',
    positionStyle: { left: '50%', top: '0%' }, // Top - 0°
  },
  {
    id: 'nextjs',
    name: 'Next.js 15',
    role: 'Fullstack SSR',
    color: '#FFFFFF',
    glowColor: 'rgba(255, 255, 255, 0.7)',
    icon: <NextjsLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '90°',
    positionStyle: { left: '100%', top: '50%' }, // Right - 90°
  },
  {
    id: 'nodejs',
    name: 'Node.js 22',
    role: 'Async Server',
    color: '#68A063',
    glowColor: 'rgba(104, 160, 99, 0.85)',
    icon: <NodeLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '180°',
    positionStyle: { left: '50%', top: '100%' }, // Bottom - 180°
  },
  {
    id: 'docker',
    name: 'Docker',
    role: 'Containers & DevOps',
    color: '#2496ED',
    glowColor: 'rgba(36, 150, 237, 0.85)',
    icon: <DockerLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '270°',
    positionStyle: { left: '0%', top: '50%' }, // Left - 270°
  },
];

// 2. Outer Orbit Tools (Counter-Clockwise rotation, 36 seconds for 360°)
// 🔷 React (Top-Right - 45°)
// ⚪ Laravel (Bottom-Right - 135°)
// 🌊 Tailwind CSS (Bottom-Left - 225°)
// 🐳 PHP (Top-Left - 315°)
const outerOrbitTools: OrbitTool[] = [
  {
    id: 'react',
    name: 'React 19',
    role: 'Frontend UI Expert',
    color: '#61DAFB',
    glowColor: 'rgba(97, 218, 251, 0.9)',
    icon: <ReactLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '45°',
    positionStyle: { left: '85.36%', top: '14.64%' }, // Top-Right - 45°
  },
  {
    id: 'laravel',
    name: 'Laravel 11',
    role: 'Backend API Expert',
    color: '#FF2D20',
    glowColor: 'rgba(255, 45, 32, 0.9)',
    icon: <LaravelLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '135°',
    positionStyle: { left: '85.36%', top: '85.36%' }, // Bottom-Right - 135°
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    role: 'Design System',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    icon: <TailwindLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '225°',
    positionStyle: { left: '14.64%', top: '85.36%' }, // Bottom-Left - 225°
  },
  {
    id: 'php',
    name: 'PHP 8.3',
    role: 'Core Backend',
    color: '#777BB4',
    glowColor: 'rgba(119, 123, 180, 0.9)',
    icon: <PhpLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    angleLabel: '315°',
    positionStyle: { left: '14.64%', top: '14.64%' }, // Top-Left - 315°
  },
];

/**
 * Interactive Floating Developer Tool Badge
 */
function ToolBadge({
  tool,
  activeTool,
  setActiveTool,
  ringType = 'inner',
}: {
  tool: OrbitTool;
  activeTool: string | null;
  setActiveTool: (id: string | null) => void;
  ringType?: 'inner' | 'outer';
}) {
  const isHovered = activeTool === tool.id;

  return (
    <div
      onMouseEnter={() => setActiveTool(tool.id)}
      onMouseLeave={() => setActiveTool(null)}
      className="relative group cursor-pointer select-none"
    >
      {/* Brand glowing aura */}
      <div
        className="absolute -inset-1.5 rounded-2xl blur-md transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: tool.color,
          opacity: isHovered ? 0.9 : ringType === 'outer' ? 0.35 : 0.22,
        }}
      />

      {/* Glass badge pill */}
      <div
        className={`relative flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-xl ${
          ringType === 'outer'
            ? 'bg-[#0b0b14]/95 border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.85)] ring-1 ring-white/10'
            : 'bg-[#07070d]/90 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.7)]'
        } ${
          isHovered
            ? 'scale-110 sm:scale-115 border-white/90 !z-50'
            : 'hover:border-white/60'
        }`}
        style={{
          boxShadow: isHovered
            ? `0 0 25px ${tool.glowColor}`
            : ringType === 'outer'
            ? `0 0 16px ${tool.glowColor}, 0 6px 20px rgba(0, 0, 0, 0.75)`
            : `0 0 10px ${tool.glowColor}, 0 4px 15px rgba(0, 0, 0, 0.65)`,
        }}
      >
        <div className="shrink-0">{tool.icon}</div>

        {/* Text */}
        <div className="flex flex-col text-left transition-all duration-200">
          <span className="text-[9px] sm:text-[11px] md:text-xs font-mono font-bold text-white tracking-wide leading-none whitespace-nowrap">
            {tool.name}
          </span>
          <span className="hidden sm:block text-[7px] sm:text-[8px] font-mono text-white/50 tracking-wider uppercase leading-none mt-0.5 whitespace-nowrap">
            {tool.role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'recruiter' | 'founder' | 'freelancer'>('all');
  const [profileImage, setProfileImage] = useState<string>(getStoredProfileImage);
  const [mouseTranslate, setMouseTranslate] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parallax transform translation along X and Y axes responding smoothly to mouse
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseTranslate({
      x: Math.max(-1, Math.min(1, x)) * 26,
      y: Math.max(-1, Math.min(1, y)) * 26,
    });
  };

  const handleHeroMouseLeave = () => {
    setMouseTranslate({ x: 0, y: 0 });
    setActiveTool(null);
  };

  // Real-time listener for profile photo across all devices
  useEffect(() => {
    const unsub = subscribeToProfileImage((img) => {
      setProfileImage(img);
    });

    const handlePhotoUpdate = (e: any) => {
      if (e.detail !== undefined) setProfileImage(e.detail);
      else setProfileImage(getStoredProfileImage());
    };
    window.addEventListener('portfolio_profile_image_updated', handlePhotoUpdate);

    return () => {
      unsub();
      window.removeEventListener('portfolio_profile_image_updated', handlePhotoUpdate);
    };
  }, []);

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
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative min-h-screen flex flex-col justify-center items-center bg-luxury-black text-white px-5 sm:px-8 md:px-12 py-20 md:py-28 overflow-hidden bg-grid-pattern"
    >
      {/* Animated interactive canvas layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-1" 
      />

      {/* Decorative luxury gradient background glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none select-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none select-none z-0" />
      
      {/* Background radial overlay to focus center */}
      <div className="absolute inset-0 bg-radial-gradient opacity-85 pointer-events-none select-none z-0" />

      {/* Content wrapper: Up-Down layout on both Web & Mobile (Image at top, Text section below) */}
      <div className="max-w-6xl mx-auto w-full z-10 flex flex-col items-center mt-2">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono tracking-widest text-white/90 font-bold uppercase">
            AVAILABLE FOR NEW ARCHITECTURES
          </span>
        </div>

        {/* TOP SECTION: Eye-Visible Portrait Constellation with Dual Orbital Rings & Parallax Translation */}
        <div className="flex flex-col items-center justify-center w-full my-4 select-none">
          {/* Main Orbit Constellation Stage with hover pause capability */}
          <div className="relative w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] lg:w-[600px] lg:h-[600px] flex items-center justify-center orbit-system">
            
            {/* Radial ambient glow behind portrait */}
            <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-blue-600/20 blur-3xl pointer-events-none" />

            {/* A. OUTER ORBIT (36s Counter-Clockwise 360°): React, Laravel, Tailwind CSS, PHP */}
            {/* Outer Orbit Guide Track */}
            <div className="absolute w-[310px] h-[310px] sm:w-[390px] sm:h-[390px] md:w-[470px] md:h-[470px] lg:w-[530px] lg:h-[530px] rounded-full border border-dashed border-sky-400/20 pointer-events-none shadow-[0_0_20px_rgba(56,189,248,0.08)]" />
            
            {/* Outer Orbit Rotating Ring: 36s Counter-Clockwise */}
            <div className="absolute w-[310px] h-[310px] sm:w-[390px] sm:h-[390px] md:w-[470px] md:h-[470px] lg:w-[530px] lg:h-[530px] rounded-full animate-orbit-outer pointer-events-none z-30">
              {outerOrbitTools.map((tool) => (
                <div
                  key={tool.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={tool.positionStyle}
                >
                  {/* Counter-rotation to keep badge upright and readable */}
                  <div className="animate-orbit-outer-counter">
                    <ToolBadge
                      tool={tool}
                      activeTool={activeTool}
                      setActiveTool={setActiveTool}
                      ringType="outer"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* B. INNER ORBIT (24s Clockwise 360°): TypeScript, Next.js, Node.js, Docker */}
            {/* Inner Orbit Guide Track */}
            <div className="absolute w-[215px] h-[215px] sm:w-[275px] sm:h-[275px] md:w-[330px] md:h-[330px] lg:w-[370px] lg:h-[370px] rounded-full border border-dashed border-amber-500/25 pointer-events-none shadow-[0_0_15px_rgba(245,158,11,0.08)]" />
            
            {/* Inner Orbit Rotating Ring: 24s Clockwise */}
            <div className="absolute w-[215px] h-[215px] sm:w-[275px] sm:h-[275px] md:w-[330px] md:h-[330px] lg:w-[370px] lg:h-[370px] rounded-full animate-orbit-inner pointer-events-none z-20">
              {innerOrbitTools.map((tool) => (
                <div
                  key={tool.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={tool.positionStyle}
                >
                  {/* Counter-rotation to keep badge upright and readable */}
                  <div className="animate-orbit-inner-counter">
                    <ToolBadge
                      tool={tool}
                      activeTool={activeTool}
                      setActiveTool={setActiveTool}
                      ringType="inner"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* C. CENTERPIECE HERO PORTRAIT: BIG, EYE-VISIBLE, PARALLAX TRANSLATE & SLOW UP-DOWN FLOATING */}
            <motion.div
              animate={{
                x: mouseTranslate.x * 0.45,
                y: mouseTranslate.y * 0.45,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 130, mass: 0.8 }}
              className="relative z-10 flex items-center justify-center pointer-events-none"
            >
              {/* Inner motion div: slow up-down floating harmonic translation */}
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  x: [-2, 2, -2],
                }}
                transition={{
                  duration: 6.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center group pointer-events-auto"
              >
                {/* Glowing multi-layer outer aura ring */}
                <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-orange-500 via-amber-400 to-blue-600 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
                
                {/* Concentric subtle radar line */}
                <div className="absolute -inset-6 sm:-inset-7 rounded-full border border-white/10 opacity-30 animate-[spin_50s_linear_infinite]" />

                {/* EYE-VISIBLE PORTRAIT FRAME: Proportional across mobile & web */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full p-2 sm:p-2.5 bg-luxury-black/90 border-2 border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center backdrop-blur-xl">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Kamal Hossain - Senior Software Architect"
                      className="w-full h-full rounded-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center p-4 text-center">
                      <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-orange-400">KH</span>
                      <span className="text-[8px] sm:text-[10px] font-mono text-white/50 tracking-widest uppercase mt-1">
                        LEAD SOFTWARE ARCHITECT
                      </span>
                    </div>
                  )}
                </div>

                {/* Active online pulse indicator */}
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 flex items-center justify-center" title="Online & Available for Engineering">
                  <span className="relative flex h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 bg-emerald-500 border-2 border-black shadow-lg" />
                  </span>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* BOTTOM SECTION: Typography, Taglines, Audience Switcher, and CTAs (Centered Up-Down) */}
        <div className="flex flex-col items-center text-center mt-6 w-full max-w-4xl">

            {/* Cinematic Big Name Title */}
            <div className="relative mb-4">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-sans text-[44px] sm:text-[68px] md:text-[80px] lg:text-[84px] xl:text-[96px] leading-[0.88] font-black tracking-tighter uppercase mb-2 italic text-white select-none">
                  KAMAL<br />
                  <span className="text-transparent border-t border-b border-white/20 px-2" style={{ WebkitTextStroke: '1.5px white' }}>
                    HOSSAIN
                  </span>
                </h1>
              </motion.div>

              {/* High-Impact Core Specialization Badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center justify-center gap-2.5 mt-4"
              >
                <div className="px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  BACKEND: LARAVEL EXPERT
                </div>
                <span className="text-white/30 font-mono hidden sm:inline">//</span>
                <div className="px-3.5 py-1.5 rounded-full bg-sky-400/15 border border-sky-400/40 text-sky-300 font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  FRONTEND: REACT EXPERT
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-xs sm:text-sm md:text-base font-mono text-orange-400/90 tracking-[0.25em] font-semibold uppercase mt-3">
                  Full-Stack Architect & API Engineer
                </h2>
              </motion.div>
            </div>

            {/* Introduction Description tailored to Laravel Backend & React Frontend */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl text-white/70 font-sans text-sm md:text-base leading-relaxed tracking-wide mb-6 font-light"
            >
              Specializing in high-performance web engineering with enterprise-grade <strong className="text-red-400 font-semibold underline decoration-red-500/40 underline-offset-4">Laravel Backends</strong> (RESTful APIs, Eloquent ORM, Queues & MySQL/PostgreSQL) coupled with reactive, pixel-perfect <strong className="text-sky-300 font-semibold underline decoration-sky-400/40 underline-offset-4">React Frontends</strong> (React 19, TypeScript, Tailwind CSS & Motion). Delivering production-ready, ultra-fast applications from database schema to responsive UI.
            </motion.p>

            {/* Dual-Pillar Quick Tech Matrix */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
            >
              {/* Backend Pillar Pill */}
              <div className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-red-950/30 via-black/40 to-black/70 border border-red-500/30 backdrop-blur-xl flex items-center gap-3 text-left shadow-xl hover:border-red-500/60 transition-all">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                  <LaravelLogo className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[9px] font-extrabold text-red-400 tracking-wider uppercase">BACKEND MASTERY</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">● 98%</span>
                  </div>
                  <h4 className="font-sans text-xs font-bold text-white truncate">Laravel 11 & PHP 8.3</h4>
                  <p className="font-mono text-[10px] text-white/50 truncate">REST APIs • Eloquent • MySQL • Redis</p>
                </div>
              </div>

              {/* Frontend Pillar Pill */}
              <div className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-sky-950/30 via-black/40 to-black/70 border border-sky-400/30 backdrop-blur-xl flex items-center gap-3 text-left shadow-xl hover:border-sky-400/60 transition-all">
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                  <ReactLogo className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[9px] font-extrabold text-sky-400 tracking-wider uppercase">FRONTEND MASTERY</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">● 98%</span>
                  </div>
                  <h4 className="font-sans text-xs font-bold text-white truncate">React 19 & TypeScript</h4>
                  <p className="font-mono text-[10px] text-white/50 truncate">SPAs • Tailwind CSS • Motion • Vite</p>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Audience Intent Switcher */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-2xl mb-8 flex flex-col items-center lg:items-start gap-4"
            >
              {/* Menu Selector Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl md:rounded-full backdrop-blur-xl shadow-2xl">
                {audienceData.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedAudience(tab.id)}
                    className={`relative px-3.5 py-2 text-[9px] md:text-[10px] font-mono tracking-widest font-extrabold rounded-xl md:rounded-full transition-all duration-300 uppercase cursor-pointer ${
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

              {/* Dynamic audience card */}
              <div className="w-full min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedAudience}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl text-left flex flex-col md:flex-row justify-between gap-5"
                  >
                    <div className="flex-1">
                      <div className="inline-block px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest mb-2.5">
                        {currentAudienceData.badge}
                      </div>
                      <h3 className="font-sans text-sm md:text-base font-semibold text-white tracking-wide mb-2 leading-snug">
                        {currentAudienceData.tagline}
                      </h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-2 md:border-l md:border-white/10 md:pl-6">
                      {currentAudienceData.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
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

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <button
                onClick={handleScrollToProjects}
                className="group w-full sm:w-auto relative flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-100 font-mono text-[10px] font-extrabold tracking-widest px-8 py-4 rounded-full transition-all duration-300 cursor-pointer shadow-2xl hover:scale-[1.04]"
              >
                EXPLORE THE CASE STUDIES
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 font-mono text-[10px] font-extrabold tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.04] text-white"
              >
                INITIATE COLLABORATION
              </a>
            </motion.div>
          </div>

        {/* BOTTOM SECTION: Social Links, Experience Stats Highlights, and Scroll Down Hint */}
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
