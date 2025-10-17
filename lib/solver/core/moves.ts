import { RubiksCube } from './cube';
import { Move, CubeState, Face, Color, FACE_NAMES } from '../types';

/**
 * Apply a single move to a cube (mutates the cube)
 * @param cube - The cube to apply the move to
 * @param move - The move to apply (e.g., 'U', "R'", 'F2')
 */
export function applyMove(cube: RubiksCube, move: Move): void {
  const state = cube.getState() as CubeState;

  // Extract base move and modifier
  const baseMove = move[0] as Face;
  const modifier = move.slice(1) as '' | "'" | '2';

  // Apply rotation based on modifier
  if (modifier === '2') {
    // 180° rotation = 2 clockwise rotations
    rotateFace(state, baseMove);
    rotateFace(state, baseMove);
  } else if (modifier === "'") {
    // Counter-clockwise = 3 clockwise rotations
    rotateFace(state, baseMove);
    rotateFace(state, baseMove);
    rotateFace(state, baseMove);
  } else {
    // Single clockwise rotation
    rotateFace(state, baseMove);
  }

  cube.setState(state);
}

/**
 * Apply multiple moves in sequence
 * @param cube - The cube to apply moves to
 * @param moves - Array of moves to apply
 */
export function applyMoves(cube: RubiksCube, moves: Move[]): void {
  moves.forEach(move => applyMove(cube, move));
}

/**
 * Rotate a single face clockwise 90° (mutates state)
 * This is the core of the move engine
 * @param state - The cube state to modify
 * @param face - The face to rotate
 */
function rotateFace(state: CubeState, face: Face): void {
  // First, rotate the face itself 90° clockwise
  // Rotation pattern: [6,3,0, 7,4,1, 8,5,2]
  // Visual transformation:
  //   0 1 2       6 3 0
  //   3 4 5  -->  7 4 1
  //   6 7 8       8 5 2
  const f = state[face];
  state[face] = [
    f[6], f[3], f[0],
    f[7], f[4], f[1],
    f[8], f[5], f[2],
  ];

  // Then rotate the adjacent edges
  switch (face) {
    case 'U':
      rotateU(state);
      break;
    case 'D':
      rotateD(state);
      break;
    case 'L':
      rotateL(state);
      break;
    case 'R':
      rotateR(state);
      break;
    case 'F':
      rotateF(state);
      break;
    case 'B':
      rotateB(state);
      break;
  }
}

/**
 * Rotate edges adjacent to U (Up) face
 * U face rotation affects the top row of F, R, B, L faces
 * Clockwise when viewed from above: F -> R -> B -> L -> F
 */
function rotateU(state: CubeState): void {
  const temp: [Color, Color, Color] = [state.F[0], state.F[1], state.F[2]];

  state.F[0] = state.L[0];
  state.F[1] = state.L[1];
  state.F[2] = state.L[2];

  state.L[0] = state.B[0];
  state.L[1] = state.B[1];
  state.L[2] = state.B[2];

  state.B[0] = state.R[0];
  state.B[1] = state.R[1];
  state.B[2] = state.R[2];

  state.R[0] = temp[0];
  state.R[1] = temp[1];
  state.R[2] = temp[2];
}

/**
 * Rotate edges adjacent to D (Down) face
 * D face rotation affects the bottom row of F, L, B, R faces
 * Clockwise when viewed from below: F -> R -> B -> L -> F
 */
function rotateD(state: CubeState): void {
  const temp: [Color, Color, Color] = [state.F[6], state.F[7], state.F[8]];

  state.F[6] = state.R[6];
  state.F[7] = state.R[7];
  state.F[8] = state.R[8];

  state.R[6] = state.B[6];
  state.R[7] = state.B[7];
  state.R[8] = state.B[8];

  state.B[6] = state.L[6];
  state.B[7] = state.L[7];
  state.B[8] = state.L[8];

  state.L[6] = temp[0];
  state.L[7] = temp[1];
  state.L[8] = temp[2];
}

/**
 * Rotate edges adjacent to L (Left) face
 * L face rotation affects the left column of U, F, D, B faces
 */
function rotateL(state: CubeState): void {
  const temp: [Color, Color, Color] = [state.U[0], state.U[3], state.U[6]];

  state.U[0] = state.B[8];
  state.U[3] = state.B[5];
  state.U[6] = state.B[2];

  state.B[8] = state.D[0];
  state.B[5] = state.D[3];
  state.B[2] = state.D[6];

  state.D[0] = state.F[0];
  state.D[3] = state.F[3];
  state.D[6] = state.F[6];

  state.F[0] = temp[0];
  state.F[3] = temp[1];
  state.F[6] = temp[2];
}

