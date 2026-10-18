/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Certification } from '../types';
import { certificationsData } from '../data';

const CERTIFICATIONS_STORAGE_KEY = 'portfolio_certifications';
const SETTINGS_COLLECTION = 'settings';
const CERTIFICATIONS_DOC = 'certifications';

// ==========================================
// 1. LOCAL STORAGE & IN-MEMORY CACHE
// ==========================================

export function getStoredCertifications(): Certification[] {
  try {
    const raw = localStorage.getItem(CERTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load certifications from storage:', e);
  }
  return certificationsData;
}

export function saveStoredCertifications(certs: Certification[]): void {
  try {
    localStorage.setItem(CERTIFICATIONS_STORAGE_KEY, JSON.stringify(certs));
    window.dispatchEvent(
      new CustomEvent('portfolio_certifications_updated', { detail: certs })
    );

    // Asynchronously sync to Cloud Firestore
    syncCertificationsToCloud(certs);
  } catch (e) {
    console.error('Failed to save certifications to storage:', e);
  }
}

// ==========================================
// 2. CRUD OPERATIONS
// ==========================================

export function addStoredCertification(cert: Omit<Certification, 'id'>): Certification[] {
  const current = getStoredCertifications();
  const newCert: Certification = {
    ...cert,
    id: 'cert-' + Date.now(),
    isCustomUploaded: true,
  };
  const updated = [newCert, ...current];
  saveStoredCertifications(updated);
  return updated;
}

export function updateStoredCertification(updatedCert: Certification): Certification[] {
  const current = getStoredCertifications();
  const updated = current.map((c) => (c.id === updatedCert.id ? updatedCert : c));
  saveStoredCertifications(updated);
  return updated;
}

export function deleteStoredCertification(id: string): Certification[] {
  const current = getStoredCertifications();
  const updated = current.filter((c) => c.id !== id);
  saveStoredCertifications(updated);
  return updated;
}

export function resetStoredCertifications(): Certification[] {
  saveStoredCertifications(certificationsData);
  return certificationsData;
}

// ==========================================
// 3. CLOUD FIRESTORE SYNCHRONIZATION
// ==========================================

async function syncCertificationsToCloud(certs: Certification[]): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CERTIFICATIONS_DOC);
    await setDoc(docRef, {
      items: certs,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore certifications sync skipped / offline:', err);
  }
}

// Real-time listener for certifications updates across devices
export function subscribeToCertifications(
  onUpdate: (certs: Certification[]) => void
): () => void {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CERTIFICATIONS_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data?.items) && data.items.length > 0) {
            localStorage.setItem(
              CERTIFICATIONS_STORAGE_KEY,
              JSON.stringify(data.items)
            );
            onUpdate(data.items);
            return;
          }
        }
        // Fallback to local
        onUpdate(getStoredCertifications());
      },
      (error) => {
        console.warn('Firestore certifications listener fallback to local:', error);
        onUpdate(getStoredCertifications());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore not reachable, using local certifications:', err);
    onUpdate(getStoredCertifications());
    return () => {};
  }
}

// ==========================================
// 4. FILE UPLOADER UTILITY (PDF, JPEG, PNG)
// ==========================================

export interface ProcessedCertFile {
  dataUrl: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'jpeg' | 'png' | 'image';
}

export function processCertificateFile(file: File): Promise<ProcessedCertFile> {
  return new Promise((resolve, reject) => {
    // Validate file type
    const validMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp'
    ];
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

    if (!validMimeTypes.includes(file.type) && !isPdf && !isJpeg && !isPng) {
      reject(new Error('Invalid file format. Please upload a PDF, JPEG, or PNG document.'));
      return;
    }

    // Maximum size: 6MB to ensure smooth local and Firestore sync
    if (file.size > 6 * 1024 * 1024) {
      reject(new Error('File size exceeds 6MB. Please upload an optimized file under 6MB.'));
      return;
    }

    // Determine type label
    let fileType: 'pdf' | 'jpeg' | 'png' | 'image' = 'image';
    if (isPdf) fileType = 'pdf';
    else if (isJpeg) fileType = 'jpeg';
    else if (isPng) fileType = 'png';

    // Format human-readable file size
    const sizeKB = (file.size / 1024).toFixed(1);
    const fileSizeStr = file.size >= 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
      : `${sizeKB} KB`;

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error reading certificate file'));

    if (isPdf) {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            dataUrl: reader.result,
            fileName: file.name,
            fileSize: fileSizeStr,
            fileType: 'pdf',
          });
        } else {
          reject(new Error('Failed to read PDF file'));
        }
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        const rawDataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 1920;
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
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, width, height);
              const outputMime = isPng ? 'image/png' : 'image/jpeg';
              const optimizedDataUrl = canvas.toDataURL(outputMime, isPng ? 0.92 : 0.88);
              const approxSizeKB = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);
              const optSizeStr = approxSizeKB >= 1024
                ? `${(approxSizeKB / 1024).toFixed(2)} MB`
                : `${approxSizeKB} KB`;

              resolve({
                dataUrl: optimizedDataUrl,
                fileName: file.name,
                fileSize: optSizeStr,
                fileType,
              });
            } else {
              resolve({
                dataUrl: rawDataUrl,
                fileName: file.name,
                fileSize: fileSizeStr,
                fileType,
              });
            }
          } catch (e) {
            resolve({
              dataUrl: rawDataUrl,
              fileName: file.name,
              fileSize: fileSizeStr,
              fileType,
            });
          }
        };
        img.onerror = () => {
          resolve({
            dataUrl: rawDataUrl,
            fileName: file.name,
            fileSize: fileSizeStr,
            fileType,
          });
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  });
}
