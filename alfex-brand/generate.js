#!/usr/bin/env node
/* eslint-disable */
/**
 * Alfex Brand — SVG generator
 * Produces 5 concepts × 5 layouts × 3 color treatments = 75 SVGs
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const FONT = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Playfair Display', Georgia, serif";

/* ---------- color treatments ---------- */
const COLORS = {
  'full-color': {
    bg: '#0A0C12',
    primary: '#1ED38A',
    grad1: '#00CFFF',
    grad2: '#A855F7',
    text: '#FFFFFF',
    textDim: 'rgba(255,255,255,0.55)',
    accent: '#1ED38A',
  },
  'white-mono': {
    bg: '#0A0C12',
    primary: '#FFFFFF',
    grad1: '#FFFFFF',
    grad2: '#FFFFFF',
    text: '#FFFFFF',
    textDim: 'rgba(255,255,255,0.55)',
    accent: '#FFFFFF',
  },
  'black-mono': {
    bg: '#FFFFFF',
    primary: '#000000',
    grad1: '#000000',
    grad2: '#000000',
    text: '#000000',
    textDim: 'rgba(0,0,0,0.55)',
    accent: '#000000',
  },
};

/* ---------- shared SVG helpers ---------- */
function svgWrap(viewBox, contents, bg = null) {
  const bgRect = bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="t">
<title id="t">Alfex</title>
${bgRect}
${contents}
</svg>
`;
}

function defs(c, conceptId) {
  if (c === COLORS['white-mono'] || c === COLORS['black-mono']) {
    return `<defs>
  <linearGradient id="g-${conceptId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${c.primary}"/>
    <stop offset="100%" stop-color="${c.primary}"/>
  </linearGradient>
</defs>`;
  }
  return `<defs>
  <linearGradient id="g-${conceptId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${c.grad1}"/>
    <stop offset="50%" stop-color="${c.primary}"/>
    <stop offset="100%" stop-color="${c.grad2}"/>
  </linearGradient>
  <radialGradient id="core-${conceptId}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>
    <stop offset="50%" stop-color="${c.grad1}" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="${c.grad2}" stop-opacity="0"/>
  </radialGradient>
</defs>`;
}

/* ============================================================
   WORDMARK — uses text element with Inter (font-feature-settings
   for premium kerning). For each concept we define a flavour.
   ============================================================ */
function wordmark(c, flavour, x, y, size) {
  if (flavour === 'inter-bold') {
    return `<text x="${x}" y="${y}" fill="${c.text}" font-family="${FONT}" font-weight="800" font-size="${size}" letter-spacing="${size * -0.02}">Alfex</text>`;
  }
  if (flavour === 'inter-light') {
    return `<text x="${x}" y="${y}" fill="${c.text}" font-family="${FONT}" font-weight="300" font-size="${size}" letter-spacing="${size * 0.02}">Alfex</text>`;
  }
  if (flavour === 'mono') {
    return `<text x="${x}" y="${y}" fill="${c.text}" font-family="'JetBrains Mono', monospace" font-weight="600" font-size="${size}" letter-spacing="${size * 0.06}">ALFEX</text>`;
  }
  if (flavour === 'serif-italic') {
    return `<text x="${x}" y="${y}" fill="${c.text}" font-family="${SERIF}" font-weight="500" font-style="italic" font-size="${size}" letter-spacing="${size * -0.005}">Alfex</text>`;
  }
  if (flavour === 'inter-medium') {
    return `<text x="${x}" y="${y}" fill="${c.text}" font-family="${FONT}" font-weight="500" font-size="${size}" letter-spacing="${size * 0.0}">Alfex</text>`;
  }
  return '';
}

/* ============================================================
   CONCEPT 1: ATOM ORBIT — 3 elliptical orbits + glowing core
   ============================================================ */
function atomMark(c, cx, cy, r, useGrad = true) {
  const id = useGrad ? `g-atom` : `mono-atom`;
  const stroke = useGrad ? `url(#${id})` : c.primary;
  const ry = r * 0.38;
  return `<g transform="translate(${cx},${cy})">
  <ellipse cx="0" cy="0" rx="${r}" ry="${ry}" fill="none" stroke="${stroke}" stroke-width="${r * 0.045}" opacity="0.95"/>
  <ellipse cx="0" cy="0" rx="${r}" ry="${ry}" fill="none" stroke="${stroke}" stroke-width="${r * 0.045}" opacity="0.95" transform="rotate(60)"/>
  <ellipse cx="0" cy="0" rx="${r}" ry="${ry}" fill="none" stroke="${stroke}" stroke-width="${r * 0.045}" opacity="0.95" transform="rotate(-60)"/>
  ${useGrad ? `<circle cx="0" cy="0" r="${r * 0.42}" fill="url(#core-atom)"/>` : ''}
  <circle cx="0" cy="0" r="${r * 0.085}" fill="${c.text}"/>
</g>`;
}

/* ============================================================
   CONCEPT 2: PRISM — geometric refraction (data → signal)
   ============================================================ */
function prismMark(c, cx, cy, r, useGrad = true) {
  const id = useGrad ? `g-prism` : `mono-prism`;
  const fill = useGrad ? `url(#${id})` : c.primary;
  const a = r;
  return `<g transform="translate(${cx},${cy})">
  <polygon points="0,${-a} ${a * 0.866},${a * 0.5} ${-a * 0.866},${a * 0.5}" fill="none" stroke="${fill}" stroke-width="${a * 0.08}" stroke-linejoin="round"/>
  <polygon points="0,${-a * 0.55} ${a * 0.476},${a * 0.275} ${-a * 0.476},${a * 0.275}" fill="${fill}" opacity="${useGrad ? 1 : 0.85}"/>
  <line x1="${-a * 1.05}" y1="${a * 0.5}" x2="${-a * 0.866}" y2="${a * 0.5}" stroke="${fill}" stroke-width="${a * 0.06}" stroke-linecap="round"/>
  <line x1="${a * 0.866}" y1="${a * 0.5}" x2="${a * 1.05}" y2="${a * 0.5}" stroke="${fill}" stroke-width="${a * 0.06}" stroke-linecap="round"/>
</g>`;
}

/* ============================================================
   CONCEPT 3: PULSE WAVE — heartbeat with anomaly spike
   ============================================================ */
function pulseMark(c, cx, cy, r, useGrad = true) {
  const id = useGrad ? `g-pulse` : `mono-pulse`;
  const stroke = useGrad ? `url(#${id})` : c.primary;
  const w = r * 2;
  const h = r * 1.4;
  // path: flat → small bump → tall spike → small bump → flat
  return `<g transform="translate(${cx - r},${cy})">
  <path d="M 0,0 L ${w * 0.18},0 L ${w * 0.26},${-h * 0.18} L ${w * 0.34},${h * 0.18} L ${w * 0.42},0 L ${w * 0.5},0 L ${w * 0.55},${-h * 0.5} L ${w * 0.6},${h * 0.4} L ${w * 0.65},0 L ${w * 0.78},0 L ${w * 0.85},${-h * 0.15} L ${w * 0.92},0 L ${w},0"
    fill="none" stroke="${stroke}" stroke-width="${r * 0.08}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${w * 0.575}" cy="${-h * 0.5}" r="${r * 0.13}" fill="${stroke}"/>
</g>`;
}

/* ============================================================
   CONCEPT 4: APERTURE — concentric rings with focused dot
   ============================================================ */
function apertureMark(c, cx, cy, r, useGrad = true) {
  const id = useGrad ? `g-aperture` : `mono-aperture`;
  const stroke = useGrad ? `url(#${id})` : c.primary;
  return `<g transform="translate(${cx},${cy})">
  <circle cx="0" cy="0" r="${r}" fill="none" stroke="${stroke}" stroke-width="${r * 0.045}" opacity="0.6"/>
  <circle cx="0" cy="0" r="${r * 0.7}" fill="none" stroke="${stroke}" stroke-width="${r * 0.05}" opacity="0.85"/>
  <circle cx="0" cy="0" r="${r * 0.4}" fill="none" stroke="${stroke}" stroke-width="${r * 0.06}" opacity="1"/>
  <circle cx="0" cy="0" r="${r * 0.18}" fill="${stroke}"/>
  <line x1="${-r * 1.15}" y1="0" x2="${-r * 1.05}" y2="0" stroke="${stroke}" stroke-width="${r * 0.055}" stroke-linecap="round"/>
  <line x1="${r * 1.05}" y1="0" x2="${r * 1.15}" y2="0" stroke="${stroke}" stroke-width="${r * 0.055}" stroke-linecap="round"/>
  <line x1="0" y1="${-r * 1.15}" x2="0" y2="${-r * 1.05}" stroke="${stroke}" stroke-width="${r * 0.055}" stroke-linecap="round"/>
  <line x1="0" y1="${r * 1.05}" x2="0" y2="${r * 1.15}" stroke="${stroke}" stroke-width="${r * 0.055}" stroke-linecap="round"/>
</g>`;
}

/* ============================================================
   CONCEPT 5: HELIX A — two intertwined curves forming an "A"
   ============================================================ */
function helixMark(c, cx, cy, r, useGrad = true) {
  const id = useGrad ? `g-helix` : `mono-helix`;
  const stroke = useGrad ? `url(#${id})` : c.primary;
  const sw = r * 0.13;
  return `<g transform="translate(${cx},${cy})">
  <path d="M ${-r * 0.7},${r} Q 0,${-r * 1.25} ${r * 0.7},${r}"
        fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>
  <path d="M ${-r * 0.7},${r} Q 0,${r * 0.6} ${r * 0.7},${r}"
        fill="none" stroke="${stroke}" stroke-width="${sw * 0.55}" stroke-linecap="round" opacity="0.55"/>
  <circle cx="0" cy="${-r * 0.52}" r="${r * 0.13}" fill="${stroke}"/>
  <line x1="${-r * 0.32}" y1="${r * 0.18}" x2="${r * 0.32}" y2="${r * 0.18}" stroke="${stroke}" stroke-width="${sw * 0.7}" stroke-linecap="round"/>
</g>`;
}

/* ============================================================
   CONCEPT META
   ============================================================ */
const CONCEPTS = [
  {
    id: 'atom-orbit',
    name: 'Atom Orbit',
    rationale: 'Three orbiting paths around a luminous core — direct AI/intelligence metaphor. Each orbit reads as an ensemble model converging on a single answer.',
    mark: atomMark,
    flavour: 'inter-bold',
    iconRatio: 1.0,
  },
  {
    id: 'prism',
    name: 'Prism',
    rationale: 'A prism refracts noise into clarity. Two nested triangles plus light tracks evoke the moment market chaos becomes a clean signal.',
    mark: prismMark,
    flavour: 'inter-medium',
    iconRatio: 0.95,
  },
  {
    id: 'pulse-wave',
    name: 'Pulse Wave',
    rationale: 'A market heartbeat with one tall spike — the anomaly Alfex catches before the rest of the room. Confident, technical, alive.',
    mark: pulseMark,
    flavour: 'inter-light',
    iconRatio: 1.1,
  },
  {
    id: 'aperture',
    name: 'Aperture',
    rationale: 'Concentric rings with a focused core and four crosshair ticks. Reads as precision, focus, and a lens trained on the market.',
    mark: apertureMark,
    flavour: 'mono',
    iconRatio: 0.95,
  },
  {
    id: 'helix-a',
    name: 'Helix A',
    rationale: 'Two intertwined arcs forming a stylised "A" — Alfex itself, and the dual-mind ensemble that makes it work. Italic serif wordmark adds editorial weight.',
    mark: helixMark,
    flavour: 'serif-italic',
    iconRatio: 1.0,
  },
];

const LAYOUTS = ['horizontal', 'vertical', 'square', 'icon-only', 'wordmark-only'];
const TREATMENTS = ['full-color', 'white-mono', 'black-mono'];

/* ---------- layout templates ---------- */
function makeHorizontal(concept, c, treatment) {
  const useGrad = treatment === 'full-color';
  const cx = 70;
  const cy = 70;
  const r = 50;
  const wordX = 145;
  const wordY = 88;
  const wordSize = 56;
  const conceptDefs = defs(c, concept.id.split('-')[0]).replace(/g-[a-z]+/g, useGrad ? `g-${concept.id.split('-')[0]}` : `mono-${concept.id.split('-')[0]}`);
  const mark = concept.mark(c, cx, cy, r, useGrad);
  const word = wordmark(c, concept.flavour, wordX, wordY, wordSize);
  const bg = treatment === 'black-mono' ? null : (treatment === 'full-color' ? c.bg : c.bg);
  return svgWrap('0 0 420 140', `${conceptDefs}\n${mark}\n${word}`, bg);
}

function makeVertical(concept, c, treatment) {
  const useGrad = treatment === 'full-color';
  const cx = 150;
  const cy = 100;
  const r = 65;
  const wordX = 150;
  const wordY = 220;
  const wordSize = 52;
  const conceptDefs = defs(c, concept.id.split('-')[0]);
  const mark = concept.mark(c, cx, cy, r, useGrad);
  // wordmark, anchored center
  const wordCentered = wordmark(c, concept.flavour, wordX, wordY, wordSize)
    .replace('<text', '<text text-anchor="middle"');
  const bg = c.bg;
  return svgWrap('0 0 300 260', `${conceptDefs}\n${mark}\n${wordCentered}`, bg);
}

function makeSquare(concept, c, treatment) {
  const useGrad = treatment === 'full-color';
  const cx = 100;
  const cy = 100;
  const r = 56;
  const conceptDefs = defs(c, concept.id.split('-')[0]);
  const mark = concept.mark(c, cx, cy, r, useGrad);
  const bg = c.bg;
  return svgWrap('0 0 200 200', `${conceptDefs}\n${mark}`, bg);
}

function makeIconOnly(concept, c, treatment) {
  const useGrad = treatment === 'full-color';
  const cx = 100;
  const cy = 100;
  const r = 80;
  const conceptDefs = defs(c, concept.id.split('-')[0]);
  const mark = concept.mark(c, cx, cy, r, useGrad);
  // No background for icon-only — keep transparent for flexibility
  return svgWrap('0 0 200 200', `${conceptDefs}\n${mark}`, null);
}

function makeWordmarkOnly(concept, c, treatment) {
  const wordSize = 80;
  const wordX = 200;
  const wordY = 95;
  const word = wordmark(c, concept.flavour, wordX, wordY, wordSize)
    .replace('<text', '<text text-anchor="middle"');
  const bg = c.bg;
  return svgWrap('0 0 400 140', word, bg);
}

const builders = {
  horizontal: makeHorizontal,
  vertical: makeVertical,
  square: makeSquare,
  'icon-only': makeIconOnly,
  'wordmark-only': makeWordmarkOnly,
};

/* ---------- generate ---------- */
let count = 0;
for (const concept of CONCEPTS) {
  for (const layout of LAYOUTS) {
    for (const treatment of TREATMENTS) {
      const c = COLORS[treatment];
      const svg = builders[layout](concept, c, treatment);
      const file = path.join(ROOT, `concept-${concept.id}`, layout, `${treatment}.svg`);
      fs.writeFileSync(file, svg);
      count++;
    }
  }
}
console.log(`Wrote ${count} SVG files.`);
