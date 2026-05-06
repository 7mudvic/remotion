import {useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Filter, X} from 'lucide-react';
import {ALL_DISHES, AREEKA, MUTABBAQ, type CategoryId, type Dish} from './data';
import {MagazineSpread} from './components/MagazineSpread';
import {OrnamentalCorners} from './components/OrnamentalCorners';
import {SideNavigator} from './components/SideNavigator';

export const App = () => {
  const [active, setActive] = useState<CategoryId>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const dishes = useMemo(() => {
    if (active === 'all') return ALL_DISHES;
    if (active === 'mutabbaq') return MUTABBAQ;
    return AREEKA;
  }, [active]);

  // Track which dish is currently centred so the side dots highlight
  // correctly during a vertical scroll-snap.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const sections = Array.from(
      scroller.querySelectorAll('[data-spread]'),
    ) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const i = sections.indexOf(e.target as HTMLElement);
            if (i >= 0) setCurrentIndex(i);
          }
        });
      },
      {root: scroller, threshold: [0.6]},
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [dishes]);

  // Reset to top whenever the category changes
  useEffect(() => {
    scrollerRef.current?.scrollTo({top: 0, behavior: 'smooth'});
    setCurrentIndex(0);
  }, [active]);

  const goTo = (i: number) => {
    const target = scrollerRef.current?.querySelectorAll('[data-spread]')[i] as
      | HTMLElement
      | undefined;
    target?.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fbf3df] text-brand-blueDeep">
      {/* Subtle paper grain — Editorial cream backdrop */}
      <Paper />

      {/* Floating top-right brand pill (RTL: shows on the visual right) */}
      <FloatingBrand />

      {/* Filter button (top-left in screen coords) */}
      <FilterButton onClick={() => setFilterOpen(true)} active={active} />

      {/* Side navigator — round dots, one per dish */}
      <SideNavigator
        count={dishes.length}
        currentIndex={currentIndex}
        onSelect={goTo}
      />

      {/* Vertical scroll-snap container */}
      <div
        ref={scrollerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dishes.map((d, i) => (
          <Section key={d.image} dish={d} index={i} total={dishes.length} />
        ))}
        <FooterCard />
      </div>

      {/* Filter drawer */}
      <AnimatePresence>
        {filterOpen ? (
          <FilterDrawer
            active={active}
            onChange={(id) => {
              setActive(id);
              setFilterOpen(false);
            }}
            onClose={() => setFilterOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const Section = ({
  dish,
  index,
  total,
}: {
  dish: Dish;
  index: number;
  total: number;
}) => {
  // Cycle through 4 layout templates so the magazine feels editorial,
  // not algorithmic.
  const layout = (index % 4) + 1;
  return (
    <section
      data-spread
      className="relative flex h-full w-full snap-start items-stretch justify-stretch"
    >
      <OrnamentalCorners variant={index % 2 === 0 ? 'blue' : 'yellow'} />
      <MagazineSpread dish={dish} index={index} total={total} layout={layout as 1 | 2 | 3 | 4} />
    </section>
  );
};

const Paper = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage:
        // Soft warm vignette + low-contrast noise for a "thick paper" look
        'radial-gradient(circle at 30% 20%, rgba(245,194,51,0.10) 0%, transparent 55%),' +
        'radial-gradient(circle at 80% 90%, rgba(30,63,163,0.07) 0%, transparent 55%)',
    }}
  />
);

const FloatingBrand = () => (
  <div className="pointer-events-none fixed right-7 top-7 z-40 flex items-center gap-3">
    <img
      src="logo.png"
      alt=""
      className="h-12 w-auto drop-shadow-[0_8px_18px_rgba(0,0,0,0.20)]"
    />
    <div className="flex flex-col leading-tight">
      <span className="font-cairo text-base font-black text-brand-blueDeep">
        عَريكة البلدة
      </span>
      <span className="font-tajawal text-[11px] uppercase tracking-[0.3em] text-brand-blueLo/70">
        AREEKAT AL-BALAD
      </span>
    </div>
  </div>
);

const FilterButton = ({
  onClick,
  active,
}: {
  onClick: () => void;
  active: CategoryId;
}) => {
  const label =
    active === 'all'
      ? 'جميع الأصناف'
      : active === 'mutabbaq'
        ? 'مطبّق'
        : 'عَريكة و معصوب';

  return (
    <button
      onClick={onClick}
      className="fixed left-7 top-7 z-40 flex items-center gap-2 rounded-full border-2 border-brand-blue/40 bg-white px-4 py-2.5 font-cairo text-sm font-bold text-brand-blueDeep shadow-[0_8px_22px_rgba(9,18,54,0.15)] transition-all hover:border-brand-blue active:scale-95"
    >
      <Filter className="h-4 w-4" strokeWidth={2.5} />
      <span>{label}</span>
    </button>
  );
};

const FilterDrawer = ({
  active,
  onChange,
  onClose,
}: {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
  onClose: () => void;
}) => {
  const items: Array<{id: CategoryId; labelAr: string; sub: string}> = [
    {id: 'all', labelAr: 'جميع الأصناف', sub: 'كامل المنيو'},
    {id: 'mutabbaq', labelAr: 'مطبّق', sub: '21 صنف'},
    {id: 'areeka', labelAr: 'عَريكة و معصوب', sub: '15 صنف'},
  ];

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.18}}
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-start bg-brand-blueDeep/40 px-7 pt-24 backdrop-blur-sm"
    >
      <motion.div
        initial={{y: -20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: -10, opacity: 0}}
        transition={{type: 'spring', damping: 24, stiffness: 240}}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border-2 border-brand-yellow bg-white p-3 shadow-[0_24px_60px_rgba(9,18,54,0.35)]"
      >
        <div className="mb-2 flex items-center justify-between px-3 pt-2">
          <h3 className="font-cairo text-lg font-black text-brand-blueDeep">
            اختر التصنيف
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-brand-blueDeep/70 hover:bg-brand-blue/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right transition-colors ${
                on
                  ? 'bg-brand-blue text-white'
                  : 'text-brand-blueDeep hover:bg-brand-yellow/20'
              }`}
            >
              <div>
                <div className="font-cairo text-base font-black">{it.labelAr}</div>
                <div
                  className={`font-tajawal text-xs ${
                    on ? 'text-white/80' : 'text-brand-blueDeep/60'
                  }`}
                >
                  {it.sub}
                </div>
              </div>
              {on ? (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-yellow text-brand-blueDeep">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

const FooterCard = () => (
  <section
    data-spread
    className="relative flex h-full w-full snap-start items-center justify-center"
  >
    <div className="text-center">
      <p className="font-tajawal text-sm uppercase tracking-[0.4em] text-brand-blue/70">
        End of menu
      </p>
      <h2 className="mt-3 font-cairo text-5xl font-black text-brand-blueDeep md:text-6xl">
        تفضّلوا بزيارتنا
      </h2>
      <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-brand-yellow" />
      <p className="mt-3 font-tajawal text-base text-brand-blueDeep/80">
        عَريكة البلدة · نكهة أصيلة من قلب البلد
      </p>
      <button
        onClick={() =>
          document
            .querySelector('[data-spread]')
            ?.scrollIntoView({behavior: 'smooth', block: 'start'})
        }
        className="mt-7 rounded-full border-2 border-brand-blue bg-brand-blue px-6 py-3 font-cairo text-sm font-black text-brand-yellow transition-transform active:scale-95"
      >
        ↑ ارجع للأعلى
      </button>
    </div>
  </section>
);
