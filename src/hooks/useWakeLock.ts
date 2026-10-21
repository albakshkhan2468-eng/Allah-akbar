import { useEffect, useRef, useState, useCallback } from 'react';

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const requestLock = useCallback(async () => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
      setIsActive(true); // Virtual active state
      return;
    }

    try {
      if (wakeLockRef.current !== null && !wakeLockRef.current.released) {
        return;
      }
      const lock = await navigator.wakeLock.request('screen');
      wakeLockRef.current = lock;
      setIsActive(true);
      setErrorMsg(null);

      lock.addEventListener('release', () => {
        wakeLockRef.current = null;
        setIsActive(false);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Wake lock denied';
      console.warn('Wake Lock request error:', msg);
      setErrorMsg(msg);
      setIsActive(false);
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (err) {
        console.warn('Error releasing wake lock:', err);
      }
      wakeLockRef.current = null;
    }
    setIsActive(false);
  }, []);

  const toggleLock = useCallback(async () => {
    if (isActive) {
      await releaseLock();
    } else {
      await requestLock();
    }
  }, [isActive, releaseLock, requestLock]);

  // Re-acquire lock when window regains visibility
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive) {
        await requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, requestLock]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  return {
    isSupported,
    isActive,
    errorMsg,
    requestLock,
    releaseLock,
    toggleLock,
  };
}
