import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ALL_DISHES,
  AREEKA,
  CATEGORIES,
  FEATURED_DISHES,
  MUTABBAQ,
  startingPrice,
  type CategoryId,
  type Dish,
} from './data';
import {DishCard} from './components/DishCard';
import {DishDetail} from './components/DishDetail';
import {TopBar} from './components/TopBar';
import {GradientMesh} from './components/GradientMesh';
import {CategoryTabs} from './components/CategoryTabs';
import {FeaturedSection} from './components/FeaturedSection';

export const App = () => {
  const [active, setActive] = useState<CategoryId>('mutabbaq');
  const [selected, setSelected] = useState<Dish | null>(null);

  const dishes = useMemo(() => {
    return active === 'mutabbaq' ? MUTABBAQ : AREEKA;
  }, [active]);

  // Pre-warm browser cache for every dish image on first paint so
  // tab filtering never hits the network.
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
        <TopBar />

        <main className="flex-1 overflow-y-auto px-6 pb-10 pt-4 md:px-10">
          {/* Featured section — always visible at the top */}
          <FeaturedSection dishes={FEATURED_DISHES} onSelect={setSelected} />

          {/* Category tabs — between featured and the main grid */}
          <div className="mt-8">
            <CategoryTabs
              active={active}
              categories={CATEGORIES}
              onChange={setActive}
            />
          </div>

          {/* Main grid (filtered by selected category) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -4}}
              transition={{duration: 0.22, ease: 'easeOut'}}
              className="mx-auto mt-6 grid w-full max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {dishes.map((d, i) => (
                <DishCard
                  key={d.image}
                  dish={d}
                  index={i}
                  startingPrice={startingPrice(d)}
                  onClick={() => setSelected(d)}
                />
              ))}
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
