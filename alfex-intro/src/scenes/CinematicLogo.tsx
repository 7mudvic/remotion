import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LETTERS, LETTER_ORDER, STROKE_WIDTH } from "../letters";
import { INTER_FAMILY } from "../fonts";

const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1);

const W = 1080;
const H = 1920;

const LETTER_DRAW_START = 110;
const LETTER_DRAW_STAGGER = 18;
const LETTER_DRAW_DURATION = 38;

const Particles: React.FC<{ frame: number; intensity: number }> = ({
  frame,
  intensity,
}) => {
  const particles = Array.from({ length: 60 });
  return (
    <>
      {particles.map((_, i) => {
        const seed = i * 13.37;
        const px = random(`px-${seed}`) * W;
        const py = 700 + random(`py-${seed}`) * 500;
        const speed = 0.3 + random(`s-${seed}`) * 0.6;
        const phase = random(`ph-${seed}`) * Math.PI * 2;
        const driftX = Math.sin(frame * 0.02 * speed + phase) * 18;
        const driftY = Math.cos(frame * 0.015 * speed + phase) * 14;
        const baseOpacity = 0.15 + random(`o-${seed}`) * 0.45;
        const twinkle =
          0.6 + 0.4 * Math.sin(frame * 0.08 + i * 1.7);
        const r = 0.8 + random(`r-${seed}`) * 1.6;
        return (
          <circle
            key={i}
            cx={px + driftX}
            cy={py + driftY}
            r={r}
            fill="#ffffff"
            opacity={baseOpacity * twinkle * intensity}
          />
        );
      })}
    </>
  );
};

