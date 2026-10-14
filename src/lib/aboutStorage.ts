/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { AboutWorkPhoto, CvDocument } from '../types';

const ABOUT_PHOTOS_KEY = 'portfolio_about_work_photos';
const CV_STORAGE_KEY = 'portfolio_cv_document';
const SETTINGS_COLLECTION = 'settings';
const ABOUT_DOC = 'about_photos';
const CV_DOC = 'cv_document';

// ==========================================
// 1. DEFAULT WORK PHOTOS (Office, Coding, New Projects)
// ==========================================
export const defaultAboutPhotos: AboutWorkPhoto[] = [
  {
    id: 'work-office',
    category: 'office',
    title: 'Strategic Office Workspace & Sprint Reviews',
    subtitle: 'Full-Stack Architecture, Team Sync & Laravel/React Sprints',
    description: 'Collaborating closely with product managers and engineers in dynamic office environments. Leading sprint architectural syncs, code reviews, and high-stakes roadmap discussions.',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    tags: ['Office Leadership', 'Laravel & React Architecture', 'Sprint Planning', 'Agile Workflows'],
    date: 'Active Operations',
    location: 'Corporate HQ & Tech Hub'
  },
  {
    id: 'work-coding',
    category: 'coding',
    title: 'Deep Engineering & Code Craftsmanship',
    subtitle: 'Laravel 11 REST API Engineering & React 19 Client Craft',
    description: 'Focused coding hours formulating resilient Laravel backends (Eloquent ORM, queues, migrations) and lightning-fast React frontend applications with clean TypeScript architectures.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Laravel 11 Backend', 'React 19 Frontend', 'Eloquent & REST APIs', 'TypeScript & Tailwind'],
    date: 'Daily Engineering',
    location: 'Engineering Lab'
  },
  {
    id: 'work-project',
    category: 'project',
    title: 'New Project Ideation & System Innovation',
    subtitle: 'Full-Stack Laravel + React Enterprise Platform Launch',
    description: 'Architecting end-to-end applications from database schema to responsive UI, integrating automated Docker containers, CI/CD pipelines, and high-concurrency cloud hosting.',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    tags: ['Full-Stack Launch', 'Laravel REST API', 'React SPA', 'Docker & Cloud SQL'],
    date: 'Recent Launch',
    location: 'Innovation Station'
  }
];

