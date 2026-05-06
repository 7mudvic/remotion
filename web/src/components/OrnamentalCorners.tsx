/**
 * Magazine-style decorative L-shaped brackets in the four corners of
 * each spread. Tones with the page palette: blue brackets on cream
 * pages, yellow brackets on blue pages.
 */
export const OrnamentalCorners = ({
  variant = 'blue',
}: {
  variant?: 'blue' | 'yellow';
}) => {
  const stroke = variant === 'yellow' ? '#f5c233' : '#1e3fa3';
  const opacity = 0.35;

  return (
    <div className="pointer-events-none absolute inset-0">
      <Bracket pos="topLeft" stroke={stroke} opacity={opacity} />
      <Bracket pos="topRight" stroke={stroke} opacity={opacity} />
      <Bracket pos="bottomLeft" stroke={stroke} opacity={opacity} />
      <Bracket pos="bottomRight" stroke={stroke} opacity={opacity} />
    </div>
  );
};

const Bracket = ({
  pos,
  stroke,
  opacity,
}: {
  pos: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  stroke: string;
  opacity: number;
}) => {
  const map: Record<typeof pos, string> = {
    topLeft: 'top-4 left-4',
    topRight: 'top-4 right-4 -scale-x-100',
    bottomLeft: 'bottom-4 left-4 -scale-y-100',
    bottomRight: 'bottom-4 right-4 -scale-100',
  };
  return (
    <svg
      className={`absolute h-12 w-12 ${map[pos]}`}
      viewBox="0 0 48 48"
      fill="none"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      style={{opacity}}
    >
      <path d="M 4 24 L 4 4 L 24 4" />
      <circle cx="4" cy="4" r="1.5" fill={stroke} />
    </svg>
  );
};
