import {motion} from 'motion/react';

/**
 * Thin progress bar at the top of the screen — fills in `durationMs`
 * while `active` is true, then resets when `stepKey` changes.
 *
 * Stories-style indicator: communicates "this dish auto-advances".
 */
export const ProgressBar = ({
  active,
  durationMs,
  stepKey,
}: {
  active: boolean;
  durationMs: number;
  stepKey: string;
}) => {
  return (
    <div className="relative h-[3px] w-full bg-brand-blueDeep/40">
      <motion.div
        key={stepKey}
        initial={{scaleX: 0}}
        animate={{scaleX: active ? 1 : 0}}
        transition={{duration: durationMs / 1000, ease: 'linear'}}
        style={{originX: 1 /* RTL: fill from right to left */}}
        className="absolute inset-0 origin-right bg-gradient-to-l from-brand-yellow via-brand-yellowHi to-brand-yellow"
      />
    </div>
  );
};
