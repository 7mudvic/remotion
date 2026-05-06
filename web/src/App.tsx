import {useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion, useMotionValue, useTransform} from 'motion/react';
import {Search, X} from 'lucide-react';
import {
  ALL_DISHES,
  AREEKA,
  CATEGORIES,
  MUTABBAQ,
  type CategoryId,
  type Dish,
} from './data';
import {SunburstBackground} from './components/SunburstBackground';
import {CinematicHero} from './components/CinematicHero';
import {ThumbStrip} from './components/ThumbStrip';
import {ProgressBar} from './components/ProgressBar';
import {BrandHeader} from './components/BrandHeader';

const AUTO_ADVANCE_MS = 6000;
const PAUSE_AFTER_INTERACT_MS = 12000;

export const App = () => {
  const [active, setActive] = useState<CategoryId>('all');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const lastInteractRef = useRef(0);

  const dishes = useMemo(() => {
    const base =
      active === 'all'
        ? ALL_DISHES
        : active === 'mutabbaq'
          ? MUTABBAQ
          : AREEKA;
    if (!query.trim()) return base;
    const q = query.trim();
    return base.filter((d) => d.nameAr.includes(q));
  }, [active, query]);

  // Wrap index inside the current list
  const safeIndex = dishes.length === 0 ? 0 : index % dishes.length;
  const dish: Dish | undefined = dishes[safeIndex];

  // Auto-advance — pauses for PAUSE_AFTER_INTERACT_MS after any interaction
  useEffect(() => {
    if (paused || dishes.length === 0) return;
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % dishes.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, dishes.length]);

  // Reset index when filter changes
  useEffect(() => {
    setIndex(0);
  }, [active, query]);

  const interact = () => {
    lastInteractRef.current = Date.now();
    setPaused(true);
    // Resume after a quiet period
    const handle = lastInteractRef.current;
    setTimeout(() => {
      if (lastInteractRef.current === handle) setPaused(false);
    }, PAUSE_AFTER_INTERACT_MS);
  };

  const goNext = () => {
    interact();
    setDirection(1);
    setIndex((i) => (i + 1) % Math.max(dishes.length, 1));
  };

  const goPrev = () => {
    interact();
    setDirection(-1);
    setIndex((i) => (i - 1 + dishes.length) % Math.max(dishes.length, 1));
  };

  const goTo = (i: number) => {
    interact();
    setDirection(i > safeIndex ? 1 : -1);
    setIndex(i);
  };

  return (
    <div className="relative h-full w-full overflow-hidden text-brand-cream">
      <SunburstBackground />

      <div className="relative z-10 flex h-full flex-col">
        {/* Top progress + brand header + filters */}
        <ProgressBar
          active={!paused && dishes.length > 0}
          durationMs={AUTO_ADVANCE_MS}
          // Forces re-mount on every step so the bar resets cleanly
          stepKey={`${active}-${safeIndex}`}
        />

        <BrandHeader
          active={active}
          categories={CATEGORIES}
          dishCount={dishes.length}
          currentIndex={safeIndex}
          onCategory={(id) => {
            interact();
            setActive(id);
          }}
          onSearchToggle={() => {
            interact();
            setSearchOpen((s) => !s);
          }}
        />

        {/* Hero zone — fills the middle */}
        <main
          className="relative flex-1 select-none"
          onPointerDown={interact}
        >
          {dish ? (
            <CinematicHero
              dish={dish}
              direction={direction}
              onSwipeLeft={goNext}
              onSwipeRight={goPrev}
            />
          ) : (
            <EmptyState />
          )}

          {/* Side arrows (also tap targets) */}
          {dishes.length > 1 ? (
            <>
              <NavArrow side="right" onClick={goNext} />
              <NavArrow side="left" onClick={goPrev} />
            </>
          ) : null}
        </main>

        {/* Bottom thumbnail strip */}
        <ThumbStrip
          dishes={dishes}
          activeIndex={safeIndex}
          onSelect={goTo}
        />
      </div>

      {/* Full-screen search overlay */}
      <AnimatePresence>
        {searchOpen ? (
          <SearchOverlay
            value={query}
            onChange={(v) => {
              interact();
              setQuery(v);
            }}
            onClose={() => {
              setSearchOpen(false);
              interact();
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const NavArrow = ({
  side,
  onClick,
}: {
  side: 'left' | 'right';
  onClick: () => void;
}) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-30, 0, 30], [0.3, 0.6, 0.3]);

  return (
    <motion.button
      onClick={onClick}
      style={{opacity, [side]: 36, x}}
      className="absolute top-1/2 z-20 grid h-16 w-16 -translate-y-1/2 place-items-center rounded-full border-2 border-brand-yellow/50 bg-white/10 backdrop-blur-md transition-colors hover:border-brand-yellow hover:bg-white/20 active:scale-95"
      aria-label={side === 'left' ? 'السابق' : 'التالي'}
    >
      <svg
        width={28}
        height={28}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-yellow"
        style={{transform: side === 'left' ? 'rotate(180deg)' : 'none'}}
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.button>
  );
};

const EmptyState = () => (
  <div className="grid h-full place-items-center">
    <div className="text-center">
      <p className="font-cairo text-3xl font-black text-brand-cream">
        لا توجد نتائج
      </p>
      <p className="mt-3 font-tajawal text-lg opacity-70">جرّب تصنيفاً آخر أو بحثاً مختلفاً</p>
    </div>
  </div>
);

const SearchOverlay = ({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) => (
  <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    transition={{duration: 0.2}}
    className="fixed inset-0 z-40 grid place-items-start bg-brand-blueDeep/85 px-8 pt-32 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div
      initial={{y: -20, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{type: 'spring', damping: 22, stiffness: 220}}
      onClick={(e) => e.stopPropagation()}
      className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-full border-2 border-brand-yellow bg-white/10 px-6 py-4 backdrop-blur"
    >
      <Search className="h-6 w-6 text-brand-yellow" strokeWidth={2.5} />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث عن صنف…"
        className="w-full bg-transparent font-cairo text-2xl text-brand-cream placeholder:text-brand-cream/50 focus:outline-none"
      />
      <button
        onClick={onClose}
        className="rounded-full p-2 text-brand-cream hover:bg-white/15"
      >
        <X className="h-6 w-6" />
      </button>
    </motion.div>
  </motion.div>
);
