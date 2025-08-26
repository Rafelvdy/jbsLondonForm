// src/components/photos/PhotoGallery.tsx
"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { getThumbBlob, getImageBlob, deleteImage } from '../../lib/mediaStore';
import { useFormContext } from '../../hooks/useFormContext';
import type { PhotoMeta } from '../../types/formTypes';

type SystemKind = 'mechanical' | 'electrical' | 'compliance';

interface Props {
    systemKind: SystemKind;
    systemId: string;
    photos: PhotoMeta[]; // pass from parent (system.photos ?? [])
}

export default function PhotoGallery({ systemKind, systemId, photos }: Props) {
    const { removeSystemPhoto } = useFormContext();
    const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});
    const [viewerUrl, setViewerUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const entries: Record<string, string> = {};
            for (const p of photos) {
                const blob = await getThumbBlob(p.id);
                if (blob) {
                    entries[p.id] = URL.createObjectURL(blob);
                }
            }
            if (!cancelled) {
                setThumbUrls(entries);
            }
        })();
        return () => {
            cancelled = true;
            Object.values(thumbUrls).forEach((u) => URL.revokeObjectURL(u));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos.map(p => p.id).join('|')]);

    async function openViewer(photoId: string) {
        const blob = await getImageBlob(photoId);
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setViewerUrl(url);
    }

    function closeViewer() {
        if (viewerUrl) URL.revokeObjectURL(viewerUrl);
        setViewerUrl(null);
    }

    async function onDelete(photoId: string) {
        if (!confirm('Delete this photo?')) return;
        await deleteImage(photoId);
        removeSystemPhoto({ systemKind, systemId, photoId });
    }

    if (photos.length === 0) return null;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 80px)', gap: 8 }}>
                {photos.map((p) => (
                    <div key={p.id} style={{ position: 'relative' }}>
                        <button onClick={() => openViewer(p.id)} style={{ padding: 0, border: 'none', background: 'none' }}>
                            {thumbUrls[p.id]
                                ? <img src={thumbUrls[p.id]} alt={p.fileName} width={80} height={80} />
                                : <div style={{ width: 80, height: 80, background: '#ddd' }} />
                            }
                        </button>
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

            {viewerUrl && (
                <div
                    onClick={closeViewer}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <img src={viewerUrl} alt="Full" style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
                </div>
            )}
        </div>
    );
}