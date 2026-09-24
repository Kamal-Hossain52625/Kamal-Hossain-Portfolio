/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Github,
  Mail,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  KeyRound,
  ShieldCheck,
  LogOut,
  ArrowUpRight,
  Sparkles,
  Inbox,
  CheckCircle2,
  Check,
  Clock,
  Settings,
  FolderGit2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Project, Inquiry } from '../types';
import {
  getStoredProjects,
  saveStoredProjects,
  addStoredProject,
  updateStoredProject,
  deleteStoredProject,
  resetStoredProjects,
  getStoredInquiries,
  markInquiryStatus,
  deleteStoredInquiry,
  getAdminPassword,
  setAdminPassword,
  logoutAdmin,
  getStoredProfileImage,
  saveStoredProfileImage
} from '../lib/storage';
import ProjectFormModal from './ProjectFormModal';
import CaseStudyModal from './CaseStudyModal';

interface AdminDashboardProps {
  onBackToPortfolio: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({ onBackToPortfolio, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries' | 'settings'>('projects');
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);
  const [inquiries, setInquiries] = useState<Inquiry[]>(getStoredInquiries);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Full-stack' | 'Frontend' | 'System' | 'Creative'>('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Settings State
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [passphraseStatus, setPassphraseStatus] = useState('');
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  // Profile Photo State (for About section & admin portrait)
  const [adminProfilePhoto, setAdminProfilePhoto] = useState<string>(getStoredProfileImage);
  const [adminPhotoUrlInput, setAdminPhotoUrlInput] = useState('');
  const [profilePhotoStatus, setProfilePhotoStatus] = useState('');

  // Sync listener
  useEffect(() => {
    const handleProjectsUpdate = (e: any) => {
      if (e.detail) setProjects(e.detail);
      else setProjects(getStoredProjects());
    };
    const handleInquiriesUpdate = (e: any) => {
      if (e.detail) setInquiries(e.detail);
      else setInquiries(getStoredInquiries());
    };
    const handleProfileUpdate = (e: any) => {
      if (e.detail !== undefined) setAdminProfilePhoto(e.detail);
      else setAdminProfilePhoto(getStoredProfileImage());
    };

    window.addEventListener('portfolio_projects_updated', handleProjectsUpdate);
    window.addEventListener('portfolio_inquiries_updated', handleInquiriesUpdate);
    window.addEventListener('portfolio_profile_image_updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('portfolio_projects_updated', handleProjectsUpdate);
      window.removeEventListener('portfolio_inquiries_updated', handleInquiriesUpdate);
      window.removeEventListener('portfolio_profile_image_updated', handleProfileUpdate);
    };
  }, []);

  // Handlers for Project CRUD
  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      const updated = updateStoredProject(project);
      setProjects(updated);
    } else {
      const updated = addStoredProject(project);
      setProjects(updated);
    }
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the project "${title}"?`)) {
      const updated = deleteStoredProject(id);
      setProjects(updated);
    }
  };

  const handleDuplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: 'custom-' + Date.now(),
      title: `${project.title} (Copy)`,
    };
    const updated = addStoredProject(duplicated);
    setProjects(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all projects back to original factory flagship templates? Any custom projects will be replaced.')) {
      const reset = resetStoredProjects();
      setProjects(reset);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kamal_portfolio_projects_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          saveStoredProjects(parsed);
          setProjects(parsed);
          alert(`Successfully imported ${parsed.length} projects!`);
        } else {
          alert('Invalid JSON structure. Expected an array of projects.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Inquiry Handlers
  const handleToggleInquiryRead = (id: string, currentRead: boolean) => {
    const updated = markInquiryStatus(id, !currentRead);
    setInquiries(updated);
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm('Delete this client inquiry transmission?')) {
      const updated = deleteStoredInquiry(id);
      setInquiries(updated);
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  // Passphrase Handler (Requested: password change korar option thakbe)
  const handleUpdatePassphrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassphrase.trim() || newPassphrase.length < 4) {
      setPassphraseStatus('Error: Passphrase must be at least 4 characters long.');
      return;
    }
    if (confirmPassphrase.trim() && newPassphrase.trim() !== confirmPassphrase.trim()) {
      setPassphraseStatus('Error: Passphrase confirmation does not match.');
      return;
    }
    setAdminPassword(newPassphrase.trim());
    setPassphraseStatus('Success: Administrative passphrase updated successfully!');
    setNewPassphrase('');
    setConfirmPassphrase('');
    setTimeout(() => setPassphraseStatus(''), 4000);
  };

  // Profile Photo Handlers for Admin
  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size exceeds 5MB. Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      saveStoredProfileImage(res);
      setAdminProfilePhoto(res);
      setProfilePhotoStatus('Profile photo updated successfully!');
      setTimeout(() => setProfilePhotoStatus(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleAdminPhotoUrlApply = () => {
    if (!adminPhotoUrlInput.trim()) return;
    saveStoredProfileImage(adminPhotoUrlInput.trim());
    setAdminProfilePhoto(adminPhotoUrlInput.trim());
    setAdminPhotoUrlInput('');
    setProfilePhotoStatus('Profile photo updated from image link!');
    setTimeout(() => setProfilePhotoStatus(''), 3000);
  };

  const handleAdminPhotoRemove = () => {
    saveStoredProfileImage('');
    setAdminProfilePhoto('');
    setProfilePhotoStatus('Profile photo reset to default vector graphic.');
    setTimeout(() => setProfilePhotoStatus(''), 3000);
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const unreadCount = inquiries.filter((inq) => !inq.read).length;

  return (
    <div className="min-h-screen bg-[#070709] bg-grid-pattern text-white font-sans selection:bg-orange-500/20">
      {/* Background ambient accents */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header / Bar */}
      <header className="sticky top-0 z-40 bg-[#070709]/85 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono font-bold">
              KH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm md:text-base tracking-tight uppercase">
                  PORTFOLIO BACKEND // COMMAND CENTER
                </span>
                <span className="text-[8px] font-mono border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase">
                  ACTIVE SYNC
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/40 block">
                ADMIN: MARIA AFRIN / KAMAL HOSSAIN &bull; ACCESS URL: /admin &bull; /login
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Live Portfolio */}
            <button
              onClick={onBackToPortfolio}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] font-bold tracking-wider rounded-xl transition-all cursor-pointer uppercase shadow-md hover:scale-105"
            >
              <span>VIEW PORTFOLIO</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-orange-400" />
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logoutAdmin();
                onLogout();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl font-mono text-[9px] font-bold tracking-wider transition-all cursor-pointer uppercase"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-10 flex flex-col gap-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-wider">TOTAL PROJECTS</span>
            <span className="text-2xl md:text-3xl font-bold text-white font-sans">{projects.length}</span>
            <span className="text-[9px] font-mono text-orange-400">All modules active & listed</span>
          </div>

          <div className="p-5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-wider">CLIENT INQUIRIES</span>
            <span className="text-2xl md:text-3xl font-bold text-white font-sans">{inquiries.length}</span>
            <span className="text-[9px] font-mono text-emerald-400">{unreadCount} unread message{unreadCount === 1 ? '' : 's'}</span>
          </div>

          <div className="p-5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-wider">FULL-STACK & SYSTEM</span>
            <span className="text-2xl md:text-3xl font-bold text-white font-sans">
              {projects.filter((p) => p.category === 'Full-stack' || p.category === 'System').length}
            </span>
            <span className="text-[9px] font-mono text-white/40">Core engineering assets</span>
          </div>

          <div className="p-5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-wider">DATABASE PERSISTENCE</span>
            <span className="text-sm font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LOCAL STORAGE SYNCED
            </span>
            <span className="text-[9px] font-mono text-white/40">Live bidirectional state</span>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md self-start">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>PROJECTS ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>INQUIRIES</span>
              {unreadCount > 0 && (
                <span className="bg-emerald-400 text-black px-1.5 py-0.2 rounded-full text-[8px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>SETTINGS & BACKUP</span>
            </button>
          </div>

          {activeTab === 'projects' && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-mono text-[9px] font-extrabold tracking-widest rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer uppercase shadow-xl"
              >
                <Plus className="w-4 h-4" /> ADD NEW PROJECT
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            
            {/* Search & Category Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter projects by title, stack (e.g. Rust, React)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl text-xs font-sans text-white outline-none transition-all placeholder:text-white/20"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                {['All', 'Full-stack', 'Frontend', 'System', 'Creative'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat as any)}
                    className={`px-3 py-1.5 text-[9px] font-mono tracking-wider font-extrabold rounded-lg transition-all uppercase cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-white/40 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Project List / Cards */}
            {filteredProjects.length === 0 ? (
              <div className="p-12 border border-white/10 bg-white/5 rounded-3xl text-center flex flex-col items-center gap-3">
                <FolderGit2 className="w-8 h-8 text-white/20" />
                <h4 className="text-base font-bold text-white uppercase">No projects match query</h4>
                <p className="text-xs text-white/40 max-w-sm">
                  Try adjusting search parameters or click below to commission a new project entry.
                </p>
                <button
                  onClick={handleOpenAdd}
                  className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-[9px] font-extrabold rounded-xl uppercase transition-all"
                >
                  + ADD PROJECT NOW
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl p-6 flex flex-col justify-between gap-5 shadow-xl hover:border-white/20 transition-all group relative"
                  >
                    {/* Header Info */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-[0.2em] font-extrabold text-orange-400 uppercase">
                          {project.category} // ARCHITECTURE
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              project.id.startsWith('custom-') ? 'bg-orange-400 animate-pulse' : 'bg-emerald-400'
                            }`}
                          />
                          <span className="text-[8px] font-mono text-white/40 font-bold uppercase">
                            {project.id.startsWith('custom-') ? 'DYNAMIC USER' : 'CORE FLAGSHIP'}
                          </span>
                        </div>
                      </div>

                      {/* Project Cover Image Thumbnail (if custom or provided) */}
                      {project.image && (project.image.startsWith('http') || project.image.startsWith('data:image') || project.image.startsWith('/')) && (
                        <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-inner group/thumb">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-center group-hover/thumb:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg text-[8px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            COVER IMAGE ATTACHED
                          </div>
                        </div>
                      )}

                      <h3 className="font-sans text-xl font-bold text-white tracking-tight uppercase">
                        {project.title}
                      </h3>
                      <span className="font-sans text-xs text-orange-400/90 font-medium">
                        {project.subtitle}
                      </span>

                      <p className="font-sans text-xs text-white/60 leading-relaxed font-light mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono bg-black/40 border border-white/5 px-2 py-0.5 rounded text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Performance Metrics preview */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 border border-white/5 bg-black/30 rounded-xl font-mono">
                      {project.metrics?.slice(0, 3).map((m, mIdx) => (
                        <div key={mIdx} className="flex flex-col">
                          <span className="text-[7px] text-white/40 uppercase truncate">{m.label}</span>
                          <span className="text-xs font-bold text-white truncate">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Live Case Study Preview */}
                        <button
                          onClick={() => setPreviewProject(project)}
                          className="p-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-[9px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Preview public modal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">PREVIEW</span>
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicateProject(project)}
                          className="p-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-[9px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Duplicate this project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">CLONE</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* EDIT BUTTON (Crucial request: ইডিট করা) */}
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[9px] font-mono font-extrabold flex items-center gap-1.5 transition-all cursor-pointer uppercase shadow-lg hover:scale-105"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>EDIT PROJECT</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProject(project.id, project.title)}
                          className="p-2 border border-rose-500/30 hover:border-rose-500/80 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES / CONTACT SUBMISSIONS */}
        {activeTab === 'inquiries' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-sans text-xl font-bold text-white uppercase">
                  Client Inbound Transmissions
                </h3>
                <p className="font-sans text-xs text-white/50">
                  Messages submitted via the cryptographic contact transmitter on the portfolio.
                </p>
              </div>

              <span className="text-xs font-mono text-orange-400 border border-orange-500/30 px-3 py-1 rounded-xl bg-orange-500/10">
                {inquiries.length} TOTAL MESSAGES
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 border border-white/10 bg-white/5 rounded-3xl text-center flex flex-col items-center gap-2">
                <Inbox className="w-8 h-8 text-white/20" />
                <span className="text-sm font-bold text-white uppercase">NO CLIENT TRANSMISSIONS RECORDED</span>
                <span className="text-xs text-white/40">Inquiries submitted via the contact form will appear here.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`border rounded-2xl p-5 flex flex-col gap-3 transition-all ${
                      inq.read
                        ? 'border-white/5 bg-white/5 opacity-80'
                        : 'border-orange-500/30 bg-orange-500/5 shadow-lg shadow-orange-500/5'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${inq.read ? 'bg-white/20' : 'bg-emerald-400 animate-pulse'}`}
                        />
                        <span className="font-bold text-sm text-white font-sans">{inq.name}</span>
                        <span className="text-xs font-mono text-orange-400/90">&lt;{inq.email}&gt;</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {inq.date}
                        </span>
                      </div>
                    </div>

                    {inq.topic && (
                      <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">
                        SERVICE TOPIC: {inq.topic}
                      </span>
                    )}

                    <p className="text-xs text-white/80 font-sans leading-relaxed whitespace-pre-wrap bg-black/30 p-3.5 rounded-xl border border-white/5">
                      {inq.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleCopyEmail(inq.email, inq.id)}
                        className="flex items-center gap-1 text-[9px] font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedEmailId === inq.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY CLIENT EMAIL</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleInquiryRead(inq.id, inq.read)}
                          className="px-3 py-1.5 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-[9px] font-mono font-bold uppercase cursor-pointer text-white/70 hover:text-white transition-all"
                        >
                          {inq.read ? 'MARK UNREAD' : 'MARK AS READ'}
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/10 text-rose-400 rounded-lg transition-all cursor-pointer"
                          title="Delete transmission"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS & BACKUP */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Security Passphrase Reset (Requested feature) */}
            <div className="p-6 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
                  <KeyRound className="w-4 h-4 text-orange-400" />
                  <h4 className="font-sans text-base font-bold text-white uppercase">
                    Admin Passphrase Security
                  </h4>
                </div>

                <p className="text-xs text-white/60 font-light leading-relaxed mb-4">
                  Change the admin passphrase used to authenticate at <code className="text-orange-400 font-mono">/admin</code> or <code className="text-orange-400 font-mono">/login</code>. (Default key: <span className="text-emerald-400 font-mono font-bold">52625</span>)
                </p>

                <form onSubmit={handleUpdatePassphrase} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                      NEW ADMIN PASSPHRASE *
                    </label>
                    <input
                      type="password"
                      value={newPassphrase}
                      onChange={(e) => setNewPassphrase(e.target.value)}
                      placeholder="Enter new passphrase..."
                      className="w-full p-3 bg-black/40 border border-white/10 focus:border-orange-500/50 rounded-xl text-xs font-mono text-white outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
                      CONFIRM NEW PASSPHRASE
                    </label>
                    <input
                      type="password"
                      value={confirmPassphrase}
                      onChange={(e) => setConfirmPassphrase(e.target.value)}
                      placeholder="Confirm new passphrase..."
                      className="w-full p-3 bg-black/40 border border-white/10 focus:border-orange-500/50 rounded-xl text-xs font-mono text-white outline-none"
                    />
                  </div>

                  {passphraseStatus && (
                    <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
                      passphraseStatus.startsWith('Error')
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {passphraseStatus}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="mt-1 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-mono text-[9px] font-bold tracking-wider rounded-xl uppercase transition-all cursor-pointer shadow-lg"
                  >
                    UPDATE PASSPHRASE
                  </button>
                </form>
              </div>
            </div>

            {/* Profile Photo Manager (Requested feature) */}
            <div className="p-6 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
                  <Camera className="w-4 h-4 text-orange-400" />
                  <h4 className="font-sans text-base font-bold text-white uppercase">
                    Profile Portrait Photo
                  </h4>
                </div>

                <p className="text-xs text-white/60 font-light leading-relaxed mb-4">
                  Manage the photograph displayed in your About Section and admin header profile.
                </p>

                {/* Photo Preview */}
                <div className="flex items-center gap-4 p-3 bg-black/40 border border-white/5 rounded-2xl mb-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 bg-zinc-950 shrink-0 flex items-center justify-center">
                    {adminProfilePhoto ? (
                      <img
                        src={adminProfilePhoto}
                        alt="Profile avatar"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white">
                      {adminProfilePhoto ? 'CUSTOM PHOTO ACTIVE' : 'DEFAULT VECTOR AVATAR'}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 mt-0.5">
                      {adminProfilePhoto ? 'Synchronized across app' : 'No personal portrait attached'}
                    </span>
                  </div>
                </div>

                {/* Upload or URL input */}
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-bold text-white uppercase transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-orange-400" /> BROWSE & UPLOAD PHOTO
                    <input type="file" accept="image/*" onChange={handleAdminPhotoUpload} className="hidden" />
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={adminPhotoUrlInput}
                      onChange={(e) => setAdminPhotoUrlInput(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 p-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white outline-none placeholder:text-white/20"
                    />
                    <button
                      type="button"
                      onClick={handleAdminPhotoUrlApply}
                      className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 font-mono text-[9px] font-bold uppercase rounded-xl transition-all cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>

                  {profilePhotoStatus && (
                    <span className="text-xs font-mono text-emerald-400">{profilePhotoStatus}</span>
                  )}

                  {adminProfilePhoto && (
                    <button
                      type="button"
                      onClick={handleAdminPhotoRemove}
                      className="self-start text-[9px] font-mono text-rose-400 hover:text-rose-300 transition-colors cursor-pointer mt-1"
                    >
                      &times; Reset to default vector avatar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Data Export & Backup */}
            <div className="p-6 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl flex flex-col justify-between gap-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Download className="w-4 h-4 text-orange-400" />
                <h4 className="font-sans text-base font-bold text-white uppercase">
                  Backup & Synchronization
                </h4>
              </div>

              <p className="text-xs text-white/60 font-light leading-relaxed">
                Export all your configured projects as a JSON file or import a previous backup safely.
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-bold text-white uppercase transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-orange-400" /> EXPORT PROJECTS (JSON)
                </button>

                <label className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-bold text-white uppercase transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-emerald-400" /> IMPORT PROJECTS (JSON)
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>

                <button
                  onClick={handleResetDefaults}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-[10px] font-mono font-bold text-rose-400 uppercase transition-all cursor-pointer mt-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> RESET TO FACTORY FLAGSHIPS
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Project Form Modal (Add & Edit) */}
      <AnimatePresence>
        {isFormOpen && (
          <ProjectFormModal
            project={editingProject}
            onClose={() => {
              setIsFormOpen(false);
              setEditingProject(null);
            }}
            onSave={handleSaveProject}
          />
        )}
      </AnimatePresence>

      {/* Case Study Live Preview Modal */}
      <AnimatePresence>
        {previewProject && (
          <CaseStudyModal
            project={previewProject}
            onClose={() => setPreviewProject(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
