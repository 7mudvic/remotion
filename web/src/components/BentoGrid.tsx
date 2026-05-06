import {AnimatePresence, motion} from 'motion/react';
import type {Dish} from '../data';
import {BentoTile} from './BentoTile';

/**
 * Bento layout — one big featured tile + 8 surrounding tiles of mixed
 * sizes. Whichever tile is currently `featuredIndex` swaps into the
 * "feature" cell using a layoutId-shared Motion transition so its
 * image flies smoothly between cells.
 *
 * Grid (12 cols × 6 rows on iPad landscape):
 *   ┌───────────────┬─────┐
 *   │               │  S  │
 *   │   FEATURE     ├─────┤
 *   │               │  S  │
 *   │               ├─────┤
 *   │               │  S  │
 *   ├──────┬────────┴─────┤
 *   │  M   │       L      │
 *   ├──────┴───┬──────────┤
 *   │     L    │     M    │
 *   └──────────┴──────────┘
 *
 * Cells are addressed via grid-area names so we can animate the
 * "feature" cell while the others swap content with a tween.
 */
type CellName =
  | 'feat'
  | 's1'
  | 's2'
  | 's3'
  | 'm1'
  | 'l1'
  | 'l2'
  | 'm2'
  | 'm3';

const CELL_ORDER: CellName[] = ['feat', 's1', 's2', 's3', 'm1', 'l1', 'l2', 'm2', 'm3'];

const CELL_SIZE: Record<CellName, 'feat' | 'large' | 'medium' | 'small'> = {
  feat: 'feat',
  l1: 'large',
  l2: 'large',
  m1: 'medium',
  m2: 'medium',
  m3: 'medium',
  s1: 'small',
  s2: 'small',
  s3: 'small',
};

export const BentoGrid = ({
  tiles,
  featuredIndex,
  onTileClick,
}: {
  tiles: Dish[];
  featuredIndex: number;
  onTileClick: (idx: number) => void;
}) => {
  // Build assignment: which dish appears in which cell.
  // The featured dish goes into 'feat'; every other dish fills the
  // remaining cells in CELL_ORDER (skipping 'feat').
  const restCells = CELL_ORDER.filter((c) => c !== 'feat');
  const restDishes = tiles.filter((_, i) => i !== featuredIndex);
  const cellToDish: Partial<Record<CellName, {dish: Dish; tileIndex: number}>> = {
    feat: {dish: tiles[featuredIndex], tileIndex: featuredIndex},
  };
  restCells.forEach((cell, i) => {
    if (restDishes[i]) {
      // Find the original index in `tiles`
      const tIdx = tiles.indexOf(restDishes[i]);
      cellToDish[cell] = {dish: restDishes[i], tileIndex: tIdx};
    }
  });

  return (
    <div
      dir="rtl"
      className="grid h-full w-full gap-3"
      style={{
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gridTemplateAreas: `
          "feat feat feat feat feat feat feat feat s1 s1 s1 s1"
          "feat feat feat feat feat feat feat feat s1 s1 s1 s1"
          "feat feat feat feat feat feat feat feat s2 s2 s2 s2"
          "feat feat feat feat feat feat feat feat s2 s2 s2 s2"
          "m1 m1 m1 m1 l1 l1 l1 l1 s3 s3 s3 s3"
          "m1 m1 m1 m1 l1 l1 l1 l1 s3 s3 s3 s3"
        `,
      }}
    >
      {CELL_ORDER.map((cell) => {
        const entry = cellToDish[cell];
        if (!entry) return <div key={cell} style={{gridArea: cell}} />;
        return (
          <div key={cell} style={{gridArea: cell}} className="relative min-h-0 min-w-0">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={entry.dish.image}
                initial={{opacity: 0, scale: 0.96}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.96}}
                transition={{type: 'spring', damping: 24, stiffness: 220}}
                className="absolute inset-0"
              >
                <BentoTile
                  dish={entry.dish}
                  size={CELL_SIZE[cell]}
                  onClick={() => onTileClick(entry.tileIndex)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
