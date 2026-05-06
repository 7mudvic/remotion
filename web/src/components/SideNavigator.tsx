import {motion} from 'motion/react';

/**
 * Vertical column of dots on the left edge — one per spread. Dots
 * shrink as they get farther from the active one (focal-point feel).
 * Tap to jump to that page.
 */
export const SideNavigator = ({
  count,
  currentIndex,
  onSelect,
}: {
  count: number;
  currentIndex: number;
  onSelect: (i: number) => void;
}) => {
  if (count === 0) return null;

  return (
    <div className="pointer-events-none fixed left-4 top-1/2 z-30 -translate-y-1/2">
      <div
        className="pointer-events-auto flex max-h-[70vh] flex-col items-center gap-2 overflow-y-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({length: count}).map((_, i) => {
          const dist = Math.abs(i - currentIndex);
          const size = i === currentIndex ? 12 : dist === 1 ? 8 : 6;
          return (
            <motion.button
              key={i}
              onClick={() => onSelect(i)}
              animate={{
                width: size,
                height: size,
                backgroundColor:
                  i === currentIndex ? '#1e3fa3' : 'rgba(30, 63, 163, 0.35)',
              }}
              whileHover={{scale: 1.4}}
              transition={{type: 'spring', damping: 22, stiffness: 240}}
              className="rounded-full"
              aria-label={`الصنف ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
