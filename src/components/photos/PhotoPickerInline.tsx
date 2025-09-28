// src/components/photos/PhotoPickerInline.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { processImage } from '../../lib/imageUtils';
import { computeContentHash, saveImage, getThumbBlob, deleteImage } from '../../lib/mediaStore';
import type { PhotoMeta } from '../../types/formTypes';

interface Props {
    value: PhotoMeta[]; // staged photos
    onChange: (next: PhotoMeta[]) => void;
    maxPhotos?: number;           // default 10
    maxBytesPerSystem?: number;   // default ~15MB
}

export default function PhotoPickerInline({ value, onChange, maxPhotos = 10, maxBytesPerSystem = 15 * 1024 * 1024 }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const entries: Record<string, string> = {};
            for (const p of value) {
                const blob = await getThumbBlob(p.id);
                if (blob) {
                    entries[p.id] = URL.createObjectURL(blob);
                }
            }
            if (!cancelled) setThumbUrls(entries);
        })();
        return () => {
            cancelled = true;
            Object.values(thumbUrls).forEach((u) => URL.revokeObjectURL(u));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.map(p => p.id).join('|')]);

    async function onSelectFiles(files: FileList | null) {
        if (!files || files.length === 0) return;
        setError(null);

        if (value.length >= maxPhotos) {
            setError(`Max ${maxPhotos} photos per system reached.`);
            return;
        }

        setBusy(true);
        try {
            let approxUsed = value.reduce((sum, p) => sum + p.sizeBytes, 0);

            const newPhotos: PhotoMeta[] = [];
            for (let i = 0; i < files.length; i++) {
                if (value.length + newPhotos.length >= maxPhotos) break;

                const file = files[i];
                const processed = await processImage(file);
                const hash = await computeContentHash(processed.blob);

                if (approxUsed + processed.blob.size > maxBytesPerSystem) {
                    setError('Storage limit for this system reached (~15MB). Delete some photos first.');
                    break;
                }

                const imageId = uuidv4();
                const { meta } = await saveImage({
                    fileName: file.name,
                    imageId,
                    imageBlob: processed.blob,
                    thumbBlob: processed.thumbBlob,
                    width: processed.width,
                    height: processed.height,
                    mimeType: processed.mimeType,
                    createdAtISO: new Date().toISOString(),
                    contentHash: hash
                });

                approxUsed += meta.sizeBytes;
                newPhotos.push(meta);
            }
            if (newPhotos.length > 0) onChange([...value, ...newPhotos]);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to add photos');
        } finally {
            setBusy(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    }

    async function onDelete(photoId: string) {
        if (!confirm('Delete this photo?')) return;
        await deleteImage(photoId);
        onChange(value.filter(p => p.id !== photoId));
    }

    return (
        <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Add photos</label>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => onSelectFiles(e.target.files)}
                disabled={busy}
            />
            {busy && <div>Processing photos...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {value.length > 0 && (
                <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 80px)', gap: 8 }}>
                        {value.map((p) => (
                            <div key={p.id} style={{ position: 'relative' }}>
                                {thumbUrls[p.id]
                                    ? <Image src={thumbUrls[p.id]} alt={p.fileName} width={80} height={80} style={{ objectFit: 'cover' }} />
                                    : <div style={{ width: 80, height: 80, background: '#ddd' }} />
                                }
                                <button
                                    onClick={() => onDelete(p.id)}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                    aria-label="Delete photo"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}