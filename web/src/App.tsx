import {useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ChevronLeft, ChevronRight, Sparkles} from 'lucide-react';
import {ALL_DISHES, AREEKA, MUTABBAQ, type CategoryId, type Dish} from './data';
import {BentoGrid} from './components/BentoGrid';
import {GradientMesh} from './components/GradientMesh';
import {DishSheet} from './components/DishSheet';

const TILES_PER_PAGE = 9; // 1 featured + 8 around it
const AUTO_FEATURE_MS = 6000;

export const App = () => {
  const [active, setActive] = useState<CategoryId>('all');
  const [page, setPage] = useState(0);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [openDish, setOpenDish] = useState<Dish | null>(null);
  const [paused, setPaused] = useState(false);
  const lastInteractRef = useRef(0);

  const all: Dish[] = useMemo(() => {
    if (active === 'all') return ALL_DISHES;
    if (active === 'mutabbaq') return MUTABBAQ;
    return AREEKA;
  }, [active]);

  const totalPages = Math.max(1, Math.ceil(all.length / TILES_PER_PAGE));
  const start = page * TILES_PER_PAGE;
  const tiles = all.slice(start, start + TILES_PER_PAGE);
  const safeFeatured = tiles.length === 0 ? 0 : featuredIdx % tiles.length;
  const featured = tiles[safeFeatured];

  // Auto-cycle which tile is featured
  useEffect(() => {
    if (paused || tiles.length === 0) return;
    const id = setInterval(() => {
      setFeaturedIdx((i) => (i + 1) % tiles.length);
    }, AUTO_FEATURE_MS);
    return () => clearInterval(id);
  }, [paused, tiles.length]);

  // Reset on category / page change
  useEffect(() => {
    setFeaturedIdx(0);
  }, [active, page]);

  useEffect(() => {
    setPage(0);
  }, [active]);

  const interact = () => {
    lastInteractRef.current = Date.now();
    setPaused(true);
    const handle = lastInteractRef.current;
    setTimeout(() => {
      if (lastInteractRef.current === handle) setPaused(false);
    }, 12000);
  };

  return (
    <div className="relative h-full w-full overflow-hidden text-white">
      <GradientMesh />

      <div className="relative z-10 flex h-full flex-col">
        <TopBar
          active={active}
          onCategory={(id) => {
            interact();
            setActive(id);
          }}
          page={page}
          totalPages={totalPages}
          onPrev={() => {
            interact();
            setPage((p) => Math.max(0, p - 1));
          }}
          onNext={() => {
            interact();
            setPage((p) => Math.min(totalPages - 1, p + 1));
          }}
        />

        <main className="flex-1 px-6 pb-6 md:px-10 md:pb-8" onPointerDown={interact}>
          {tiles.length === 0 ? (
            <div className="grid h-full place-items-center text-white/60">
              <p className="font-cairo text-2xl font-bold">لا توجد أصناف</p>
            </div>
          ) : (
            <BentoGrid
              tiles={tiles}
              featuredIndex={safeFeatured}
              onTileClick={(i) => {
                interact();
                if (i === safeFeatured) {
                  setOpenDish(tiles[i]);
                } else {
                  setFeaturedIdx(i);
                }
              }}
            />
          )}
        </main>
      </div>

      {/* Detail sheet */}
      <AnimatePresence>
        {openDish ? (
          <DishSheet dish={openDish} onClose={() => setOpenDish(null)} />
        ) : null}
      </AnimatePresence>

      {/* Bottom hint */}
      {featured ? (
        <FeaturedHint dishName={featured.nameAr} />
      ) : null}
    </div>
  );
};

const TopBar = ({
  active,
  onCategory,
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  active: CategoryId;
  onCategory: (id: CategoryId) => void;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const cats: Array<{id: CategoryId; label: string}> = [
    {id: 'all', label: 'الكل'},
    {id: 'mutabbaq', label: 'مطبّق'},
    {id: 'areeka', label: 'عَريكة و معصوب'},
  ];

  return (
    <header className="flex flex-shrink-0 items-center justify-between gap-4 px-6 py-5 md:px-10 md:py-6">
      {/* Brand — right (RTL leading) */}
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <img src="logo.png" alt="" className="h-9 w-auto" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-cairo text-base font-black md:text-lg">
            عَريكة البلدة
          </span>
          <span className="font-tajawal text-[10px] uppercase tracking-[0.4em] text-brand-yellow/70 md:text-xs">
            DISCOVER · MENU
          </span>
        </div>
      </div>

      {/* Glass nav — categories + page */}
      <div className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur-2xl ring-1 ring-white/15">
        {cats.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => onCategory(c.id)}
              className="relative px-1 py-1.5"
            >
              {on ? (
                <motion.span
                  layoutId="topActiveBg"
                  transition={{type: 'spring', damping: 22, stiffness: 240}}
                  className="absolute inset-0 -z-0 rounded-full bg-white/95"
                />
              ) : null}
              <span
                className={`relative z-10 px-4 py-1 font-cairo text-sm font-bold transition-colors ${
                  on ? 'text-brand-blueDeep' : 'text-white/80 hover:text-white'
                }`}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pager */}
      {totalPages > 1 ? (
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1.5 backdrop-blur-2xl ring-1 ring-white/15">
          <button
            onClick={onPrev}
            disabled={page === 0}
            className="grid h-8 w-8 place-items-center rounded-full text-white transition-all disabled:opacity-30 enabled:hover:bg-white/15 enabled:active:scale-90"
            aria-label="السابق"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="font-cairo text-xs font-bold tabular-nums text-white/80">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={page === totalPages - 1}
            className="grid h-8 w-8 place-items-center rounded-full text-white transition-all disabled:opacity-30 enabled:hover:bg-white/15 enabled:active:scale-90"
            aria-label="التالي"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </header>
  );
};

const FeaturedHint = ({dishName}: {dishName: string}) => (
  <motion.div
    key={dishName}
    initial={{opacity: 0, y: 10}}
    animate={{opacity: 1, y: 0}}
    className="pointer-events-none fixed bottom-3 left-1/2 z-40 -translate-x-1/2"
  >
    <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-xl ring-1 ring-white/15">
      <Sparkles className="h-3 w-3 text-brand-yellow" strokeWidth={2.5} />
      <span className="font-tajawal text-[11px] uppercase tracking-[0.3em] text-white/70">
        Featured
      </span>
      <span className="font-cairo text-xs font-bold text-white">{dishName}</span>
    </div>
  </motion.div>
);
