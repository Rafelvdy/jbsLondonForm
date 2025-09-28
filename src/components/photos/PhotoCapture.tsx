'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { deletePhoto, ensurePersistence, estimateUsage, getPhoto, savePhoto } from '@/lib/photoStore';

type PhotoCaptureProps = {
    initialPhotoIds?: string[];
    onChange?: (photoIds: string[]) => void;
};

export default function PhotoCapture({ initialPhotoIds = [], onChange }: PhotoCaptureProps) {
    const [photoIds, setPhotoIds] = useState<string[]>(initialPhotoIds);
    const [persisted, setPersisted] = useState<boolean | null>(null);
    const [usageText, setUsageText] = useState<string>('');
    const objectUrlsRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        (async () => {
            const res = await ensurePersistence();
            setPersisted(res.persisted);
        })();
    }, []);

    const refreshUsage = async () => {
        const { usage, quota } = await estimateUsage();
        if (usage != null && quota != null) {
            const usedMB = (usage / (1024 * 1024)).toFixed(1);
            const totalMB = (quota / (1024 * 1024)).toFixed(1);
            setUsageText(`${usedMB} MB / ${totalMB} MB`);

            const remaining = quota - usage;
            if (remaining < 50 * 1024 * 1024) {
              
            }
          }
        };
        useEffect(() => {
          refreshUsage();
        }, [photoIds.length]);
      
        // Load thumbnails as object URLs (cache in ref; revoke on unmount)
        useEffect(() => {
          let cancelled = false;
      
          (async () => {
            // Clear existing URLs for removed ids
            for (const [id, url] of objectUrlsRef.current.entries()) {
              if (!photoIds.includes(id)) {
                URL.revokeObjectURL(url);
                objectUrlsRef.current.delete(id);
              }
            }
      
            // Preload URLs for current ids
            for (const id of photoIds) {
              if (!objectUrlsRef.current.has(id)) {
                const rec = await getPhoto(id);
                if (!rec) continue;
                const blob = rec.thumbnailBlob || rec.blob;
                const url = URL.createObjectURL(blob);
                if (!cancelled) {
                  objectUrlsRef.current.set(id, url);
                } else {
                  URL.revokeObjectURL(url);
                }
              }
            }
          })();
      
          return () => {
            cancelled = true;
          };
        }, [photoIds]);
      
        useEffect(() => {
          const currentObjectUrls = objectUrlsRef.current;
          return () => {
            // Revoke all URLs on unmount
            for (const url of currentObjectUrls.values()) {
              URL.revokeObjectURL(url);
            }
            currentObjectUrls.clear();
          };
        }, []);
      
        const objectUrls = useMemo(() => {
          return photoIds.map((id) => ({
            id,
            url: objectUrlsRef.current.get(id) || ''
          }));
        }, [photoIds]);
      
        const handleFiles = async (files: FileList | null) => {
          if (!files || files.length === 0) return;
          const newIds: string[] = [];
          for (const file of Array.from(files)) {
            try {
              const { id } = await savePhoto({ file, maxEdge: 1600, mime: 'image/jpeg', quality: 0.8 });
              newIds.push(id);
            } catch (e) {
              console.warn('Failed to save photo:', e);
            }
          }
          const updated = [...photoIds, ...newIds];
          setPhotoIds(updated);
          onChange?.(updated);
        };
      
        const handleDelete = async (id: string) => {
          await deletePhoto(id);
          const updated = photoIds.filter((x) => x !== id);
          setPhotoIds(updated);
          onChange?.(updated);
        };
      
        return (
          <div className="space-y-3">
            {/* Camera/Gallery input */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
      
            {/* Status: persistence and usage */}
            <div className="text-sm text-gray-600">
              {persisted === true && <span>Storage: Persisted ✓</span>}
              {persisted === false && <span>Storage: Not persisted (device may evict data)</span>}
              {persisted === null && <span>Checking storage…</span>}
              {usageText && <span className="ml-2">Usage: {usageText}</span>}
            </div>
      
            {/* Thumbnails */}
            {objectUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {objectUrls.map(({ id, url }) => (
                  <div key={id} className="relative w-24 h-24 border rounded overflow-hidden">
                    {url ? <Image src={url} alt="" fill className="object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                    <button
                      type="button"
                      onClick={() => handleDelete(id)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
}