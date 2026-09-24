/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser for JSON with support for Base64 image uploads
app.use(express.json({ limit: '30mb' }));

// Init Google GenAI SDK (Server-Side ONLY)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function formatApiKeyErrorMessage(error: any): string | null {
  const errMsg = typeof error?.message === 'string' ? error.message : JSON.stringify(error || '');
  if (errMsg.includes('leaked') || errMsg.includes('PERMISSION_DENIED') || errMsg.includes('API_KEY_INVALID')) {
    return 'Your current GEMINI_API_KEY was reported as expired or revoked by Google. To resolve this 100% free with no credit card: Visit https://aistudio.google.com/app/apikey, create a free API key, and add it to your project Secrets. Showing local simulation below:';
  }
  return null;
}

// ========================================================
// 100% FREE TIER ENDPOINTS (Powered by gemini-3.8-flash)
// ========================================================

// 1. Vision & UI/UX Inspector (Multimodal: Image + Text)
app.post('/api/ai/vision-inspect', async (req, res) => {
  try {
    const { image, mimeType, prompt } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Please upload an image or mockup to inspect.' });
    }

    const cleanBase64 = image.includes(',') ? image.split(',')[1] : image;
    const userPrompt = prompt && prompt.trim()
      ? prompt.trim()
      : 'Analyze this UI/UX design or screenshot in detail. Provide: 1) Visual Hierarchy & Aesthetics Audit, 2) UX & Accessibility critique, 3) Production-ready React + Tailwind CSS code structure to recreate or improve this interface.';

    try {
      const imagePart = {
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanBase64,
        },
      };

      const textPart = {
        text: userPrompt,
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: 'You are Kamal Hossain\'s AI Engineering Partner, a senior frontend architect and luxury UI/UX specialist. Provide clear, structured, actionable audits with crisp formatting, bullet points, and production-grade Tailwind CSS/React code when requested.',
        },
      });

      if (response.text) {
        return res.json({
          success: true,
          analysis: response.text,
        });
      }
    } catch (genError: any) {
      const keyNotice = formatApiKeyErrorMessage(genError);
      if (keyNotice) {
        // High quality fallback audit report so user still sees the capability
        const fallbackAudit = `### 🔍 AI UI/UX Vision Audit Report (Kamal.H Architecture System)
*(Notice: ${keyNotice})*

#### 1. Visual Hierarchy & Spacing Rhythm
- **Focal Dominance**: The primary visual anchor is well-aligned with 60-30-10 color balance. Ensure the call-to-action maintains high luminosity against background elements.
- **Glassmorphic Depth**: The background container benefits from subtle backdrop blur (\`backdrop-blur-xl\`) with translucent borders (\`border border-white/10\`) to evoke high-end tactile glassmorphism.
- **Micro-Typographic Precision**: Sub-labels and badges should utilize monospace uppercase typography (\`font-mono tracking-widest text-[10px]\`) for an engineered, contemporary finish.

#### 2. Accessibility & Contrast (WCAG 2.1 AA)
- **Contrast Ratio**: Ensure dark background text maintains at least 4.5:1 contrast against pure obsidian bases (\`#070709\`).
- **Focus Rings**: Implement explicit focus indicators (\`focus-visible:ring-2 focus-visible:ring-orange-500/80\`) for keyboard navigability.

#### 3. Recommended Production React + Tailwind Code
\`\`\`tsx
export function AuditedGlassCard() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-2xl transition-all hover:border-orange-500/40">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">
          AUDIT_STATUS // OPTIMIZED
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </div>
      <h3 className="text-xl font-bold font-sans text-white mt-3">High-Performance Vector Canvas</h3>
      <p className="text-xs text-white/60 font-light mt-1.5 leading-relaxed">
        Engineered with responsive flex layouts, GPU-accelerated motion, and fluid micro-interactions.
      </p>
    </div>
  );
}
\`\`\``;
        return res.json({
          success: true,
          analysis: fallbackAudit,
        });
      }
      throw genError;
    }

    return res.status(500).json({ error: 'Failed to inspect image.' });
  } catch (error: any) {
    console.error('Vision inspection error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to inspect image with Gemini Vision.',
    });
  }
});

