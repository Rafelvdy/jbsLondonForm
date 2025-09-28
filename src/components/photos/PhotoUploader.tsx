// src/components/photos/PhotoUploader.tsx
"use client";
import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { processImage } from '../../lib/imageUtils';
import { computeContentHash, saveImage, estimateUsage } from '../../lib/mediaStore';
import { useFormContext } from '../../hooks/useFormContext';
import type { PhotoMeta } from '../../types/formTypes';

type SystemKind = 'mechanical' | 'electrical' | 'compliance';

interface Props {
    systemKind: SystemKind;
    systemId: string;
    maxPhotos?: number; // default 10
    maxBytesPerSystem?: number; // default ~15MB
}

export default function PhotoUploader({ systemKind, systemId, maxPhotos = 10, maxBytesPerSystem = 15 * 1024 * 1024 }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { state, addSystemPhoto } = useFormContext();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentPhotos: PhotoMeta[] =
        systemKind === 'mechanical'
            ? (state.mechanicalSystems.find(s => s.id === systemId)?.photos ?? [])
            : systemKind === 'electrical'
                ? (state.electricalSystems.find(s => s.id === systemId)?.photos ?? [])
                : (state.complianceSystems.find(s => s.id === systemId)?.photos ?? []);

    async function onSelectFiles(files: FileList | null) {
        if (!files || files.length === 0) return;
        setError(null);

        if (currentPhotos.length >= maxPhotos) {
            setError(`Max ${maxPhotos} photos per system reached.`);
            return;
        }

        setBusy(true);
        try {
            const usage = await estimateUsage();
            let used = usage.usedBytes ?? 0;

            for (let i = 0; i < files.length; i++) {
                if (currentPhotos.length + i >= maxPhotos) break;

                const file = files[i];
                const processed = await processImage(file);
                const hash = await computeContentHash(processed.blob);

                if (used + processed.blob.size > maxBytesPerSystem) {
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

                // Update used size approx
                used += meta.sizeBytes;

                addSystemPhoto({
                    systemKind,
                    systemId,
                    photo: meta
                });
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to add photos');
        } finally {
            setBusy(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    }

    return (
        <div>
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
        </div>
    );
}