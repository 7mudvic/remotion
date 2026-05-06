import {motion} from 'motion/react';
import {X} from 'lucide-react';
import type {Dish, PriceItem} from '../data';

/**
 * Glass detail modal — opens when a customer taps a card. Image right
 * (RTL leading), name + sizes on the left.
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
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5 backdrop-blur-md"
    >
      <motion.div
        initial={{y: 60, scale: 0.95, opacity: 0}}
        animate={{y: 0, scale: 1, opacity: 1}}
        exit={{y: 40, scale: 0.95, opacity: 0}}
        transition={{type: 'spring', damping: 24, stiffness: 240}}
        onClick={(e) => e.stopPropagation()}
        className="relative grid h-full max-h-[88vh] w-full max-w-6xl grid-cols-1 gap-6 overflow-hidden rounded-[36px] p-8 backdrop-blur-3xl md:grid-cols-2 md:p-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(47,85,196,0.30) 0%, rgba(9,18,54,0.55) 100%)',
          boxShadow: '0 36px 80px rgba(0, 0, 0, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-5 top-5 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-transform hover:bg-white/20 active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="grid place-items-center md:order-2">
          <motion.img
            initial={{scale: 0.92, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{delay: 0.1, type: 'spring', damping: 18, stiffness: 110}}
            src={dish.image}
            alt={dish.nameAr}
            className="max-h-[55vh] w-auto object-contain drop-shadow-[0_36px_60px_rgba(0,0,0,0.55)]"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center md:order-1" dir="rtl">
          <motion.p
            initial={{x: 24, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{delay: 0.15}}
            className="font-tajawal text-xs uppercase tracking-[0.5em] text-brand-yellow"
          >
            {dish.nameEn ?? 'AREEKAT AL-BALAD'}
          </motion.p>

          <motion.h2
            initial={{x: 24, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{delay: 0.2, type: 'spring', damping: 18, stiffness: 120}}
            className="mt-2 font-cairo font-black leading-tight text-white"
            style={{fontSize: 'clamp(2.25rem, 4.5vw, 4rem)'}}
          >
            {dish.nameAr}
          </motion.h2>

          <div className="my-5 h-1 w-20 rounded-full bg-brand-yellow" />

          {dish.prices && dish.prices.length > 0 ? (
            <SizesGrid prices={dish.prices} />
          ) : (
            <SinglePrice price={dish.price ?? '—'} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SizesGrid = ({prices}: {prices: PriceItem[]}) => (
  <div className="grid grid-cols-3 gap-3">
    {prices.map((p, i) => (
      <motion.div
        key={p.label}
        initial={{y: 16, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{delay: 0.25 + i * 0.07, type: 'spring', damping: 20, stiffness: 140}}
        className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur"
      >
        <div className="font-tajawal text-[11px] uppercase tracking-[0.4em] text-brand-yellow/80">
          {p.label}
        </div>
        <div className="mt-1 flex items-baseline gap-1 font-cairo">
          <span className="text-3xl font-black text-white md:text-4xl">
            {p.value.split(' ')[0]}
          </span>
          <span className="text-xs font-bold text-brand-yellow md:text-sm">ر.س</span>
        </div>
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
      className="flex items-baseline gap-2"
    >
      <span
        className="font-cairo font-black leading-none text-brand-yellow"
        style={{fontSize: 'clamp(3rem, 7vw, 6rem)'}}
      >
        {num}
      </span>
      <span className="font-cairo text-2xl font-bold text-brand-yellow md:text-4xl">
        {unit.join(' ') || 'ر.س'}
      </span>
    </motion.div>
  );
};
