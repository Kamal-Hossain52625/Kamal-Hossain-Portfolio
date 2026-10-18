/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  ShieldCheck,
  Calendar,
  KeyRound,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Building2,
  Download
} from 'lucide-react';
import { Certification } from '../types';

interface CertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cert: Certification | null;
}

export default function CertificateViewerModal({
  isOpen,
  onClose,
  cert,
}: CertificateViewerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !cert) return null;

  const isPdf =
    cert.fileType === 'pdf' ||
    cert.fileDataUrl?.startsWith('data:application/pdf') ||
    cert.fileName?.toLowerCase().endsWith('.pdf');

  const hasDocument = Boolean(cert.fileDataUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0d0d14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-white/10 bg-[#14141e] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest truncate">
                  {cert.issuer}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
                {cert.fileType && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70 uppercase">
                    {cert.fileType}
                  </span>
                )}
              </div>
              <h3 className="font-sans text-sm sm:text-base md:text-lg font-bold text-white truncate">
                {cert.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0 ml-3"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
          {hasDocument ? (
            isPdf ? (
              /* PDF Viewport */
              <div className="relative w-full h-[58vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-white/10 bg-white shadow-xl">
                <iframe
                  src={`${cert.fileDataUrl}#toolbar=0&navpanes=0&view=FitH`}
                  title={cert.title}
                  className="w-full h-full border-none"
                />
              </div>
            ) : (
              /* Image Viewport (JPEG, PNG) */
              <div className="relative w-full max-h-[62vh] rounded-2xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center p-2 shadow-xl">
                <img
                  src={cert.fileDataUrl}
                  alt={cert.title}
                  className="w-full h-auto max-h-[58vh] object-contain rounded-xl"
                />
              </div>
            )
          ) : (
            /* Fallback Card when no document uploaded */
            <div className="p-10 rounded-2xl border border-white/10 bg-white/5 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="font-sans text-lg font-bold text-white uppercase italic">
                {cert.title}
              </h4>
              <p className="font-mono text-xs text-white/50 max-w-md">
                Issued by {cert.issuer} &bull; Credential ID: {cert.credentialId}
              </p>
            </div>
          )}

          {/* Certificate Metadata Bar */}
          <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-white/70">
                <Building2 className="w-4 h-4 text-orange-400" />
                <span>ISSUER: <strong className="text-white">{cert.issuer}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-white/70">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>DATE: <strong className="text-white">{cert.date}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-white/70">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>ID: <strong className="text-white">{cert.credentialId}</strong></span>
              </div>

              {cert.fileName && (
                <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[180px]">{cert.fileName}</span>
                </div>
              )}
            </div>

            {/* Verification Link */}
            {cert.url && cert.url !== '#' && (
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0 ml-auto"
              >
                <span>VERIFY ON OFFICIAL SITE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
