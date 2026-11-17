import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeThemePreference, resolveTheme } from '../src/utils/theme.js';

test('accepts explicit light and dark preferences', () => {
  assert.equal(normalizeThemePreference('light'), 'light');
  assert.equal(normalizeThemePreference('dark'), 'dark');
});

test('falls back to system for missing or invalid values', () => {
  assert.equal(normalizeThemePreference(null), 'system');
  assert.equal(normalizeThemePreference('unexpected'), 'system');
});

test('system choice tracks the current operating system', () => {
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
});

test('manual preference takes priority over system appearance', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
});
