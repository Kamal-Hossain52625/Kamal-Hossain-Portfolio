/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Info, AlertCircle, Save, Plus, Image as ImageIcon, Upload, Link as LinkIcon, Trash2, Check } from 'lucide-react';
import { Project } from '../types';

interface ProjectFormModalProps {
  project?: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const PRESET_IMAGES = [
  {
    label: 'High-Tech Dashboard',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Distributed Cloud Node',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Code Architecture Matrix',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Neural Quantum AI',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Dark Spatial 3D UI',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
  },
];

const TEMPLATE_SAMPLES = [
  {
    title: 'Horizon Quantum',
    subtitle: 'High-Fidelity Quantum Cryptography Suite',
    category: 'System' as const,
    description: 'An open-source security gateway orchestrating post-quantum TLS handshakes, randomized matrix key encryptions, and atomic secure pipelines.',
    longDescription: 'Horizon Quantum provides decentralized microservice environments with cutting-edge post-quantum cryptography algorithms. It executes rapid dual-phase packet verifications with zero state lag, utilizing WebAssembly kernels to process massive multi-tenant encryption matrices securely in the browser.',
    techStack: 'Rust, WebAssembly, TypeScript, Node.js, WebSockets',
    features: 'Multi-threaded WASM key negotiation, Quantum-safe lattice validation loops, Low-overhead hardware acceleration',
    github: 'https://github.com/Kamal-Hossain52625/horizon-quantum',
    liveDemo: '#',
    metrics: [
      { label: 'Throughput Overhead', value: '< 1.8ms' },
      { label: 'Cipher Strength', value: '8192-bit' },
      { label: 'Failover Rate', value: '0.001%' }
    ],
    caseStudy: {
      challenge: 'Traditional key exchanges were susceptible to predictive entropy analysis, causing high-priority transaction channels to experience security breaches under specialized load conditions.',
      solution: 'Developed an atomic multi-threaded lattice validation scheme running locally inside a sandboxed WebAssembly execution layer to randomize keys on every transaction frame.',
      results: 'Secured all critical application layers, lowered cryptographic handshaking overheads by 75%, and eliminated zero-day credential leaks successfully.'
    }
  },
  {
    title: 'Aether Analytics',
    subtitle: 'Dynamic Semantic Knowledge Map Graph',
    category: 'Full-stack' as const,
    description: 'A distributed vector embedding database search engine visualization linking high-dimensional clusters with interactive radial trees.',
    longDescription: 'Aether Analytics allows data scientists to search and map high-dimensional database structures cleanly in a collaborative workspace. Built with specialized radial embedding layouts, it renders thousands of interconnected database nodes with real-time semantic proximity indicators.',
    techStack: 'React, D3.js, FastAPI, PostgreSQL, Tailwind CSS',
    features: 'Interactive semantic search index, High-dimensional proximity layouts, Real-time cluster group sorting',
    github: 'https://github.com/Kamal-Hossain52625/aether-analytics',
    liveDemo: '#',
    metrics: [
      { label: 'Node Capacity', value: '25,000+' },
      { label: 'Search Latency', value: '14ms' },
      { label: 'Cluster Accuracy', value: '99.2%' }
    ],
    caseStudy: {
      challenge: 'Parsing dense neural vector clusters in client systems generated massive thread blockages, freeze states, and messy layouts that confused enterprise operators.',
      solution: 'Integrated spatial grouping algorithms and lazy-loaded nodes using canvas virtual viewports to show precise sub-clusters on demand.',
      results: 'Delivered intuitive searching capabilities, boosted load performance times by 9x, and improved operational productivity.'
    }
  }
];

export default function ProjectFormModal({ project, onClose, onSave }: ProjectFormModalProps) {
  const isEditing = Boolean(project);

  const [title, setTitle] = useState(project?.title || '');
  const [subtitle, setSubtitle] = useState(project?.subtitle || '');
  const [category, setCategory] = useState<'Full-stack' | 'Frontend' | 'System' | 'Creative'>(
    project?.category || 'Full-stack'
  );
  const [description, setDescription] = useState(project?.description || '');
  const [longDescription, setLongDescription] = useState(project?.longDescription || '');
  const [techStack, setTechStack] = useState(project?.techStack?.join(', ') || '');
  const [features, setFeatures] = useState(project?.features?.join(', ') || '');
  const [github, setGithub] = useState(project?.github || '');
  const [liveDemo, setLiveDemo] = useState(project?.liveDemo || '');

  // Image & Live Preview State
  const [image, setImage] = useState(
    project?.image && project.image !== 'interactive-custom' ? project.image : ''
  );
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Metrics
  const [metric1Label, setMetric1Label] = useState(project?.metrics?.[0]?.label || 'Uptime');
  const [metric1Val, setMetric1Val] = useState(project?.metrics?.[0]?.value || '99.9%');
  const [metric2Label, setMetric2Label] = useState(project?.metrics?.[1]?.label || 'Throughput');
  const [metric2Val, setMetric2Val] = useState(project?.metrics?.[1]?.value || '10k/s');
  const [metric3Label, setMetric3Label] = useState(project?.metrics?.[2]?.label || 'Latency');
  const [metric3Val, setMetric3Val] = useState(project?.metrics?.[2]?.value || '< 5ms');

  // Case study
  const [challenge, setChallenge] = useState(project?.caseStudy?.challenge || '');
  const [solution, setSolution] = useState(project?.caseStudy?.solution || '');
  const [results, setResults] = useState(project?.caseStudy?.results?.join(', ') || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }
    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
      setIsProcessingImage(false);
    };
    reader.onerror = () => {
      alert('Failed to read image file.');
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImage(imageUrlInput.trim());
    setImageUrlInput('');
  };

