import {useEffect, useRef} from 'react';
import {motion} from 'motion/react';
import type {Dish} from '../data';

/**
 * Bottom horizontal scroller of dish thumbnails. Tap a thumb to jump
 * to that dish. The strip auto-scrolls so the active thumb stays
 * roughly centred while the carousel auto-advances.
 */
export const ThumbStrip = ({
  dishes,
  activeIndex,
  onSelect,
}: {
  dishes: Dish[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Centre the active thumb whenever it changes
  useEffect(() => {
    const el = itemsRef.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
  }, [activeIndex]);

  if (dishes.length === 0) return null;

  return (
    <div className="relative h-36 shrink-0 border-t border-brand-yellow/20 bg-brand-blueDeep/40 backdrop-blur-md">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-blueDeep/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-blueDeep/90 to-transparent" />

      <div
        ref={scrollerRef}
        dir="rtl"
        className="flex h-full items-center gap-3 overflow-x-auto px-8 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dishes.map((d, i) => {
          const on = i === activeIndex;
          return (
            <motion.button
              key={d.image}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              onClick={() => onSelect(i)}
              animate={{
                scale: on ? 1 : 0.9,
                borderColor: on ? '#f5c233' : 'rgba(245, 194, 51, 0.2)',
              }}
              whileTap={{scale: on ? 0.96 : 0.86}}
              transition={{type: 'spring', damping: 22, stiffness: 240}}
              className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 ${
                on
                  ? 'shadow-chip ring-2 ring-brand-yellow/50'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={d.nameAr}
            >
              <img
                src={d.image}
                alt={d.nameAr}
                className="h-full w-full scale-110 object-contain p-1"
                loading="lazy"
              />
              {on ? (
                <motion.div
                  layoutId="thumbActiveDot"
                  className="absolute -bottom-1.5 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-brand-yellow shadow-[0_0_12px_rgba(245,194,51,0.6)]"
                />
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
