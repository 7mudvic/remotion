import {motion} from 'motion/react';
import type {CategoryId} from '../data';

/**
 * Tab pills — dark-tinted glass with a yellow active state. The
 * active background uses layoutId so it slides between tabs smoothly.
 * No backdrop-filter (kept on the search bar above this) so this
 * never costs a fullscreen blur pass per frame.
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
    className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-center gap-1 rounded-full p-1.5 ring-1 ring-white/10"
    style={{
      background:
        'linear-gradient(180deg, rgba(47,85,196,0.18) 0%, rgba(9,18,54,0.40) 100%)',
    }}
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
              transition={{type: 'spring', damping: 24, stiffness: 280}}
              className="absolute inset-0 -z-0 rounded-full bg-brand-yellow"
            />
          ) : null}
          <span
            className={`relative z-10 block px-3 py-1.5 font-cairo text-sm font-bold transition-colors duration-200 ${
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
