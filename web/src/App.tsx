import {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Search, X} from 'lucide-react';
import {
  ALL_DISHES,
  AREEKA,
  CATEGORIES,
  MUTABBAQ,
  type CategoryId,
  type Dish,
  startingPrice,
} from './data';
import {DishCard} from './components/DishCard';
import {DishDetail} from './components/DishDetail';
import {TopBar} from './components/TopBar';
import {SunburstBackground} from './components/SunburstBackground';

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
    <div className="relative h-full w-full overflow-hidden text-brand-cream">
      {/* Background — subtle animated sunburst, brand-blue dominant */}
      <SunburstBackground />

      {/* Foreground content */}
      <div className="relative z-10 flex h-full flex-col">
        <TopBar />

        {/* Search + tabs */}
        <div className="px-8 pt-2">
          <SearchBar value={query} onChange={setQuery} />
          <Tabs active={active} onChange={setActive} />
        </div>

        {/* Dish grid */}
        <main className="flex-1 overflow-y-auto px-8 pb-10">
          <DishGrid dishes={dishes} onSelect={setSelected} />
        </main>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected ? (
          <DishDetail dish={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="mx-auto mt-4 flex w-full max-w-2xl items-center gap-3 rounded-full border-2 border-brand-yellow/60 bg-white/10 px-5 py-3 backdrop-blur">
    <Search className="h-5 w-5 text-brand-yellow" strokeWidth={2.5} />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="ابحث عن صنف…"
      className="w-full bg-transparent font-cairo text-lg text-brand-cream placeholder:text-brand-cream/50 focus:outline-none"
    />
    {value ? (
      <button
        onClick={() => onChange('')}
        className="rounded-full p-1 text-brand-cream/70 hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    ) : null}
  </div>
);

const Tabs = ({
  active,
  onChange,
}: {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}) => (
  <div
    className="mx-auto mt-5 flex w-full max-w-2xl items-center justify-center gap-2"
    role="tablist"
  >
    {CATEGORIES.map((c) => {
      const on = c.id === active;
      return (
        <button
          key={c.id}
          role="tab"
          aria-selected={on}
          onClick={() => onChange(c.id)}
          className={`relative rounded-full px-6 py-2.5 font-cairo text-base font-bold transition-all ${
            on
              ? 'bg-brand-yellow text-brand-blue shadow-chip'
              : 'bg-white/10 text-brand-cream hover:bg-white/20'
          }`}
        >
          {c.labelAr}
        </button>
      );
    })}
  </div>
);

const DishGrid = ({
  dishes,
  onSelect,
}: {
  dishes: Dish[];
  onSelect: (d: Dish) => void;
}) => {
  if (dishes.length === 0) {
    return (
      <div className="grid h-full place-items-center text-brand-cream/60">
        <div className="text-center">
          <p className="font-cairo text-2xl font-bold">لا توجد نتائج</p>
          <p className="mt-2 font-tajawal opacity-80">جرّب كلمة بحث أخرى</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 grid w-full max-w-7xl grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {dishes.map((d, i) => (
        <DishCard
          key={d.image}
          dish={d}
          index={i}
          startingPrice={startingPrice(d)}
          onClick={() => onSelect(d)}
        />
      ))}
    </div>
  );
};
