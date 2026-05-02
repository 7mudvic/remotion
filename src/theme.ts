/**
 * Visual identity for "عَريكة البلدة" — royal blue + warm yellow.
 * Tweak these tokens to rebrand the entire video instantly.
 */
export const THEME = {
  // Brand background: deep royal blue with a touch of midnight at the edges
  bgTop: '#0a1638',
  bgMid: '#15295e',
  bgBottom: '#050a1f',

  // Brand royal blue (primary)
  brandBlue: '#1e3fa3',
  brandBlueHi: '#2f55c4',
  brandBlueLo: '#0c1f5a',

  // Signature yellow / honey palette - matches the logo + warm-bread feel
  goldHi: '#ffd76b',
  gold: '#f5c233',
  goldLo: '#a87b14',
  goldShadow: 'rgba(245, 194, 51, 0.42)',

  // Text
  cream: '#fff8e3',
  creamDim: 'rgba(255, 248, 227, 0.74)',
  ink: '#0a1638',

  // Effects
  vignette: 'rgba(0, 0, 0, 0.65)',
  filmGrain: 0.06,
} as const;

export const FONT = {
  display: 'Cormorant Garamond',
  serif: 'Playfair Display',
  arabic: 'El Messiri',
  ui: 'Inter',
} as const;
