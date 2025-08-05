"use client";
import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check initial connection status
    setIsOnline(navigator.onLine);

    // Handle online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // Hide success indicator after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show indicator if online and we haven't shown it yet
  if (isOnline && !showIndicator) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium
        transition-all duration-300 ease-in-out
        ${isOnline 
          ? 'bg-green-500 border-green-600' 
          : 'bg-red-500 border-red-600'
        }
        ${showIndicator ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
    >
      <div className="flex items-center gap-2">
        <div
          className={`
            w-2 h-2 rounded-full
            ${isOnline ? 'bg-green-200' : 'bg-red-200'}
          `}
        />
        {isOnline ? (
          <span>🌐 Back online - Data will sync</span>
        ) : (
          <span>📱 Offline mode - Data saved locally</span>
        )}
      </div>
    </div>
  );
}