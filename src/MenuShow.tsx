import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {DishShowcase} from './scenes/DishShowcase';
import {DISHES, DISH_FRAMES, TRANSITION_FRAMES} from './data';
import {THEME} from './theme';

/**
 * Menu-only video — no intro, no outro. The dish hero scenes play
 * back-to-back with a fade between each. Designed for in-store TV loop:
 * when the video restarts, the loop is seamless.
 */
export const MenuShow: React.FC = () => {
  return (
    <AbsoluteFill style={{background: THEME.blueDeep}}>
      <TransitionSeries>
        {DISHES.map((dish, i) => (
          <React.Fragment key={dish.image}>
            <TransitionSeries.Sequence durationInFrames={DISH_FRAMES}>
              <DishShowcase dish={dish} index={i + 1} />
            </TransitionSeries.Sequence>

            {i < DISHES.length - 1 ? (
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

export const TOTAL_FRAMES =
  DISH_FRAMES * DISHES.length -
  TRANSITION_FRAMES * Math.max(0, DISHES.length - 1);