/**
 * Rotate edges adjacent to R (Right) face
 * R face rotation affects the right column of U, B, D, F faces
 */
function rotateR(state: CubeState): void {
  const temp: [Color, Color, Color] = [state.U[2], state.U[5], state.U[8]];

  state.U[2] = state.F[2];
  state.U[5] = state.F[5];
  state.U[8] = state.F[8];

  state.F[2] = state.D[2];
  state.F[5] = state.D[5];
  state.F[8] = state.D[8];

  state.D[2] = state.B[6];
  state.D[5] = state.B[3];
  state.D[8] = state.B[0];

  state.B[6] = temp[0];
  state.B[3] = temp[1];
  state.B[0] = temp[2];
}

/**
 * Rotate edges adjacent to F (Front) face
 * F face rotation affects the bottom of U, left of R, top of D, right of L
 */
function rotateF(state: CubeState): void {
  const temp: [Color, Color, Color] = [state.U[6], state.U[7], state.U[8]];

  state.U[6] = state.L[8];
  state.U[7] = state.L[5];
  state.U[8] = state.L[2];

  state.L[8] = state.D[2];
  state.L[5] = state.D[1];
  state.L[2] = state.D[0];

  state.D[2] = state.R[0];
  state.D[1] = state.R[3];
  state.D[0] = state.R[6];

  state.R[0] = temp[0];
  state.R[3] = temp[1];
  state.R[6] = temp[2];
}

/**
 * Rotate edges adjacent to B (Back) face
 * B face rotation affects the top of U, right of R, bottom of D, left of L
 */
function rotateB(state: CubeState): void {
  const temp: [Color, Color, Color] = [state.U[0], state.U[1], state.U[2]];

  state.U[0] = state.R[2];
  state.U[1] = state.R[5];
  state.U[2] = state.R[8];

  state.R[2] = state.D[8];
  state.R[5] = state.D[7];
  state.R[8] = state.D[6];

  state.D[8] = state.L[6];
  state.D[7] = state.L[3];
  state.D[6] = state.L[0];

  state.L[6] = temp[0];
  state.L[3] = temp[1];
  state.L[0] = temp[2];
}

/**
 * Parse move notation string into Move array
 * @param notation - String of moves separated by spaces (e.g., "R U R' U' F2")
 * @returns Array of Move objects
 */
export function parseNotation(notation: string): Move[] {
  const moves = notation
    .trim()
    .split(/\s+/)
    .filter(m => m.length > 0);

  return moves.map(m => {
    if (isValidMove(m)) {
      return m as Move;
    }
    throw new Error(`Invalid move: "${m}". Must be one of [UDLRFB] optionally followed by ' or 2`);
  });
}

/**
 * Check if a string is a valid move
 * @param move - String to check
 * @returns True if valid move notation
 */
export function isValidMove(move: string): move is Move {
  return /^[UDLRFB]['2]?$/.test(move);
}

/**
 * Invert a move (for undoing or reversing sequences)
 * @param move - The move to invert
 * @returns The inverse move
 * @example
 * invertMove('R') -> "R'"
 * invertMove("R'") -> "R"
 * invertMove('R2') -> "R2"
 */
export function invertMove(move: Move): Move {
  const base = move[0];
  const modifier = move.slice(1);

  if (modifier === "'") {
    return base as Move;
  } else if (modifier === '2') {
    return move; // R2 is its own inverse
  } else {
    return `${base}'` as Move;
  }
}

/**
 * Invert a sequence of moves (reverse order and invert each)
 * @param moves - Array of moves to invert
 * @returns Inverted move sequence
 * @example
 * invertMoves(['R', 'U', "F'"]) -> ['F', "U'", "R'"]
 */
export function invertMoves(moves: Move[]): Move[] {
  return moves.map(invertMove).reverse();
}

/**
 * Convert a move to a human-readable string
 * @param move - The move to describe
 * @returns Human-readable description
 */
export function describeMove(move: Move): string {
  const base = move[0] as Face;
  const modifier = move.slice(1);
  const faceName = FACE_NAMES[base];

  if (modifier === "'") {
    return `${faceName} counter-clockwise`;
  } else if (modifier === '2') {
    return `${faceName} 180°`;
  } else {
    return `${faceName} clockwise`;
  }
}
