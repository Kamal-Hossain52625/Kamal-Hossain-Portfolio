/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Certification } from '../types';
import { getStoredCertifications, subscribeToCertifications } from '../lib/certificatesStorage';
import { isUserAdmin } from '../lib/storage';
import CertificateViewerModal from './CertificateViewerModal';
import {
  Award,
  ShieldCheck,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Eye,
  Settings,
  Plus
} from 'lucide-react';

interface CertificationsProps {
  isVisible?: boolean;
  onClose?: () => void;
  isExpandedOnMobile?: boolean;
  onToggleExpandMobile?: (expanded: boolean) => void;
}

function CredentialCard({
  cert,
  isFeatured = false,
  onOpenViewer,
}: {
  cert: Certification;
  isFeatured?: boolean;
  onOpenViewer: (cert: Certification) => void;
  key?: string;
}) {
  const isPdf =
    cert.fileType === 'pdf' ||
    cert.fileDataUrl?.startsWith('data:application/pdf') ||
    cert.fileName?.toLowerCase().endsWith('.pdf');
  const hasFile = Boolean(cert.fileDataUrl);

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 md:p-6 bg-white/5 border ${
        isFeatured ? 'border-orange-500/35 shadow-[0_0_30px_rgba(249,115,22,0.12)]' : 'border-white/10'
      } backdrop-blur-2xl rounded-2xl transition-all duration-300 hover:border-orange-500/40 shadow-2xl flex-1`}
    >
      <div>
        {/* Header issuer info & badges */}
        <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[8px] font-mono font-extrabold tracking-widest text-white/40 uppercase">
              ISSUER
            </span>
            <span className="text-xs font-semibold text-white mt-0.5 truncate">
              {cert.issuer}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {hasFile && (
              <span
                className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                  isPdf
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                }`}
              >
                {cert.fileType?.toUpperCase() || (isPdf ? 'PDF' : 'IMAGE')}
              </span>
            )}
            {isFeatured && (
              <span className="text-[8px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 hidden xs:inline-block">
                TOP TIER
              </span>
            )}
            <Award className="w-4 h-4 text-orange-400 opacity-90" />
          </div>
        </div>

        {/* Document Thumbnail / Interactive Preview Strip */}
        {hasFile && (
          <div
            onClick={() => onOpenViewer(cert)}
            className="relative h-32 w-full rounded-xl overflow-hidden bg-black/60 mb-4 border border-white/10 flex items-center justify-center cursor-pointer group/thumb select-none transition-all duration-300 group-hover:border-orange-500/30"
          >
            {isPdf ? (
              <div className="flex flex-col items-center justify-center p-3 text-center">
                <FileText className="w-8 h-8 text-orange-400 mb-1.5 group-hover/thumb:scale-110 transition-transform" />
                <span className="text-[11px] font-mono font-bold text-white truncate max-w-[170px]">
                  {cert.fileName || 'PDF Document'}
                </span>
                <span className="text-[9px] font-mono text-white/40 mt-0.5">
                  {cert.fileSize || 'Interactive PDF'}
                </span>
              </div>
            ) : (
              <img
                src={cert.fileDataUrl}
                alt={cert.title}
                className="w-full h-full object-contain p-1.5 group-hover/thumb:scale-105 transition-transform duration-500"
              />
            )}

            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/60 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover/thumb:opacity-100 px-3 py-1.5 rounded-lg bg-orange-500 text-black font-mono text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-all scale-90 group-hover/thumb:scale-100">
                <Eye className="w-3.5 h-3.5" /> Preview Document
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        <h3
          onClick={() => onOpenViewer(cert)}
          className="font-sans text-xs md:text-sm font-bold text-white group-hover:text-orange-300 transition-colors leading-snug mb-2.5 uppercase italic cursor-pointer line-clamp-2"
        >
          {cert.title}
        </h3>

        <div className="space-y-0.5 font-mono text-[9px] text-white/40 mb-3">
          <p>
            DATE: <span className="text-white/60">{cert.date}</span>
          </p>
          <p>
            ID: <span className="text-white/60">{cert.credentialId}</span>
          </p>
        </div>
      </div>

      {/* Verified Badge & Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> SECURE_VERIFIED
        </span>

        <div className="flex items-center gap-1.5">
          {/* Preview Document Button */}
          <button
            onClick={() => onOpenViewer(cert)}
            className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
            title="Preview certificate document"
          >
            <Eye className="w-3 h-3" />
            <span>VIEW</span>
          </button>

          {/* External Verification Link */}
          {cert.url && cert.url !== '#' && (
            <a
              href={cert.url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 border border-white/10 rounded-lg text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-label={`Verify credential for ${cert.title}`}
              title="Official verification website"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
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
  const [certifications, setCertifications] = useState<Certification[]>(getStoredCertifications);
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);
  const [localExpandedMobile, setLocalExpandedMobile] = useState<boolean>(true);
  const isAdmin = isUserAdmin();

  // Subscribe to real-time additions and updates from Admin Backend
  useEffect(() => {
    const unsub = subscribeToCertifications((updatedCerts) => {
      setCertifications(updatedCerts);
    });
    return unsub;
  }, []);

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

            {/* Subtitle describing personal verified certificates */}
            <p className="text-white/50 text-xs md:text-sm max-w-2xl leading-relaxed">
              Official industry certifications and licenses in Laravel Backend, React, Cloud & System Architecture (PDF, JPEG, PNG).
            </p>

            {/* Mobile status indicator */}
            <div className="md:hidden flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                {isExpanded ? 'FULL ARCHIVE' : 'COMPACT'}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {isExpanded ? `All ${certifications.length} visible` : `1 of ${certifications.length} visible`}
              </span>
            </div>
          </div>

          {/* Desktop & Mobile Actions */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-mono text-[10px] font-bold uppercase transition-all"
                title="Manage and upload certificates in Admin Backend"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>MANAGE IN ADMIN</span>
              </a>
            )}

            {/* Mobile Header Quick-Toggle Pill */}
            <div className="md:hidden">
              <button
                onClick={() => handleToggle(!isExpanded)}
                className="inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 font-mono text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isExpanded ? 'COLLAPSE' : `SHOW ALL (${certifications.length})`}</span>
                </div>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 animate-bounce" />}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP VIEW: Full Grid (Always visible on md+ screens)          */}
        {/* ============================================================== */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {certifications.map((cert) => (
            <CredentialCard
              key={cert.id}
              cert={cert}
              onOpenViewer={(selected) => setPreviewCert(selected)}
            />
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

              {/* 1 featured card rendered */}
              {certifications.length > 0 && (
                <CredentialCard
                  cert={certifications[0]}
                  isFeatured={true}
                  onOpenViewer={(selected) => setPreviewCert(selected)}
                />
              )}

              {/* Tactile High-Conversion "TAP TO EXPAND" Button */}
              <div className="mt-2 flex flex-col items-center gap-2">
                <button
                  onClick={() => handleToggle(true)}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-white/5 to-orange-500/20 hover:from-orange-500/30 hover:to-orange-500/30 border border-orange-500/40 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-[0_4px_20px_rgba(249,115,22,0.15)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-extrabold tracking-wider">
                      VIEW ALL {certifications.length} CREDENTIALS
                    </span>
                  </div>
                  <span className="text-[10px] text-orange-400 font-extrabold bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30 flex items-center gap-1">
                    TAP TO EXPAND <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  </span>
                </button>
                <span className="text-[9px] font-mono text-white/40 tracking-wider">
                  Currently showing less • Tap to reveal {Math.max(0, certifications.length - 1)} more verified credentials
                </span>
              </div>
            </div>
          ) : (
            /* EXPANDED STATE: Reveal all credentials with smooth animation + SHOW LESS toggle */
            <AnimatePresence>
              <div className="flex flex-col gap-4">
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> ALL {certifications.length} CREDENTIALS UNLOCKED
                  </span>
                  <button
                    onClick={() => handleToggle(false)}
                    className="text-[9px] font-mono bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-white/90 cursor-pointer font-bold"
                  >
                    SHOW LESS
                  </button>
                </div>

                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                  >
                    <CredentialCard
                      cert={cert}
                      isFeatured={index === 0}
                      onOpenViewer={(selected) => setPreviewCert(selected)}
                    />
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
                    Viewing all {certifications.length} certifications
                  </span>
                </div>
              </div>
            </AnimatePresence>
          )}
        </div>

      </div>

      {/* Interactive Lightbox Viewer Modal for PDF, JPEG, PNG */}
      <AnimatePresence>
        {previewCert && (
          <CertificateViewerModal
            isOpen={Boolean(previewCert)}
            onClose={() => setPreviewCert(null)}
            cert={previewCert}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
