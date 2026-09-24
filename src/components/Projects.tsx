/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import CaseStudyModal from './CaseStudyModal';
import { getStoredProjects } from '../lib/storage';
import { Github, ExternalLink, FileText, LayoutGrid, Layers, CircleDot } from 'lucide-react';

// Live interactive mockup for dynamically added custom projects
function CustomDynamicMockup() {
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p === 1 ? 1.15 : 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#070709]/90 p-6 flex flex-col justify-between overflow-hidden font-mono text-[9px] select-none">
      <div className="flex justify-between items-center text-orange-500/80 border-b border-white/5 pb-2">
        <span className="font-bold tracking-wider flex items-center gap-1">
          <CircleDot className="w-2 h-2 animate-ping text-orange-500" /> CUSTOM_ARCHITECTURE_RECON
        </span>
        <span className="text-white/30">MODULE: DYNAMIC_SIM</span>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 bg-grid-pattern scale-75" />
        <motion.div
          animate={{ scale: pulse, rotate: 360 }}
          transition={{
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' }
          }}
          className="relative w-20 h-20 rounded-full border border-orange-500/30 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full border border-dashed border-white/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50" />
          </div>
          <div className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-zinc-950 border border-orange-500 flex items-center justify-center text-[6px] text-orange-400 font-bold font-mono">1</div>
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-zinc-950 border border-orange-500 flex items-center justify-center text-[6px] text-orange-400 font-bold font-mono">2</div>
        </motion.div>
      </div>

      <div className="flex justify-between text-[7px] text-white/30 pt-2 border-t border-white/5">
        <span>FEED_STABILITY: 100.0%</span>
        <span>LATENCY: ZERO_OVERHEAD</span>
      </div>
    </div>
  );
}

