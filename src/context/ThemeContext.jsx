import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { STORAGE_KEYS } from '../services/storage.js';
import { normalizeThemePreference, resolveTheme } from '../utils/theme.js';

export const ThemeContext = createContext(null);
const DARK_QUERY = '(prefers-color-scheme: dark)';

function systemPrefersDark() {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(DARK_QUERY).matches;
}

export function ThemeProvider({ children }) {
  const { read, write } = useLocalStorage(
    STORAGE_KEYS.THEME,
    'system',
    normalizeThemePreference,
  );
  const [preference, setPreference] = useState(read);
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark);
  const theme = resolveTheme(preference, prefersDark);

  // Continue following the OS until the user makes a manual choice.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia(DARK_QUERY);
    const handleChange = (event) => setPrefersDark(event.matches);
    media.addEventListener('change', handleChange);
    setPrefersDark(media.matches);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // Apply before paint so switching themes doesn't briefly flash the old palette.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    write(preference);
  }, [preference, write]);

  const toggleTheme = useCallback(() => {
    setPreference(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  const followSystem = useCallback(() => setPreference('system'), []);

  const value = useMemo(() => ({
    theme,
    preference,
    toggleTheme,
    followSystem,
  }), [theme, preference, toggleTheme, followSystem]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