// 2. Full-Stack Code & Architecture Generator
app.post('/api/ai/generate-code', async (req, res) => {
  try {
    const { prompt, language } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Please enter a feature or architecture specification.' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are a Principal Full-Stack Software Engineer and UI Architect. Target language/framework: ${language || 'React, TypeScript, Tailwind CSS'}. Output modular, highly readable, production-quality code with comments and an architectural breakdown. Avoid unnecessary filler text.`,
        },
      });

      if (response.text) {
        return res.json({
          success: true,
          code: response.text,
        });
      }
    } catch (genError: any) {
      const keyNotice = formatApiKeyErrorMessage(genError);
      if (keyNotice) {
        const fallbackCode = `// [Notice: ${keyNotice}]
// Generated with Kamal.H Production Architecture Standards
// Target: ${language || 'React + TypeScript + Tailwind CSS'}
// Specification: "${prompt}"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface ComponentProps {
  title?: string;
  onActionComplete?: (payload: { id: string; timestamp: number }) => void;
  className?: string;
}

export const ModernArchitecturalComponent: React.FC<ComponentProps> = ({
  title = "${prompt.replace(/"/g, "'")}",
  onActionComplete,
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecute = async () => {
    setIsProcessing(true);
    // Simulate lightweight optimistic execution
    await new Promise((r) => setTimeout(r, 600));
    setIsProcessing(false);
    setIsActive(true);
    onActionComplete?.({ id: 'action_' + Date.now(), timestamp: Date.now() });
  };

  return (
    <div className={\`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12]/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:border-orange-500/40 \${className}\`}>
      {/* Top Accent Status */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/90 font-bold">
            PRODUCTION READY
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/40">TSX // TAILWIND V4</span>
      </div>

      {/* Main Body */}
      <div className="mt-4 flex flex-col gap-2">
        <h4 className="text-lg font-bold tracking-tight text-white">{title}</h4>
        <p className="text-xs text-white/60 leading-relaxed font-light">
          Self-contained modular component with declarative state, accessible touch targets, and fluid frame transitions.
        </p>
      </div>

      {/* Interactive Trigger */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handleExecute}
          disabled={isProcessing}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 font-mono text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : isActive ? 'Re-execute' : 'Trigger Action'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {isActive && (
          <span className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-semibold">
            <Check className="w-3.5 h-3.5" /> Verified
          </span>
        )}
      </div>
    </div>
  );
};

export default ModernArchitecturalComponent;`;
        return res.json({
          success: true,
          code: fallbackCode,
        });
      }
      throw genError;
    }

    return res.status(500).json({ error: 'Failed to generate code.' });
  } catch (error: any) {
    console.error('Code generation error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate code.',
    });
  }
});

// 3. Technical Consultation & Project Estimator
app.post('/api/ai/consult', async (req, res) => {
  try {
    const { question, projectType } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Please ask a technical question or project challenge.' });
    }

    try {
      const systemPrompt = `You are the AI Digital Twin of Kamal Hossain, a Creative UI Engineer & Full-Stack Architect with 5+ years of experience in React, Next.js, TypeScript, Tailwind CSS, WebGL, Node.js, and high-performance design systems.
Tone: Confident, insightful, pragmatic, polite, and deeply knowledgeable. 
Project Context: ${projectType || 'Modern Web Application'}.
Provide high-value technical advice, recommended stack choices, performance benchmarks, and delivery estimates.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      if (response.text) {
        return res.json({
          success: true,
          answer: response.text,
        });
      }
    } catch (genError: any) {
      const keyNotice = formatApiKeyErrorMessage(genError);
      if (keyNotice) {
        const fallbackConsult = `### 💡 Architectural Advisory from Kamal.H
*(Notice: ${keyNotice})*

**Project Scope / Domain**: ${projectType || 'High-Performance Web Application'}  
**Inquiry**: "${question}"

---

#### 1. Core Architectural Strategy
For a modern high-scale application, I strongly recommend a **Hybrid Decoupled Architecture**:
- **Frontend Core**: React 19 + TypeScript on Vite (or Next.js 15 App Router if programmatic SEO and SSR streaming are fundamental business drivers).
- **Styling Architecture**: Tailwind CSS with strict CSS-variable design tokens (ensuring sub-millisecond repaint latency and zero runtime CSS overhead).
- **State Topology**: Lightweight atomic state management (Zustand or Jotai) paired with TanStack Query for declarative server-state caching and automatic background refetching.

#### 2. Performance & Delivery Benchmarks
- **Lighthouse Goals**: Target >95 across Performance, Accessibility, Best Practices, and SEO through aggressive image optimization (modern WebP/AVIF with responsive \`srcset\`), code-splitting, and dynamic route preloading.
- **Estimated MVP Horizon**: A fully polished, high-fidelity MVP with end-to-end type safety typically requires **2 to 3 sprint cycles (3–5 weeks)** from architectural blueprint to production deployment.

Feel free to connect directly via the Contact section below if you would like to review detailed sprint milestones!`;
        return res.json({
          success: true,
          answer: fallbackConsult,
        });
      }
      throw genError;
    }

    return res.status(500).json({ error: 'Failed to provide consultation.' });
  } catch (error: any) {
    console.error('Consultation error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to provide consultation.',
    });
  }
});

// ==========================================
// Vite Dev Server / Static Hosting
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[AI Studio Free] Server active on port ${PORT}`);
  });
}

startServer();
