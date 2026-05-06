import {motion} from 'motion/react';
import {X} from 'lucide-react';
import type {Dish} from '../data';

/**
 * Full-screen detail modal — shown when a customer taps a card.
 *   - Big hero image on the right (RTL)
 *   - Name + sizes/prices on the left
 *   - "Back" button top-left
 *
 * Dismissed by tapping the close button or outside the card.
 */
export const DishDetail = ({
  dish,
  onClose,
}: {
  dish: Dish;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.25}}
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-brand-blueDeep/85 p-6 backdrop-blur-md"
    >
      <motion.div
        initial={{y: 60, scale: 0.95, opacity: 0}}
        animate={{y: 0, scale: 1, opacity: 1}}
        exit={{y: 40, scale: 0.95, opacity: 0}}
        transition={{type: 'spring', damping: 22, stiffness: 220}}
        onClick={(e) => e.stopPropagation()}
        className="relative grid h-full max-h-[88vh] w-full max-w-6xl grid-cols-1 gap-6 overflow-hidden rounded-[36px] border-2 border-brand-yellow/40 bg-gradient-to-br from-brand-blueHi/50 to-brand-blueDeep/70 p-8 shadow-cardHi md:grid-cols-2 md:p-10"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-brand-yellow text-brand-blue shadow-chip transition-transform hover:scale-110 active:scale-95"
        >
          <X className="h-6 w-6" strokeWidth={2.8} />
        </button>

        {/* Image (right in RTL) */}
        <div className="grid place-items-center md:order-2">
          <motion.img
            initial={{scale: 0.9, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{delay: 0.08, type: 'spring', damping: 18, stiffness: 110}}
            src={dish.image}
            alt={dish.nameAr}
            className="max-h-[55vh] w-auto object-contain drop-shadow-[0_36px_60px_rgba(0,0,0,0.55)]"
          />
        </div>

        {/* Text panel (left in RTL) */}
        <div className="flex flex-col justify-center md:order-1">
          <motion.h2
            initial={{x: -30, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{delay: 0.15, type: 'spring', damping: 18, stiffness: 110}}
            className="font-cairo text-4xl font-black leading-tight text-brand-cream md:text-5xl"
          >
            {dish.nameAr}
          </motion.h2>

          {dish.nameEn ? (
            <motion.p
              initial={{x: -30, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              transition={{delay: 0.2}}
              className="mt-2 font-cairo text-base uppercase tracking-[0.4em] text-brand-yellowHi/80 md:text-lg"
            >
              {dish.nameEn}
            </motion.p>
          ) : null}

          {/* Divider */}
          <div className="my-6 h-1 w-24 rounded-full bg-brand-yellow" />

          {/* Prices */}
          {dish.prices && dish.prices.length > 0 ? (
            <PriceList prices={dish.prices} />
          ) : (
            <SinglePrice price={dish.price ?? '—'} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const PriceList = ({prices}: {prices: NonNullable<Dish['prices']>}) => (
  <div className="flex flex-col gap-3">
    {prices.map((p, i) => (
      <motion.div
        key={p.label}
        initial={{x: -30, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        transition={{delay: 0.25 + i * 0.07, type: 'spring', damping: 18, stiffness: 130}}
        className="flex items-center justify-between rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 px-5 py-4"
      >
        <span className="font-cairo text-xl font-bold text-brand-cream md:text-2xl">
          {p.label}
        </span>
        <span className="flex items-baseline gap-1 font-cairo text-brand-yellow">
          <span className="text-3xl font-black md:text-4xl">
            {p.value.split(' ')[0]}
          </span>
          <span className="text-base font-bold opacity-90 md:text-lg">ر.س</span>
        </span>
      </motion.div>
    ))}
  </div>
);

const SinglePrice = ({price}: {price: string}) => {
  const [num, ...unit] = price.split(' ');
  return (
    <motion.div
      initial={{scale: 0.9, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{delay: 0.25, type: 'spring', damping: 18, stiffness: 110}}
      className="flex items-baseline gap-3"
    >
      <span className="font-cairo text-7xl font-black leading-none text-brand-yellow md:text-8xl">
        {num}
      </span>
      <span className="font-cairo text-3xl font-bold text-brand-yellow md:text-4xl">
        {unit.join(' ') || 'ر.س'}
      </span>
    </motion.div>
  );
};
