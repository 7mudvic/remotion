import {motion} from 'motion/react';
import type {Dish} from '../data';

/**
 * Glass card — frosted surface, brand-yellow chip on the price. Same
 * Bento aesthetic at a smaller scale.
 */
export const DishCard = ({
  dish,
  index,
  startingPrice,
  onClick,
}: {
  dish: Dish;
  index: number;
  startingPrice: number;
  onClick: () => void;
}) => {
  const isMulti = dish.prices && dish.prices.length > 1;

  return (
    <motion.button
      onClick={onClick}
      initial={{opacity: 0, y: 16}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: index * 0.02, type: 'spring', damping: 22, stiffness: 200}}
      whileHover={{y: -4, scale: 1.01}}
      whileTap={{scale: 0.97}}
      className="group relative flex flex-col overflow-hidden rounded-3xl text-right"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        boxShadow:
          '0 16px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
    >
      {/* Glass border + frosted veil */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15" />
      <div
        className="absolute inset-0 rounded-3xl"
        style={{backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'}}
      />

      {/* Image */}
      <div className="relative grid aspect-square w-full place-items-center p-3">
        <img
          src={dish.image}
          alt={dish.nameAr}
          loading="lazy"
          className="h-full w-full scale-105 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
        />
      </div>

      {/* Bottom info strip */}
      <div className="relative mx-3 mb-3 flex items-end justify-between gap-2 rounded-2xl bg-white/10 p-3 backdrop-blur-xl ring-1 ring-white/15">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-cairo text-sm font-black leading-tight md:text-base">
            {dish.nameAr}
          </h3>
        </div>
        <div className="flex shrink-0 items-baseline gap-1 rounded-xl bg-brand-yellow px-3 py-1.5 text-brand-blueDeep">
          {isMulti ? (
            <span className="font-tajawal text-[9px] font-bold opacity-80">من</span>
          ) : null}
          <span className="font-cairo text-xl font-black leading-none md:text-2xl">
            {startingPrice}
          </span>
          <span className="font-cairo text-[10px] font-bold">ر.س</span>
        </div>
      </div>

      {/* Yellow ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-brand-yellow/0 transition-all group-hover:ring-brand-yellow/40" />
    </motion.button>
  );
};
