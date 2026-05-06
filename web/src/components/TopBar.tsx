/**
 * Top strip — just the brand logo, centred. No text, no counter.
 */
export const TopBar = () => {
  return (
    <header className="flex flex-shrink-0 items-center justify-center px-6 pt-6 md:pt-8">
      <div
        className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl ring-1 ring-white/15 md:h-24 md:w-24"
        style={{
          background:
            'linear-gradient(135deg, rgba(47,85,196,0.30) 0%, rgba(9,18,54,0.65) 100%)',
        }}
      >
        <img
          src="logo.png"
          alt="عَريكة البلدة"
          className="h-14 w-auto md:h-16"
        />
      </div>
    </header>
  );
};
