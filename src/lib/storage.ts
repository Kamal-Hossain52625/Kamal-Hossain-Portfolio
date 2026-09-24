/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Inquiry, AdminUser } from '../types';
import { projectsData } from '../data';

const PROJECTS_STORAGE_KEY = 'portfolio_projects';
const INQUIRIES_STORAGE_KEY = 'portfolio_inquiries';
const AUTH_STORAGE_KEY = 'portfolio_admin_auth';
const PASSWORD_STORAGE_KEY = 'portfolio_admin_password';
const PROFILE_IMAGE_STORAGE_KEY = 'portfolio_profile_image';

// Initial sample inquiries for preview
const initialInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'David Vance',
    email: 'david.vance@quantumtech.io',
    topic: 'High-Throughput Systems Architecture',
    message: 'Hello Kamal, we are reviewing your distributed systems portfolio. We have an upcoming contract for an ultra low-latency WebAssembly gateway and would like to schedule a 20-minute sync.',
    date: '2026-09-17 14:32',
    read: false,
  },
  {
    id: 'inq-2',
    name: 'Sophia Laurent',
    email: 'sophia@luxurystudio.design',
    topic: 'Micro-Interaction & 3D Web Audio',
    message: 'Hi Kamal! Loved the design aesthetics and the reactive telemetry animations on your projects. Are you open for a freelance design engineering collaboration next month?',
    date: '2026-09-16 09:15',
    read: true,
  }
];

// --- Projects Storage ---
export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load projects from storage:', e);
  }
  // Fallback to default
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsData));
  return projectsData;
}

export function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent('portfolio_projects_updated', { detail: projects }));
  } catch (e) {
    console.error('Failed to save projects to storage:', e);
  }
}

export function addStoredProject(project: Project): Project[] {
  const current = getStoredProjects();
  const updated = [project, ...current];
  saveStoredProjects(updated);
  return updated;
}

export function updateStoredProject(project: Project): Project[] {
  const current = getStoredProjects();
  const updated = current.map((p) => (p.id === project.id ? project : p));
  saveStoredProjects(updated);
  return updated;
}

export function deleteStoredProject(id: string): Project[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);
  saveStoredProjects(updated);
  return updated;
}

export function resetStoredProjects(): Project[] {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsData));
  window.dispatchEvent(new CustomEvent('portfolio_projects_updated', { detail: projectsData }));
  return projectsData;
}

// --- Inquiries Storage ---
export function getStoredInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load inquiries:', e);
  }
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(initialInquiries));
  return initialInquiries;
}

export function addStoredInquiry(inquiry: Omit<Inquiry, 'id' | 'date' | 'read'>): Inquiry {
  const current = getStoredInquiries();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');
  const newInquiry: Inquiry = {
    ...inquiry,
    id: 'inq-' + Date.now(),
    date: dateStr,
    read: false,
  };
  const updated = [newInquiry, ...current];
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('portfolio_inquiries_updated', { detail: updated }));
  return newInquiry;
}

export function markInquiryStatus(id: string, read: boolean): Inquiry[] {
  const current = getStoredInquiries();
  const updated = current.map((inq) => (inq.id === id ? { ...inq, read } : inq));
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('portfolio_inquiries_updated', { detail: updated }));
  return updated;
}

export function deleteStoredInquiry(id: string): Inquiry[] {
  const current = getStoredInquiries();
  const updated = current.filter((inq) => inq.id !== id);
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('portfolio_inquiries_updated', { detail: updated }));
  return updated;
}

// --- Admin Authentication ---
export function getAdminPassword(): string {
  const current = localStorage.getItem(PASSWORD_STORAGE_KEY);
  // If no password or old placeholder 'admin123', update to new requested default 52625
  if (!current || current === 'admin123') {
    localStorage.setItem(PASSWORD_STORAGE_KEY, '52625');
    return '52625';
  }
  return current;
}

export function setAdminPassword(newPass: string): void {
  localStorage.setItem(PASSWORD_STORAGE_KEY, newPass);
}

// --- Profile Image Storage ---
export function getStoredProfileImage(): string {
  try {
    return localStorage.getItem(PROFILE_IMAGE_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStoredProfileImage(imageUrl: string): void {
  try {
    localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, imageUrl);
    window.dispatchEvent(new CustomEvent('portfolio_profile_image_updated', { detail: imageUrl }));
  } catch (e) {
    console.error('Failed to save profile image:', e);
  }
}

export function isUserAdmin(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const auth = JSON.parse(raw);
    return !!auth && auth.loggedIn === true;
  } catch {
    return false;
  }
}

export function loginAdmin(username: string, pass: string): boolean {
  const validPass = getAdminPassword();
  // Allow 'admin', 'kamal', or Kamal's email
  const validUsernames = ['admin', 'kamal', 'kamalhossainm5443@gmail.com', 'mariaafrin1106@gmail.com'];
  if (validUsernames.includes(username.trim().toLowerCase()) && pass === validPass) {
    const session = {
      loggedIn: true,
      username: username.trim(),
      email: 'kamalhossainm5443@gmail.com',
      role: 'Super Admin',
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('portfolio_auth_changed'));
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event('portfolio_auth_changed'));
}

export function getAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
