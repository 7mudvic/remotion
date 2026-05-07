/**
 * Smart top bar — transparent when the user is at the top of the
 * page, fades into a frosted-glass strip the moment they start
 * scrolling. The pattern matches what Apple Music / Instagram /
 * Spotify do for their navigation headers, and stops dish cards
 * from bleeding behind the logo.
 */
export const TopBar = ({scrolled}: {scrolled: boolean}) => (
  <header
    className={`sticky top-0 z-30 flex items-center justify-center px-6 py-4 transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ease-out md:py-5 ${
      scrolled
        ? 'border-b border-white/10 bg-[rgba(9,18,54,0.72)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150'
        : 'border-b border-transparent'
    }`}
    style={{
      // Fall back when backdrop-filter isn't supported — keep the
      // strip readable with a slightly more opaque tint instead.
      WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(150%)' : 'none',
    }}
  >
    <div
      className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl ring-1 ring-white/15 md:h-20 md:w-20"
      style={{
        background:
          'linear-gradient(135deg, rgba(47,85,196,0.30) 0%, rgba(9,18,54,0.65) 100%)',
      }}
    >
      <img src="logo.png" alt="عَريكة البلدة" className="h-12 w-auto md:h-14" />
    </div>
  </header>
);
