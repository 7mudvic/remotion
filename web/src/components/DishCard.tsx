import {motion} from 'motion/react';
import type {Dish} from '../data';

/**
 * A single dish card in the grid. Tappable on iPad — animates a small
 * scale-up on press, then opens the detail modal.
 *
 * The card itself is a soft glass surface with a top-anchored dish
 * image so the wooden plate "sits" on top of the card.
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
  const hasMultiplePrices = dish.prices && dish.prices.length > 1;

  return (
    <motion.button
      onClick={onClick}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: index * 0.02, type: 'spring', damping: 18, stiffness: 130}}
      whileHover={{y: -4, scale: 1.02}}
      whileTap={{scale: 0.97}}
      className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-brand-yellow/30 bg-white/10 p-3 text-right shadow-card backdrop-blur-md transition-shadow hover:border-brand-yellow/60 hover:shadow-cardHi"
    >
      {/* Image */}
      <div className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl bg-gradient-to-b from-brand-blueHi/40 to-brand-blueDeep/30">
        <img
          src={dish.image}
          alt={dish.nameAr}
          loading="lazy"
          className="h-full w-full scale-110 object-contain p-2 drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]"
        />
      </div>

      {/* Name + price */}
      <div className="mt-3 flex min-h-[78px] flex-col justify-between px-1">
        <h3 className="line-clamp-2 font-cairo text-base font-black leading-tight text-brand-cream md:text-lg">
          {dish.nameAr}
        </h3>

        <div className="mt-1.5 flex items-baseline justify-between">
          {hasMultiplePrices ? (
            <span className="rounded-full bg-brand-yellow/15 px-2.5 py-1 font-tajawal text-xs font-bold text-brand-yellowHi">
              ٣ أحجام
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-baseline gap-1 font-cairo text-brand-yellow">
            {hasMultiplePrices ? (
              <span className="text-[10px] opacity-70">يبدأ من</span>
            ) : null}
            <span className="text-2xl font-black leading-none">{startingPrice}</span>
            <span className="text-xs font-bold opacity-90">ر.س</span>
          </span>
        </div>
      </div>
    </motion.button>
  );
};
