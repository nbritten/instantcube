/**
 * Core type definitions for the Rubik's Cube solver
 */

/**
 * Cube faces using standard notation
 * U = Up, D = Down, L = Left, R = Right, F = Front, B = Back
 */
export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

/**
 * Sticker colors (using first letter)
 * W = White, Y = Yellow, R = Red, O = Orange, B = Blue, G = Green
 */
export type Color = 'W' | 'Y' | 'R' | 'O' | 'B' | 'G';

/**
 * Full cube state - each face has 9 stickers (0-8)
 * Index pattern:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 * Where 4 is always the center (fixed)
 */
export type CubeState = {
  [K in Face]: [
    Color, Color, Color,  // Row 0: indices 0, 1, 2
    Color, Color, Color,  // Row 1: indices 3, 4, 5
    Color, Color, Color   // Row 2: indices 6, 7, 8
  ];
};

/**
 * Base move (single face rotation)
 */
export type BaseMove = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

/**
 * Move modifier
 * '' = clockwise 90°
 * "'" = counter-clockwise 90°
 * '2' = 180°
 */
export type MoveModifier = '' | "'" | '2';

/**
 * Complete move notation
 * Examples: 'U', "U'", 'U2', 'R', "R'", 'F2', etc.
 */
export type Move = `${BaseMove}${MoveModifier}`;

/**
 * Complete solution from a solver
 */
export interface Solution {
  /** Array of all moves in the solution */
  moves: Move[];
  /** Breakdown of solution by step */
  steps: SolutionStep[];
  /** Total number of moves */
  totalMoves: number;
  /** Solving method used */
  method: string;
  /** Whether the solution has been optimized */
  optimized: boolean;
}

/**
 * Individual step in a solution
 */
export interface SolutionStep {
  /** Name of this step (e.g., "White Cross") */
  name: string;
  /** Description of what this step does */
  description: string;
  /** Moves for this step */
  moves: Move[];
  /** Number of moves in this step */
  moveCount: number;
  /** Optional: cube state after this step (for visualization) */
  cubeState?: CubeState;
}

/**
 * Result of cube state validation
 */
export interface ValidationResult {
  /** Whether the cube state is valid */
  valid: boolean;
  /** List of validation errors, if any */
  errors: string[];
}

/**
 * Color map for UI rendering
 */
export const COLOR_NAMES: Record<Color, string> = {
  W: 'White',
  Y: 'Yellow',
  R: 'Red',
  O: 'Orange',
  B: 'Blue',
  G: 'Green',
};

/**
 * Face names for UI display
 */
export const FACE_NAMES: Record<Face, string> = {
  U: 'Up',
  D: 'Down',
  L: 'Left',
  R: 'Right',
  F: 'Front',
  B: 'Back',
};
