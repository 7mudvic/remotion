import {motion} from 'motion/react';

/**
 * Slowly drifting gradient mesh — three big colour blobs (royal blue,
 * deep midnight, brand yellow) softly blended into a Vision-Pro-ish
 * dark backdrop. Each blob animates independently so the canvas always
 * feels alive without being distracting.
 */
export const GradientMesh = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#070d24]">
      {/* Blob 1 — royal blue */}
      <motion.div
        className="absolute h-[60vh] w-[60vw] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(47, 85, 196, 0.55), transparent 60%)',
          filter: 'blur(60px)',
        }}
        initial={{x: '10%', y: '5%'}}
        animate={{
          x: ['10%', '40%', '10%'],
          y: ['5%', '20%', '5%'],
        }}
        transition={{duration: 22, ease: 'easeInOut', repeat: Infinity}}
      />

      {/* Blob 2 — yellow accent */}
      <motion.div
        className="absolute h-[45vh] w-[45vw] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 194, 51, 0.30), transparent 65%)',
          filter: 'blur(70px)',
        }}
        initial={{x: '60%', y: '50%'}}
        animate={{
          x: ['60%', '30%', '60%'],
          y: ['50%', '70%', '50%'],
        }}
        transition={{duration: 28, ease: 'easeInOut', repeat: Infinity}}
      />

      {/* Blob 3 — deep midnight */}
      <motion.div
        className="absolute h-[50vh] w-[50vw] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(9, 18, 54, 0.95), transparent 55%)',
          filter: 'blur(50px)',
        }}
        initial={{x: '70%', y: '0%'}}
        animate={{
          x: ['70%', '40%', '70%'],
          y: ['0%', '40%', '0%'],
        }}
        transition={{duration: 32, ease: 'easeInOut', repeat: Infinity}}
      />

      {/* Grain — subtle texture for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,' +
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>" +
            "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter>" +
            "<rect width='100%' height='100%' filter='url(%23n)'/></svg>" +
            '")',
          backgroundSize: '200px',
        }}
      />
    </div>
  );
};
