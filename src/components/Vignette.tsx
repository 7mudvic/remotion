import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.7}) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(0,0,0,${strength}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};
