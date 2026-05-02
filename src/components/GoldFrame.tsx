import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';

/**
 * Animated double gold frame that draws itself in.
 * Two opposite L-shaped corners + a thin inner line for that "menu card" feel.
 */
export const GoldFrame: React.FC<{
  inset?: number;
  delay?: number;
  thickness?: number;
}> = ({inset = 80, delay = 0, thickness = 2}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  const draw = spring({
    frame: local,
    fps,
    config: {damping: 200, stiffness: 60, mass: 0.8},
  });

  const cornerLen = 220;
  const opacity = interpolate(local, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  const cornerStyle: React.CSSProperties = {
    position: 'absolute',
    border: `${thickness}px solid ${THEME.gold}`,
    boxShadow: `0 0 18px ${THEME.goldShadow}`,
  };

  const horizontalCorner = (top: boolean, left: boolean): React.CSSProperties => ({
    ...cornerStyle,
    [top ? 'top' : 'bottom']: inset,
    [left ? 'left' : 'right']: inset,
    width: cornerLen * draw,
    height: 0,
    borderTopWidth: top ? thickness : 0,
    borderBottomWidth: top ? 0 : thickness,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    transformOrigin: left ? 'left' : 'right',
  });

  const verticalCorner = (top: boolean, left: boolean): React.CSSProperties => ({
    ...cornerStyle,
    [top ? 'top' : 'bottom']: inset,
    [left ? 'left' : 'right']: inset,
    width: 0,
    height: cornerLen * draw,
    borderLeftWidth: left ? thickness : 0,
    borderRightWidth: left ? 0 : thickness,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    transformOrigin: top ? 'top' : 'bottom',
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <div style={horizontalCorner(true, true)} />
      <div style={verticalCorner(true, true)} />
      <div style={horizontalCorner(true, false)} />
      <div style={verticalCorner(true, false)} />
      <div style={horizontalCorner(false, true)} />
      <div style={verticalCorner(false, true)} />
      <div style={horizontalCorner(false, false)} />
      <div style={verticalCorner(false, false)} />

      {/* inner hairline */}
      <div
        style={{
          position: 'absolute',
          top: inset + 14,
          left: inset + 14,
          right: inset + 14,
          bottom: inset + 14,
          border: `1px solid ${THEME.goldLo}`,
          opacity: 0.5 * draw,
        }}
      />

      {/* watermark micro-text */}
      <div
        style={{
          position: 'absolute',
          bottom: inset - 28,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: THEME.goldLo,
          fontFamily: 'monospace',
          fontSize: 11,
          letterSpacing: 8,
          opacity: 0.45 * draw,
        }}
      >
        — CHEF&apos;S SELECTION · {new Date().getFullYear()} —
      </div>

      {/* hidden helpers so unused width/height args still type-check cleanly */}
      <div data-w={width} data-h={height} style={{display: 'none'}} />
    </AbsoluteFill>
  );
};
