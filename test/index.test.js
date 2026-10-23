import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSvg, generatePng, THEMES, PRESETS, AVAILABLE_THEMES, AVAILABLE_PRESETS } from '../src/index.js';

test('constants export expected entries', () => {
  assert.ok(AVAILABLE_THEMES.includes('dark'));
  assert.ok(AVAILABLE_THEMES.includes('light'));
  assert.ok(AVAILABLE_THEMES.includes('terminal'));
  assert.ok(AVAILABLE_THEMES.includes('gold'));
  assert.ok(AVAILABLE_PRESETS.includes('og'));
  assert.ok(AVAILABLE_PRESETS.includes('twitter'));
  assert.ok(AVAILABLE_PRESETS.includes('banner'));
  assert.ok(AVAILABLE_PRESETS.includes('compact'));
  assert.ok(AVAILABLE_PRESETS.includes('square'));
  assert.ok(AVAILABLE_PRESETS.includes('story'));
});

test('generateSvg produces valid SVG string with title and metadata', () => {
  const svg = generateSvg({
    title: 'Hello PostReady',
    subtitle: 'Testing automated image generation',
    theme: 'dark',
    badge: 'TEST.ORG',
    author: 'eco-null',
    url: 'postready.org'
  });

  assert.ok(svg.startsWith('<?xml version="1.0"'));
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('Hello PostReady'));
  assert.ok(svg.includes('TEST.ORG'));
  assert.ok(svg.includes('eco-null'));
  assert.ok(svg.includes('postready.org'));
});

test('generatePng renders clean PNG buffer without errors', () => {
  const png = generatePng({
    title: 'Rust Resvg Engine',
    subtitle: 'Ultra fast native SVG to PNG compilation',
    theme: 'terminal',
    preset: 'og'
  });

  assert.ok(png instanceof Uint8Array);
  assert.ok(png.length > 5000, `Expected PNG buffer > 5000 bytes, got ${png.length}`);

  // Check PNG magic bytes: 0x89 0x50 0x4E 0x47
  assert.equal(png[0], 0x89);
  assert.equal(png[1], 0x50);
  assert.equal(png[2], 0x4E);
  assert.equal(png[3], 0x47);
});

test('generateSvg handles multi-line title wrapping', () => {
  const longTitle = 'Building Scalable Open Source Tools for Developers and Solo Founders in 2026';
  const svg = generateSvg({ title: longTitle });
  const textMatches = svg.match(/<text x="96"/g);
  assert.ok(textMatches && textMatches.length >= 2, 'Should wrap into multiple text lines');
});
