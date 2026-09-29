/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Project, Inquiry, AdminUser } from '../types';
import { projectsData } from '../data';

const PROJECTS_COLLECTION = 'projects';
const INQUIRIES_COLLECTION = 'inquiries';
const SETTINGS_COLLECTION = 'settings';
const PROFILE_DOC = 'profile';

const PROJECTS_STORAGE_KEY = 'portfolio_projects';
const INQUIRIES_STORAGE_KEY = 'portfolio_inquiries';
const AUTH_STORAGE_KEY = 'portfolio_admin_auth';
const PASSWORD_STORAGE_KEY = 'portfolio_admin_password';
const PROFILE_IMAGE_STORAGE_KEY = 'portfolio_profile_image';

// Initial sample inquiries
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

// Helper to sanitize undefined values before sending to Firestore
function sanitizeProject(project: Project): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(project)) {
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean;
}

// ==========================================
// 1. PROJECTS (Cloud Firestore + Local Cache)
// ==========================================

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

// Real-time listener for Firestore projects - syncs to any device!
export function subscribeToProjects(onUpdate: (projects: Project[]) => void): () => void {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProjects: Project[] = [];
          snapshot.forEach((docSnap) => {
            cloudProjects.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          // Update cache & dispatch
          saveStoredProjects(cloudProjects);
          onUpdate(cloudProjects);
        } else {
          // If Firestore is empty on first boot, seed it with default projects
          seedDefaultProjects();
          onUpdate(getStoredProjects());
        }
      },
      (error) => {
        console.warn('Firestore projects subscribe fallback to local:', error);
        onUpdate(getStoredProjects());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore not reachable, using local:', err);
    onUpdate(getStoredProjects());
    return () => {};
  }
}

// Seed defaults to Firestore if database is fresh
export async function seedDefaultProjects(): Promise<void> {
  try {
    for (const proj of projectsData) {
      const docRef = doc(db, PROJECTS_COLLECTION, proj.id);
      await setDoc(docRef, sanitizeProject(proj), { merge: true });
    }
  } catch (e) {
    console.warn('Could not seed default projects to Firestore:', e);
  }
}

export function addStoredProject(project: Project): Project[] {
  const current = getStoredProjects();
  const updated = [project, ...current.filter((p) => p.id !== project.id)];
  saveStoredProjects(updated);

  // Sync to Firestore immediately so all devices receive it
  (async () => {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, project.id);
      await setDoc(docRef, sanitizeProject(project));
    } catch (e) {
      console.error('Failed to sync added project to Firestore:', e);
    }
  })();

  return updated;
}

export function updateStoredProject(project: Project): Project[] {
  const current = getStoredProjects();
  const updated = current.map((p) => (p.id === project.id ? project : p));
  saveStoredProjects(updated);

  // Sync to Firestore
  (async () => {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, project.id);
      await setDoc(docRef, sanitizeProject(project), { merge: true });
    } catch (e) {
      console.error('Failed to sync updated project to Firestore:', e);
    }
  })();

  return updated;
}

export function deleteStoredProject(id: string): Project[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);
  saveStoredProjects(updated);

  // Remove from Firestore
  (async () => {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error('Failed to delete project from Firestore:', e);
    }
  })();

  return updated;
}

export function resetStoredProjects(): Project[] {
  saveStoredProjects(projectsData);
  // Re-seed to Firestore
  seedDefaultProjects();
  return projectsData;
}

// ==========================================
// 2. INQUIRIES (Cloud Firestore + Local Cache)
// ==========================================

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
  return initialInquiries;
}

export function subscribeToInquiries(onUpdate: (inquiries: Inquiry[]) => void): () => void {
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudInquiries: Inquiry[] = [];
          snapshot.forEach((docSnap) => {
            cloudInquiries.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          // Sort by date descending
          cloudInquiries.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(cloudInquiries));
          window.dispatchEvent(new CustomEvent('portfolio_inquiries_updated', { detail: cloudInquiries }));
          onUpdate(cloudInquiries);
        } else {
          onUpdate(getStoredInquiries());
        }
      },
      (error) => {
        console.warn('Firestore inquiries subscribe error:', error);
        onUpdate(getStoredInquiries());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore inquiries unreachable, fallback:', err);
    onUpdate(getStoredInquiries());
    return () => {};
  }
}

