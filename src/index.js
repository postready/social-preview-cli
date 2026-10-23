import { Resvg } from '@resvg/resvg-js';

// --- Theme Definitions ---

export const THEMES = {
  dark: {
    bg: '#09090b',
    surface: '#121215',
    border: '#27272a',
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    accent: '#ffffff',
    accentText: '#09090b',
    dotGrid: 'rgba(255, 255, 255, 0.05)'
  },
  light: {
    bg: '#fafafa',
    surface: '#ffffff',
    border: '#e4e4e7',
    textPrimary: '#09090b',
    textSecondary: '#52525b',
    textMuted: '#a1a1aa',
    accent: '#09090b',
    accentText: '#ffffff',
    dotGrid: 'rgba(0, 0, 0, 0.05)'
  },
  terminal: {
    bg: '#0c0c0c',
    surface: '#141414',
    border: '#222222',
    textPrimary: '#00ff66',
    textSecondary: '#88e0a2',
    textMuted: '#38704a',
    accent: '#00ff66',
    accentText: '#0c0c0c',
    dotGrid: 'rgba(0, 255, 102, 0.05)'
  },
  gold: {
    bg: '#0a0a0c',
    surface: '#121216',
    border: '#2a2720',
    textPrimary: '#fbf8ee',
    textSecondary: '#d4af37',
    textMuted: '#8a7846',
    accent: '#d4af37',
    accentText: '#0a0a0c',
    dotGrid: 'rgba(212, 175, 55, 0.06)'
  }
};

export const AVAILABLE_THEMES = Object.keys(THEMES);

// --- Layout Presets & Ratios ---

export const PRESETS = {
  'og': { width: 1200, height: 630, titleSize: 52, titleWrap: 28, subtitleSize: 22, subtitleWrap: 48, padding: 96 },
  'twitter': { width: 1200, height: 600, titleSize: 52, titleWrap: 28, subtitleSize: 22, subtitleWrap: 48, padding: 96 },
  'github': { width: 1280, height: 640, titleSize: 54, titleWrap: 30, subtitleSize: 24, subtitleWrap: 50, padding: 104 },
  'banner': { width: 1200, height: 400, titleSize: 40, titleWrap: 36, subtitleSize: 18, subtitleWrap: 60, padding: 60 },
  'compact': { width: 800, height: 420, titleSize: 36, titleWrap: 26, subtitleSize: 16, subtitleWrap: 42, padding: 56 },
  'square': { width: 1080, height: 1080, titleSize: 64, titleWrap: 22, subtitleSize: 26, subtitleWrap: 38, padding: 112 },
  'story': { width: 1080, height: 1920, titleSize: 76, titleWrap: 18, subtitleSize: 32, subtitleWrap: 32, padding: 128 }
};

export const AVAILABLE_PRESETS = Object.keys(PRESETS);

// --- Text Utilities ---

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxCharsPerLine = 32) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

// --- SVG Generator ---

