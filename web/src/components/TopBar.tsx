/**
 * Glass top strip — logo on the right (RTL leading), tagline below it,
 * dish counter chip on the left. Sits over the gradient mesh.
 */
export const TopBar = ({dishCount}: {dishCount: number}) => {
  return (
    <header className="flex flex-shrink-0 items-center justify-between gap-4 px-6 py-5 md:px-10 md:py-6">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <img src="logo.png" alt="" className="h-10 w-auto" />
        </div>
        <div className="flex flex-col leading-tight">
          <h1 className="font-cairo text-xl font-black md:text-2xl">عَريكة البلدة</h1>
          <p className="font-tajawal text-[10px] uppercase tracking-[0.4em] text-brand-yellow/80 md:text-xs">
            AREEKAT AL-BALAD
          </p>
        </div>
      </div>

      <div className="rounded-full bg-white/10 px-4 py-2 font-cairo text-sm font-bold text-brand-yellow backdrop-blur-2xl ring-1 ring-white/15">
        المنيو الكامل · {dishCount} صنف
      </div>
    </header>
  );
};
