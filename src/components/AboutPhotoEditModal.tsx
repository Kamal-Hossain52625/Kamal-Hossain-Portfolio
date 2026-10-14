/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Building2,
  Code2,
  Rocket,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { AboutWorkPhoto } from '../types';
import { updateAboutPhoto, resetAboutPhotos, defaultAboutPhotos } from '../lib/aboutStorage';

interface AboutPhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoToEdit?: AboutWorkPhoto | null;
  allPhotos: AboutWorkPhoto[];
  onPhotosUpdated: (photos: AboutWorkPhoto[]) => void;
}

export default function AboutPhotoEditModal({
  isOpen,
  onClose,
  photoToEdit,
  allPhotos,
  onPhotosUpdated,
}: AboutPhotoEditModalProps) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>(
    photoToEdit?.id || allPhotos[0]?.id || 'work-office'
  );

  const activePhoto = allPhotos.find((p) => p.id === selectedPhotoId) || allPhotos[0] || defaultAboutPhotos[0];

  const [title, setTitle] = useState(activePhoto?.title || '');
  const [subtitle, setSubtitle] = useState(activePhoto?.subtitle || '');
  const [description, setDescription] = useState(activePhoto?.description || '');
  const [imageUrl, setImageUrl] = useState(activePhoto?.imageUrl || '');
  const [category, setCategory] = useState<'office' | 'coding' | 'project' | 'custom'>(activePhoto?.category || 'office');
  const [tagsInput, setTagsInput] = useState(activePhoto?.tags?.join(', ') || '');
  const [location, setLocation] = useState(activePhoto?.location || '');
  const [date, setDate] = useState(activePhoto?.date || '');

  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (photoToEdit?.id) {
      setSelectedPhotoId(photoToEdit.id);
    }
  }, [photoToEdit]);

  useEffect(() => {
    if (activePhoto) {
      setTitle(activePhoto.title);
      setSubtitle(activePhoto.subtitle);
      setDescription(activePhoto.description);
      setImageUrl(activePhoto.imageUrl);
      setCategory(activePhoto.category);
      setTagsInput(activePhoto.tags?.join(', ') || '');
      setLocation(activePhoto.location || '');
      setDate(activePhoto.date || '');
      setErrorMsg('');
      setSaveSuccess(false);
    }
  }, [selectedPhotoId, allPhotos]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image file size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    setIsProcessingFile(true);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setImageUrl(compressed);
        } else {
          setImageUrl(result);
        }
        setIsProcessingFile(false);
      };
      img.onerror = () => {
        setImageUrl(result);
        setIsProcessingFile(false);
      };
      img.src = result;
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process image file.');
      setIsProcessingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a title for this photo moment.');
      return;
    }
    if (!imageUrl.trim()) {
      setErrorMsg('Please upload a photo or provide an image URL.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedPhoto: AboutWorkPhoto = {
      id: activePhoto?.id || `work-${Date.now()}`,
      category,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      tags,
      location: location.trim(),
      date: date.trim(),
    };

    const nextList = updateAboutPhoto(updatedPhoto);
    onPhotosUpdated(nextList);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all 3 work photos back to initial defaults?')) {
      const reset = resetAboutPhotos();
      onPhotosUpdated(reset);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0d0d12] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:px-8 border-b border-white/10 bg-[#121218]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-white">
                Edit Work Experience Pictures
              </h3>
              <p className="text-xs text-white/50 font-mono">
                Update Office, Deep Coding, or New Project photos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-white/5 px-6 pt-3 gap-2 overflow-x-auto">
          {allPhotos.map((p) => {
            const isSel = p.id === selectedPhotoId;
            const Icon =
              p.category === 'office'
                ? Building2
                : p.category === 'coding'
                ? Code2
                : Rocket;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhotoId(p.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[#0d0d12] text-orange-400 border-t border-x border-white/15'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.category}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2"
              >
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Changes saved successfully & synced with cloud!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Image Preview & Upload Left Box */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <label className="text-xs font-mono text-white/60 font-bold uppercase">
                PHOTO PREVIEW & REPLACEMENT
              </label>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-xl group">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Work moment preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                    <span className="text-xs font-mono">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 text-[9px] font-mono text-white/70 bg-black/80 px-2 py-0.5 rounded border border-white/10">
                  {category.toUpperCase()}
                </span>
              </div>

              {/* Upload Local Image Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-black rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md mt-1">
                <Upload className="w-4 h-4" />
                <span>{isProcessingFile ? 'PROCESSING...' : 'UPLOAD FROM COMPUTER'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isProcessingFile}
                  className="hidden"
                />
              </label>

              {/* Or Direct Image URL input */}
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] font-mono text-white/40 uppercase">OR IMAGE URL</span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            {/* Form Fields Right Box */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono text-white/60 font-bold uppercase block mb-1">
                  MOMENT TITLE *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 font-bold uppercase block mb-1">
                  SUBTITLE / SLOGAN
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-white/60 font-bold uppercase block mb-1">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mirpur, Dhaka"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 font-bold uppercase block mb-1">
                    STATUS / DATE
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Active Operations"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 font-bold uppercase block mb-1">
                  SKILL TAGS (COMMA-SEPARATED)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="TypeScript, React, Office Sync"
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 font-bold uppercase block mb-1">
                  STORY / DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-orange-500/50 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between p-5 md:px-8 border-t border-white/10 bg-[#121218]/90">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-mono transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Cloud Sync</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}