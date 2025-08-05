"use client";
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CacheManagerState {
  isLoading: boolean;
  progress: number;
  isComplete: boolean;
  error: string | null;
}

const PAGES_TO_CACHE = [
  '/mechanical-system-form',
  '/electrical-system-form',
  '/compliance-other-systems-forms'
];

export function useCacheManager() {
  const router = useRouter();
  const [state, setState] = useState<CacheManagerState>({
    isLoading: false,
    progress: 0,
    isComplete: false,
    error: null
  });

  const updateProgress = useCallback((completed: number, total: number) => {
    const percentage = Math.round((completed / total) * 100);
    setState(prev => ({ ...prev, progress: percentage }));
  }, []);

  const cachePages = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, progress: 0, error: null }));
    
    try {
      const total = PAGES_TO_CACHE.length;
      let completed = 0;

      // Cache each page with progress tracking
      for (const page of PAGES_TO_CACHE) {
        try {
          // Use Next.js router prefetch for reliable caching
          await router.prefetch(page);
          
          // Also do a fetch to ensure it's fully cached
          await fetch(page, { 
            method: 'HEAD',
            cache: 'force-cache'
          });
          
          completed++;
          updateProgress(completed, total);
          
          // Small delay for smooth UI experience
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (pageError) {
          console.warn(`Failed to cache page ${page}:`, pageError);
          // Continue with other pages even if one fails
          completed++;
          updateProgress(completed, total);
        }
      }

      // Mark as complete
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isComplete: true, 
        progress: 100 
      }));

    } catch (error) {
      console.error('Caching failed:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to cache pages. App will still work online.',
        progress: 0
      }));
    }
  }, [router, updateProgress]);

  const resetCache = useCallback(() => {
    setState({
      isLoading: false,
      progress: 0,
      isComplete: false,
      error: null
    });
  }, []);

  return {
    ...state,
    cachePages,
    resetCache
  };
}