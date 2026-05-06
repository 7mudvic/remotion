import {motion} from 'motion/react';

/**
 * Background mesh — two slowly drifting colour blobs over a dark navy
 * base. Tuned for iPad Safari: only 2 blobs (was 3), smaller blur
 * radius, slower animation, no infinite mix-blend layers — every
 * setting picked to keep the GPU mostly idle.
 */
export const GradientMesh = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#070d24]">
      {/* Royal-blue blob — drifts top-left → bottom-right */}
      <motion.div
        className="absolute h-[55vh] w-[55vw] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(47, 85, 196, 0.45), transparent 65%)',
          filter: 'blur(45px)',
          transform: 'translate3d(0,0,0)',
        }}
        initial={{x: '15%', y: '5%'}}
        animate={{x: ['15%', '35%', '15%'], y: ['5%', '15%', '5%']}}
        transition={{duration: 50, ease: 'easeInOut', repeat: Infinity}}
      />

      {/* Brand-yellow accent — drifts bottom-right → centre */}
      <motion.div
        className="absolute h-[45vh] w-[45vw] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 194, 51, 0.22), transparent 70%)',
          filter: 'blur(50px)',
          transform: 'translate3d(0,0,0)',
        }}
        initial={{x: '60%', y: '55%'}}
        animate={{x: ['60%', '40%', '60%'], y: ['55%', '65%', '55%']}}
        transition={{duration: 60, ease: 'easeInOut', repeat: Infinity}}
      />

      {/* Static deep-midnight vignette in the bottom-right — purely a
          static box-shadow-style overlay so it costs nothing to paint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at bottom right, rgba(9,18,54,0.6), transparent 60%)',
        }}
      />
    </div>
  );
};
