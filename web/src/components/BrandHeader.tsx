import {motion} from 'motion/react';
import {Search} from 'lucide-react';
import type {CategoryId} from '../data';

const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabicNumeral = (n: number) =>
  String(n)
    .split('')
    .map((d) => arabicDigits[Number(d)] ?? d)
    .join('');

/**
 * Top strip — minimal: logo + brand on the right, category pills in
 * the centre, search button on the left. Indices like ٣ / ١٥ live in
 * the centre too so the customer knows where they are in the loop.
 */
export const BrandHeader = ({
  active,
  categories,
  dishCount,
  currentIndex,
  onCategory,
  onSearchToggle,
}: {
  active: CategoryId;
  categories: ReadonlyArray<{id: CategoryId; labelAr: string}>;
  dishCount: number;
  currentIndex: number;
  onCategory: (id: CategoryId) => void;
  onSearchToggle: () => void;
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between gap-4 px-8 py-5">
      {/* Brand — right (RTL leading) */}
      <div className="flex items-center gap-3">
        <img
          src="logo.png"
          alt="عَريكة البلدة"
          className="h-12 w-auto drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
        />
        <div className="hidden flex-col leading-tight md:flex">
          <span className="font-cairo text-base font-black text-brand-cream">
            عَريكة البلدة
          </span>
          <span className="font-tajawal text-xs text-brand-yellowHi/80">
            نكهة أصيلة من قلب البلد
          </span>
        </div>
      </div>

      {/* Category pills — centre */}
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:flex">
        {categories.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => onCategory(c.id)}
              className="relative px-1 py-2"
            >
              {on ? (
                <motion.span
                  layoutId="catActiveBg"
                  transition={{type: 'spring', damping: 22, stiffness: 240}}
                  className="absolute inset-0 -z-0 rounded-full border-2 border-brand-yellow bg-brand-yellow/15"
                />
              ) : null}
              <span
                className={`relative z-10 px-4 py-1 font-cairo text-sm font-bold transition-colors ${
                  on ? 'text-brand-yellowHi' : 'text-brand-cream/70'
                }`}
              >
                {c.labelAr}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right side: counter + search */}
      <div className="flex items-center gap-3">
        {dishCount > 0 ? (
          <div className="hidden items-center gap-1.5 rounded-full border border-brand-yellow/30 bg-white/5 px-3 py-1.5 font-cairo text-xs font-bold text-brand-yellowHi md:flex">
            <span>{toArabicNumeral(currentIndex + 1)}</span>
            <span className="opacity-50">/</span>
            <span className="opacity-80">{toArabicNumeral(dishCount)}</span>
          </div>
        ) : null}
        <button
          onClick={onSearchToggle}
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-brand-yellow/50 bg-white/10 text-brand-yellow backdrop-blur transition-colors hover:border-brand-yellow hover:bg-white/15 active:scale-95"
          aria-label="بحث"
        >
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
};
