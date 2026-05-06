import {motion} from 'motion/react';
import type {Dish} from '../data';

type Size = 'feat' | 'large' | 'medium' | 'small';

const startingPrice = (d: Dish): string => {
  if (d.prices && d.prices.length > 0) {
    const min = Math.min(
      ...d.prices.map((p) => parseInt(p.value.replace(/[^\d]/g, ''), 10)),
    );
    return `${min}`;
  }
  if (d.price) return d.price.replace(/[^\d]/g, '');
  return '—';
};

/**
 * One Bento tile — glass surface with the dish image floating inside
 * and a translucent strip at the bottom carrying name + price. Size
 * controls typography and the level of detail shown.
 */
export const BentoTile = ({
  dish,
  size,
  onClick,
}: {
  dish: Dish;
  size: Size;
  onClick: () => void;
}) => {
  const isMulti = dish.prices && dish.prices.length > 1;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{y: -3, scale: 1.01}}
      whileTap={{scale: 0.98}}
      transition={{type: 'spring', damping: 22, stiffness: 260}}
      className="group relative flex h-full w-full flex-col items-stretch justify-end overflow-hidden rounded-3xl text-right"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        boxShadow:
          '0 16px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
    >
      {/* Inner border for the glass look */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15" />

      {/* Backdrop blur veil — applies behind the tile content for a
          true frosted-glass surface */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'}}
      />

      {/* Dish image — fills the tile, slightly offset on the feature
          tile to make the food really sing */}
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.img
          src={dish.image}
          alt={dish.nameAr}
          loading="lazy"
          animate={size === 'feat' ? {y: [0, -8, 0]} : {}}
          transition={
            size === 'feat'
              ? {duration: 6, repeat: Infinity, ease: 'easeInOut'}
              : undefined
          }
          className="max-h-full max-w-full object-contain p-3 drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)]"
          style={{
            // Featured tile shows the dish bigger
            transform: size === 'feat' ? 'scale(1.05)' : undefined,
          }}
        />
      </div>

      {/* Bottom info strip */}
      <Info dish={dish} size={size} isMulti={!!isMulti} />

      {/* Subtle yellow ring on hover to hint clickability */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-brand-yellow/0 transition-all group-hover:ring-brand-yellow/40" />
    </motion.button>
  );
};

const Info = ({
  dish,
  size,
  isMulti,
}: {
  dish: Dish;
  size: Size;
  isMulti: boolean;
}) => {
  if (size === 'feat') {
    return (
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-2xl ring-1 ring-white/20">
        <div className="min-w-0 flex-1">
          <p className="font-tajawal text-[10px] uppercase tracking-[0.4em] text-brand-yellow">
            FEATURED
          </p>
          <h2 className="mt-1 line-clamp-1 font-cairo text-2xl font-black md:text-3xl">
            {dish.nameAr}
          </h2>
          {dish.nameEn ? (
            <p className="mt-0.5 truncate font-tajawal text-[11px] uppercase tracking-[0.3em] text-white/60">
              {dish.nameEn}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-baseline gap-1.5 rounded-2xl bg-brand-yellow px-4 py-2 text-brand-blueDeep">
          {isMulti ? (
            <span className="font-tajawal text-[10px] font-bold opacity-80">من</span>
          ) : null}
          <span className="font-cairo text-3xl font-black leading-none">
            {startingPrice(dish)}
          </span>
          <span className="font-cairo text-xs font-bold">ر.س</span>
        </div>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-2xl ring-1 ring-white/15">
        <span className="line-clamp-1 font-cairo text-sm font-black">{dish.nameAr}</span>
        <span className="flex shrink-0 items-baseline gap-1 font-cairo text-brand-yellow">
          <span className="text-lg font-black leading-none">{startingPrice(dish)}</span>
          <span className="text-[10px] font-bold">ر.س</span>
        </span>
      </div>
    );
  }

  if (size === 'medium') {
    return (
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-lg bg-white/10 px-2.5 py-1.5 backdrop-blur-2xl ring-1 ring-white/15">
        <span className="line-clamp-1 font-cairo text-xs font-black">{dish.nameAr}</span>
        <span className="flex shrink-0 items-baseline gap-0.5 font-cairo text-brand-yellow">
          <span className="text-base font-black leading-none">{startingPrice(dish)}</span>
          <span className="text-[9px] font-bold">ر.س</span>
        </span>
      </div>
    );
  }

  // small
  return (
    <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1 rounded-md bg-white/10 px-2 py-1 backdrop-blur-2xl ring-1 ring-white/15">
      <span className="line-clamp-1 font-cairo text-[10px] font-black">{dish.nameAr}</span>
      <span className="flex shrink-0 items-baseline gap-0.5 font-cairo text-brand-yellow">
        <span className="text-sm font-black leading-none">{startingPrice(dish)}</span>
      </span>
    </div>
  );
};
