/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Upload,
  ExternalLink,
  FileText,
  Check,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Clock,
  HardDrive
} from 'lucide-react';
interface CvDocument {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  pdfDataUrl: string;
  isCustomUploaded?: boolean;
}

const saveStoredCvDocument = async (cv: CvDocument) => {
  window.localStorage.setItem('portfolio_cv_document', JSON.stringify(cv));
};

const triggerCvDownload = (cv: CvDocument) => {
  const link = window.document.createElement('a');
  link.href = cv.pdfDataUrl;
  link.download = cv.fileName;
  link.click();
};

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CvDocument;
  onCvUpdated?: (updatedCv: CvDocument) => void;
  allowUpload?: boolean;
  allowDownload?: boolean;
}

export default function CvModal({
  isOpen,
  onClose,
  cv,
  onCvUpdated,
  allowUpload = false,
  allowDownload = false,
}: CvModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Local PDF File upload from computer drive
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('PDF file exceeds 20MB limit. Please upload an optimized PDF.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      const newCv: CvDocument = {
        fileName: file.name,
        fileSize: formattedSize,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        pdfDataUrl: dataUrl,
        isCustomUploaded: true,
      };

      await saveStoredCvDocument(newCv);
      onCvUpdated?.(newCv);
      setIsUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    };

    reader.onerror = () => {
      setErrorMsg('Failed to read the local PDF file. Please try again.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    triggerCvDownload(cv);
  };

  const handleOpenExternal = () => {
    try {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${cv.pdfDataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      } else {
        window.open(cv.pdfDataUrl, '_blank');
      }
    } catch {
      window.open(cv.pdfDataUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-6xl h-[92vh] bg-[#0c0c11] border border-white/15 rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:px-6 md:py-4 border-b border-white/10 bg-[#121218]/90 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-base md:text-lg font-bold text-white truncate">
                  {cv.fileName}
                </h3>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED CV
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-white/50 mt-0.5">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-orange-400" /> {cv.fileSize}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {cv.uploadedAt}
                </span>
                {cv.isCustomUploaded && (
                  <>
                    <span>•</span>
                    <span className="text-orange-400 font-semibold">Custom Upload Active</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Upload PDF from Local Drive button (only enabled in Admin mode) */}
            {allowUpload && (
              <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold tracking-wider cursor-pointer active:scale-95 transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'UPLOADING...' : 'UPLOAD NEW PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}

            {/* Download Button (only if allowDownload is enabled) */}
            {allowDownload && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-white/80" />
                <span>DOWNLOAD</span>
              </button>
            )}

            {/* Open in external tab */}
            <button
              onClick={handleOpenExternal}
              title="Open PDF in new window"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications / Alerts */}
        <AnimatePresence>
          {uploadSuccess && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-950/40 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 font-mono"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Success: New CV document uploaded and synced to your portfolio!</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">SAVED</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-rose-950/40 border-b border-rose-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-rose-300 font-mono"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg('')} className="text-white/60 hover:text-white text-xs">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Document Canvas Viewport */}
        <div className="flex-1 w-full bg-[#181820] relative overflow-hidden flex flex-col">
          {cv.pdfDataUrl ? (
            <iframe
              src={`${cv.pdfDataUrl}#toolbar=1&navpanes=0&view=FitH`}
              title="Official Curriculum Vitae Viewer"
              className="w-full h-full border-none rounded-b-2xl bg-white"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white/50">
              <FileText className="w-16 h-16 text-white/20 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">No PDF Document Found</h4>
              <p className="text-xs max-w-md text-white/50 mb-6">
                Upload your official Curriculum Vitae in PDF format directly from your computer drive to preview here.
              </p>
              <label className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all">
                Choose PDF File
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Bottom Quick Help Bar */}
        <div className="px-6 py-3 bg-[#0c0c11] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-white/40 gap-2 shrink-0">
          <span>
            You can upload a newer PDF version anytime from your local drive. It automatically saves to your portfolio.
          </span>
          <div className="flex items-center gap-4 text-white/60">
            <span>Press ESC or click outside to close</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
