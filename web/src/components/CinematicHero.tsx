import {motion, AnimatePresence} from 'motion/react';
import type {Dish, PriceItem} from '../data';

/**
 * Full-bleed cinematic display of a single dish — swap with a smooth
 * cross-slide whenever `dish` (keyed by image) changes. The hero pairs
 * a huge plate photo on the left of an RTL container (= right edge of
 * the screen) with a stacked typography block on the right (= left
 * edge of the screen) showing the dish name + size/price chips.
 */
export const CinematicHero = ({
  dish,
  direction,
  onSwipeLeft,
  onSwipeRight,
}: {
  dish: Dish;
  /** 1 = next, -1 = previous — used to bias slide direction */
  direction: 1 | -1;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={dish.image}
          custom={direction}
          drag="x"
          dragElastic={0.18}
          dragConstraints={{left: 0, right: 0}}
          onDragEnd={(_, info) => {
            if (info.offset.x < -90) onSwipeLeft();
            else if (info.offset.x > 90) onSwipeRight();
          }}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {type: 'spring', damping: 28, stiffness: 220, mass: 0.8},
            opacity: {duration: 0.3},
          }}
          className="absolute inset-0 flex items-center justify-center px-12"
        >
          <HeroBody dish={dish} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const slide = {
  enter: (dir: 1 | -1) => ({
    x: dir * 60,
    opacity: 0,
    scale: 0.96,
  }),
  center: {x: 0, opacity: 1, scale: 1},
  exit: (dir: 1 | -1) => ({
    x: dir * -60,
    opacity: 0,
    scale: 0.96,
  }),
} as const;

const HeroBody = ({dish}: {dish: Dish}) => {
  const isMulti = dish.prices && dish.prices.length > 1;

  return (
    <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-2" dir="rtl">
      {/* Image — appears on the right in RTL */}
      <motion.div
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{delay: 0.1, type: 'spring', damping: 18, stiffness: 110}}
        className="relative grid place-items-center"
      >
        <motion.img
          src={dish.image}
          alt={dish.nameAr}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="max-h-[64vh] w-auto object-contain drop-shadow-[0_42px_70px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      {/* Text + prices — left in RTL */}
      <div className="flex flex-col gap-7">
        <motion.h1
          initial={{x: 30, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          transition={{delay: 0.18, type: 'spring', damping: 20, stiffness: 120}}
          className="font-cairo font-black leading-[1.05] text-brand-cream"
          style={{fontSize: 'clamp(2.5rem, 6vw, 5.5rem)'}}
        >
          {dish.nameAr}
        </motion.h1>

        {dish.nameEn ? (
          <motion.p
            initial={{x: 30, opacity: 0}}
            animate={{x: 0, opacity: 0.65}}
            transition={{delay: 0.25}}
            className="-mt-4 font-cairo text-base uppercase tracking-[0.4em] text-brand-yellowHi md:text-lg"
          >
            {dish.nameEn}
          </motion.p>
        ) : null}

        <motion.div
          initial={{scaleX: 0, opacity: 0}}
          animate={{scaleX: 1, opacity: 0.6}}
          transition={{delay: 0.3, duration: 0.5}}
          style={{originX: 1}}
          className="h-1 w-32 rounded-full bg-brand-yellow"
        />

        {isMulti && dish.prices ? (
          <SizeStack prices={dish.prices} />
        ) : (
          <SinglePriceLarge price={dish.price ?? '—'} />
        )}
      </div>
    </div>
  );
};

const SizeStack = ({prices}: {prices: PriceItem[]}) => (
  <div className="flex flex-col gap-3">
    {prices.map((p, i) => (
      <motion.div
        key={p.label}
        initial={{x: 30, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        transition={{delay: 0.35 + i * 0.07, type: 'spring', damping: 22, stiffness: 140}}
        className="flex items-center justify-between gap-4 rounded-2xl border-2 border-brand-yellow/60 bg-brand-yellow/15 px-6 py-4 backdrop-blur"
      >
        <span className="font-cairo text-2xl font-bold text-brand-cream md:text-3xl">
          {p.label}
        </span>
        <span className="flex items-baseline gap-2">
          <span className="font-cairo text-4xl font-black leading-none text-brand-yellow md:text-5xl">
            {p.value.split(' ')[0]}
          </span>
          <span className="font-cairo text-lg font-bold text-brand-yellow opacity-90 md:text-xl">
            ر.س
          </span>
        </span>
      </motion.div>
    ))}
  </div>
);

const SinglePriceLarge = ({price}: {price: string}) => {
  const [num, ...unit] = price.split(' ');
  return (
    <motion.div
      initial={{scale: 0.85, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{delay: 0.35, type: 'spring', damping: 18, stiffness: 110}}
      className="flex items-baseline gap-3"
    >
      <span
        className="font-cairo font-black leading-none text-brand-yellow"
        style={{fontSize: 'clamp(4rem, 10vw, 9rem)'}}
      >
        {num}
      </span>
      <span className="font-cairo text-3xl font-bold text-brand-yellow md:text-5xl">
        {unit.join(' ') || 'ر.س'}
      </span>
    </motion.div>
  );
};