  const fillTemplate = () => {
    const randomTemplate = TEMPLATE_SAMPLES[Math.floor(Math.random() * TEMPLATE_SAMPLES.length)];
    setTitle(randomTemplate.title);
    setSubtitle(randomTemplate.subtitle);
    setCategory(randomTemplate.category);
    setDescription(randomTemplate.description);
    setLongDescription(randomTemplate.longDescription);
    setTechStack(randomTemplate.techStack);
    setFeatures(randomTemplate.features);
    setGithub(randomTemplate.github);
    setLiveDemo(randomTemplate.liveDemo);
    setImage(
      randomTemplate.category === 'System'
        ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
    );

    setMetric1Label(randomTemplate.metrics[0].label);
    setMetric1Val(randomTemplate.metrics[0].value);
    setMetric2Label(randomTemplate.metrics[1].label);
    setMetric2Val(randomTemplate.metrics[1].value);
    setMetric3Label(randomTemplate.metrics[2].label);
    setMetric3Val(randomTemplate.metrics[2].value);

    setChallenge(randomTemplate.caseStudy.challenge);
    setSolution(randomTemplate.caseStudy.solution);
    setResults(randomTemplate.caseStudy.results);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!subtitle.trim()) newErrors.subtitle = 'Subtitle is required';
    if (!description.trim()) newErrors.description = 'Short description is required';
    if (!longDescription.trim()) newErrors.longDescription = 'Detailed description is required';
    if (!techStack.trim()) newErrors.techStack = 'Tech stack is required';
    if (!challenge.trim()) newErrors.challenge = 'Challenge details are required';
    if (!solution.trim()) newErrors.solution = 'Solution details are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const element = document.getElementById('project-form-container');
      if (element) element.scrollTop = 0;
      return;
    }

    const techArray = techStack.split(',').map((item) => item.trim()).filter(Boolean);
    const featuresArray = features.split(',').map((item) => item.trim()).filter(Boolean);
    const resultsArray = results.trim()
      ? results.split(',').map((item) => item.trim()).filter(Boolean)
      : ['Optimized network runtime latency', 'Maintained 99.9% uptime benchmark', 'Delivered zero downtime transition'];

    const savedProject: Project = {
      id: project?.id || 'custom-' + Date.now(),
      title,
      subtitle,
      description,
      longDescription,
      image: image.trim() || project?.image || 'interactive-custom',
      techStack: techArray,
      features: featuresArray.length > 0 ? featuresArray : ['Modular backend architecture', 'Automated optimization engines'],
      metrics: [
        { label: metric1Label || 'Throughput', value: metric1Val || 'Stable' },
        { label: metric2Label || 'Coverage', value: metric2Val || '95%' },
        { label: metric3Label || 'Load Time', value: metric3Val || '0.2s' },
      ],
      liveDemo: liveDemo.trim() || '#',
      github: github.trim() || 'https://github.com/Kamal-Hossain52625',
      category,
      caseStudy: {
        challenge,
        solution,
        results: resultsArray,
      },
    };

    onSave(savedProject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/85 backdrop-blur-xl">
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.3 }}
        id="project-form-container"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#09090c] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl z-10 no-scrollbar select-text text-white font-sans"
      >
        {/* Header Controls */}
        <div className="sticky top-0 flex justify-between items-center pb-4 border-b border-white/5 bg-gradient-to-b from-[#09090c] via-[#09090c] to-transparent z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-orange-500 font-extrabold uppercase">
              {isEditing ? `EDIT PROJECT // ${project?.title}` : 'ADD NEW PROJECT // PROTOCOL'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                type="button"
                onClick={fillTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-mono text-[9px] font-extrabold tracking-wider rounded-xl transition-all cursor-pointer uppercase shadow-lg"
              >
                <Sparkles className="w-3 h-3" /> AUTOFILL SAMPLE
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
          {Object.keys(errors).length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please review required fields marked below.</span>
            </div>
          )}

          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Horizon Quantum"
                className={`w-full p-3 bg-white/5 border ${
                  errors.title ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40'
                } rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20`}
              />
              {errors.title && <span className="text-[9px] font-mono text-rose-400">{errors.title}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 bg-zinc-950 border border-white/10 focus:border-orange-500/40 rounded-xl text-xs font-mono outline-none transition-all cursor-pointer text-white/80"
              >
                <option value="Full-stack">Full-stack</option>
                <option value="Frontend">Frontend</option>
                <option value="System">System</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
          </div>

          {/* Subtitle */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
              SUBTITLE / ARCHITECTURAL FOCUS *
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Next-Gen Cryptographic Middleware Engine"
              className={`w-full p-3 bg-white/5 border ${
                errors.subtitle ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40'
              } rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20`}
            />
            {errors.subtitle && <span className="text-[9px] font-mono text-rose-400">{errors.subtitle}</span>}
          </div>

          {/* Project Cover Image & Live Preview (Requested Feature) */}
          <div className="p-5 border border-white/10 bg-white/5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-400" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-orange-400 uppercase">
                  PROJECT COVER IMAGE & LIVE PREVIEW
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1 rounded-lg font-mono text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    imageMode === 'upload' ? 'bg-orange-500 text-white shadow' : 'text-white/40 hover:text-white'
                  }`}
                >
                  UPLOAD FILE
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1 rounded-lg font-mono text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    imageMode === 'url' ? 'bg-orange-500 text-white shadow' : 'text-white/40 hover:text-white'
                  }`}
                >
                  IMAGE URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('presets')}
                  className={`px-3 py-1 rounded-lg font-mono text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    imageMode === 'presets' ? 'bg-orange-500 text-white shadow' : 'text-white/40 hover:text-white'
                  }`}
                >
                  PRESETS
                </button>
              </div>
            </div>

            {/* Mode 1: File Upload */}
            {imageMode === 'upload' && (
              <div className="flex flex-col gap-2">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 hover:border-orange-500/40 rounded-xl bg-black/30 cursor-pointer transition-all group">
                  <Upload className="w-6 h-6 text-white/30 group-hover:text-orange-400 transition-colors mb-2" />
                  <span className="text-xs font-mono font-semibold text-white/80 group-hover:text-white">
                    {isProcessingImage ? 'Processing image...' : 'Click to browse & upload project image'}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 mt-1">
                    Supports PNG, JPG, WebP, SVG (Up to 5MB) &bull; Converted to offline base64
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessingImage}
                  />
                </label>
              </div>
            )}

            {/* Mode 2: Image URL */}
            {imageMode === 'url' && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste image link (e.g. https://images.unsplash.com/...)"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 focus:border-orange-500/50 rounded-xl text-xs font-mono text-white outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 rounded-xl font-mono text-[9px] font-bold uppercase transition-all cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
                <span className="text-[9px] font-mono text-white/40">
                  Tip: Direct URLs from Unsplash, GitHub, Imgur, or cloud storage work instantly.
                </span>
              </div>
            )}

            {/* Mode 3: Curated Presets */}
            {imageMode === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_IMAGES.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`p-2.5 border rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                      image === preset.url
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-white/10 bg-black/30 hover:border-white/20 text-white/70'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-10 h-8 rounded object-cover shrink-0"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-mono font-bold truncate">{preset.label}</span>
                      <span className="text-[8px] font-mono text-white/40">1200x800 HD</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* LIVE PREVIEW BOX */}
            <div className="mt-2 pt-3 border-t border-white/5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-wider text-white/50 uppercase">
                  CARD PREVIEW (ASPECT RATIO 16:9)
                </span>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="flex items-center gap-1 text-[9px] font-mono text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> REMOVE IMAGE
                  </button>
                )}
              </div>

              {image ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-xl group">
                  <img
                    src={image}
                    alt="Project preview"
                    className="w-full h-full object-cover object-center"
                    onError={() => {
                      alert('Image failed to load. Please check the URL.');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>COVER IMAGE ATTACHED</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono text-white/60">
                    16:9 PREVIEW
                  </div>
                </div>
              ) : (
                <div className="h-32 w-full rounded-2xl border border-white/5 bg-black/30 flex flex-col items-center justify-center text-center p-4">
                  <ImageIcon className="w-6 h-6 text-white/20 mb-1.5" />
                  <span className="text-[10px] font-mono font-semibold text-white/50">
                    No custom cover image chosen
                  </span>
                  <span className="text-[8.5px] font-sans text-white/30 max-w-sm mt-0.5">
                    This project will automatically render the interactive real-time simulation canvas on the portfolio cards.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
              SHORT SUMMARY (TEASER) *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A secure reverse proxy gateway orchestrating post-quantum TLS verifications..."
              className={`w-full p-3 bg-white/5 border ${
                errors.description ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40'
              } rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20 resize-none leading-relaxed`}
            />
            {errors.description && <span className="text-[9px] font-mono text-rose-400">{errors.description}</span>}
          </div>

          {/* Long Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
              DETAILED NARRATIVE DESCRIPTION *
            </label>
            <textarea
              rows={3}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Describe system goals, design paradigms, and architectural layers..."
              className={`w-full p-3 bg-white/5 border ${
                errors.longDescription ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40'
              } rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20 resize-none leading-relaxed`}
            />
            {errors.longDescription && <span className="text-[9px] font-mono text-rose-400">{errors.longDescription}</span>}
          </div>

          {/* Tech Stack and Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                TECH STACK * (Comma separated)
              </label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. React, Rust, D3.js, WebSockets"
                className={`w-full p-3 bg-white/5 border ${
                  errors.techStack ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40'
                } rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20`}
              />
              {errors.techStack && <span className="text-[9px] font-mono text-rose-400">{errors.techStack}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                KEY FEATURES (Comma separated)
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. Atomic handshakes, 60fps canvas, Zero telemetry lag"
                className="w-full p-3 bg-white/5 border border-white/10 focus:border-orange-500/40 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                GITHUB REPOSITORY URL
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full p-3 bg-white/5 border border-white/10 focus:border-orange-500/40 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                LIVE DEMO URL
              </label>
              <input
                type="text"
                value={liveDemo}
                onChange={(e) => setLiveDemo(e.target.value)}
                placeholder="e.g. https://... or #"
                className="w-full p-3 bg-white/5 border border-white/10 focus:border-orange-500/40 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="flex flex-col gap-3 p-4 border border-white/5 bg-white/5 rounded-2xl">
            <span className="text-[9px] font-mono font-bold tracking-widest text-orange-500 uppercase flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> THREE SYSTEM PERFORMANCE METRICS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={metric1Label}
                  onChange={(e) => setMetric1Label(e.target.value)}
                  placeholder="Metric 1 Label (e.g. Latency)"
                  className="w-full p-2.5 bg-black/40 border border-white/5 focus:border-orange-500/40 rounded-xl text-xs font-mono outline-none text-white/80"
                />
                <input
                  type="text"
                  value={metric1Val}
                  onChange={(e) => setMetric1Val(e.target.value)}
                  placeholder="Metric 1 Value (e.g. < 2.5ms)"
                  className="w-full p-2.5 bg-black/40 border border-white/5 focus:border-orange-500/40 rounded-xl text-xs font-sans font-bold outline-none text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={metric2Label}
                  onChange={(e) => setMetric2Label(e.target.value)}
                  placeholder="Metric 2 Label (e.g. Throughput)"
                  className="w-full p-2.5 bg-black/40 border border-white/5 focus:border-orange-500/40 rounded-xl text-xs font-mono outline-none text-white/80"
                />
                <input
                  type="text"
                  value={metric2Val}
                  onChange={(e) => setMetric2Val(e.target.value)}
                  placeholder="Metric 2 Value (e.g. 50k events/s)"
                  className="w-full p-2.5 bg-black/40 border border-white/5 focus:border-orange-500/40 rounded-xl text-xs font-sans font-bold outline-none text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={metric3Label}
                  onChange={(e) => setMetric3Label(e.target.value)}
                  placeholder="Metric 3 Label (e.g. Uptime)"
                  className="w-full p-2.5 bg-black/40 border border-white/5 focus:border-orange-500/40 rounded-xl text-xs font-mono outline-none text-white/80"
                />
                <input
                  type="text"
                  value={metric3Val}
                  onChange={(e) => setMetric3Val(e.target.value)}
                  placeholder="Metric 3 Value (e.g. 99.99%)"
                  className="w-full p-2.5 bg-black/40 border border-white/5 focus:border-orange-500/40 rounded-xl text-xs font-sans font-bold outline-none text-white"
                />
              </div>
            </div>
          </div>

          {/* Case Study Details */}
          <div className="flex flex-col gap-4 p-4 border border-white/5 bg-white/5 rounded-2xl">
            <span className="text-[9px] font-mono font-bold tracking-widest text-orange-500 uppercase">
              CASE STUDY AUDIT DATA
            </span>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/30 uppercase">
                THE CHALLENGE BRIEF *
              </label>
              <textarea
                rows={2}
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="e.g. Real-time rendering loops created thread blockage on low-end devices..."
                className={`w-full p-3 bg-black/40 border ${
                  errors.challenge ? 'border-rose-500/50' : 'border-white/5 focus:border-orange-500/40'
                } rounded-xl text-xs font-sans outline-none resize-none leading-relaxed`}
              />
              {errors.challenge && <span className="text-[9px] font-mono text-rose-400">{errors.challenge}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/30 uppercase">
                THE RESOLUTION / ARCHITECTURAL SOLUTION *
              </label>
              <textarea
                rows={2}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="e.g. Separated the calculation cycle from React's reconciliation engine using dedicated Web Workers..."
                className={`w-full p-3 bg-black/40 border ${
                  errors.solution ? 'border-rose-500/50' : 'border-white/5 focus:border-orange-500/40'
                } rounded-xl text-xs font-sans outline-none resize-none leading-relaxed`}
              />
              {errors.solution && <span className="text-[9px] font-mono text-rose-400">{errors.solution}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono font-bold tracking-widest text-white/30 uppercase">
                KEY MEASURABLE OUTCOMES (Comma separated)
              </label>
              <input
                type="text"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="e.g. Achieved 60 FPS, Reduced memory by 64%, Eliminated zero-day leaks"
                className="w-full p-3 bg-black/40 border border-white/5 focus:border-orange-500/40 rounded-xl text-xs font-sans outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-mono text-[9px] font-extrabold tracking-widest transition-colors cursor-pointer uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-mono text-[9px] font-extrabold tracking-widest px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer uppercase shadow-xl"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'SAVE PROJECT CHANGES' : 'CREATE NEW PROJECT'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
