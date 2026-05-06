/**
 * Top strip — logo on the right (RTL leading), dish counter chip on
 * the left. No backdrop filter; uses a subtle dark gradient pill so
 * it sits cleanly over the gradient mesh without extra paint cost.
 */
export const TopBar = ({dishCount}: {dishCount: number}) => {
  return (
    <header className="flex flex-shrink-0 items-center justify-between gap-4 px-6 py-5 md:px-10 md:py-6">
      <div className="flex items-center gap-3">
        <div
          className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl ring-1 ring-white/15"
          style={{
            background:
              'linear-gradient(135deg, rgba(47,85,196,0.30) 0%, rgba(9,18,54,0.65) 100%)',
          }}
        >
          <img src="logo.png" alt="" className="h-10 w-auto" />
        </div>
        <div className="flex flex-col leading-tight">
          <h1 className="font-cairo text-xl font-black md:text-2xl">عَريكة البلدة</h1>
          <p className="font-tajawal text-[10px] uppercase tracking-[0.4em] text-brand-yellow/80 md:text-xs">
            AREEKAT AL-BALAD
          </p>
        </div>
      </div>

      <div
        className="rounded-full px-4 py-2 font-cairo text-sm font-bold text-brand-yellow ring-1 ring-white/15"
        style={{
          background:
            'linear-gradient(180deg, rgba(47,85,196,0.25) 0%, rgba(9,18,54,0.55) 100%)',
        }}
      >
        المنيو الكامل · {dishCount} صنف
      </div>
    </header>
  );
};
