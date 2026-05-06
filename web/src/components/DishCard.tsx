import type {Dish} from '../data';

/**
 * Glass card — DARK-tinted glass (royal-blue) so empty / loading
 * cards never flash white when filters change. backdrop-filter is
 * deliberately removed: 36 simultaneously-blurred surfaces are too
 * much for iPad Safari, and the gradient mesh underneath is already
 * blurred at the source.
 *
 * Hover / press use CSS transitions instead of Motion springs to keep
 * scroll buttery smooth.
 */
export const DishCard = ({
  dish,
  startingPrice,
  onClick,
}: {
  dish: Dish;
  index: number; // kept for API compatibility but no longer used
  startingPrice: number;
  onClick: () => void;
}) => {
  const isMulti = dish.prices && dish.prices.length > 1;

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-3xl text-right outline-none transition-transform duration-200 ease-out will-change-transform hover:-translate-y-1 active:scale-[0.98]"
      style={{
        // Royal-blue tinted glass — avoids the white flash you get with
        // a white-tinted surface when images are still loading.
        background:
          'linear-gradient(135deg, rgba(47, 85, 196, 0.18) 0%, rgba(9, 18, 54, 0.55) 100%)',
        boxShadow:
          '0 14px 30px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.10)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />

      {/* Image — eager load on first 12, lazy after */}
      <div className="relative grid aspect-square w-full place-items-center p-3">
        <img
          src={dish.image}
          alt={dish.nameAr}
          decoding="async"
          className="h-full w-full scale-[1.04] object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
        />
      </div>

      {/* Bottom info strip — also tinted with royal blue */}
      <div
        className="relative mx-3 mb-3 flex items-end justify-between gap-2 rounded-2xl px-3 py-2.5 ring-1 ring-white/10"
        style={{
          background:
            'linear-gradient(180deg, rgba(47, 85, 196, 0.32) 0%, rgba(9, 18, 54, 0.65) 100%)',
        }}
      >
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-cairo text-sm font-black leading-tight md:text-base">
            {dish.nameAr}
          </h3>
        </div>
        <div className="flex shrink-0 items-baseline gap-1 rounded-xl bg-brand-yellow px-3 py-1.5 text-brand-blueDeep">
          {isMulti ? (
            <span className="font-tajawal text-[9px] font-bold opacity-80">من</span>
          ) : null}
          <span className="font-cairo text-xl font-black leading-none md:text-2xl">
            {startingPrice}
          </span>
          <span className="font-cairo text-[10px] font-bold">ر.س</span>
        </div>
      </div>

      {/* Yellow ring on hover (CSS transition, cheap) */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-brand-yellow/0 transition-[box-shadow] duration-200 group-hover:ring-brand-yellow/40" />
    </button>
  );
};