const SparkCore: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const grow = interpolate(frame, [0, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const fadeOut = interpolate(frame, [85, 115], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });

  const stretch = interpolate(frame, [80, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const pulse =
    1 + 0.18 * Math.sin((frame / 60) * Math.PI * 2.4);

  const coreOpacity = grow * fadeOut;
  const coreR = 4 + grow * 5 * pulse;
  const haloR = 12 + grow * 110 * pulse;

  const beamWidth = stretch * (1080 - 60) * 1.05;
  const beamHeight = 2 + (1 - stretch) * 6;
  const beamOpacity = stretch * fadeOut;

  return (
    <>
      <circle
        cx={W / 2}
        cy={960}
        r={haloR}
        fill="url(#sparkHalo)"
        opacity={coreOpacity * 0.9}
      />
      <circle
        cx={W / 2}
        cy={960}
        r={coreR + 6}
        fill="#ffffff"
        opacity={coreOpacity * 0.4}
      />
      <circle
        cx={W / 2}
        cy={960}
        r={coreR}
        fill="#ffffff"
        opacity={coreOpacity}
      />
      <rect
        x={W / 2 - beamWidth / 2}
        y={960 - beamHeight / 2}
        width={beamWidth}
        height={beamHeight}
        fill="#ffffff"
        opacity={beamOpacity}
      />
    </>
  );
};

const ScanBeam: React.FC<{ frame: number }> = ({ frame }) => {
  const sweep = interpolate(frame, [100, 280], [-150, W + 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });

  const opacity = interpolate(
    frame,
    [98, 110, 270, 290],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <g opacity={opacity}>
      <rect
        x={sweep - 60}
        y={780}
        width={120}
        height={360}
        fill="url(#scanGradient)"
      />
      <rect
        x={sweep - 1}
        y={780}
        width={2}
        height={360}
        fill="#ffffff"
        opacity={0.9}
      />
    </g>
  );
};

const Letter: React.FC<{
  frame: number;
  letterIndex: number;
  paths: string[];
  approxLength: number;
}> = ({ frame, letterIndex, paths, approxLength }) => {
  const start = LETTER_DRAW_START + letterIndex * LETTER_DRAW_STAGGER;
  const end = start + LETTER_DRAW_DURATION;

  const drawProgress = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const settleGlow = interpolate(frame, [end, end + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const ambientGlow = interpolate(frame, [end + 40, end + 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });

  const dashOffset = approxLength * (1 - drawProgress);

  return (
    <g>
      {paths.map((d, i) => (
        <path
          key={`glow-${i}`}
          d={d}
          stroke="#ffffff"
          strokeWidth={STROKE_WIDTH + 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={settleGlow * 0.35 + ambientGlow * 0.2}
          filter="url(#softGlow)"
        />
      ))}
      {paths.map((d, i) => (
        <path
          key={`stroke-${i}`}
          d={d}
          stroke="#ffffff"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={approxLength}
          strokeDashoffset={dashOffset}
          opacity={drawProgress > 0 ? 1 : 0}
        />
      ))}
      {paths.map((d, i) => (
        <path
          key={`hot-${i}`}
          d={d}
          stroke="#ffffff"
          strokeWidth={STROKE_WIDTH * 0.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={approxLength}
          strokeDashoffset={dashOffset}
          opacity={drawProgress > 0 && drawProgress < 1 ? 0.95 : 0}
        />
      ))}
    </g>
  );
};

const Underline: React.FC<{ frame: number }> = ({ frame }) => {
  const draw = interpolate(frame, [290, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const totalWidth = 740;
  const y = 1130;
  const halfWidth = (totalWidth / 2) * draw;

  const opacity = interpolate(frame, [285, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={opacity}>
      <line
        x1={W / 2 - halfWidth}
        y1={y}
        x2={W / 2 + halfWidth}
        y2={y}
        stroke="#ffffff"
        strokeWidth={2}
        opacity={0.7}
      />
      <circle
        cx={W / 2 - halfWidth}
        cy={y}
        r={3}
        fill="#ffffff"
        opacity={draw}
      />
      <circle
        cx={W / 2 + halfWidth}
        cy={y}
        r={3}
        fill="#ffffff"
        opacity={draw}
      />
    </g>
  );
};

const Tagline: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [330, 380], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const lift = interpolate(frame, [330, 380], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const fadeOut = interpolate(frame, [445, 475], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 1170,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: opacity * fadeOut,
        transform: `translateY(${lift}px)`,
      }}
    >
      <span
        style={{
          fontFamily: INTER_FAMILY,
          fontWeight: 500,
          fontSize: 32,
          color: "#ffffff",
          opacity: 0.78,
          letterSpacing: 14,
          textTransform: "uppercase",
        }}
      >
        Engineered Intelligence
      </span>
    </div>
  );
};

const Vignette: React.FC<{ frame: number }> = ({ frame }) => {
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [450, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fadeIn * fadeOut,
        background:
          "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
        pointerEvents: "none",
      }}
    />
  );
};

const Grid: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    frame,
    [220, 280, 440, 470],
    [0, 0.08, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const lines = [];
  for (let i = 0; i <= 10; i++) {
    const x = (W / 10) * i;
    lines.push(
      <line
        key={`v-${i}`}
        x1={x}
        y1={0}
        x2={x}
        y2={H}
        stroke="#ffffff"
        strokeWidth={1}
      />,
    );
  }
  for (let i = 0; i <= 18; i++) {
    const y = (H / 18) * i;
    lines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={y}
        x2={W}
        y2={y}
        stroke="#ffffff"
        strokeWidth={1}
      />,
    );
  }

  return <g opacity={opacity}>{lines}</g>;
};

const SubtleGlobalGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    frame,
    [220, 280, 460, 480],
    [0, 0.5, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background:
          "radial-gradient(ellipse 600px 300px at center, rgba(255,255,255,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};

export const CinematicLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particleIntensity = interpolate(
    frame,
    [200, 280, 440, 470],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <SubtleGlobalGlow frame={frame} />
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="sparkHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="b1" />
            <feGaussianBlur stdDeviation="28" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Grid frame={frame} />
        <Particles frame={frame} intensity={particleIntensity} />
        <SparkCore frame={frame} />
        <ScanBeam frame={frame} />

        <g>
          {LETTER_ORDER.map((key, i) => (
            <Letter
              key={key}
              frame={frame}
              letterIndex={i}
              paths={LETTERS[key].paths}
              approxLength={LETTERS[key].approxLength}
            />
          ))}
        </g>

        <Underline frame={frame} />
      </svg>

      <Tagline frame={frame} />
      <Vignette frame={frame} />
    </AbsoluteFill>
  );
};
