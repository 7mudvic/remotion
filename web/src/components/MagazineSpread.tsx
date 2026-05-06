import {motion} from 'motion/react';
import type {Dish, PriceItem} from '../data';

const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabic = (n: number) =>
  String(n)
    .split('')
    .map((d) => arabicDigits[Number(d)] ?? d)
    .join('')
    .padStart(2, '٠');

type LayoutKind = 1 | 2 | 3 | 4;

/**
 * Magazine "spread" — one dish per page, with a layout that varies by
 * `layout` so consecutive pages don't feel like a template grid.
 *
 *   1: image right    + huge text on the left, blue stripe accent
 *   2: image left     + text right, yellow paper, framed image
 *   3: full-bleed image with text overlay (centred poster)
 *   4: stacked: huge name on top, image bottom-centre
 */
export const MagazineSpread = ({
  dish,
  index,
  total,
  layout,
}: {
  dish: Dish;
  index: number;
  total: number;
  layout: LayoutKind;
}) => {
  const indexLabel = `Nº ${toArabic(index + 1)} / ${toArabic(total)}`;

  if (layout === 1) return <Layout1 dish={dish} indexLabel={indexLabel} />;
  if (layout === 2) return <Layout2 dish={dish} indexLabel={indexLabel} />;
  if (layout === 3) return <Layout3 dish={dish} indexLabel={indexLabel} />;
  return <Layout4 dish={dish} indexLabel={indexLabel} />;
};

// ── Layout 1 ──────────────────────────────────────────────────────
// Image right · giant title left · blue accent stripe along the edge
const Layout1 = ({dish, indexLabel}: {dish: Dish; indexLabel: string}) => (
  <div dir="rtl" className="relative grid h-full w-full grid-cols-12 gap-6 px-12 py-16">
    {/* Right strip (RTL leading): blue accent column */}
    <aside className="col-span-1 flex flex-col items-center justify-between text-brand-blue">
      <div className="h-1 w-1 rounded-full bg-brand-blue" />
      <span
        className="font-tajawal text-xs uppercase tracking-[0.5em]"
        style={{writingMode: 'vertical-rl'}}
      >
        {indexLabel}
      </span>
      <div className="h-24 w-px bg-brand-blue" />
    </aside>

    {/* Image */}
    <div className="col-span-5 grid place-items-center">
      <ImageBlock dish={dish} delay={0.05} />
    </div>

    {/* Title + price block (left in RTL) */}
    <div className="col-span-6 flex flex-col justify-center pl-6">
      <Eyebrow text={dish.nameEn ?? 'AREEKAT AL-BALAD'} />
      <Title text={dish.nameAr} />
      <Rule />
      <PriceArea dish={dish} />
    </div>
  </div>
);

// ── Layout 2 ──────────────────────────────────────────────────────
// Yellow paper · image left · framed by a thin blue border · text right
const Layout2 = ({dish, indexLabel}: {dish: Dish; indexLabel: string}) => (
  <div dir="rtl" className="relative h-full w-full bg-brand-yellow">
    {/* Inner border frame */}
    <div className="absolute inset-6 rounded-3xl border border-brand-blue/30" />

    <div className="relative grid h-full w-full grid-cols-12 gap-6 px-16 py-16">
      <div className="col-span-7 flex flex-col justify-center">
        <Eyebrow text={indexLabel} />
        <Title text={dish.nameAr} dark />
        {dish.nameEn ? (
          <p className="mt-2 font-tajawal text-base uppercase tracking-[0.4em] text-brand-blue/80">
            {dish.nameEn}
          </p>
        ) : null}
        <Rule dark />
        <PriceArea dish={dish} dark />
      </div>
      <div className="col-span-5 grid place-items-center">
        <ImageBlock dish={dish} delay={0.05} />
      </div>
    </div>
  </div>
);

