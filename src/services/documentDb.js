// Dedicated Persistent Document Database (IndexedDB + LocalStorage Fallback)
// Ensures patient uploaded documents and medical scans are never lost upon page refresh.

const DB_NAME = 'PulsePoint_Medical_DB';
const DB_VERSION = 1;
const STORE_NAME = 'documents';
const FALLBACK_STORAGE_KEY = 'pulsepoint_documents_cache';

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function getCachedDocuments() {
  try {
    const raw = localStorage.getItem(FALLBACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveDocumentToDb(doc) {
  // 1. Save to IndexedDB
  try {
    const db = await openDB();
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(doc);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }

  // 2. Also cache in localStorage for fast synchronous render
  try {
    const cached = getCachedDocuments();
    const withoutCurrent = cached.filter(d => d.id !== doc.id);
    const updated = [doc, ...withoutCurrent];
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('localStorage cache limit:', err);
  }

  return doc;
}

export async function getAllStoredDocuments(initialDocs = []) {
  let docs = [];

  try {
    const db = await openDB();
    if (db) {
      docs = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }
  } catch {
    docs = [];
  }

  if (!docs || docs.length === 0) {
    docs = getCachedDocuments();
  }

  // Merge with initial seeded documents so they are always available
  const map = new Map();
  docs.forEach(d => map.set(d.id, d));
  initialDocs.forEach(d => {
    if (!map.has(d.id)) {
      map.set(d.id, d);
      saveDocumentToDb(d);
    }
  });

  return Array.from(map.values());
}

export async function deleteDocumentFromDb(docId) {
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(docId);
    }
  } catch {}

  try {
    const cached = getCachedDocuments();
    const updated = cached.filter(d => d.id !== docId);
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}
