import {useMemo, useState} from 'react';
import {AnimatePresence} from 'motion/react';
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

  return (
    <div className="relative h-full w-full overflow-hidden text-white">
      {/* Animated dark gradient mesh — Bento aesthetic */}
      <GradientMesh />

      <div className="relative z-10 flex h-full flex-col">
        <TopBar dishCount={dishes.length} />

        <div className="px-6 pt-2 md:px-10">
          <SearchBar value={query} onChange={setQuery} />
          <CategoryTabs active={active} categories={CATEGORIES} onChange={setActive} />
        </div>

        <main className="flex-1 overflow-y-auto px-6 pb-10 md:px-10">
          {dishes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mx-auto mt-6 grid w-full max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {dishes.map((d, i) => (
                <DishCard
                  key={d.image}
                  dish={d}
                  index={i}
                  startingPrice={startingPrice(d)}
                  onClick={() => setSelected(d)}
                />
              ))}
            </div>
          )}
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

const EmptyState = () => (
  <div className="grid h-full place-items-center text-white/60">
    <div className="text-center">
      <p className="font-cairo text-2xl font-bold">لا توجد نتائج</p>
      <p className="mt-2 font-tajawal opacity-80">جرّب كلمة بحث أخرى</p>
    </div>
  </div>
);
