/**
 * Top bar — yellow oval logo on the right (RTL leading), small subtitle
 * on the left. Feels like a hotel-lobby strip.
 */
export const TopBar = () => {
  return (
    <header className="flex items-center justify-between px-8 pt-6">
      <div className="flex items-center gap-4">
        <img
          src="logo.png"
          alt="عَريكة البلدة"
          className="h-16 w-auto drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
        />
        <div>
          <h1 className="font-cairo text-2xl font-black leading-none text-brand-cream md:text-3xl">
            عَريكة البلدة
          </h1>
          <p className="font-tajawal text-xs text-brand-yellowHi md:text-sm">
            نكهة أصيلة من قلب البلد
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <span className="rounded-full border-2 border-brand-yellow/70 bg-white/10 px-4 py-2 font-cairo text-sm font-bold text-brand-yellowHi backdrop-blur">
          المنيو الكامل
        </span>
      </div>
    </header>
  );
};