// Live interactive mockup for Synthetix Telemetry Dashboard
function TelemetryMockup() {
  const [points, setPoints] = useState<number[]>([40, 55, 45, 60, 50, 70, 65, 80, 75, 90]);

  // Simulate stream updates
  useState(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev.slice(1)];
        const variance = Math.floor(Math.random() * 25) - 12;
        const last = prev[prev.length - 1];
        next.push(Math.max(20, Math.min(100, last + variance)));
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  });

  return (
    <div className="absolute inset-0 bg-[#070709]/90 p-6 flex flex-col justify-between overflow-hidden font-mono text-[9px] select-none text-white/40">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-orange-500 font-bold tracking-wider flex items-center gap-1">
          <CircleDot className="w-2 h-2 animate-ping text-orange-500" /> SYS_METRICS_STREAM // LIVE
        </span>
        <span className="text-white/30">OVERHEAD: 2.1ms</span>
      </div>

      <div className="flex-1 flex items-end gap-1 px-2 pt-6 pb-2 h-32 relative">
        {/* Dynamic Telemetry Graph Bars */}
        {points.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end h-full group">
            <motion.div 
              className="w-full rounded-t bg-gradient-to-t from-orange-500/20 via-blue-500/40 to-white/70"
              style={{ height: `${val}%` }}
              animate={{ height: `${val}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            />
            <span className="text-[7px] text-center text-white/30 mt-1">{val}%</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-white/5 pt-2 text-[8px] text-white/30">
        <span>PACKETS: 50.4k /s</span>
        <span>RE reconciliation: OFF</span>
      </div>
    </div>
  );
}

// Live interactive mockup for Aura Commerce Store
function CommerceMockup() {
  const [selectedColor, setSelectedColor] = useState<string>('#f97316');
  const products = [
    { name: 'AXIS CHRONO', price: '$1,250', desc: 'Satin Slate Titanium Edition' }
  ];

  return (
    <div className="absolute inset-0 bg-[#070709]/90 p-6 flex flex-col justify-between overflow-hidden font-sans select-none">
      <div className="flex justify-between items-center text-[9px] font-mono text-white/30">
        <span>AURA // ATELIER</span>
        <span>BAG (1)</span>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {/* Glowing floating luxury mockup watch representation */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-28 h-28 rounded-full border border-white/10 bg-gradient-to-tr from-zinc-900 to-black p-1 shadow-2xl flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full border border-white/5 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-[10px] text-white/60 font-mono tracking-widest font-bold">AURA</span>
            <span className="text-[7px] text-orange-400 font-mono tracking-[0.2em] mt-1 font-semibold">CHRONOGRAPH</span>
            {/* Clock mechanism aesthetic */}
            <div className="w-10 h-[1px] bg-orange-500/60 rotate-45 origin-center mt-2" />
          </div>
        </motion.div>
      </div>

      <div className="text-left font-sans">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-[10px] font-bold text-white tracking-wide uppercase">{products[0].name}</h4>
            <p className="text-[8px] text-white/40 mt-0.5">{products[0].desc}</p>
          </div>
          <span className="text-[10px] font-bold text-orange-400 font-mono">{products[0].price}</span>
        </div>

        {/* Mini interactive options */}
        <div className="flex gap-1.5 mt-2.5">
          {['#f97316', '#3b82f6', '#ffffff'].map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className="w-3 h-3 rounded-full border border-zinc-950 cursor-pointer transition-transform duration-200"
              style={{ 
                backgroundColor: color, 
                transform: selectedColor === color ? 'scale(1.25)' : 'scale(1)',
                boxShadow: selectedColor === color ? '0 0 8px rgba(249, 115, 22, 0.4)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Live interactive mockup for Vortex Gateway Router
function GatewayMockup() {
  const [connections, setConnections] = useState<number>(0);

  useState(() => {
    const interval = setInterval(() => {
      setConnections((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  });

  return (
    <div className="absolute inset-0 bg-[#070709]/90 p-6 flex flex-col justify-between overflow-hidden font-mono text-[9px] select-none text-white/40">
      <div className="flex justify-between items-center text-white/30 border-b border-white/5 pb-2">
        <span>VORTEX_GATEWAY_v1.0</span>
        <span className="text-emerald-400 font-semibold">● ACTIVE</span>
      </div>

      {/* Network route animation */}
      <div className="flex-1 flex items-center justify-around relative py-4">
        {/* Source Node */}
        <div className="w-10 h-10 rounded border border-white/10 bg-black flex items-center justify-center text-white/50 font-bold shadow">
          CLI
        </div>

        {/* Router visual connections */}
        <div className="flex-1 h-0.5 bg-white/5 relative mx-2">
          {/* Moving packet dot */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Core Gateway Node */}
        <div className="w-12 h-12 rounded border border-white/10 bg-zinc-950/80 flex flex-col items-center justify-center text-orange-400 font-bold relative shadow-lg">
          <span className="text-[8px]">ROUTER</span>
          <span className="text-[6px] text-white/30 mt-0.5">TLS 1.3</span>
          {/* Routing lines flashing */}
          <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${connections === 0 ? 'bg-orange-500' : 'bg-emerald-500'} border border-black animate-pulse`} />
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-white/5 pt-2 text-white/30">
        <span>GATEWAY LATENCY: 2.4ms</span>
        <span className="text-orange-400">JWT SIGNED</span>
      </div>
    </div>
  );
}

// Live interactive mockup for Apex Canvas Suite
function VectorMockup() {
  const [shapes, setShapes] = useState<{ x: number; y: number; size: number; color: string }[]>([
    { x: 45, y: 55, size: 28, color: '#f97316' },
    { x: 135, y: 40, size: 35, color: '#3b82f6' }
  ]);

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add new shape node
    const colors = ['#f97316', '#3b82f6', '#10b981', '#a855f7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = Math.floor(Math.random() * 25) + 15;
    
    setShapes((prev) => [...prev, { x, y, size: randomSize, color: randomColor }]);
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    setShapes([]);
  };

  return (
    <div 
      onClick={handleCanvasClick}
      className="absolute inset-0 bg-[#070709]/90 p-4 flex flex-col justify-between overflow-hidden font-mono text-[9px] select-none text-white/40 cursor-crosshair relative"
    >
      <div className="flex justify-between items-center text-white/30 border-b border-white/5 pb-1.5 pointer-events-none relative z-10">
        <span>APEX_CANVAS_RENDERER // CLICK TO DRAW</span>
        <button 
          onClick={handleClear}
          className="hover:text-white text-[8px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 cursor-pointer pointer-events-auto"
        >
          CLEAR
        </button>
      </div>

      {/* Shapes workspace */}
      <div className="flex-1 relative w-full h-full">
        {shapes.map((shape, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.65 }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: shape.x - shape.size / 2,
              top: shape.y - shape.size / 2,
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: `0 0 12px ${shape.color}35`
            }}
          />
        ))}

        {shapes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[8px] tracking-wider uppercase select-none pointer-events-none">
            Click inside workspace to plot vectors
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-white/20 text-[7px] border-t border-white/5 pt-1 pointer-events-none relative z-10">
        <span>COORDINATES: PROJECTION_2D</span>
        <span>SHAPES PLOTTED: {shapes.length}</span>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);
  const [filter, setFilter] = useState<'All' | 'Full-stack' | 'Frontend' | 'System' | 'Creative'>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setProjects(e.detail);
      else setProjects(getStoredProjects());
    };
    window.addEventListener('portfolio_projects_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_projects_updated', handleUpdate);
  }, []);

  const filteredProjects = projects.filter((proj) => {
    if (filter === 'All') return true;
    return proj.category === filter;
  });

  const getMockupElement = (id: string, image?: string) => {
    if (image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('/'))) {
      return (
        <div className="absolute inset-0 w-full h-full bg-[#070709] overflow-hidden group/img">
          <img
            src={image}
            alt="Project Cover"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
        </div>
      );
    }
    if (id.startsWith('custom-')) {
      return <CustomDynamicMockup />;
    }
    switch (id) {
      case 'synthetix':
        return <TelemetryMockup />;
      case 'aura':
        return <CommerceMockup />;
      case 'vortex':
        return <GatewayMockup />;
      case 'apex':
        return <VectorMockup />;
      default:
        return <CustomDynamicMockup />;
    }
  };

  return (
    <section 
      id="projects" 
      className="relative py-28 bg-luxury-black border-t border-white/10"
    >
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none select-none z-0" />
      <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
              03 // SELECT CASE STUDIES
            </span>
            <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
              Curated Masterpieces
            </h2>
          </div>

          <div className="flex items-center">
            {/* Filtering navigation pills */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur-md">
              {['All', 'Full-stack', 'Frontend', 'System', 'Creative'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-3.5 py-1.5 text-[9px] font-mono tracking-widest font-extrabold rounded-lg transition-all uppercase cursor-pointer ${
                    filter === cat 
                      ? 'bg-white/10 text-white border border-white/20 shadow-sm' 
                      : 'text-white/40 hover:text-white border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.65, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl"
              >
                
                {/* Visual live simulator inside project card */}
                <div 
                  data-cursor="project"
                  className="relative h-64 w-full border-b border-white/10 overflow-hidden"
                >
                  {getMockupElement(project.id, project.image)}
                  
                  {/* Subtle luxury gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>

                {/* Text Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center gap-4 mb-3.5">
                      <span className="text-[10px] font-mono tracking-[0.2em] font-extrabold text-orange-500 uppercase">
                        {project.category} // ARCHITECTURE
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${project.id.startsWith('custom-') ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className="text-[8px] font-mono text-white/40 font-bold uppercase">
                          {project.id.startsWith('custom-') ? 'USER DYNAMIC' : 'PROD STABLE'}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-sans text-2xl text-white font-bold tracking-tight mb-2 group-hover:text-orange-400 transition-colors uppercase italic">
                      {project.title}
                    </h3>
                    
                    <p className="font-sans text-xs text-white/60 tracking-wide leading-relaxed mb-6 font-light">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {project.techStack.map((tech) => (
                        <span 
                          key={tech}
                          className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[8.5px] font-mono text-white/50 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operational Metrics Cards */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-white/5 border border-white/10 rounded-xl mb-6">
                    {project.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col text-left">
                        <span className="font-sans text-sm font-bold text-white tracking-tight">{metric.value}</span>
                        <span className="text-[7.5px] font-mono text-white/40 font-bold tracking-wider uppercase mt-0.5">{metric.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Trigger Actions */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-auto">
                    
                    {/* Read case study modal trigger */}
                    <button
                      onClick={() => setSelectedCaseStudy(project)}
                      className="flex items-center gap-1.5 font-mono text-[9px] font-extrabold tracking-widest text-orange-400 hover:text-white transition-colors cursor-pointer uppercase"
                    >
                      <FileText className="w-4 h-4 text-orange-500" />
                      ANALYZE ARCHITECTURE
                    </button>

                    <div className="flex items-center gap-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/20 transition-colors bg-white/5 hover:bg-white/10"
                        aria-label="View Source on GitHub"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={project.liveDemo}
                        className="p-2 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/20 transition-colors bg-white/5 hover:bg-white/10"
                        aria-label="Launch Live Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>

                </div>

              </motion.article>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Cinematic Case Study Modal Panel */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <CaseStudyModal 
            project={selectedCaseStudy} 
            onClose={() => setSelectedCaseStudy(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
