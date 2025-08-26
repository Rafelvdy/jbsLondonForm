const DB_NAME = 'jbs-forms-media';
const DB_VERSION = 1;
const IMAGES_STORE = 'images';
const THUMBS_STORE = 'thumbnails';
const HASHES_STORE = 'hashes'; // contentHash -> imageId

type SaveResult = {
    imageId: string;
    meta: {
        id: string;
        fileName: string;
        sizeBytes: number;
        mimeType: string;
        width: number;
        height: number;
        createdAt: string;
        contentHash: string;
    };
};

type OpenedDB = IDBDatabase;

let dbPromise: Promise<OpenedDB> | null = null;

function openDb(): Promise<OpenedDB> {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(IMAGES_STORE)) db.createObjectStore(IMAGES_STORE);
                if (!db.objectStoreNames.contains(THUMBS_STORE)) db.createObjectStore(THUMBS_STORE);
                if (!db.objectStoreNames.contains(HASHES_STORE)) db.createObjectStore(HASHES_STORE);
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    return dbPromise;
}

async function idbSet(store: string, key: string, value: any): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onabort = () => reject(tx.error);
        tx.objectStore(store).put(value, key);
    });
}

async function idbGet(store: string, key: string): Promise<any | null> {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readonly');
        tx.onabort = () => reject(tx.error);
        const req = tx.objectStore(store).get(key);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => reject(req.error);
    });
}

async function idbDelete(store: string, key: string): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onabort = () => reject(tx.error);
        tx.objectStore(store).delete(key);
    });
}

// Hashing for dedup
export async function computeContentHash(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const bytes = Array.from(new Uint8Array(digest));
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

// OPFS helpers (Chromium)
function hasOPFS(): boolean {
    return typeof navigator !== 'undefined' && !!(navigator as any).storage && typeof (navigator as any).storage.getDirectory === 'function';
}

async function opfsGetDir(path: string) {
    const root = await (navigator as any).storage.getDirectory();
    const parts = path.split('/').filter(Boolean);
    let dir = root;
    for (const part of parts) {
        dir = await dir.getDirectoryHandle(part, { create: true });
    }
    return dir;
}

async function opfsWriteFile(path: string, blob: Blob) {
    const lastSlash = path.lastIndexOf('/');
    const dirPath = path.slice(0, lastSlash);
    const name = path.slice(lastSlash + 1);
    const dir = await opfsGetDir(dirPath);
    const handle = await dir.getFileHandle(name, { create: true });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
}

async function opfsGetFile(path: string): Promise<Blob | null> {
    try {
        const lastSlash = path.lastIndexOf('/');
        const dirPath = path.slice(0, lastSlash);
        const name = path.slice(lastSlash + 1);
        const dir = await opfsGetDir(dirPath);
        const handle = await dir.getFileHandle(name);
        const file = await handle.getFile();
        return file as Blob;
    } catch {
        return null;
    }
}

async function opfsDeleteFile(path: string): Promise<void> {
    try {
        const lastSlash = path.lastIndexOf('/');
        const dirPath = path.slice(0, lastSlash);
        const name = path.slice(lastSlash + 1);
        const dir = await opfsGetDir(dirPath);
        await dir.removeEntry(name, { recursive: false });
    } catch {
        // ignore
    }
}

export async function estimateUsage(): Promise<{ usedBytes: number; quotaBytes?: number }> {
    try {
        // Browser provides a global estimate (covers IDB + OPFS + others)
        const est = await (navigator as any).storage.estimate();
        return {
            usedBytes: est?.usage ?? 0,
            quotaBytes: est?.quota ?? undefined
        };
    } catch {
        return { usedBytes: 0 };
    }
}

export async function saveImage(args: {
    fileName: string;
    imageId: string;
    imageBlob: Blob;
    thumbBlob: Blob;
    width: number;
    height: number;
    mimeType: string;
    createdAtISO: string;
    contentHash: string;
}): Promise<SaveResult> {
    const {
        fileName, imageId, imageBlob, thumbBlob, width, height, mimeType, createdAtISO, contentHash
    } = args;

    // Dedup by hash
    const existingId = await idbGet(HASHES_STORE, contentHash);
    if (existingId) {
        // Thumb might already exist too; return existing meta
        const meta = {
            id: existingId as string,
            fileName,
            sizeBytes: (await idbGet(IMAGES_STORE, `${existingId}:meta`))?.sizeBytes ?? imageBlob.size,
            mimeType,
            width,
            height,
            createdAt: createdAtISO,
            contentHash
        };
        return { imageId: existingId as string, meta };
    }

    // Store full image: OPFS or IDB
    if (hasOPFS()) {
        const ext = mimeType.includes('avif') ? 'avif' : (mimeType.includes('webp') ? 'webp' : 'png');
        await opfsWriteFile(`jbs-forms-media/images/${imageId}.${ext}`, imageBlob);
        // Persist minimal meta in IDB to keep lookups fast
        await idbSet(IMAGES_STORE, `${imageId}:opfs`, `jbs-forms-media/images/${imageId}.${ext}`);
        await idbSet(IMAGES_STORE, `${imageId}:meta`, { sizeBytes: imageBlob.size });
    } else {
        await idbSet(IMAGES_STORE, imageId, imageBlob);
        await idbSet(IMAGES_STORE, `${imageId}:meta`, { sizeBytes: imageBlob.size });
    }

    // Thumbnails always in IDB
    await idbSet(THUMBS_STORE, imageId, thumbBlob);

    // Hash -> imageId
    await idbSet(HASHES_STORE, contentHash, imageId);

    const meta = {
        id: imageId,
        fileName,
        sizeBytes: imageBlob.size,
        mimeType,
        width,
        height,
        createdAt: createdAtISO,
        contentHash
    };
    return { imageId, meta };
}

export async function getImageBlob(imageId: string): Promise<Blob | null> {
    // If OPFS path present, prefer it
    const opfsPath = await idbGet(IMAGES_STORE, `${imageId}:opfs`);
    if (opfsPath && hasOPFS()) {
        return await opfsGetFile(opfsPath as string);
    }
    // Fall back to IDB blob
    const blob = await idbGet(IMAGES_STORE, imageId);
    return blob ?? null;
}

export async function getThumbBlob(imageId: string): Promise<Blob | null> {
    const blob = await idbGet(THUMBS_STORE, imageId);
    return blob ?? null;
}

export async function deleteImage(imageId: string): Promise<void> {
    // Remove OPFS file if present
    const opfsPath = await idbGet(IMAGES_STORE, `${imageId}:opfs`);
    if (opfsPath && hasOPFS()) {
        await opfsDeleteFile(opfsPath as string);
        await idbDelete(IMAGES_STORE, `${imageId}:opfs`);
    }
    await idbDelete(IMAGES_STORE, imageId);
    await idbDelete(IMAGES_STORE, `${imageId}:meta`);
    await idbDelete(THUMBS_STORE, imageId);

    // We cannot reverse lookup hash->imageId easily here without indexing;
    // safe approach is to leave HASHES_STORE mapping as-is or add an index later.
    // (Optional improvement: store reverse mapping to clear it.)
}