export function normalizeThemePreference(value) {
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function resolveTheme(preference, prefersDark) {
  const normalized = normalizeThemePreference(preference);
  return normalized === 'system' ? (prefersDark ? 'dark' : 'light') : normalized;
}