export function generateSvg(options = {}) {
  const {
    title = 'Developer Tools & Open Source',
    subtitle = 'Autonomous agents, high-performance web tooling and zero-dependency utilities.',
    badge = 'POSTREADY.ORG',
    author = 'eco-null',
    url = 'postready.org',
    tags = ['TypeScript', 'CLI', 'Open Source'],
    theme = 'dark',
    preset = 'og',
    customWidth,
    customHeight,
    showGrid = true
  } = options;

  const t = THEMES[theme] || THEMES.dark;
  const p = PRESETS[preset] || PRESETS.og;
  const width = customWidth || p.width;
  const height = customHeight || p.height;

  const pad = p.padding || 80;
  const titleSize = p.titleSize || 48;
  const subtitleSize = p.subtitleSize || 20;

  const titleLines = wrapText(title, p.titleWrap || 28);
  const subtitleLines = wrapText(subtitle, p.subtitleWrap || 45);

  const safeBadge = escapeXml(badge);
  const safeAuthor = escapeXml(author);
  const safeUrl = escapeXml(url);

  const titleLineHeight = Math.round(titleSize * 1.2);
  const subtitleLineHeight = Math.round(subtitleSize * 1.45);

  let titleStartY;
  if (preset === 'banner') {
    titleStartY = pad + 90;
  } else if (preset === 'story') {
    titleStartY = 580;
  } else if (preset === 'square') {
    titleStartY = 380;
  } else {
    titleStartY = pad + 130;
  }

  const subtitleStartY = titleStartY + (titleLines.length * titleLineHeight) + 10;

  let titleSvg = '';
  titleLines.forEach((line, idx) => {
    titleSvg += `<text x="${pad}" y="${titleStartY + (idx * titleLineHeight)}" fill="${t.textPrimary}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="${titleSize}" font-weight="700" letter-spacing="-0.025em">${escapeXml(line)}</text>\n`;
  });

  let subtitleSvg = '';
  subtitleLines.forEach((line, idx) => {
    subtitleSvg += `<text x="${pad}" y="${subtitleStartY + (idx * subtitleLineHeight)}" fill="${t.textSecondary}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="${subtitleSize}" font-weight="400">${escapeXml(line)}</text>\n`;
  });

  let tagsSvg = '';
  let tagX = pad;
  const tagY = height - pad + 12;

  (tags || []).slice(0, 4).forEach(tag => {
    const safeTag = escapeXml(tag);
    const fontSize = preset === 'compact' ? 11 : 13;
    const tagWidth = safeTag.length * (fontSize * 0.65) + 24;
    const tagHeight = preset === 'compact' ? 26 : 30;

    tagsSvg += `
      <g transform="translate(${tagX}, ${tagY - tagHeight})">
        <rect width="${tagWidth}" height="${tagHeight}" rx="4" fill="${t.surface}" stroke="${t.border}" stroke-width="1" />
        <text x="12" y="${tagHeight - 10}" fill="${t.textSecondary}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="${fontSize}" font-weight="500">${safeTag}</text>
      </g>
    `;
    tagX += tagWidth + 8;
  });

  const gridPattern = showGrid ? `
    <defs>
      <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="${t.dotGrid}" />
      </pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#dot-grid)" />
  ` : '';

  const frameInset = preset === 'compact' ? 20 : 32;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Layer -->
  <rect width="${width}" height="${height}" fill="${t.bg}" />
  ${gridPattern}

  <!-- Structural Frame Border -->
  <rect x="${frameInset}" y="${frameInset}" width="${width - (frameInset * 2)}" height="${height - (frameInset * 2)}" rx="8" fill="none" stroke="${t.border}" stroke-width="1.5" />

  <!-- Brand Top Header -->
  <g transform="translate(${pad}, ${pad - 8})">
    <rect width="${safeBadge.length * 8 + 20}" height="26" rx="4" fill="${t.accent}" />
    <text x="10" y="17" fill="${t.accentText}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="0.08em">${safeBadge}</text>
    <text x="${width - (pad * 2)}" y="18" text-anchor="end" fill="${t.textMuted}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="13">${safeUrl}</text>
  </g>

  <!-- Title & Subtitle Typography -->
  ${titleSvg}
  ${subtitleSvg}

  <!-- Bottom Metadata & Tags -->
  ${tagsSvg}

  <!-- Author Signature -->
  <g transform="translate(${width - pad}, ${height - pad + 8})">
    <text x="0" y="0" text-anchor="end" fill="${t.textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500">Curated by <tspan fill="${t.textPrimary}" font-weight="600">${safeAuthor}</tspan></text>
  </g>
</svg>`.trim();
}

// --- PNG Exporter ---

export function generatePng(options = {}) {
  const svg = generateSvg(options);
  const p = PRESETS[options.preset] || PRESETS.og;
  const targetWidth = options.customWidth || p.width;

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: targetWidth },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: '-apple-system'
    }
  });

  return resvg.render().asPng();
}
