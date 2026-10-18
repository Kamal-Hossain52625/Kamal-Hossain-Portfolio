/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Award,
  Link as LinkIcon,
  Calendar,
  KeyRound,
  Trash2
} from 'lucide-react';
import { Certification } from '../types';
import { processCertificateFile } from '../lib/certificatesStorage';

interface CertificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: Certification | Omit<Certification, 'id'>) => void;
  initialCert?: Certification | null;
}

export default function CertificationFormModal({
  isOpen,
  onClose,
  onSave,
  initialCert,
}: CertificationFormModalProps) {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [url, setUrl] = useState('');
  
  // File state
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileType, setFileType] = useState<'pdf' | 'jpeg' | 'png' | 'image' | 'link'>('link');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCert) {
      setTitle(initialCert.title || '');
      setIssuer(initialCert.issuer || '');
      setDate(initialCert.date || '');
      setCredentialId(initialCert.credentialId || '');
      setUrl(initialCert.url || '');
      setFileDataUrl(initialCert.fileDataUrl || '');
      setFileType(initialCert.fileType || (initialCert.fileDataUrl ? 'image' : 'link'));
      setFileName(initialCert.fileName || '');
      setFileSize(initialCert.fileSize || '');
    } else {
      setTitle('');
      setIssuer('');
      setDate(new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      setCredentialId('');
      setUrl('');
      setFileDataUrl('');
      setFileType('link');
      setFileName('');
      setFileSize('');
    }
    setErrorMsg('');
  }, [initialCert, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setIsProcessingFile(true);

    try {
      const processed = await processCertificateFile(file);
      setFileDataUrl(processed.dataUrl);
      setFileType(processed.fileType);
      setFileName(processed.fileName);
      setFileSize(processed.fileSize);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process file');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setFileDataUrl('');
    setFileType('link');
    setFileName('');
    setFileSize('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Certificate Title is required');
      return;
    }
    if (!issuer.trim()) {
      setErrorMsg('Issuer name is required');
      return;
    }

    const payload = {
      ...(initialCert ? { id: initialCert.id } : {}),
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim() || 'Active',
      credentialId: credentialId.trim() || 'CERT-' + Math.floor(100000 + Math.random() * 900000),
      url: url.trim() || '#',
      badgeColor: initialCert?.badgeColor || 'border-amber-500/30 text-amber-400 bg-amber-950/10',
      fileType,
      fileDataUrl: fileDataUrl || undefined,
      fileName: fileName || undefined,
      fileSize: fileSize || undefined,
      isCustomUploaded: true,
    };

    onSave(payload as any);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#0e0e14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:px-7 border-b border-white/10 bg-[#14141c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-orange-400 block">
                {initialCert ? 'UPDATE RECORD' : 'NEW CREDENTIAL ENTRY'}
              </span>
              <h3 className="font-sans text-lg font-bold text-white">
                {initialCert ? 'Edit Personal Certificate' : 'Add Personal Certificate'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 md:p-7 flex flex-col gap-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Certificate Title */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Certificate Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect / Laravel Developer"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:bg-white/10 text-white text-xs md:text-sm outline-none transition-all placeholder:text-white/20"
            />
          </div>

          {/* Issuer & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                Issuer / Institution *
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Amazon Web Services / Meta / Coursera"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:bg-white/10 text-white text-xs md:text-sm outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                Date of Issuance
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Dec 2024"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:bg-white/10 text-white text-xs md:text-sm outline-none transition-all placeholder:text-white/20"
                />
                <Calendar className="w-4 h-4 text-white/30 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Credential ID & External URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                Credential ID / License
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. AWS-ASA-9942A"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:bg-white/10 text-white text-xs md:text-sm outline-none transition-all placeholder:text-white/20"
                />
                <KeyRound className="w-4 h-4 text-white/30 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                Verification URL (Optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:bg-white/10 text-white text-xs md:text-sm outline-none transition-all placeholder:text-white/20"
                />
                <LinkIcon className="w-4 h-4 text-white/30 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* DOCUMENT UPLOADER ZONE: PDF, JPEG, PNG */}
          <div className="pt-2">
            <label className="block text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Certificate Document (PDF, JPEG, PNG)</span>
              <span className="text-white/40 font-normal">Max size: 6MB</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="hidden"
              id="cert-file-input"
            />

            {!fileDataUrl ? (
              <label
                htmlFor="cert-file-input"
                className={`border-2 border-dashed border-white/20 hover:border-orange-500/50 bg-white/5 hover:bg-orange-500/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer text-center group ${
                  isProcessingFile ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-orange-500/10 border border-white/10 group-hover:border-orange-500/30 flex items-center justify-center text-white/60 group-hover:text-orange-400 transition-all">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-white block mb-1">
                    {isProcessingFile ? 'Reading & encoding file...' : 'Click to Upload Personal Certificate'}
                  </span>
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[9px] font-bold">
                      PDF
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-sky-300 font-mono text-[9px] font-bold">
                      JPEG
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[9px] font-bold">
                      PNG
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 block mt-2">
                    Max size: 6MB • Easily editable / changeable anytime
                  </span>
                </div>
              </label>
            ) : (
              /* Attached Document Card with Replace option */
              <div className="border border-white/20 rounded-2xl bg-[#14141c] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                      {fileType === 'pdf' ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white truncate block">
                        {fileName || 'Uploaded Certificate Document'}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
                        <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold uppercase border border-orange-500/30">
                          {fileType.toUpperCase()}
                        </span>
                        {fileSize && <span>{fileSize}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="cert-file-input"
                      className="px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 hover:text-white text-[10px] font-mono font-bold uppercase cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                      title="Replace attached file with another PDF, JPEG, or PNG"
                    >
                      <Upload className="w-3 h-3 text-orange-400" />
                      <span>Replace</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mini Visual Preview */}
                <div className="mt-1 rounded-xl overflow-hidden border border-white/10 bg-black/60 max-h-40 flex items-center justify-center">
                  {fileType === 'pdf' ? (
                    <div className="p-4 flex items-center gap-3 text-white/70">
                      <FileText className="w-8 h-8 text-orange-400" />
                      <div className="text-left">
                        <span className="text-xs font-mono font-bold block text-white">PDF Document Ready</span>
                        <span className="text-[10px] font-mono text-white/40">Will render in interactive PDF viewer</span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={fileDataUrl}
                      alt="Certificate Preview"
                      className="max-h-36 w-full object-contain"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95"
            >
              {initialCert ? 'Save Changes' : 'Create Certificate'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
