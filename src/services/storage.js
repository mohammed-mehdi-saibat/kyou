export const STORAGE_KEYS = Object.freeze({
  TASKS: 'kyou.tasks.v1',
  THEME: 'kyou.theme.v1',
});

// Only this service accesses browser storage. Swap its implementation later
// to change persistence without rewriting the reducer or React components.
export const storage = {
  getItem(key) {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },

  setItem(key, value) {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key) {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
