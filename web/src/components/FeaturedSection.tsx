import {Star} from 'lucide-react';
import type {Dish} from '../data';
import {startingPrice} from '../data';

/**
 * "أصناف مميّزة" — three signature dishes pinned at the top.
 * Re-tuned for phone widths: the image now dominates the card
 * (~65 % of height) and the bottom info strip is compact so the
 * dish name + yellow price chip never bleed into the image area.
 *
 * Each card uses a portrait aspect ratio, so the image gets a tall,
 * generous frame on every viewport from phone to desktop.
 */
export const FeaturedSection = ({
  dishes,
  onSelect,
}: {
  dishes: Dish[];
  onSelect: (d: Dish) => void;
}) => {
  return (
    <section className="mx-auto w-full max-w-7xl">
      {/* Section heading */}
      <div className="flex items-center justify-center gap-2 pb-3 sm:gap-4 sm:pb-4">
        <span className="h-px w-8 bg-gradient-to-l from-brand-yellow to-transparent sm:w-16" />
        <Star
          className="h-4 w-4 fill-brand-yellow text-brand-yellow sm:h-5 sm:w-5"
          strokeWidth={2}
        />
        <h2 className="font-cairo text-base font-black tracking-wide text-brand-yellow sm:text-xl md:text-2xl">
          أصناف مميّزة
        </h2>
        <Star
          className="h-4 w-4 fill-brand-yellow text-brand-yellow sm:h-5 sm:w-5"
          strokeWidth={2}
        />
        <span className="h-px w-8 bg-gradient-to-r from-brand-yellow to-transparent sm:w-16" />
      </div>

      {/* 3-card row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {dishes.map((d) => (
          <FeaturedCard key={d.image} dish={d} onClick={() => onSelect(d)} />
        ))}
      </div>
    </section>
  );
};

const FeaturedCard = ({dish, onClick}: {dish: Dish; onClick: () => void}) => {
  const isMulti = dish.prices && dish.prices.length > 1;
  const startPrice = startingPrice(dish);

  return (
    <button
      onClick={onClick}
      className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl text-right outline-none transition-transform duration-200 ease-out will-change-transform hover:-translate-y-1 active:scale-[0.98] sm:rounded-3xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(245,194,51,0.18) 0%, rgba(9,18,54,0.65) 60%, rgba(9,18,54,0.65) 100%)',
        boxShadow:
          '0 16px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      }}
    >
      {/* Gold ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-brand-yellow/40 sm:rounded-3xl" />

      {/* Star-only "مميّز" badge — small and tucked in the corner so it
          doesn't eat into the image area on phones */}
      <div className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-brand-yellow text-brand-blueDeep shadow-sm ring-1 ring-brand-yellowLo/50 sm:h-8 sm:w-8">
        <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" strokeWidth={2.5} />
      </div>

      {/* Image — the dominant element of the card (~65 % of height) */}
      <div className="relative flex flex-1 items-center justify-center px-2 pb-1 pt-3 sm:pt-4">
        <img
          src={dish.image}
          alt={dish.nameAr}
          decoding="async"
          className="max-h-full max-w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
          style={{transform: 'scale(1.06)'}}
        />
      </div>

      {/* Compact bottom strip
          • Phone: stacked — full-width name on top, price chip below
            (so long names like "عَريكة جنوبية" don't get truncated)
          • Tablet+: side-by-side, single row */}
      <div
        className="relative mx-2 mb-2 flex flex-shrink-0 flex-col items-stretch gap-1 rounded-xl px-2 py-1.5 ring-1 ring-white/10 sm:mx-3 sm:mb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2"
        style={{
          background:
            'linear-gradient(180deg, rgba(47,85,196,0.32) 0%, rgba(9,18,54,0.70) 100%)',
        }}
      >
        <h3 className="line-clamp-2 min-w-0 flex-1 font-cairo text-[11px] font-black leading-tight sm:line-clamp-1 sm:text-sm md:text-base">
          {dish.nameAr}
        </h3>
        <div className="flex shrink-0 items-baseline gap-0.5 self-end rounded-md bg-brand-yellow px-1.5 py-0.5 text-brand-blueDeep sm:gap-1 sm:self-auto sm:rounded-lg sm:px-2 sm:py-1">
          {isMulti ? (
            <span className="font-tajawal text-[8px] font-bold opacity-80 sm:text-[9px]">
              من
            </span>
          ) : null}
          <span className="font-cairo text-sm font-black leading-none sm:text-lg md:text-xl">
            {startPrice}
          </span>
          <span className="font-cairo text-[8px] font-bold sm:text-[9px]">ر.س</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-brand-yellow/0 transition-[box-shadow] duration-200 group-hover:ring-brand-yellow/70 sm:rounded-3xl" />
    </button>
  );
};
