import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {LogoIntro} from './scenes/LogoIntro';
import {DishShowcase} from './scenes/DishShowcase';
import {Outro} from './scenes/Outro';
import {
  BRAND,
  DISHES,
  INTRO_FRAMES,
  DISH_FRAMES,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
} from './data';
import {THEME} from './theme';

/**
 * Top-level video. Three dish hero scenes wrapped between a logo intro and
 * an outro. Fade transitions only — the brand background already has a lot
 * of motion (sunburst rays + decor) so flashy slides would compete.
 */
export const MenuShow: React.FC = () => {
  return (
    <AbsoluteFill style={{background: THEME.blueDeep}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
          <LogoIntro
            brandNameAr={BRAND.nameAr}
            taglineAr={BRAND.taglineAr}
            logoSrc={BRAND.logoSrc}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

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

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <Outro
            brandNameAr={BRAND.nameAr}
            callToActionAr={BRAND.callToActionAr}
            logoSrc={BRAND.logoSrc}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES =
  INTRO_FRAMES +
  DISH_FRAMES * DISHES.length +
  OUTRO_FRAMES -
  TRANSITION_FRAMES * (1 + Math.max(0, DISHES.length - 1) + 1);