export function addStoredInquiry(inquiry: Omit<Inquiry, 'id' | 'date' | 'read'>): Inquiry {
  const current = getStoredInquiries();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');
  const id = 'inq-' + Date.now();
  const newInquiry: Inquiry = {
    ...inquiry,
    id,
    date: dateStr,
    read: false,
  };
  const updated = [newInquiry, ...current];
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('portfolio_inquiries_updated', { detail: updated }));

  // Sync to Firestore
  (async () => {
    try {
      const docRef = doc(db, INQUIRIES_COLLECTION, id);
      await setDoc(docRef, {
        id,
        name: newInquiry.name,
        email: newInquiry.email,
        topic: newInquiry.topic,
        message: newInquiry.message,
        date: dateStr,
        read: false,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Could not save inquiry to Firestore:', e);
    }
  })();

  return newInquiry;
}

export function markInquiryStatus(id: string, read: boolean): Inquiry[] {
  const current = getStoredInquiries();
  const updated = current.map((inq) => (inq.id === id ? { ...inq, read } : inq));
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('portfolio_inquiries_updated', { detail: updated }));

  // Update in Firestore
  (async () => {
    try {
      const docRef = doc(db, INQUIRIES_COLLECTION, id);
      await setDoc(docRef, { read }, { merge: true });
    } catch (e) {
      console.warn('Failed to update inquiry read status in Firestore:', e);
    }
  })();

  return updated;
}

export function deleteStoredInquiry(id: string): Inquiry[] {
  const current = getStoredInquiries();
  const updated = current.filter((inq) => inq.id !== id);
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('portfolio_inquiries_updated', { detail: updated }));

  // Delete from Firestore
  (async () => {
    try {
      const docRef = doc(db, INQUIRIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Failed to delete inquiry from Firestore:', e);
    }
  })();

  return updated;
}

// ==========================================
// 3. ADMIN AUTHENTICATION
// ==========================================

export function getAdminPassword(): string {
  const current = localStorage.getItem(PASSWORD_STORAGE_KEY);
  if (!current || current === 'admin123') {
    localStorage.setItem(PASSWORD_STORAGE_KEY, '52625');
    return '52625';
  }
  return current;
}

export function setAdminPassword(newPass: string): void {
  localStorage.setItem(PASSWORD_STORAGE_KEY, newPass);
}

// ==========================================
// 4. PROFILE IMAGE STORAGE (Cloud Firestore + Local Cache)
// ==========================================

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
    console.error('Failed to save profile image locally:', e);
  }

  // Sync to Firestore immediately so all other devices receive the updated profile photo
  (async () => {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC);
      await setDoc(docRef, {
        profileImage: imageUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Failed to sync profile photo to Firestore:', e);
    }
  })();
}

// Real-time listener for profile photo across all devices
export function subscribeToProfileImage(onUpdate: (imageUrl: string) => void): () => void {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const img = typeof data?.profileImage === 'string' ? data.profileImage : '';
          localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, img);
          window.dispatchEvent(new CustomEvent('portfolio_profile_image_updated', { detail: img }));
          onUpdate(img);
        } else {
          // If Firestore document doesn't exist yet, seed it from local cache if available
          const localImg = getStoredProfileImage();
          if (localImg) {
            setDoc(docRef, {
              profileImage: localImg,
              updatedAt: new Date().toISOString()
            }, { merge: true }).catch(() => {});
          }
          onUpdate(localImg);
        }
      },
      (error) => {
        console.warn('Firestore profile image listener fallback:', error);
        onUpdate(getStoredProfileImage());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore unreachable for profile photo, using local cache:', err);
    onUpdate(getStoredProfileImage());
    return () => {};
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
