import type {CategoryId} from '../data';

/**
 * Category tabs — exactly 2 buttons, equal-width via grid-cols-2 so
 * the active yellow background ALWAYS fills its half of the pill,
 * regardless of which category is selected. No layoutId animation
 * (it was making the active fill look subtly off when the labels had
 * different lengths).
 */
export const CategoryTabs = ({
  active,
  categories,
  onChange,
}: {
  active: CategoryId;
  categories: ReadonlyArray<{id: CategoryId; labelAr: string}>;
  onChange: (id: CategoryId) => void;
}) => (
  <div
    className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-1 rounded-full p-1.5 ring-1 ring-white/10"
    style={{
      background:
        'linear-gradient(180deg, rgba(47,85,196,0.18) 0%, rgba(9,18,54,0.40) 100%)',
    }}
    role="tablist"
  >
    {categories.map((c) => {
      const on = c.id === active;
      return (
        <button
          key={c.id}
          role="tab"
          aria-selected={on}
          onClick={() => onChange(c.id)}
          className={`rounded-full px-3 py-2.5 text-center font-cairo text-sm font-bold transition-colors duration-200 ${
            on
              ? 'bg-brand-yellow text-brand-blueDeep shadow-[0_4px_14px_rgba(245,194,51,0.35)]'
              : 'text-white/80 hover:text-white'
          }`}
        >
          {c.labelAr}
        </button>
      );
    })}
  </div>
);
