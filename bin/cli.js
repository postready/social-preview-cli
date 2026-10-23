#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { generateSvg, generatePng, AVAILABLE_THEMES, AVAILABLE_PRESETS } from '../src/index.js';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// --- Color Palette ---

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// --- Help & Usage ---

function printHelp() {
  console.log(`
${c.bold}${c.cyan}social-preview-cli${c.reset} v${pkg.version}
${c.dim}Generate developer-first social preview cards (OG Images) for GitHub, X, and blogs.${c.reset}
${c.dim}Powered by PostReady — ${c.blue}https://postready.org${c.reset}

${c.bold}USAGE:${c.reset}
  $ social-preview "<title>" [options]

${c.bold}OPTIONS:${c.reset}
  ${c.green}-s, --subtitle <text>${c.reset}   Subtitle description
  ${c.green}-o, --out <path>${c.reset}        Output file path (default: preview.png)
  ${c.green}-t, --theme <name>${c.reset}      Color theme: dark (default), light, terminal, gold
  ${c.green}-p, --preset <name>${c.reset}     Size preset: og (1200x630, default), twitter (1200x600),
                             github (1280x640), banner (1200x400 - wide header),
                             compact (800x420 - feed-friendly), square (1080x1080),
                             story (1080x1920 - vertical / mobile)
  ${c.green}-b, --badge <text>${c.reset}      Top brand badge label (default: POSTREADY.ORG)
  ${c.green}-a, --author <name>${c.reset}     Author name (default: eco-null)
  ${c.green}-u, --url <text>${c.reset}        URL or domain watermark (default: postready.org)
  ${c.green}--tags <item,item>${c.reset}      Comma-separated metadata pill tags
  ${c.green}--format <svg|png>${c.reset}     Output format (default: auto-detected from output path)
  ${c.green}--no-grid${c.reset}              Disable subtle dot grid background
  ${c.green}-h, --help${c.reset}              Show this help message
  ${c.green}-v, --version${c.reset}           Show version

${c.bold}EXAMPLES:${c.reset}
  $ social-preview "Building in Public in 2026" -s "Lessons from shipping 3 developer tools in one day."
  $ social-preview "Release v1.0.0" -t terminal --tags "Node.js,Rust,CLI" -o release.png
  $ social-preview "Awesome Tech Hooks" -t gold -p github -o banner.png
`);
}

// --- Argument Parser ---

function parseArgs() {
  const args = process.argv.slice(2);
  let title = '';
  const options = {
    title: '',
    subtitle: '',
    out: 'preview.png',
    theme: 'dark',
    preset: 'og',
    badge: 'POSTREADY.ORG',
    author: 'eco-null',
    url: 'postready.org',
    tags: ['TypeScript', 'CLI', 'Open Source'],
    format: null,
    showGrid: true
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }
    if (arg === '-v' || arg === '--version') {
      console.log(`v${pkg.version}`);
      process.exit(0);
    }
    if (arg === '--no-grid') {
      options.showGrid = false;
      continue;
    }
    if (arg === '-s' || arg === '--subtitle') {
      options.subtitle = args[++i];
      continue;
    }
    if (arg === '-o' || arg === '--out') {
      options.out = args[++i];
      continue;
    }
    if (arg === '-t' || arg === '--theme') {
      options.theme = args[++i];
      continue;
    }
    if (arg === '-p' || arg === '--preset') {
      options.preset = args[++i];
      continue;
    }
    if (arg === '-b' || arg === '--badge') {
      options.badge = args[++i];
      continue;
    }
    if (arg === '-a' || arg === '--author') {
      options.author = args[++i];
      continue;
    }
    if (arg === '-u' || arg === '--url') {
      options.url = args[++i];
      continue;
    }
    if (arg === '--tags') {
      const tagStr = args[++i] || '';
      options.tags = tagStr.split(',').map(t => t.trim()).filter(Boolean);
      continue;
    }
    if (arg === '--format') {
      options.format = args[++i].toLowerCase();
      continue;
    }

    if (!arg.startsWith('-') && !title) {
      title = arg;
    }
  }

  options.title = title || 'Developer Tools & Open Source';
  return options;
}

// --- Execution ---

async function main() {
  try {
    const opts = parseArgs();

    if (!opts.title) {
      printHelp();
      process.exit(1);
    }

    const outPath = path.resolve(process.cwd(), opts.out);
    const isSvg = opts.format === 'svg' || opts.out.endsWith('.svg');

    console.log(`\n${c.bold}${c.cyan}⚡ Generating Social Preview Card...${c.reset}`);
    console.log(`${c.dim}Title:${c.reset} ${opts.title}`);
    console.log(`${c.dim}Theme:${c.reset} ${opts.theme} | ${c.dim}Preset:${c.reset} ${opts.preset}`);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    if (isSvg) {
      const svg = generateSvg(opts);
      fs.writeFileSync(outPath, svg, 'utf8');
    } else {
      const png = generatePng(opts);
      fs.writeFileSync(outPath, png);
    }

    const fileSize = fs.statSync(outPath).size;
    const sizeKb = (fileSize / 1024).toFixed(1);

    console.log(`\n${c.bold}${c.green}✓ Saved card to:${c.reset} ${outPath} ${c.dim}(${sizeKb} KB)${c.reset}`);
    console.log(`${c.dim}Powered by PostReady — ${c.cyan}https://postready.org${c.reset}\n`);
  } catch (err) {
    console.error(`\n${c.yellow}Error:${c.reset}`, err.message);
    process.exit(1);
  }
}

main();
