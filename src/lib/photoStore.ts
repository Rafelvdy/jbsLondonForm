'use client';

import { openDB, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';


type PhotoRecord = {
    id: string;
    blob: Blob;
    mime: string;
    createdAt: number;
    width: number;
    height: number;
    sizeBytes: number;
    thumbnailBlob?: Blob;
    originalName?: string;
};

type PhotoDB = {
    photos: PhotoRecord;
};

let dbPromise: Promise<IDBPDatabase<PhotoDB>> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<PhotoDB>('jbs-photo-store', 1, {
            upgrade(db) {
                db.createObjectStore('photos', { keyPath: 'id' });
            }
        });
    }
    return dbPromise;
}

//Loading an image from a file/blob
async function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        };
        img.src = url;
    });
}


//draw to canvas and export compressed blob
async function downscaleToMaxEdge(
    fileOrBlob: File | Blob,
    maxEdge: number,
    mime: string = 'image/jpeg',
    quality: number = 0.8,
): Promise<{ blob: Blob; width: number; height: number }> {
    const img = await loadImageFromBlob(fileOrBlob);
    const { width: srcW, height: srcH } = img;
    
    const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
    const dstW = Math.round(srcW * scale);
    const dstH = Math.round(srcH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = dstW;
    canvas.height = dstH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    ctx.drawImage(img, 0, 0, dstW, dstH);

    const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob(
            (b) => resolve(b || new Blob()),
            mime,
            quality
        )
    );

    return { blob, width: dstW, height: dstH };
}

export async function savePhoto(params: {
    file: File;
    maxEdge?: number;  //default 1600
    mime?: string;  //default image/jpeg
    quality?: number;  //default 0.8
    makeThumbnail?: boolean;  //default true
    thumbMaxEdge?: number;  //default 320
}): Promise<{ id: string; width: number; height: number; sizeBytes: number; originalName?: string; mime: string }> {
    const {
        file,
        maxEdge = 1600,
        mime = 'image/jpeg',
        quality = 0.8,
        makeThumbnail = true,
        thumbMaxEdge = 320,
    } = params;

    const main = await downscaleToMaxEdge(file, maxEdge, mime, quality);
    const photoId = uuidv4();

    let thumbnailBlob: Blob | undefined;
    if (makeThumbnail) {
        const thumb = await downscaleToMaxEdge(file, thumbMaxEdge, mime, 0.7);
        thumbnailBlob = thumb.blob;
    }

    const record: PhotoRecord = {
        id: photoId,
        blob: main.blob,
        mime,
        createdAt: Date.now(),
        width: main.width,
        height: main.height,
        sizeBytes: main.blob.size,
        thumbnailBlob,
        originalName: file.name,
    };

    const db = await getDB();
    await db.put('photos', record);

    return {
        id: photoId,
        width: main.width,
        height: main.height,
        sizeBytes: record.sizeBytes,
        mime
    }
}

export async function getPhoto(photoId: string): Promise<PhotoRecord | undefined> {
    const db = await getDB();
    return db.get('photos', photoId);
}
  
export async function deletePhoto(photoId: string): Promise<void> {
const db = await getDB();
await db.delete('photos', photoId);
}
  
export async function ensurePersistence(): Promise<{ persisted: boolean; reason?: string }> {
if (!('storage' in navigator) || !('persist' in navigator.storage)) {
    return { persisted: false, reason: 'Persistence API not supported' };
}
try {
    const persisted = await navigator.storage.persist();
    return { persisted };
} catch {
    return { persisted: false, reason: 'persist() threw' };
}
}

export async function estimateUsage(): Promise<{ usage?: number; quota?: number }> {
if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
    return {};
}
try {
    const { usage, quota } = await navigator.storage.estimate();
    return { usage, quota };
} catch {
    return {};
}
}