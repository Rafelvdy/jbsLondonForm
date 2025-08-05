"use client";
import { useState, useEffect } from 'react';
import styles from './CacheLoadingOverlay.module.css';

interface CacheLoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  onComplete: () => void;
}

export default function CacheLoadingOverlay({ isVisible, progress, onComplete }: CacheLoadingOverlayProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  // Smooth progress animation
  useEffect(() => {
    if (progress > displayProgress) {
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + 1, progress));
      }, 20); // Smooth increment every 20ms
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  // Handle completion
  useEffect(() => {
    if (displayProgress >= 100 && !isCompleting) {
      setIsCompleting(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 800); // Wait a bit before hiding
      return () => clearTimeout(timer);
    }
  }, [displayProgress, isCompleting, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.overlay} ${isCompleting ? styles.fadeOut : ''}`}>
      <div className={styles.backdrop} />
      <div className={styles.container}>
        <div className={styles.card}>
          {/* JBS London Branding */}
          <div className={styles.branding}>
            <div className={styles.logo}>JBS</div>
            <div className={styles.company}>London</div>
          </div>

          {/* Loading Content */}
          <div className={styles.content}>
            <h2 className={styles.title}>Preparing for Offline Use</h2>
            <p className={styles.subtitle}>Caching pages for seamless offline experience</p>
            
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
              <div className={styles.progressBackground}>
                <div 
                  className={styles.progressBar}
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {displayProgress}%
              </div>
            </div>

            {/* Loading Animation */}
            <div className={styles.loadingDots}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>

            {/* Status Text */}
            <div className={styles.status}>
              {displayProgress < 100 ? 'Caching pages...' : 'Ready for offline use!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}