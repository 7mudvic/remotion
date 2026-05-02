import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming, type TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {LogoIntro} from './scenes/LogoIntro';
import {DishShowcase} from './scenes/DishShowcase';
import {Outro} from './scenes/Outro';
import {BRAND, DISHES, INTRO_FRAMES, DISH_FRAMES, OUTRO_FRAMES, TRANSITION_FRAMES} from './data';
import {THEME} from './theme';

// Each presentation has a different generic, so we erase to a common
// type before passing through the JSX prop. Both slide() and wipe()
// satisfy the runtime contract TransitionSeries.Transition expects.
const pickTransition = (i: number): TransitionPresentation<Record<string, unknown>> => {
  return (
    i % 2 === 0
      ? slide({direction: 'from-right'})
      : wipe({direction: 'from-bottom-right'})
  ) as unknown as TransitionPresentation<Record<string, unknown>>;
};

/**
 * Top-level video. Stitches the logo intro, three dish showcases, and the
 * outro together with cinematic transitions. The TransitionSeries from
 * @remotion/transitions makes the overlaps frame-perfect.
 */
export const MenuShow: React.FC = () => {
  return (
    <AbsoluteFill style={{background: THEME.bgBottom}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
          <LogoIntro
            brandName={BRAND.nameEn}
            brandNameAr={BRAND.nameAr}
            tagline={BRAND.taglineEn}
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
                // alternate slide / wipe so transitions don't feel repetitive
                presentation={pickTransition(i)}
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

/**
 * Compute the total runtime so the Composition's durationInFrames matches the
 * scene graph exactly. TransitionSeries overlaps consume `transition.duration`
 * from each adjacent sequence, so we subtract them.
 */
export const TOTAL_FRAMES =
  INTRO_FRAMES +
  DISH_FRAMES * DISHES.length +
  OUTRO_FRAMES -
  // 1 transition between intro & first dish
  // (DISHES.length - 1) transitions between dishes
  // 1 transition between last dish & outro
  TRANSITION_FRAMES * (1 + Math.max(0, DISHES.length - 1) + 1);
