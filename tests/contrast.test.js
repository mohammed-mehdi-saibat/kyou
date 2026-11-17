import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/themes.css', import.meta.url), 'utf8');

function colorsFor(selector) {
  const match = css.match(selector);
  assert.ok(match, 'Theme block should exist');
  return Object.fromEntries(
    [...match[1].matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)]
      .map(([, variable, color]) => [variable, color]),
  );
}

function luminance(hex) {
  const channels = [1, 3, 5].map((at) => {
    const value = parseInt(hex.slice(at, at + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground, background) {
  const high = Math.max(luminance(foreground), luminance(background));
  const low = Math.min(luminance(foreground), luminance(background));
  return (high + 0.05) / (low + 0.05);
}

const light = colorsFor(/:root,\s*:root\[data-theme='light'\]\s*\{([^}]+)\}/);
const dark = colorsFor(/:root\[data-theme='dark'\]\s*\{([^}]+)\}/);

for (const [name, palette] of [['light', light], ['dark', dark]]) {
  test(`${name} text meets WCAG AA contrast on main surfaces`, () => {
    for (const background of ['--color-paper', '--color-surface']) {
      for (const foreground of ['--color-ink', '--color-ink-muted']) {
        const ratio = contrast(palette[foreground], palette[background]);
        assert.ok(ratio >= 4.5, `${name}: ${foreground} / ${background} contrast ${ratio.toFixed(2)} < 4.5`);
      }
    }
  });

  test(`${name} accent button and pink text meet WCAG AA contrast`, () => {
    const buttonRatio = contrast(palette['--color-paper'], palette['--color-ai']);
    const pinkRatio = contrast(palette['--color-sakura-ink'], palette['--color-complete-surface']);
    const doneRatio = contrast(palette['--color-ink-muted'], palette['--color-complete-surface']);
    assert.ok(buttonRatio >= 4.5, `${name}: accent button contrast ${buttonRatio.toFixed(2)} < 4.5`);
    assert.ok(pinkRatio >= 4.5, `${name}: completed-surface accent contrast ${pinkRatio.toFixed(2)} < 4.5`);
    assert.ok(doneRatio >= 4.5, `${name}: completed task title contrast ${doneRatio.toFixed(2)} < 4.5`);
  });
}
