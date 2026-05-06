import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ALL_DISHES,
  AREEKA,
  CATEGORIES,
  MUTABBAQ,
  startingPrice,
  type CategoryId,
  type Dish,
} from './data';
import {DishCard} from './components/DishCard';
import {DishDetail} from './components/DishDetail';
import {TopBar} from './components/TopBar';
import {GradientMesh} from './components/GradientMesh';
import {SearchBar} from './components/SearchBar';
import {CategoryTabs} from './components/CategoryTabs';

export const App = () => {
  const [active, setActive] = useState<CategoryId>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Dish | null>(null);

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

  // Pre-warm the browser cache for every dish image on first paint so
  // tab/search filtering never has to hit the network. Fires once.
  useEffect(() => {
    ALL_DISHES.forEach((d) => {
      const img = new Image();
      img.src = d.image;
    });
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden text-white">
      <GradientMesh />

      <div className="relative z-10 flex h-full flex-col">
        <TopBar dishCount={dishes.length} />

        <div className="px-6 pt-2 md:px-10">
          <SearchBar value={query} onChange={setQuery} />
          <CategoryTabs active={active} categories={CATEGORIES} onChange={setActive} />
        </div>

        <main className="flex-1 overflow-y-auto px-6 pb-10 md:px-10">
          {/* Single fade transition on the GRID rather than 36 per-card
              springs — drastically smoother on iPad Safari. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active}-${query}`}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -4}}
              transition={{duration: 0.22, ease: 'easeOut'}}
              className="mx-auto mt-6 grid w-full max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {dishes.length === 0 ? (
                <div className="col-span-full grid place-items-center py-24 text-white/60">
                  <div className="text-center">
                    <p className="font-cairo text-2xl font-bold">لا توجد نتائج</p>
                    <p className="mt-2 font-tajawal opacity-80">جرّب كلمة بحث أخرى</p>
                  </div>
                </div>
              ) : (
                dishes.map((d, i) => (
                  <DishCard
                    key={d.image}
                    dish={d}
                    index={i}
                    startingPrice={startingPrice(d)}
                    onClick={() => setSelected(d)}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {selected ? (
          <DishDetail dish={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
