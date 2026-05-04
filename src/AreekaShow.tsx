import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {DishShowcase, type Dish} from './scenes/DishShowcase';
import {DISH_FRAMES, TRANSITION_FRAMES} from './data';
import {THEME} from './theme';

/**
 * عَريكة البلدة — signature-dish-only loop. Two scenes back-to-back so
 * the transition between consecutive instances of the same dish is
 * visible (yellow scene → fade → blue scene).
 */
const AREEKA: Dish = {
  image: 'dishes/dish-22-areekat-al-balad.png',
  nameAr: 'عَريكة البلدة',
  // No nameEn — Arabic only.
  prices: [
    {label: 'صغير', value: '16 ر.س'},
    {label: 'وسط', value: '21 ر.س'},
    {label: 'كبير', value: '37 ر.س'},
  ],
};

export const AreekaShow: React.FC = () => {
  return (
    <AbsoluteFill style={{background: THEME.blueDeep}}>
      <TransitionSeries>
        {/* index 1 → blueTop variant */}
        <TransitionSeries.Sequence durationInFrames={DISH_FRAMES}>
          <DishShowcase dish={AREEKA} index={1} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        {/* index 2 → yellowTop variant */}
        <TransitionSeries.Sequence durationInFrames={DISH_FRAMES}>
          <DishShowcase dish={AREEKA} index={2} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// 195 × 2 − 18 = 372 frames @ 30 fps ≈ 12.4 s
export const AREEKA_TOTAL_FRAMES = DISH_FRAMES * 2 - TRANSITION_FRAMES;
