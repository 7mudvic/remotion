/**
 * Visual identity for the slideshow.
 * Tweak these tokens to rebrand the entire video instantly.
 */
export const THEME = {
  // Deep cinematic charcoal -> warm coal gradient
  bgTop: '#0b0807',
  bgMid: '#171010',
  bgBottom: '#070403',

  // Signature gold palette (same family Michelin guides use)
  goldHi: '#f6d98a',
  gold: '#d4a85a',
  goldLo: '#8a6a2b',
  goldShadow: 'rgba(212, 168, 90, 0.35)',

  // Text
  cream: '#f5ecd7',
  creamDim: 'rgba(245, 236, 215, 0.72)',
  ink: '#0b0807',

  // Effects
  vignette: 'rgba(0, 0, 0, 0.65)',
  filmGrain: 0.08,
} as const;

export const FONT = {
  display: 'Cormorant Garamond',
  serif: 'Playfair Display',
  arabic: 'El Messiri',
  ui: 'Inter',
} as const;
