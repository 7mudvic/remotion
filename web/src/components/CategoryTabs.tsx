import {motion} from 'motion/react';
import type {CategoryId} from '../data';

/**
 * Glass tab pill — same layoutId trick as the Bento top bar so the
 * white pill morphs between categories smoothly.
 */
export const CategoryTabs = ({
  active,
  categories,
  onChange,
}: {
  active: CategoryId;
  categories: ReadonlyArray<{id: CategoryId; labelAr: string}>;
  onChange: (id: CategoryId) => void;
}) => (
  <div
    className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-center gap-1 rounded-full bg-white/10 p-1.5 backdrop-blur-2xl ring-1 ring-white/15"
    role="tablist"
  >
    {categories.map((c) => {
      const on = c.id === active;
      return (
        <button
          key={c.id}
          role="tab"
          aria-selected={on}
          onClick={() => onChange(c.id)}
          className="relative flex-1 px-2 py-1.5"
        >
          {on ? (
            <motion.span
              layoutId="catTabBg"
              transition={{type: 'spring', damping: 22, stiffness: 240}}
              className="absolute inset-0 -z-0 rounded-full bg-white/95"
            />
          ) : null}
          <span
            className={`relative z-10 block px-3 py-1.5 font-cairo text-sm font-bold transition-colors ${
              on ? 'text-brand-blueDeep' : 'text-white/80 hover:text-white'
            }`}
          >
            {c.labelAr}
          </span>
        </button>
      );
    })}
  </div>
);