// ── Layout 3 ──────────────────────────────────────────────────────
// Centred poster: full-bleed dark blue, image floating, text overlay
const Layout3 = ({dish, indexLabel}: {dish: Dish; indexLabel: string}) => (
  <div dir="rtl" className="relative h-full w-full bg-brand-blue text-brand-yellow">
    {/* Sunburst hint */}
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        background:
          'conic-gradient(from 0deg, rgba(255,255,255,0.06) 0deg 5deg, transparent 5deg 10deg)',
      }}
    />

    <div className="relative grid h-full w-full grid-rows-[auto_1fr_auto] px-16 py-12">
      <div className="flex items-start justify-between">
        <span className="font-tajawal text-xs uppercase tracking-[0.5em] text-brand-yellowHi">
          {indexLabel}
        </span>
        <span className="font-tajawal text-xs uppercase tracking-[0.5em] text-brand-yellowHi">
          SIGNATURE
        </span>
      </div>

      <div className="grid place-items-center">
        <ImageBlock dish={dish} delay={0.1} ringColor="rgba(245,194,51,0.45)" />
      </div>

      <div className="text-center">
        <Title text={dish.nameAr} center />
        {dish.nameEn ? (
          <p className="mt-2 font-tajawal text-sm uppercase tracking-[0.5em] text-brand-yellowHi/85 md:text-base">
            {dish.nameEn}
          </p>
        ) : null}
        <Rule center />
        <PriceArea dish={dish} centered light />
      </div>
    </div>
  </div>
);

// ── Layout 4 ──────────────────────────────────────────────────────
// Title huge on top, dish photo below centre
const Layout4 = ({dish, indexLabel}: {dish: Dish; indexLabel: string}) => (
  <div dir="rtl" className="relative grid h-full w-full grid-rows-[auto_1fr] px-12 py-12">
    <div className="flex items-end justify-between border-b-2 border-brand-blue/30 pb-6">
      <div>
        <Eyebrow text={indexLabel} />
        <Title text={dish.nameAr} compact />
      </div>
      <div className="text-left">
        <PriceArea dish={dish} inline />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-6 pt-10">
      <div className="col-span-3 flex flex-col justify-end">
        {dish.nameEn ? (
          <p className="mb-4 font-tajawal text-sm uppercase tracking-[0.4em] text-brand-blue/70">
            {dish.nameEn}
          </p>
        ) : null}
        <p className="font-tajawal text-sm leading-relaxed text-brand-blueDeep/70">
          من كلاسيكيات قائمتنا، تُحضَّر بعناية في مطبخ عَريكة البلدة وتُقدّم
          بنكهتها التقليدية المميّزة.
        </p>
      </div>
      <div className="col-span-9 grid place-items-center">
        <ImageBlock dish={dish} delay={0.05} />
      </div>
    </div>
  </div>
);

// ── Shared building blocks ──────────────────────────────────────
const Eyebrow = ({text}: {text: string}) => (
  <motion.p
    initial={{x: -10, opacity: 0}}
    whileInView={{x: 0, opacity: 1}}
    viewport={{once: true, margin: '-20%'}}
    transition={{duration: 0.5}}
    className="font-tajawal text-xs uppercase tracking-[0.5em] text-brand-blue/80 md:text-sm"
  >
    {text}
  </motion.p>
);

const Title = ({
  text,
  center,
  dark,
  compact,
}: {
  text: string;
  center?: boolean;
  dark?: boolean;
  compact?: boolean;
}) => (
  <motion.h1
    initial={{y: 24, opacity: 0}}
    whileInView={{y: 0, opacity: 1}}
    viewport={{once: true, margin: '-20%'}}
    transition={{type: 'spring', damping: 22, stiffness: 140, delay: 0.05}}
    className={`mt-3 font-cairo font-black leading-[0.95] ${
      dark ? 'text-brand-blueDeep' : 'text-brand-blueDeep'
    } ${center ? 'text-center' : ''}`}
    style={{
      fontSize: compact
        ? 'clamp(3rem, 6vw, 5rem)'
        : 'clamp(3.5rem, 8vw, 7rem)',
      letterSpacing: '-0.04em',
    }}
  >
    {text}
  </motion.h1>
);

const Rule = ({center, dark}: {center?: boolean; dark?: boolean}) => (
  <motion.div
    initial={{scaleX: 0}}
    whileInView={{scaleX: 1}}
    viewport={{once: true, margin: '-20%'}}
    transition={{duration: 0.6, delay: 0.2}}
    style={{originX: 1}}
    className={`my-6 h-1 w-32 rounded-full ${
      dark ? 'bg-brand-blue' : 'bg-brand-yellow'
    } ${center ? 'mx-auto' : ''}`}
  />
);