// Generate a valid minimal PDF Data URI for default CV preview
function generateDefaultCvPdfDataUri(): string {
  const content = `BT
/F1 20 Tf
50 720 Td
(KAMAL HOSSAIN - LEAD FULL-STACK ARCHITECT) Tj
/F1 11 Tf
0 -26 Td
(Email: kamalhossainm5443@gmail.com  |  Portfolio: Verified Production Standard) Tj
0 -20 Td
(Location: Berlin, Germany / Remote Available  |  Clearance: Verified Active) Tj
0 -30 Td
(PROFESSIONAL PROFILE & SUMMARY) Tj
/F1 10 Tf
0 -18 Td
(Lead Full-Stack Engineer with 5+ years designing enterprise architectures and high-end) Tj
0 -15 Td
(reactive user experiences. Specialized in React, TypeScript, Node.js, and Cloud Infrastructure.) Tj
0 -28 Td
(CORE TECHNICAL CAPABILITIES) Tj
0 -18 Td
(- Frontend: React, Next.js, TypeScript, Tailwind CSS, Canvas, Motion, WebGL) Tj
0 -15 Td
(- Backend: Node.js, Express, PostgreSQL, Redis, REST APIs, Microservices, Laravel) Tj
0 -15 Td
(- DevOps & Tooling: Docker, Firebase, Git CI/CD, Vite, Linux Shell Systems) Tj
0 -28 Td
(KEY RESPONSIBILITIES & WORK VALUES) Tj
0 -18 Td
(- Office Collaboration: Active sprint leader translating business goals into tech specs) Tj
0 -15 Td
(- Code Craftsmanship: Zero-slop discipline, sub-millisecond renders, strict type safety) Tj
0 -15 Td
(- New Project Launches: Rapid prototyping, whiteboard architecture, and robust testing) Tj
0 -36 Td
([OFFICIAL RESUME VERIFICATION] Upload your personal custom PDF anytime via the local drive uploader) Tj
ET`;

  const streamLength = content.length;
  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${content}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000317 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
450
%%EOF`;

  try {
    return 'data:application/pdf;base64,' + btoa(unescape(encodeURIComponent(pdfString)));
  } catch {
    return 'data:application/pdf;base64,' + btoa(pdfString);
  }
}

export const defaultCvDocument: CvDocument = {
  fileName: 'Kamal_Hossain_FullStack_Engineer_CV.pdf',
  fileSize: '142 KB',
  uploadedAt: 'Active Official CV',
  pdfDataUrl: generateDefaultCvPdfDataUri(),
  isCustomUploaded: false,
};

// ==========================================
// 2. INDEXED DB HELPER FOR LARGE CV PDFs
// ==========================================
const DB_NAME = 'PortfolioAssetsDB';
const DB_VERSION = 1;
const STORE_NAME = 'assets';

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function setIndexedDbValue(key: string, value: any): Promise<void> {
  try {
    const db = await openIndexedDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB set error:', e);
  }
}

async function getIndexedDbValue<T>(key: string): Promise<T | null> {
  try {
    const db = await openIndexedDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB get error:', e);
    return null;
  }
}

// ==========================================
// 3. ABOUT WORK PHOTOS STORAGE & CLOUD SYNC
// ==========================================

export function getStoredAboutPhotos(): AboutWorkPhoto[] {
  try {
    const raw = localStorage.getItem(ABOUT_PHOTOS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load about photos from cache:', e);
  }
  return defaultAboutPhotos;
}

export function saveStoredAboutPhotos(photos: AboutWorkPhoto[]): void {
  try {
    localStorage.setItem(ABOUT_PHOTOS_KEY, JSON.stringify(photos));
    window.dispatchEvent(new CustomEvent('portfolio_about_photos_updated', { detail: photos }));
  } catch (e) {
    console.error('Failed to cache about photos:', e);
  }

  // Cloud Firestore Sync
  (async () => {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, ABOUT_DOC);
      await setDoc(docRef, {
        photos,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync about photos to Firestore:', err);
    }
  })();
}

export function subscribeToAboutPhotos(onUpdate: (photos: AboutWorkPhoto[]) => void): () => void {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ABOUT_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data?.photos) && data.photos.length > 0) {
            localStorage.setItem(ABOUT_PHOTOS_KEY, JSON.stringify(data.photos));
            window.dispatchEvent(new CustomEvent('portfolio_about_photos_updated', { detail: data.photos }));
            onUpdate(data.photos);
            return;
          }
        }
        // If not in cloud yet, seed defaults
        const current = getStoredAboutPhotos();
        setDoc(docRef, {
          photos: current,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
        onUpdate(current);
      },
      (error) => {
        console.warn('Firestore about photos listener fallback:', error);
        onUpdate(getStoredAboutPhotos());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore unreachable for about photos:', err);
    onUpdate(getStoredAboutPhotos());
    return () => {};
  }
}

// Update single photo
export function updateAboutPhoto(updated: AboutWorkPhoto): AboutWorkPhoto[] {
  const current = getStoredAboutPhotos();
  const exists = current.some((p) => p.id === updated.id);
  const nextList = exists
    ? current.map((p) => (p.id === updated.id ? updated : p))
    : [...current, updated];
  saveStoredAboutPhotos(nextList);
  return nextList;
}

// Delete single photo
export function deleteAboutPhoto(id: string): AboutWorkPhoto[] {
  const current = getStoredAboutPhotos();
  const nextList = current.filter((p) => p.id !== id);
  saveStoredAboutPhotos(nextList.length > 0 ? nextList : defaultAboutPhotos);
  return nextList.length > 0 ? nextList : defaultAboutPhotos;
}

// Reset photos to default
export function resetAboutPhotos(): AboutWorkPhoto[] {
  saveStoredAboutPhotos(defaultAboutPhotos);
  return defaultAboutPhotos;
}

// ==========================================
// 4. CV DOCUMENT STORAGE & PDF UPLOADER
// ==========================================

export function getStoredCvDocument(): CvDocument {
  try {
    const raw = localStorage.getItem(CV_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.pdfDataUrl) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load CV from cache:', e);
  }
  return defaultCvDocument;
}

export async function saveStoredCvDocument(cv: CvDocument): Promise<void> {
  // 1. Save in IndexedDB (handles any file size up to 50MB+)
  await setIndexedDbValue('user_cv_pdf', cv);

  // 2. Save in localStorage (safely trim or store full)
  try {
    // If PDF is smaller than 2MB, store in localStorage
    if (cv.pdfDataUrl.length < 2.5 * 1024 * 1024) {
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cv));
    } else {
      // Store metadata only in localStorage, keep large data in IndexedDB
      const metaOnly = { ...cv, pdfDataUrl: cv.pdfDataUrl.slice(0, 100) };
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(metaOnly));
    }
  } catch (e) {
    console.warn('LocalStorage full, stored in IndexedDB:', e);
  }

  window.dispatchEvent(new CustomEvent('portfolio_cv_updated', { detail: cv }));

  // 3. Sync to Firestore if size is within Firestore 1MB limit (< 800KB)
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CV_DOC);
    if (cv.pdfDataUrl.length < 900 * 1024) {
      await setDoc(docRef, {
        fileName: cv.fileName,
        fileSize: cv.fileSize,
        uploadedAt: cv.uploadedAt,
        pdfDataUrl: cv.pdfDataUrl,
        isCustomUploaded: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      // Store metadata only in Firestore for large files
      await setDoc(docRef, {
        fileName: cv.fileName,
        fileSize: cv.fileSize,
        uploadedAt: cv.uploadedAt,
        isCustomUploaded: true,
        isLargeFile: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Failed to sync CV to Firestore:', err);
  }
}

// Initial loader that checks IndexedDB for full PDF
export async function loadFullCvDocument(): Promise<CvDocument> {
  const idbCv = await getIndexedDbValue<CvDocument>('user_cv_pdf');
  if (idbCv && idbCv.pdfDataUrl && idbCv.pdfDataUrl.startsWith('data:application/pdf')) {
    return idbCv;
  }
  return getStoredCvDocument();
}

export function subscribeToCvDocument(onUpdate: (cv: CvDocument) => void): () => void {
  // First load from IndexedDB/Local
  loadFullCvDocument().then((cv) => onUpdate(cv));

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CV_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.pdfDataUrl && typeof data.pdfDataUrl === 'string') {
            const cvDoc: CvDocument = {
              fileName: data.fileName || 'Kamal_Hossain_CV.pdf',
              fileSize: data.fileSize || 'Verified PDF',
              uploadedAt: data.uploadedAt || 'Cloud Synchronized',
              pdfDataUrl: data.pdfDataUrl,
              isCustomUploaded: !!data.isCustomUploaded
            };
            setIndexedDbValue('user_cv_pdf', cvDoc);
            try {
              localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvDoc));
            } catch {}
            window.dispatchEvent(new CustomEvent('portfolio_cv_updated', { detail: cvDoc }));
            onUpdate(cvDoc);
          }
        }
      },
      (error) => {
        console.warn('Firestore CV listener fallback:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore unreachable for CV:', err);
    return () => {};
  }
}

// Trigger browser download for CV PDF
export function triggerCvDownload(cv: CvDocument): void {
  try {
    const link = document.createElement('a');
    link.href = cv.pdfDataUrl;
    link.download = cv.fileName.endsWith('.pdf') ? cv.fileName : `${cv.fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('Download error:', e);
    // Fallback: open in new tab
    window.open(cv.pdfDataUrl, '_blank');
  }
}
