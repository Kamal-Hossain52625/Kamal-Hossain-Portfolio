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
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { AboutWorkPhoto } from '../types';
import {
  updateAboutPhoto,
  deleteAboutPhoto,
  resetAboutPhotos,
  defaultAboutPhotos
} from '../lib/aboutStorage';

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
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>(
    photoToEdit?.id || allPhotos[0]?.id || 'work-office'
  );

  const activePhoto =
    allPhotos.find((p) => p.id === selectedPhotoId) || allPhotos[0] || defaultAboutPhotos[0];

  const [title, setTitle] = useState(activePhoto?.title || '');
  const [subtitle, setSubtitle] = useState(activePhoto?.subtitle || '');
  const [description, setDescription] = useState(activePhoto?.description || '');
  const [imageUrl, setImageUrl] = useState(activePhoto?.imageUrl || '');
  const [category, setCategory] = useState<'office' | 'coding' | 'project' | 'custom'>(
    activePhoto?.category || 'office'
  );
  const [tagsInput, setTagsInput] = useState(activePhoto?.tags?.join(', ') || '');
  const [location, setLocation] = useState(activePhoto?.location || '');
  const [date, setDate] = useState(activePhoto?.date || '');

  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when activePhoto or photoToEdit changes
  useEffect(() => {
    if (photoToEdit?.id) {
      setIsCreatingNew(false);
      setSelectedPhotoId(photoToEdit.id);
    }
  }, [photoToEdit]);

  useEffect(() => {
    if (!isCreatingNew && activePhoto) {
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
  }, [selectedPhotoId, isCreatingNew, allPhotos]);

  // Start adding a brand new photo
  const handleStartNewPhoto = () => {
    setIsCreatingNew(true);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setImageUrl('');
    setCategory('custom');
    setTagsInput('Engineering, Milestone');
    setLocation('Tech Workspace');
    setDate('New Project');
    setErrorMsg('');
    setSaveSuccess(false);
  };

  // Switch to an existing photo tab
  const handleSelectExistingPhoto = (id: string) => {
    setIsCreatingNew(false);
    setSelectedPhotoId(id);
    setErrorMsg('');
  };

  // Handle local image file upload & client-side compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
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
      setErrorMsg('Please enter a title for this picture.');
      return;
    }
    if (!imageUrl.trim()) {
      setErrorMsg('Please upload a photo from local drive or provide an image URL.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (isCreatingNew) {
      // Add Brand New Picture
      const newPhoto: AboutWorkPhoto = {
        id: `work-custom-${Date.now()}`,
        category,
        title: title.trim(),
        subtitle: subtitle.trim() || 'Engineering Innovation',
        description: description.trim() || 'Verified professional work experience.',
        imageUrl: imageUrl.trim(),
        tags: tags.length > 0 ? tags : ['Verified Experience'],
        location: location.trim() || 'Dhaka, Bangladesh',
        date: date.trim() || 'Active Operations',
      };

      const nextList = updateAboutPhoto(newPhoto);
      onPhotosUpdated(nextList);
      setIsCreatingNew(false);
      setSelectedPhotoId(newPhoto.id);
    } else {
      // Update Existing Picture
      const updatedPhoto: AboutWorkPhoto = {
        id: selectedPhotoId,
        category,
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        tags: tags.length > 0 ? tags : ['Verified Experience'],
        location: location.trim(),
        date: date.trim(),
      };

      const nextList = updateAboutPhoto(updatedPhoto);
      onPhotosUpdated(nextList);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1100);
  };

  // Delete current photo
  const handleDeleteCurrent = () => {
    if (allPhotos.length <= 1) {
      alert('You must keep at least 1 work picture in the portfolio.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove "${title || 'this picture'}"?`)) {
      const nextList = deleteAboutPhoto(selectedPhotoId);
      onPhotosUpdated(nextList);
      if (nextList.length > 0) {
        setSelectedPhotoId(nextList[0].id);
      }
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all work pictures to default initial templates?')) {
      const reset = resetAboutPhotos();
      onPhotosUpdated(reset);
      setIsCreatingNew(false);
      setSelectedPhotoId(reset[0]?.id || 'work-office');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-[#0d0d12] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl z-10 my-8 overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-6 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-orange-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> LIVE ASSET EDITOR
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">
                ANYTIME EDITABLE
              </span>
            </div>
            <h3 className="font-sans text-2xl md:text-3xl font-bold text-white uppercase italic tracking-tight">
              Change & Edit About Pictures
            </h3>
            <p className="text-white/50 text-xs mt-1">
              Upload your actual photos from office, deep coding sprints, or new project work from your local disk or web.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tabs Bar: Existing Photos + Add New Picture Button */}
        <div className="flex flex-wrap items-center gap-2 pt-6 pb-4 border-b border-white/5 relative z-10">
          {allPhotos.map((photo, pIdx) => {
            const isSelected = !isCreatingNew && selectedPhotoId === photo.id;
            const Icon =
              photo.category === 'office'
                ? Building2
                : photo.category === 'coding'
                ? Code2
                : photo.category === 'project'
                ? Rocket
                : Sparkles;

            const tabLabel =
              photo.category === 'office'
                ? `${pIdx + 1}. Office Work`
                : photo.category === 'coding'
                ? `${pIdx + 1}. Coding Sprints`
                : photo.category === 'project'
                ? `${pIdx + 1}. New Projects`
                : `${pIdx + 1}. ${photo.title.slice(0, 14) || 'Custom Photo'}`;

            return (
              <button
                key={photo.id}
                onClick={() => handleSelectExistingPhoto(photo.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tabLabel}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse ml-1" />}
              </button>
            );
          })}

          {/* + ADD NEW PICTURE BUTTON */}
          <button
            type="button"
            onClick={handleStartNewPhoto}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              isCreatingNew
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-300'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>+ ADD NEW PICTURE</span>
          </button>
        </div>

        {/* Content Body: Left Form Inputs + Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 relative z-10 max-h-[60vh] overflow-y-auto pr-1">
          {/* Form Controls */}
          <div className="lg:col-span-7 flex flex-col gap-4 font-sans">
            {/* New Picture Banner */}
            {isCreatingNew && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  ADDING NEW WORK PICTURE
                </span>
                <span className="text-[10px] text-emerald-400/80">UPLOAD & SAVE TO PORTFOLIO</span>
              </div>
            )}

            {/* Category / Work Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider">
                CATEGORY / WORK TYPE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'office', label: 'Office Work', icon: Building2 },
                  { key: 'coding', label: 'Coding Craft', icon: Code2 },
                  { key: 'project', label: 'New Project', icon: Rocket },
                  { key: 'custom', label: 'Custom Work', icon: Sparkles },
                ].map((cat) => {
                  const CatIcon = cat.icon;
                  const isCatSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key as any)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                        isCatSelected
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 font-bold'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Source & Upload */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/80 flex items-center justify-between">
                <span>PICTURE FILE / IMAGE SOURCE *</span>
                <span className="text-[10px] text-orange-400 font-normal">Local File Upload or URL</span>
              </label>

              {/* Local File Input */}
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold tracking-wider cursor-pointer active:scale-98 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>{isProcessingFile ? 'OPTIMIZING IMAGE...' : 'CHOOSE FROM LOCAL DRIVE'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessingFile}
                  />
                </label>
              </div>

              {/* Or paste URL */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/40 uppercase">OR URL:</span>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or paste image link"
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-orange-500/50 outline-none font-mono"
                />
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider">
                TITLE (WHAT YOU WERE DOING) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Strategic Office Workspace & Sprint Reviews"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 outline-none"
              />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider">
                SUBTITLE / HIGHLIGHT ROLE
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Leadership, Team Sync & Architectural Alignment"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 outline-none"
              />
            </div>

            {/* Story & Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider">
                STORY & EXPERIENCE DETAILS
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you worked on, technologies used, leadership moments, or engineering challenges..."
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:border-orange-500/50 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Tags & Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-white/70 uppercase tracking-wider">
                  TAGS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Leadership, Sprints, Agile"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:border-orange-500/50 outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-white/70 uppercase tracking-wider">
                  LOCATION / ENVIRONMENT
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Corporate HQ, Dhaka"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:border-orange-500/50 outline-none font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Right Column: Live Portfolio Preview Card */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <label className="text-xs font-mono text-white/60 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>LIVE PORTFOLIO PREVIEW</span>
            </label>

            <div className="border border-white/15 rounded-2xl bg-white/[0.04] p-4 flex flex-col gap-4 shadow-xl">
              {/* Picture Frame */}
              <div className="relative h-48 w-full rounded-xl overflow-hidden bg-black/60 border border-white/10">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-[11px] font-mono">No Image Uploaded</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[8.5px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>
                    {category === 'office'
                      ? 'OFFICE WORK'
                      : category === 'coding'
                      ? 'DEEP CODING CRAFTSMANSHIP'
                      : category === 'project'
                      ? 'NEW PROJECT INNOVATION'
                      : 'CUSTOM EXPERIENCE'}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-black/90 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono text-white/70">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                  {date || 'Active Operations'}
                </div>
              </div>

              {/* Title & Narrative */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9.5px] font-mono text-orange-400/90 font-bold uppercase tracking-wider truncate">
                  {subtitle || 'HIGHLIGHT ROLE / SUBTITLE'}
                </span>
                <h4 className="font-sans text-base font-bold text-white truncate">
                  {title || 'Your Picture Title Here'}
                </h4>
                {description && (
                  <p className="font-sans text-xs text-white/50 leading-relaxed font-light line-clamp-3">
                    {description}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-1 pt-2 border-t border-white/5">
                  {tagsInput
                    .split(',')
                    .filter((t) => t.trim())
                    .slice(0, 3)
                    .map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[8.5px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50"
                      >
                        {t.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Delete Picture Button for existing extra photos */}
            {!isCreatingNew && allPhotos.length > 1 && (
              <button
                type="button"
                onClick={handleDeleteCurrent}
                className="mt-2 py-2 px-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete this picture from portfolio</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 relative z-10">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-mono text-white/40 hover:text-white/80 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset To Default Pictures</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessingFile}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white border border-emerald-500 shadow-emerald-600/30'
                  : isCreatingNew
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-black border border-emerald-400 shadow-emerald-500/20'
                  : 'bg-orange-500 hover:bg-orange-600 text-black border border-orange-400 shadow-orange-500/20'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>SAVED TO PORTFOLIO!</span>
                </>
              ) : isCreatingNew ? (
                <>
                  <Plus className="w-4 h-4" />
                  <span>ADD TO PORTFOLIO</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>SAVE PHOTO CHANGES</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
