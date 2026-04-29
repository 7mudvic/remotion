import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { INTER_FAMILY } from "../fonts";

const W = 1080;
const H = 1920;

const GEAR_CX = 540;
const GEAR_CY = 870;
const NUM_TEETH = 12;
const OUTER_R = 285;
const INNER_R = 218;

const INNER_RING_R = 110;
const CENTER_DOT_R = 32;

const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1);
const easeInOutQuart = Easing.bezier(0.76, 0, 0.24, 1);

const generateGearPath = (): string => {
  const points: Array<[number, number]> = [];
  const toothFraction = 1 / (NUM_TEETH * 4);
  const startAngle = -Math.PI / 2;

  for (let tooth = 0; tooth < NUM_TEETH; tooth++) {
    const baseT = tooth / NUM_TEETH;
    const a1 = startAngle + (baseT + toothFraction * 0.4) * Math.PI * 2;
    const a2 = startAngle + (baseT + toothFraction * 1.6) * Math.PI * 2;
    const a3 = startAngle + (baseT + toothFraction * 2.4) * Math.PI * 2;
    const a4 = startAngle + (baseT + toothFraction * 3.6) * Math.PI * 2;

    points.push([GEAR_CX + Math.cos(a1) * INNER_R, GEAR_CY + Math.sin(a1) * INNER_R]);
    points.push([GEAR_CX + Math.cos(a2) * OUTER_R, GEAR_CY + Math.sin(a2) * OUTER_R]);
    points.push([GEAR_CX + Math.cos(a3) * OUTER_R, GEAR_CY + Math.sin(a3) * OUTER_R]);
    points.push([GEAR_CX + Math.cos(a4) * INNER_R, GEAR_CY + Math.sin(a4) * INNER_R]);
  }

  const head = `M ${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  const rest = points
    .slice(1)
    .map(([x, y]) => `L ${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  return `${head} ${rest} Z`;
};

const generateCirclePath = (cx: number, cy: number, r: number): string => {
  return [
    `M ${cx},${cy - r}`,
    `A ${r},${r} 0 1,1 ${cx},${cy + r}`,
    `A ${r},${r} 0 1,1 ${cx},${cy - r}`,
    "Z",
  ].join(" ");
};

const GEAR_PATH = generateGearPath();
const INNER_RING_PATH = generateCirclePath(GEAR_CX, GEAR_CY, INNER_RING_R);
const CENTER_DOT_PATH = generateCirclePath(GEAR_CX, GEAR_CY, CENTER_DOT_R);

const GEAR_LENGTH = getLength(GEAR_PATH);
const INNER_RING_LENGTH = getLength(INNER_RING_PATH);
const CENTER_DOT_LENGTH = getLength(CENTER_DOT_PATH);

const PHASE = {
  intro: { start: 0, end: 50 },
  penEnter: { start: 50, end: 95 },
  drawGear: { start: 95, end: 360 },
  drawInner: { start: 365, end: 425 },
  drawDot: { start: 430, end: 460 },
  penExit: { start: 460, end: 495 },
  fill: { start: 480, end: 540 },
  reveal: { start: 530, end: 580 },
  outro: { start: 590, end: 660 },
};

const PenTip: React.FC<{
  x: number;
  y: number;
  visible: number;
  pulse: number;
}> = ({ x, y, visible, pulse }) => {
  if (visible <= 0) return null;
  return (
    <g opacity={visible}>
      <circle
        cx={x}
        cy={y}
        r={45 + pulse * 8}
        fill="url(#penGlow)"
        opacity={0.8}
      />
      <circle cx={x} cy={y} r={16 + pulse * 2} fill="#ffffff" opacity={0.45} />
      <circle cx={x} cy={y} r={8} fill="#ffffff" />
      <circle cx={x} cy={y} r={3} fill="#ffffff" />
    </g>
  );
};

const Particles: React.FC<{ frame: number; intensity: number }> = ({
  frame,
  intensity,
}) => {
  if (intensity <= 0) return null;
  const particles = Array.from({ length: 50 });
  return (
    <g>
      {particles.map((_, i) => {
        const seed = i * 7.31;
        const px = random(`px-${seed}`) * W;
        const py = 500 + random(`py-${seed}`) * 800;
        const phase = random(`ph-${seed}`) * Math.PI * 2;
        const speed = 0.4 + random(`s-${seed}`) * 0.7;
        const driftX = Math.sin(frame * 0.018 * speed + phase) * 22;
        const driftY = Math.cos(frame * 0.014 * speed + phase) * 18;
        const baseO = 0.1 + random(`o-${seed}`) * 0.4;
        const tw = 0.5 + 0.5 * Math.sin(frame * 0.07 + i * 1.3);
        const r = 0.8 + random(`r-${seed}`) * 1.4;
        return (
          <circle
            key={i}
            cx={px + driftX}
            cy={py + driftY}
            r={r}
            fill="#ffffff"
            opacity={baseO * tw * intensity}
          />
        );
      })}
    </g>
  );
};

const InkTrail: React.FC<{
  frame: number;
  pathPoints: Array<{ x: number; y: number; frame: number }>;
}> = ({ frame, pathPoints }) => {
  const trail = pathPoints.slice(-12);
  return (
    <g>
      {trail.map((p, i) => {
        const age = frame - p.frame;
        const opacity = Math.max(0, 1 - age / 12) * (i / trail.length) * 0.6;
        const r = 2 + (i / trail.length) * 4;
        return (
          <circle
            key={`${p.frame}-${i}`}
            cx={p.x}
            cy={p.y}
            r={r}
            fill="#ffffff"
            opacity={opacity}
          />
        );
      })}
    </g>
  );
};

const Grid: React.FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity <= 0) return null;
  const lines = [];
  for (let i = 0; i <= 10; i++) {
    const x = (W / 10) * i;
    lines.push(<line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#ffffff" strokeWidth={1} />);
  }
  for (let i = 0; i <= 18; i++) {
    const y = (H / 18) * i;
    lines.push(<line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#ffffff" strokeWidth={1} />);
  }
  return <g opacity={opacity}>{lines}</g>;
};

export const GearBrainHandDraw: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const gearProgress = interpolate(
    frame,
    [PHASE.drawGear.start, PHASE.drawGear.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutCubic },
  );

  const innerProgress = interpolate(
    frame,
    [PHASE.drawInner.start, PHASE.drawInner.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutQuart },
  );

  const dotProgress = interpolate(
    frame,
    [PHASE.drawDot.start, PHASE.drawDot.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo },
  );

  const fillProgress = interpolate(
    frame,
    [PHASE.fill.start, PHASE.fill.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutQuart },
  );

  const bloomProgress = interpolate(
    frame,
    [PHASE.reveal.start, PHASE.reveal.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo },
  );

  const outroFade = interpolate(
    frame,
    [PHASE.outro.start, PHASE.outro.end],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutCubic },
  );

  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18);

  let penX = GEAR_CX;
  let penY = GEAR_CY - OUTER_R;
  let penOpacity = 0;

  if (frame >= PHASE.penEnter.start && frame < PHASE.drawGear.start) {
    const enter = interpolate(
      frame,
      [PHASE.penEnter.start, PHASE.penEnter.end],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo },
    );
    const startPt = getPointAtLength(GEAR_PATH, 0);
    penX = startPt.x;
    penY = startPt.y - 80 * (1 - enter);
    penOpacity = enter;
  } else if (frame >= PHASE.drawGear.start && frame <= PHASE.drawGear.end) {
    const pt = getPointAtLength(GEAR_PATH, GEAR_LENGTH * gearProgress);
    penX = pt.x;
    penY = pt.y;
    penOpacity = 1;
  } else if (frame > PHASE.drawGear.end && frame < PHASE.drawInner.start) {
    const t = interpolate(
      frame,
      [PHASE.drawGear.end, PHASE.drawInner.start],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutCubic },
    );
    const lastGear = getPointAtLength(GEAR_PATH, GEAR_LENGTH);
    const innerStart = getPointAtLength(INNER_RING_PATH, 0);
    penX = lastGear.x + (innerStart.x - lastGear.x) * t;
    penY = lastGear.y + (innerStart.y - lastGear.y) * t;
    penOpacity = 1;
  } else if (frame >= PHASE.drawInner.start && frame <= PHASE.drawInner.end) {
    const pt = getPointAtLength(INNER_RING_PATH, INNER_RING_LENGTH * innerProgress);
    penX = pt.x;
    penY = pt.y;
    penOpacity = 1;
  } else if (frame > PHASE.drawInner.end && frame < PHASE.drawDot.start) {
    const t = interpolate(
      frame,
      [PHASE.drawInner.end, PHASE.drawDot.start],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutCubic },
    );
    const lastInner = getPointAtLength(INNER_RING_PATH, INNER_RING_LENGTH);
    const dotStart = getPointAtLength(CENTER_DOT_PATH, 0);
    penX = lastInner.x + (dotStart.x - lastInner.x) * t;
    penY = lastInner.y + (dotStart.y - lastInner.y) * t;
    penOpacity = 1;
  } else if (frame >= PHASE.drawDot.start && frame <= PHASE.drawDot.end) {
    const pt = getPointAtLength(CENTER_DOT_PATH, CENTER_DOT_LENGTH * dotProgress);
    penX = pt.x;
    penY = pt.y;
    penOpacity = 1;
  } else if (frame > PHASE.drawDot.end) {
    const exit = interpolate(
      frame,
      [PHASE.penExit.start, PHASE.penExit.end],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo },
    );
    const lastDot = getPointAtLength(CENTER_DOT_PATH, CENTER_DOT_LENGTH);
    penX = lastDot.x;
    penY = lastDot.y - 100 * exit;
    penOpacity = 1 - exit;
  }

  const trailPoints: Array<{ x: number; y: number; frame: number }> = [];
  if (frame >= PHASE.drawGear.start && frame <= PHASE.drawDot.end) {
    for (let i = 0; i < 12; i++) {
      const f = frame - i;
      if (f < PHASE.drawGear.start) break;
      let path = GEAR_PATH;
      let totalLen = GEAR_LENGTH;
      let progressLen = 0;

      if (f >= PHASE.drawGear.start && f <= PHASE.drawGear.end) {
        const p = interpolate(
          f,
          [PHASE.drawGear.start, PHASE.drawGear.end],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutCubic },
        );
        progressLen = totalLen * p;
        const pt = getPointAtLength(path, progressLen);
        trailPoints.push({ x: pt.x, y: pt.y, frame: f });
      } else if (f >= PHASE.drawInner.start && f <= PHASE.drawInner.end) {
        const p = interpolate(
          f,
          [PHASE.drawInner.start, PHASE.drawInner.end],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutQuart },
        );
        const pt = getPointAtLength(INNER_RING_PATH, INNER_RING_LENGTH * p);
        trailPoints.push({ x: pt.x, y: pt.y, frame: f });
      } else if (f >= PHASE.drawDot.start && f <= PHASE.drawDot.end) {
        const p = interpolate(
          f,
          [PHASE.drawDot.start, PHASE.drawDot.end],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo },
        );
        const pt = getPointAtLength(CENTER_DOT_PATH, CENTER_DOT_LENGTH * p);
        trailPoints.push({ x: pt.x, y: pt.y, frame: f });
      }
    }
    trailPoints.reverse();
  }

  const gridOpacity = interpolate(
    frame,
    [PHASE.intro.start, PHASE.intro.end, PHASE.outro.start, PHASE.outro.end],
    [0, 0.07, 0.07, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const particleIntensity = interpolate(
    frame,
    [60, 200, 600, 660],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const labelOpacity = interpolate(
    frame,
    [PHASE.reveal.start + 20, PHASE.reveal.end, PHASE.outro.start, PHASE.outro.end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo },
  );

  const labelLift = interpolate(
    frame,
    [PHASE.reveal.start + 20, PHASE.reveal.end],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo },
  );

  const strokeOpacity = 1 - fillProgress * 0.6;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: bloomProgress * 0.35 * outroFade,
          background:
            "radial-gradient(ellipse 700px 700px at 50% 45%, rgba(255,255,255,0.18) 0%, transparent 70%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, opacity: outroFade }}
      >
        <defs>
          <radialGradient id="penGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="strokeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <Grid opacity={gridOpacity} />
        <Particles frame={frame} intensity={particleIntensity} />

        <g opacity={bloomProgress * 0.4}>
          <path d={GEAR_PATH} fill="#ffffff" filter="url(#softGlow)" opacity={0.6} />
        </g>

        <g>
          <path
            d={GEAR_PATH}
            stroke="#ffffff"
            strokeWidth={20}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.18 * strokeOpacity}
            filter="url(#strokeGlow)"
            strokeDasharray={GEAR_LENGTH}
            strokeDashoffset={GEAR_LENGTH * (1 - gearProgress)}
          />
          <path
            d={GEAR_PATH}
            stroke="#ffffff"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={strokeOpacity}
            strokeDasharray={GEAR_LENGTH}
            strokeDashoffset={GEAR_LENGTH * (1 - gearProgress)}
          />
        </g>

        <g>
          <path
            d={INNER_RING_PATH}
            stroke="#ffffff"
            strokeWidth={20}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.18 * strokeOpacity}
            filter="url(#strokeGlow)"
            strokeDasharray={INNER_RING_LENGTH}
            strokeDashoffset={INNER_RING_LENGTH * (1 - innerProgress)}
          />
          <path
            d={INNER_RING_PATH}
            stroke="#ffffff"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={strokeOpacity}
            strokeDasharray={INNER_RING_LENGTH}
            strokeDashoffset={INNER_RING_LENGTH * (1 - innerProgress)}
          />
        </g>

        <g>
          <path
            d={CENTER_DOT_PATH}
            stroke="#ffffff"
            strokeWidth={20}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.25 * strokeOpacity * dotProgress}
            filter="url(#strokeGlow)"
            strokeDasharray={CENTER_DOT_LENGTH}
            strokeDashoffset={CENTER_DOT_LENGTH * (1 - dotProgress)}
          />
          <path
            d={CENTER_DOT_PATH}
            stroke="#ffffff"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={strokeOpacity}
            strokeDasharray={CENTER_DOT_LENGTH}
            strokeDashoffset={CENTER_DOT_LENGTH * (1 - dotProgress)}
          />
          <path d={CENTER_DOT_PATH} fill="#ffffff" opacity={fillProgress} />
        </g>

        <g opacity={fillProgress}>
          <path d={GEAR_PATH} fill="#ffffff" />
          <circle cx={GEAR_CX} cy={GEAR_CY} r={INNER_RING_R - 8} fill="#000000" />
          <circle
            cx={GEAR_CX}
            cy={GEAR_CY}
            r={INNER_RING_R}
            fill="none"
            stroke="#ffffff"
            strokeWidth={6}
          />
          <circle cx={GEAR_CX} cy={GEAR_CY} r={CENTER_DOT_R} fill="#ffffff" />
        </g>

        <InkTrail frame={frame} pathPoints={trailPoints} />
        <PenTip x={penX} y={penY} visible={penOpacity} pulse={pulse} />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 1280,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: labelOpacity * outroFade,
          transform: `translateY(${labelLift}px)`,
        }}
      >
        <div
          style={{
            fontFamily: INTER_FAMILY,
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 8,
          }}
        >
          GEAR BRAIN
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: INTER_FAMILY,
            fontSize: 26,
            fontWeight: 500,
            color: "#ffffff",
            opacity: 0.6,
            letterSpacing: 12,
            textTransform: "uppercase",
          }}
        >
          Mechanism of Thought
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)",
          opacity: outroFade,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
