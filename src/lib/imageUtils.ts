// src/lib/imageUtils.ts
export type ProcessedImage = {
    blob: Blob;
    mimeType: string;
    width: number;
    height: number;
    thumbBlob: Blob;
    thumbWidth: number;
    thumbHeight: number;
};

type EncodePrefs = {
    maxDim: number; // e.g., 1600
    thumbMaxDim: number; // e.g., 256
    avifQuality: number; // 0..1
    webpQuality: number; // 0..1
};

async function loadImageBitmap(file: File | Blob): Promise<ImageBitmap> {
    const arrayBuffer = await file.arrayBuffer();
    return await createImageBitmap(new Blob([arrayBuffer]));
}

function drawToCanvas(image: ImageBitmap, maxDim: number): HTMLCanvasElement {
    const { width, height } = image;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('Canvas 2D context not available');
    ctx.drawImage(image, 0, 0, w, h);
    return canvas;
}

async function tryEncode(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
    return await new Promise(resolve => {
        canvas.toBlob(
            blob => resolve(blob),
            type,
            typeof quality === 'number' ? quality : undefined
        );
    });
}

export async function processImage(file: File, prefs: EncodePrefs = {
    maxDim: 1600,
    thumbMaxDim: 256,
    avifQuality: 0.7,
    webpQuality: 0.8
}): Promise<ProcessedImage> {
    const bitmap = await loadImageBitmap(file);

    // Original resized
    const canvas = drawToCanvas(bitmap, prefs.maxDim);
    let mimeType = 'image/avif';
    let blob = await tryEncode(canvas, 'image/avif', prefs.avifQuality);

    if (!blob) {
        mimeType = 'image/webp';
        blob = await tryEncode(canvas, 'image/webp', prefs.webpQuality);
    }
    if (!blob) {
        mimeType = 'image/png';
        blob = await tryEncode(canvas, 'image/png');
    }
    if (!blob) {
        throw new Error('Failed to encode image');
    }

    // Thumbnail
    const thumbCanvas = drawToCanvas(bitmap, prefs.thumbMaxDim);
    let thumbBlob = await tryEncode(thumbCanvas, 'image/avif', 0.6);
    if (!thumbBlob) thumbBlob = await tryEncode(thumbCanvas, 'image/webp', 0.7);
    if (!thumbBlob) thumbBlob = await tryEncode(thumbCanvas, 'image/png');

    if (!thumbBlob) {
        throw new Error('Failed to encode thumbnail');
    }

    return {
        blob,
        mimeType,
        width: canvas.width,
        height: canvas.height,
        thumbBlob,
        thumbWidth: thumbCanvas.width,
        thumbHeight: thumbCanvas.height
    };
}