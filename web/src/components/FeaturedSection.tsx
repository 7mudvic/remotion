import {Star} from 'lucide-react';
import type {Dish} from '../data';
import {startingPrice} from '../data';

/**
 * Hero "أصناف مميزة" row — three signature dishes pinned at the top.
 * Visually distinct from the main grid so the eye lands here first:
 *   - Yellow-tinted glass surfaces (vs the regular blue tint below)
 *   - "★ مميز" badge in the top-right of each card
 *   - Larger image area + bigger price chip
 *   - A decorative section header with a gold rule on either side
 */
export const FeaturedSection = ({
  dishes,
  onSelect,
}: {
  dishes: Dish[];
  onSelect: (d: Dish) => void;
}) => {
  return (
    <section className="mx-auto mt-2 w-full max-w-7xl">
      {/* Section heading */}
      <div className="flex items-center justify-center gap-4 pb-4">
        <span className="h-px w-16 bg-gradient-to-l from-brand-yellow to-transparent" />
        <Star
          className="h-5 w-5 fill-brand-yellow text-brand-yellow"
          strokeWidth={2}
        />
        <h2 className="font-cairo text-xl font-black tracking-wide text-brand-yellow md:text-2xl">
          أصناف مميّزة
        </h2>
        <Star
          className="h-5 w-5 fill-brand-yellow text-brand-yellow"
          strokeWidth={2}
        />
        <span className="h-px w-16 bg-gradient-to-r from-brand-yellow to-transparent" />
      </div>

      {/* 3-card row */}
      <div className="grid grid-cols-3 gap-4">
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
      className="group relative flex flex-col overflow-hidden rounded-3xl text-right outline-none transition-transform duration-200 ease-out will-change-transform hover:-translate-y-1 active:scale-[0.98]"
      style={{
        // Warmer "feature" glass — yellow accent + deep blue body
        background:
          'linear-gradient(135deg, rgba(245,194,51,0.18) 0%, rgba(9,18,54,0.65) 60%, rgba(9,18,54,0.65) 100%)',
        boxShadow:
          '0 18px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      }}
    >
      {/* Gold border ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-inset ring-brand-yellow/40" />

      {/* "مميز" badge — top-left in screen coords (we don't flip on RTL
          here so the star always sits in the same visual corner) */}
      <div
        className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1 text-brand-blueDeep ring-1 ring-brand-yellowLo/50"
        dir="ltr"
      >
        <Star className="h-3 w-3 fill-current" strokeWidth={2} />
        <span className="font-cairo text-[11px] font-black tracking-wide">
          مميّز
        </span>
      </div>

      {/* Image */}
      <div className="relative grid w-full place-items-center p-4 pt-12">
        <div className="relative aspect-square w-full">
          <img
            src={dish.image}
            alt={dish.nameAr}
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.06] object-contain drop-shadow-[0_22px_36px_rgba(0,0,0,0.55)]"
          />
        </div>
      </div>

      {/* Bottom info strip — mostly text + yellow price chip */}
      <div
        className="relative mx-3 mb-3 flex items-end justify-between gap-2 rounded-2xl px-3 py-3 ring-1 ring-white/10"
        style={{
          background:
            'linear-gradient(180deg, rgba(47,85,196,0.32) 0%, rgba(9,18,54,0.70) 100%)',
        }}
      >
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-cairo text-base font-black leading-tight md:text-lg">
            {dish.nameAr}
          </h3>
        </div>
        <div className="flex shrink-0 items-baseline gap-1 rounded-xl bg-brand-yellow px-3 py-1.5 text-brand-blueDeep">
          {isMulti ? (
            <span className="font-tajawal text-[10px] font-bold opacity-80">من</span>
          ) : null}
          <span className="font-cairo text-2xl font-black leading-none">
            {startPrice}
          </span>
          <span className="font-cairo text-[11px] font-bold">ر.س</span>
        </div>
      </div>

      {/* Brighter yellow ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-brand-yellow/0 transition-[box-shadow] duration-200 group-hover:ring-brand-yellow/70" />
    </button>
  );
};
