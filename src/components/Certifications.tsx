/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { certificationsData } from '../data';
import { Certification } from '../types';
import { Award, ShieldCheck, ArrowUpRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface CertificationsProps {
  isVisible?: boolean;
  onClose?: () => void;
  isExpandedOnMobile?: boolean;
  onToggleExpandMobile?: (expanded: boolean) => void;
}

function CredentialCard({ cert, isFeatured = false }: { cert: Certification; isFeatured?: boolean; key?: string }) {
  return (
    <div
      className={`group relative flex flex-col justify-between p-6 bg-white/5 border ${
        isFeatured ? 'border-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.12)]' : 'border-white/10'
      } backdrop-blur-2xl rounded-2xl transition-all duration-300 hover:border-white/25 shadow-2xl`}
    >
      <div>
        {/* Header issuer info */}
        <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono font-extrabold tracking-widest text-white/40 uppercase">ISSUER</span>
            <span className="text-xs font-semibold text-white mt-0.5">{cert.issuer}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isFeatured && (
              <span className="text-[8px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 hidden xs:inline-block">
                TOP TIER
              </span>
            )}
            <Award className="w-4 h-4 text-orange-400 opacity-90" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-sans text-xs md:text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-snug mb-3 uppercase italic">
          {cert.title}
        </h3>

        <p className="font-mono text-[9px] text-white/40">
          DATE: <span className="text-white/60">{cert.date}</span>
        </p>

        <p className="font-mono text-[9px] text-white/40 mt-1">
          ID: <span className="text-white/60">{cert.credentialId}</span>
        </p>
      </div>

      {/* Verified Badge Footer */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> SECURE_VERIFIED
        </span>

        <a
          href={cert.url}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 border border-white/10 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label={`Verify credential for ${cert.title}`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function Certifications({
  isVisible = false,
  onClose,
  isExpandedOnMobile = true,
  onToggleExpandMobile,
}: CertificationsProps) {
  // Mobile expand/less state: default to expanded when opened via navbar
  const [localExpandedMobile, setLocalExpandedMobile] = useState<boolean>(true);

  // Sync external prop if provided
  useEffect(() => {
    if (typeof isExpandedOnMobile === 'boolean') {
      setLocalExpandedMobile(isExpandedOnMobile);
    }
  }, [isExpandedOnMobile]);

  const isExpanded = typeof isExpandedOnMobile === 'boolean' ? isExpandedOnMobile : localExpandedMobile;

  const handleToggle = (expand: boolean) => {
    setLocalExpandedMobile(expand);
    if (onToggleExpandMobile) {
      onToggleExpandMobile(expand);
    }
  };

  return (
    <section 
      id="certifications" 
      className={`relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden bg-grid-pattern ${
        isVisible ? 'block' : 'hidden'
      }`}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[250px] h-[250px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation Indicator / Dismiss Bar */}
        {isVisible && (
          <div className="mb-10 p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> NAVIGATED FROM NAVBAR // CREDENTIALS & CERTIFICATIONS
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="text-[9px] font-mono bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-white/90 hover:text-white transition-all cursor-pointer font-bold flex items-center gap-1"
                aria-label="Hide Certifications section"
              >
                HIDE SECTION ✕
              </button>
            )}
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 md:mb-16">
          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
              06 // GLOBAL RECOGNITION
            </span>
            <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
              Credentials & Certifications
            </h2>
            {/* Mobile status indicator */}
            <div className="md:hidden flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                {isExpanded ? 'FULL ARCHIVE' : 'COMPACT'}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {isExpanded ? `All ${certificationsData.length} visible` : `1 of ${certificationsData.length} visible`}
              </span>
            </div>
          </div>

          {/* Mobile Header Quick-Toggle Pill */}
          <div className="md:hidden">
            <button
              onClick={() => handleToggle(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 font-mono text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExpanded ? 'COLLAPSE' : `SHOW ALL (${certificationsData.length})`}</span>
              </div>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 animate-bounce" />}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP VIEW: Full 4-Column Grid (Always visible on md+ screens) */}
        {/* ============================================================== */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificationsData.map((cert) => (
            <CredentialCard key={cert.id} cert={cert} />
          ))}
        </div>

        {/* ============================================================== */}
        {/* MOBILE VIEW: "Less" by default, Tap to Expand to show all       */}
        {/* ============================================================== */}
        <div className="md:hidden flex flex-col gap-4">
          {!isExpanded ? (
            /* LESS STATE: Show only 1 featured credential + prominent TAP TO EXPAND button */
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50 px-1">
                <span className="text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> PRIMARY RECOGNITION
                </span>
                <span>LESS MODE ACTIVE</span>
              </div>

              {/* Only 1 featured card rendered */}
              <CredentialCard cert={certificationsData[0]} isFeatured={true} />

              {/* Tactile High-Conversion "TAP TO EXPAND" Button */}
              <div className="mt-2 flex flex-col items-center gap-2">
                <button
                  onClick={() => handleToggle(true)}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-white/5 to-orange-500/20 hover:from-orange-500/30 hover:to-orange-500/30 border border-orange-500/40 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-[0_4px_20px_rgba(249,115,22,0.15)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-extrabold tracking-wider">
                      VIEW ALL {certificationsData.length} CREDENTIALS
                    </span>
                  </div>
                  <span className="text-[10px] text-orange-400 font-extrabold bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30 flex items-center gap-1">
                    TAP TO EXPAND <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  </span>
                </button>
                <span className="text-[9px] font-mono text-white/40 tracking-wider">
                  Currently showing less • Tap to reveal {certificationsData.length - 1} more verified credentials
                </span>
              </div>
            </div>
          ) : (
            /* EXPANDED STATE: Reveal all credentials with smooth animation + SHOW LESS toggle */
            <AnimatePresence>
              <div className="flex flex-col gap-4">
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> ALL {certificationsData.length} CREDENTIALS UNLOCKED
                  </span>
                  <button
                    onClick={() => handleToggle(false)}
                    className="text-[9px] font-mono bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-white/90 cursor-pointer font-bold"
                  >
                    SHOW LESS
                  </button>
                </div>

                {certificationsData.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                  >
                    <CredentialCard cert={cert} isFeatured={index === 0} />
                  </motion.div>
                ))}

                {/* Bottom Collapse Button */}
                <div className="mt-2 flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      handleToggle(false);
                      const el = document.getElementById('certifications');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
                  >
                    <ChevronUp className="w-4 h-4 text-orange-400" />
                    <span>SHOW LESS (COMPACT VIEW)</span>
                  </button>
                  <span className="text-[9px] font-mono text-white/40 tracking-wider">
                    Viewing all {certificationsData.length} certifications
                  </span>
                </div>
              </div>
            </AnimatePresence>
          )}
        </div>

      </div>
    </section>
  );
}