const ImageBlock = ({
  dish,
  delay = 0,
  ringColor,
}: {
  dish: Dish;
  delay?: number;
  ringColor?: string;
}) => (
  <motion.div
    initial={{scale: 0.92, opacity: 0}}
    whileInView={{scale: 1, opacity: 1}}
    viewport={{once: true, margin: '-20%'}}
    transition={{type: 'spring', damping: 18, stiffness: 110, delay}}
    className="relative"
  >
    {ringColor ? (
      <div
        className="absolute inset-0 -z-10 rounded-full blur-2xl"
        style={{background: ringColor}}
      />
    ) : null}
    <motion.img
      src={dish.image}
      alt={dish.nameAr}
      animate={{y: [0, -8, 0]}}
      transition={{duration: 5, repeat: Infinity, ease: 'easeInOut'}}
      className="max-h-[60vh] w-auto object-contain drop-shadow-[0_30px_50px_rgba(9,18,54,0.30)]"
    />
  </motion.div>
);

// ── Price layouts ──────────────────────────────────────────────
const PriceArea = ({
  dish,
  centered,
  inline,
  dark,
  light,
}: {
  dish: Dish;
  centered?: boolean;
  inline?: boolean;
  dark?: boolean;
  light?: boolean;
}) => {
  const isMulti = dish.prices && dish.prices.length > 1;
  if (isMulti && dish.prices) {
    return (
      <SizesRow
        prices={dish.prices}
        centered={centered}
        dark={dark}
        light={light}
      />
    );
  }
  return (
    <SinglePrice
      price={dish.price ?? '—'}
      inline={inline}
      centered={centered}
      dark={dark}
      light={light}
    />
  );
};

const SinglePrice = ({
  price,
  inline,
  centered,
  dark,
  light,
}: {
  price: string;
  inline?: boolean;
  centered?: boolean;
  dark?: boolean;
  light?: boolean;
}) => {
  const [num, ...unit] = price.split(' ');
  const numColor = light ? 'text-brand-yellow' : dark ? 'text-brand-blue' : 'text-brand-blue';
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-20%'}}
      transition={{delay: 0.3}}
      className={`flex items-baseline gap-2 ${centered ? 'justify-center' : ''}`}
    >
      <span
        className={`font-cairo font-black leading-none ${numColor}`}
        style={{fontSize: inline ? 'clamp(2.5rem, 5vw, 4rem)' : 'clamp(3rem, 7vw, 6rem)'}}
      >
        {num}
      </span>
      <span className={`font-cairo text-xl font-bold md:text-3xl ${numColor}`}>
        {unit.join(' ') || 'ر.س'}
      </span>
    </motion.div>
  );
};

const SizesRow = ({
  prices,
  centered,
  dark,
  light,
}: {
  prices: PriceItem[];
  centered?: boolean;
  dark?: boolean;
  light?: boolean;
}) => {
  const fg = light
    ? 'text-brand-yellow'
    : dark
      ? 'text-brand-blue'
      : 'text-brand-blue';
  const labelFg = light
    ? 'text-brand-yellowHi/80'
    : dark
      ? 'text-brand-blue/70'
      : 'text-brand-blue/70';
  const border = light
    ? 'border-brand-yellow/40'
    : dark
      ? 'border-brand-blue/30'
      : 'border-brand-blue/30';
  return (
    <div className={`flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}>
      {prices.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{y: 14, opacity: 0}}
          whileInView={{y: 0, opacity: 1}}
          viewport={{once: true, margin: '-20%'}}
          transition={{delay: 0.25 + i * 0.07}}
          className={`min-w-[7rem] rounded-2xl border-2 ${border} bg-white/40 px-4 py-3 backdrop-blur-sm ${
            light ? 'bg-white/10' : ''
          }`}
        >
          <div className={`font-tajawal text-[11px] uppercase tracking-[0.3em] ${labelFg}`}>
            {p.label}
          </div>
          <div className={`mt-0.5 flex items-baseline gap-1 font-cairo font-black ${fg}`}>
            <span className="text-2xl md:text-3xl">{p.value.split(' ')[0]}</span>
            <span className="text-xs font-bold opacity-90">ر.س</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
