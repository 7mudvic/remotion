import {loadFont as loadCairo} from '@remotion/google-fonts/Cairo';
import {loadFont as loadTajawal} from '@remotion/google-fonts/Tajawal';
import {loadFont as loadReemKufi} from '@remotion/google-fonts/ReemKufi';

/**
 * Arabic-first font stack tuned for big-screen / TV display.
 *
 *   cairo         → large display titles (very heavy, modern Arabic)
 *   tajawal       → body / description text (clean, rounded, readable)
 *   reemKufi      → accent / English-feel headers in Arabic
 *
 * Subsets are restricted to keep bundle + network footprint small.
 */
const cairoHandle = loadCairo('normal', {
  subsets: ['arabic', 'latin'],
  weights: ['400', '700', '900'],
  ignoreTooManyRequestsWarning: true,
});

const tajawalHandle = loadTajawal('normal', {
  subsets: ['arabic', 'latin'],
  weights: ['400', '500', '700'],
  ignoreTooManyRequestsWarning: true,
});

const reemKufiHandle = loadReemKufi('normal', {
  subsets: ['arabic', 'latin'],
  weights: ['400', '700'],
  ignoreTooManyRequestsWarning: true,
});

export const FONT_FAMILY = {
  cairo: cairoHandle.fontFamily,
  tajawal: tajawalHandle.fontFamily,
  reemKufi: reemKufiHandle.fontFamily,
} as const;
