import { useCallback } from 'react';
import { storage } from '../services/storage.js';

const identity = (value) => value;

// A small persistence adapter: React owns state; this hook reads/saves it.
export function useLocalStorage(key, fallbackValue, normalize = identity) {
  const read = useCallback(() => {
    const raw = storage.getItem(key);
    if (raw === null) return fallbackValue;

    try {
      return normalize(JSON.parse(raw));
    } catch {
      return fallbackValue;
    }
  }, [key, fallbackValue, normalize]);

  const write = useCallback((value) => {
    try {
      return storage.setItem(key, JSON.stringify(value));
    } catch {
      return false;
    }
  }, [key]);

  return { read, write };
}
