import { useTheme } from '../../hooks/useTheme.js';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, preference, toggleTheme, followSystem } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className={styles.controls}>
      <button
        className={styles.toggle}
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${nextTheme} mode`}
        title={`Switch to ${nextTheme} mode`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {theme === 'dark' ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </>
          ) : (
            <path d="M20.2 15.7A8.7 8.7 0 0 1 8.3 3.8 8.7 8.7 0 1 0 20.2 15.7Z" />
          )}
        </svg>
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
      {preference === 'system' ? (
        <span className={styles.systemLabel}>System</span>
      ) : (
        <button
          className={styles.autoButton}
          type="button"
          onClick={followSystem}
          aria-label="Follow system appearance"
          title="Follow system appearance"
        >
          Auto
        </button>
      )}
    </div>
  );
}
