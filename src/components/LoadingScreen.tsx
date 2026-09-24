/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingSteps = [
  'BOOTSTRAPPING INTERFACE...',
  'SYNTHESIZING COMPONENT LAYOUTS...',
  'DRAFTING GEOMETRICAL MATRICES...',
  'RENDERING DARK LUXURY ENVIRONMENT...',
  'READY'
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Accelerate near the end
        const increment = prev > 80 ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 4) + 1;
        return Math.min(prev + increment, 100);
      });
    }, 45);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Cycle through steps based on progress
    const stepPart = 100 / loadingSteps.length;
    const currentStep = Math.min(Math.floor(progress / stepPart), loadingSteps.length - 1);
    setStepIndex(currentStep);
    
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      id="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-luxury-black p-8 md:p-16 select-none font-sans"
    >
      {/* Top section: Brand Signature */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs text-gold-400 tracking-[0.2em] font-medium"
          >
            KAMAL HOSSAIN
          </motion.span>
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
            Senior Full-Stack Developer
          </span>
        </div>
        <div className="font-mono text-xs text-zinc-600">
          PORTFOLIO 2.0 // EST. 2026
        </div>
      </div>

      {/* Middle section: Brand Initials and Percentage */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          {/* Subtle halo glow behind the loading initials */}
          <div className="absolute inset-0 bg-gold-500/10 rounded-full blur-[80px] -z-10 w-48 h-48 mx-auto" />
          
          <h1 className="font-serif italic text-6xl md:text-8xl text-gold-100 tracking-tighter select-none font-medium">
            K<span className="text-gold-400">.</span>H
          </h1>
        </motion.div>
        
        {/* Dynamic percentage */}
        <div className="mt-8 font-serif italic text-5xl md:text-7xl text-gold-300 select-none font-bold">
          {progress}%
        </div>
        
        {/* Status text */}
        <div className="h-6 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-xs text-zinc-500 tracking-[0.15em] uppercase font-semibold"
            >
              {loadingSteps[stepIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom section: loading progress bar */}
      <div className="w-full flex flex-col gap-4">
        <div className="h-[2px] w-full bg-zinc-900 overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 tracking-wider">
          <div>AWWWARDS CANDIDATE ARCHITECTURE</div>
          <div>© 2026 ALL RIGHTS RESERVED</div>
        </div>
      </div>
    </motion.div>
  );
}
