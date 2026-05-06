import {motion} from 'motion/react';

/**
 * Same sunburst language as the Remotion videos: a slowly-spinning
 * conic gradient overlaid on a brand-blue base. Sub-divided into a
 * grid of dot decorations and wavy lines on the corners so the canvas
 * doesn't feel empty.
 */
export const SunburstBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base brand-blue */}
      <div className="absolute inset-0 bg-brand-blue" />

      {/* Slowly rotating sunburst rays */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'conic-gradient(from 0deg at 50% 50%,' +
            Array.from({length: 36})
              .map((_, i) =>
                i % 2 === 0
                  ? `rgba(255,255,255,0.05) ${i * 10}deg ${(i + 1) * 10}deg`
                  : `rgba(9,18,54,0.08) ${i * 10}deg ${(i + 1) * 10}deg`,
              )
              .join(',') +
            ')',
          mixBlendMode: 'overlay',
        }}
        animate={{rotate: 360}}
        transition={{duration: 90, ease: 'linear', repeat: Infinity}}
      />

      {/* Soft radial highlight in the middle */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(255,215,107,0.18), rgba(0,0,0,0) 55%)',
        }}
      />

      {/* Decor dots — corners */}
      <DotGrid className="left-8 top-8" />
      <DotGrid className="right-8 top-8" />
      <DotGrid className="left-8 bottom-8" />
      <DotGrid className="right-8 bottom-8" />

      {/* Decor wavy lines on the sides */}
      <Waves className="left-4 top-1/2 -translate-y-1/2" />
      <Waves className="right-4 top-1/2 -translate-y-1/2 -scale-x-100" />
    </div>
  );
};

const DotGrid = ({className = ''}: {className?: string}) => (
  <svg
    className={`absolute h-20 w-20 opacity-40 ${className}`}
    viewBox="0 0 80 80"
  >
    {Array.from({length: 5}).map((_, r) =>
      Array.from({length: 5}).map((__, c) => (
        <circle
          key={`${r}-${c}`}
          cx={8 + c * 16}
          cy={8 + r * 16}
          r={2.4}
          fill="#fff8e3"
        />
      )),
    )}
  </svg>
);

const Waves = ({className = ''}: {className?: string}) => (
  <svg
    className={`absolute h-14 w-32 opacity-30 ${className}`}
    viewBox="0 0 180 60"
  >
    {[10, 30, 50].map((y) => (
      <path
        key={y}
        d={`M 0 ${y} q 22.5 -16 45 0 t 45 0 t 45 0 t 45 0`}
        stroke="#fff8e3"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    ))}
  </svg>
);
