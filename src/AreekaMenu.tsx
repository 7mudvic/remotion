import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {DishShowcase} from './scenes/DishShowcase';
import {AREEKA_DISHES, DISH_FRAMES, TRANSITION_FRAMES} from './data';
import {THEME} from './theme';

/**
 * عَريكة البلدة — full Areeka / Masoub menu (15 signature dishes,
 * each with three sizes). Same visual language as MenuShow but uses
 * the AREEKA_DISHES array and the editorial-typography price layout.
 */
export const AreekaMenu: React.FC = () => {
  return (
    <AbsoluteFill style={{background: THEME.blueDeep}}>
      <TransitionSeries>
        {AREEKA_DISHES.map((dish, i) => (
          <React.Fragment key={dish.image}>
            <TransitionSeries.Sequence durationInFrames={DISH_FRAMES}>
              <DishShowcase dish={dish} index={i + 1} />
            </TransitionSeries.Sequence>

            {i < AREEKA_DISHES.length - 1 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
              />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// 195 × 15 − 18 × 14 = 2925 − 252 = 2673 frames @ 30 fps ≈ 89.1 s
export const AREEKA_MENU_TOTAL_FRAMES =
  DISH_FRAMES * AREEKA_DISHES.length -
  TRANSITION_FRAMES * Math.max(0, AREEKA_DISHES.length - 1);
