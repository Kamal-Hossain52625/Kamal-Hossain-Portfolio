/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Code2, 
  Eye, 
  Bot, 
  Upload, 
  RefreshCw, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle,
  Cpu,
  Layers,
  CheckCircle2,
  FileCode,
  Zap
} from 'lucide-react';

type LabTab = 'vision' | 'code-gen' | 'consult';

const SAMPLE_CODE_PROMPTS = [
  'Build a responsive glassmorphic pricing card with monthly/yearly toggle in React and Tailwind CSS',
  'Create a custom useDebounce hook with TypeScript generics and cancelable timeout',
  'Design an accessible modal dialog with backdrop blur, Escape key listener, and focus trapping',
  'Write a high-performance infinite scroll virtualized feed in React'
];

const SAMPLE_CONSULT_PROMPTS = [
  'What is the optimal tech stack for building a real-time collaborative dashboard in 2026?',
  'How do I achieve a 100/100 Lighthouse performance score with Next.js and Tailwind CSS?',
  'What are the key trade-offs between Server Components (RSC) and Client-Side rendering for portfolios?'
];

export default function AiCreativeLab() {
  const [activeTab, setActiveTab] = useState<LabTab>('vision');

  // --- Tab 1: Vision Inspector State ---
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionMimeType, setVisionMimeType] = useState<string>('image/png');
  const [visionPrompt, setVisionPrompt] = useState<string>('');
  const [visionLoading, setVisionLoading] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);
  const [visionError, setVisionError] = useState<string | null>(null);

  // --- Tab 2: Code & Architecture Generator State ---
  const [codePrompt, setCodePrompt] = useState<string>('');
  const [codeLanguage, setCodeLanguage] = useState<string>('React + TypeScript + Tailwind');
  const [codeLoading, setCodeLoading] = useState<boolean>(false);
  const [codeResult, setCodeResult] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // --- Tab 3: AI Consultation State ---
  const [consultQuestion, setConsultQuestion] = useState<string>('');
  const [consultProjectType, setConsultProjectType] = useState<string>('High-Performance Web App');
  const [consultLoading, setConsultLoading] = useState<boolean>(false);
  const [consultResult, setConsultResult] = useState<string | null>(null);
  const [consultError, setConsultError] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Image Upload handler
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setVisionImage(event.target?.result as string);
      setVisionMimeType(file.type || 'image/png');
      setVisionResult(null);
      setVisionError(null);
    };
    reader.readAsDataURL(file);
  };

  // 1. Run Vision Analysis
  const handleRunVisionAudit = async () => {
    if (!visionImage) {
      setVisionError('Please upload an image or UI screenshot first.');
      return;
    }

    setVisionLoading(true);
    setVisionError(null);

    try {
      const res = await fetch('/api/ai/vision-inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: visionImage,
          mimeType: visionMimeType,
          prompt: visionPrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.analysis) {
        throw new Error(data.error || 'Failed to analyze UI.');
      }

      setVisionResult(data.analysis);
    } catch (err: any) {
      setVisionError(err?.message || 'Error executing vision analysis.');
    } finally {
      setVisionLoading(false);
    }
  };

  // 2. Run Code Generator
  const handleGenerateCode = async () => {
    if (!codePrompt.trim()) {
      setCodeError('Please describe the component or architecture you want to build.');
      return;
    }

    setCodeLoading(true);
    setCodeError(null);

    try {
      const res = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: codePrompt.trim(),
          language: codeLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.code) {
        throw new Error(data.error || 'Failed to generate code.');
      }

      setCodeResult(data.code);
    } catch (err: any) {
      setCodeError(err?.message || 'Error during code generation.');
    } finally {
      setCodeLoading(false);
    }
  };

  // 3. Run AI Consultation
  const handleConsult = async () => {
    if (!consultQuestion.trim()) {
      setConsultError('Please enter your engineering question or architectural query.');
      return;
    }

    setConsultLoading(true);
    setConsultError(null);

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: consultQuestion.trim(),
          projectType: consultProjectType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.answer) {
        throw new Error(data.error || 'Failed to retrieve consultation.');
      }

      setConsultResult(data.answer);
    } catch (err: any) {
      setConsultError(err?.message || 'Error occurred during consultation.');
    } finally {
      setConsultLoading(false);
    }
  };

  return (
    <section id="ai-studio" className="relative py-28 bg-[#070709] text-white border-t border-white/5 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-[130px] pointer-events-none select-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold tracking-widest uppercase mb-4 shadow-lg backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            100% FREE TIER // GEMINI 3.8 FLASH
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-tight uppercase mb-4 text-white">
            AI Engineering & Vision Lab
          </h2>

          <p className="max-w-2xl font-sans text-xs sm:text-sm text-white/60 font-light leading-relaxed">
            Experience Kamal's custom AI engineering toolkit powered by Google's fastest free-tier model, <span className="text-orange-400 font-mono font-medium">gemini-3.8-flash</span>. 
            Audit UI designs with multimodal vision, generate production-grade code, or receive instant technical architecture consultations without any paid subscription or credit card.
          </p>

          {/* Module Selector Tabs */}
          <div className="flex items-center gap-2 p-1.5 mt-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('vision')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'vision'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>UI/UX Vision Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('code-gen')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'code-gen'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Full-Stack Code Architect</span>
            </button>

            <button
              onClick={() => setActiveTab('consult')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'consult'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Kamal's AI Tech Twin</span>
            </button>
          </div>
        </div>

        {/* Dynamic Studio Card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-10 shadow-2xl overflow-hidden">
          
          {/* ======================================================== */}
          {/* TAB 1: UI/UX VISION INSPECTOR (Multimodal Gemini Flash) */}
          {/* ======================================================== */}
          {activeTab === 'vision' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Image Upload & Custom Question */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Engine:</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      gemini-3.8-flash (Free)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Multimodal Vision</span>
                </div>

                {/* Upload Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-white/70 uppercase">
                    Upload UI Screenshot or Wireframe:
                  </label>
                  <div className="relative border-2 border-dashed border-white/15 hover:border-orange-500/50 transition-colors rounded-2xl p-4 bg-black/30 flex flex-col items-center justify-center gap-3 text-center">
                    {visionImage ? (
                      <div className="relative w-full h-52 rounded-xl overflow-hidden group">
                        <img src={visionImage} alt="Uploaded for inspection" className="w-full h-full object-contain bg-black/40" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer px-3.5 py-2 bg-orange-500 rounded-xl text-xs font-mono font-bold text-white shadow-lg">
                            Choose Another Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2 py-10 w-full">
                        <Upload className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-mono text-white/80 font-semibold">
                          Upload website screenshot or design mockup
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">PNG, JPG, WEBP formats</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Specific Audit Question */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-white/70 uppercase">
                    Specific Audit Focus (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={visionPrompt}
                    onChange={(e) => setVisionPrompt(e.target.value)}
                    placeholder="e.g. Audit this landing page for visual hierarchy, dark mode contrast, and generate Tailwind CSS code to rebuild the hero card."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-sans text-white focus:outline-none focus:border-orange-500/60 placeholder:text-white/20 transition-all resize-none"
                  />
                </div>

                {visionError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{visionError}</span>
                  </div>
                )}

                <button
                  disabled={visionLoading || !visionImage}
                  onClick={handleRunVisionAudit}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {visionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Analyzing UI Architecture with Gemini Flash...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-white" />
                      Run Free UI/UX & Code Audit
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Audit Results Report */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white/70 uppercase">Gemini Vision Audit Report</span>
                  {visionResult && (
                    <button
                      onClick={() => handleCopy(visionResult)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all text-xs flex items-center gap-1.5 font-mono"
                    >
                      {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{codeCopied ? 'Copied' : 'Copy Report'}</span>
                    </button>
                  )}
                </div>

                <div className="w-full min-h-[420px] max-h-[580px] rounded-2xl border border-white/10 bg-black/50 p-6 overflow-y-auto">
                  {visionLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-16">
                      <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
                      <span className="text-xs font-mono text-white/80 font-bold uppercase tracking-wider">
                        Inspecting Layout, Contrast & Color Palette...
                      </span>
                      <span className="text-[11px] font-sans text-white/40 max-w-xs">
                        Gemini 3.8 Flash is evaluating visual hierarchy, spacing, accessibility standards, and code components.
                      </span>
                    </div>
                  ) : visionResult ? (
                    <div className="prose prose-invert prose-xs sm:prose-sm max-w-none font-sans text-white/90 leading-relaxed whitespace-pre-wrap">
                      {visionResult}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-20 text-white/30">
                      <Eye className="w-12 h-12 stroke-[1.2]" />
                      <span className="text-xs font-mono uppercase tracking-wider font-bold">Report Viewport Idle</span>
                      <span className="text-[11px] font-sans max-w-xs font-light">
                        Upload any website screenshot or UI design on the left to receive an instant, free architectural critique and code breakdown.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: FULL-STACK CODE ARCHITECT (Free Gemini Flash) */}
          {/* ======================================================== */}
          {activeTab === 'code-gen' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Code Request Form */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Engine:</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      gemini-3.8-flash (Free)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Clean Code Matrix</span>
                </div>

                {/* Framework Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-white/70 uppercase">Target Tech Stack:</label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500/60 cursor-pointer"
                  >
                    <option value="React + TypeScript + Tailwind CSS">React + TypeScript + Tailwind CSS</option>
                    <option value="Next.js 15 Server Actions & RSC">Next.js 15 Server Actions & RSC</option>
                    <option value="Node.js Express + TypeScript API">Node.js Express + TypeScript API</option>
                    <option value="Custom React Hook + State Machine">Custom React Hook + State Machine</option>
                    <option value="Tailwind CSS Glassmorphism UI Component">Tailwind CSS Glassmorphism UI Component</option>
                  </select>
                </div>

                {/* Prompt Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-white/70 uppercase">Component / Architecture Prompt:</label>
                  <textarea
                    rows={4}
                    value={codePrompt}
                    onChange={(e) => setCodePrompt(e.target.value)}
                    placeholder="e.g. Build an animated biometric authentication button in React with Tailwind CSS, error states, and pulse effects..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-sans text-white focus:outline-none focus:border-orange-500/60 placeholder:text-white/20 transition-all resize-none"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">Example Architectural Tasks:</span>
                  <div className="flex flex-col gap-1.5">
                    {SAMPLE_CODE_PROMPTS.slice(0, 3).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setCodePrompt(prompt)}
                        className="text-left text-[11px] font-sans text-white/60 hover:text-orange-400 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl px-3 py-2 transition-all truncate"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>

                {codeError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{codeError}</span>
                  </div>
                )}

                <button
                  disabled={codeLoading}
                  onClick={handleGenerateCode}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {codeLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Generating Modular TypeScript Code...
                    </>
                  ) : (
                    <>
                      <Code2 className="w-4 h-4 text-white" />
                      Generate Production Code
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Generated Code Display */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white/70 uppercase">Generated Code Artifact</span>
                  {codeResult && (
                    <button
                      onClick={() => handleCopy(codeResult)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all text-xs flex items-center gap-1.5 font-mono"
                    >
                      {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{codeCopied ? 'Copied to Clipboard' : 'Copy Code'}</span>
                    </button>
                  )}
                </div>

                <div className="w-full min-h-[420px] max-h-[580px] rounded-2xl border border-white/10 bg-[#060608] p-5 overflow-y-auto font-mono text-xs">
                  {codeLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
                      <Cpu className="w-8 h-8 text-orange-400 animate-pulse" />
                      <span className="text-xs font-mono text-white/80 font-bold uppercase tracking-wider">
                        Compiling Component Architecture...
                      </span>
                      <span className="text-[11px] font-sans text-white/40 max-w-xs">
                        Gemini 3.8 Flash is assembling TypeScript types, hook logic, and responsive Tailwind styling.
                      </span>
                    </div>
                  ) : codeResult ? (
                    <pre className="text-white/90 whitespace-pre-wrap leading-relaxed font-mono">
                      {codeResult}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-20 text-white/30 font-sans">
                      <FileCode className="w-12 h-12 stroke-[1.2]" />
                      <span className="text-xs font-mono uppercase tracking-wider font-bold">Code Terminal Idle</span>
                      <span className="text-[11px] max-w-xs font-light">
                        Select your preferred stack and describe any UI component, state hook, or API endpoint to generate ready-to-paste code.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: KAMAL'S AI TECH TWIN (Free Consultation) */}
          {/* ======================================================== */}
          {activeTab === 'consult' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Consultation Prompt */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Digital Twin:</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      gemini-3.8-flash (Free)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Kamal.H AI Engine</span>
                </div>

                {/* Project Domain */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-white/70 uppercase">Project Domain / Scope:</label>
                  <select
                    value={consultProjectType}
                    onChange={(e) => setConsultProjectType(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500/60 cursor-pointer"
                  >
                    <option value="SaaS & High-Performance Web Application">SaaS & High-Performance Web Application</option>
                    <option value="Luxury Creative Portfolio & Spatial UI">Luxury Creative Portfolio & Spatial UI</option>
                    <option value="Fintech / E-Commerce High-Scale System">Fintech / E-Commerce High-Scale System</option>
                    <option value="Design System & Micro-Frontend Architecture">Design System & Micro-Frontend Architecture</option>
                  </select>
                </div>

                {/* Question Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-white/70 uppercase">Technical Question or Challenge:</label>
                  <textarea
                    rows={4}
                    value={consultQuestion}
                    onChange={(e) => setConsultQuestion(e.target.value)}
                    placeholder="e.g. We are building a high-traffic fintech web app. Should we choose Next.js with App Router or a Vite React SPA with Node.js microservices? Explain performance and team delivery trade-offs."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-sans text-white focus:outline-none focus:border-orange-500/60 placeholder:text-white/20 transition-all resize-none"
                  />
                </div>

                {/* Presets */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">Consultation Prompts:</span>
                  <div className="flex flex-col gap-1.5">
                    {SAMPLE_CONSULT_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setConsultQuestion(prompt)}
                        className="text-left text-[11px] font-sans text-white/60 hover:text-orange-400 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl px-3 py-2 transition-all truncate"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>

                {consultError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{consultError}</span>
                  </div>
                )}

                <button
                  disabled={consultLoading}
                  onClick={handleConsult}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {consultLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Kamal's AI Twin is Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-white" />
                      Consult Technical Twin
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Advisory Response */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white/70 uppercase">Kamal's Architectural Advisory</span>
                  {consultResult && (
                    <button
                      onClick={() => handleCopy(consultResult)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all text-xs flex items-center gap-1.5 font-mono"
                    >
                      {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{codeCopied ? 'Copied' : 'Copy Advice'}</span>
                    </button>
                  )}
                </div>

                <div className="w-full min-h-[420px] max-h-[580px] rounded-2xl border border-white/10 bg-black/50 p-6 overflow-y-auto">
                  {consultLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
                      <Bot className="w-8 h-8 text-orange-400 animate-bounce" />
                      <span className="text-xs font-mono text-white/80 font-bold uppercase tracking-wider">
                        Formulating Architectural Recommendation...
                      </span>
                      <span className="text-[11px] font-sans text-white/40 max-w-xs">
                        Reviewing modern industry best practices, performance metrics, and production-tested patterns.
                      </span>
                    </div>
                  ) : consultResult ? (
                    <div className="prose prose-invert prose-xs sm:prose-sm max-w-none font-sans text-white/90 leading-relaxed whitespace-pre-wrap">
                      {consultResult}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-20 text-white/30 font-sans">
                      <Bot className="w-12 h-12 stroke-[1.2]" />
                      <span className="text-xs font-mono uppercase tracking-wider font-bold">Consultation Chamber Ready</span>
                      <span className="text-[11px] max-w-xs font-light">
                        Ask any engineering, stack decision, or system design challenge to receive an instant, high-level technical assessment.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
