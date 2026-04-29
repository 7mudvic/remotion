export const LETTER_HEIGHT = 240;
export const LETTER_Y = 840;
export const STROKE_WIDTH = 22;

type Letter = {
  paths: string[];
  approxLength: number;
};

export const LETTERS: Record<"A" | "L" | "F" | "E" | "X", Letter> = {
  A: {
    paths: [
      "M 230,1080 L 290,840 L 350,1080",
      "M 250,1000 L 330,1000",
    ],
    approxLength: 660,
  },
  L: {
    paths: ["M 400,840 L 400,1080 L 510,1080"],
    approxLength: 350,
  },
  F: {
    paths: [
      "M 560,1080 L 560,840 L 680,840",
      "M 560,960 L 660,960",
    ],
    approxLength: 480,
  },
  E: {
    paths: [
      "M 850,840 L 730,840 L 730,1080 L 850,1080",
      "M 730,960 L 830,960",
    ],
    approxLength: 580,
  },
  X: {
    paths: [
      "M 900,840 L 1020,1080",
      "M 1020,840 L 900,1080",
    ],
    approxLength: 540,
  },
};

export const LETTER_ORDER: Array<keyof typeof LETTERS> = ["A", "L", "F", "E", "X"];

export const LETTER_CENTER_X: Record<keyof typeof LETTERS, number> = {
  A: 290,
  L: 455,
  F: 620,
  E: 790,
  X: 960,
};
