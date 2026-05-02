import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadElMessiri} from '@remotion/google-fonts/ElMessiri';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';

/**
 * Centralised font loading. We restrict subsets and weights aggressively so
 * the bundle stays fast and Google Fonts fires fewer than the warning
 * threshold of network requests per family.
 */
const cormorantHandle = loadCormorant('normal', {
  subsets: ['latin'],
  weights: ['400', '500', '600'],
  ignoreTooManyRequestsWarning: true,
});

const cormorantItalicHandle = loadCormorant('italic', {
  subsets: ['latin'],
  weights: ['400', '500'],
  ignoreTooManyRequestsWarning: true,
});

const playfairHandle = loadPlayfair('normal', {
  subsets: ['latin'],
  weights: ['400', '600'],
  ignoreTooManyRequestsWarning: true,
});

const playfairItalicHandle = loadPlayfair('italic', {
  subsets: ['latin'],
  weights: ['400'],
  ignoreTooManyRequestsWarning: true,
});

const elMessiriHandle = loadElMessiri('normal', {
  subsets: ['arabic', 'latin'],
  weights: ['400', '600', '700'],
  ignoreTooManyRequestsWarning: true,
});

// Force the italic variants to load (handle.waitUntilDone is implicit when a
// component renders text in that style).
void cormorantItalicHandle;
void playfairItalicHandle;

export const FONT_FAMILY = {
  cormorant: cormorantHandle.fontFamily,
  playfair: playfairHandle.fontFamily,
  elMessiri: elMessiriHandle.fontFamily,
} as const;
