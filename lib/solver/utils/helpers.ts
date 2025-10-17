/**
 * Helper utilities for solving algorithms
 * These functions help with pattern recognition and piece manipulation
 */

import { RubiksCube } from '../core/cube';
import { Move, Color, Face } from '../types';
import { applyMoves } from '../core/moves';

/**
 * Edge piece position on the cube
 * Edges are identified by their two face positions
 */
export interface EdgePosition {
  face1: Face;
  index1: number;
  face2: Face;
  index2: number;
}

/**
 * Corner piece position on the cube
 * Corners are identified by their three face positions
 */
export interface CornerPosition {
  face1: Face;
  index1: number;
  face2: Face;
  index2: number;
  face3: Face;
  index3: number;
}

/**
 * Edge positions on a cube (12 edges total)
 * Each edge has two stickers on adjacent faces
 */
export const EDGE_POSITIONS: EdgePosition[] = [
  // Top layer edges (U face)
  { face1: 'U', index1: 1, face2: 'B', index2: 1 }, // UB
  { face1: 'U', index1: 3, face2: 'L', index2: 1 }, // UL
  { face1: 'U', index1: 5, face2: 'R', index2: 1 }, // UR
  { face1: 'U', index1: 7, face2: 'F', index2: 1 }, // UF

  // Middle layer edges
  { face1: 'F', index1: 3, face2: 'L', index2: 5 }, // FL
  { face1: 'F', index1: 5, face2: 'R', index2: 3 }, // FR
  { face1: 'B', index1: 3, face2: 'R', index2: 5 }, // BR
  { face1: 'B', index1: 5, face2: 'L', index2: 3 }, // BL

  // Bottom layer edges (D face)
  { face1: 'D', index1: 1, face2: 'F', index2: 7 }, // DF
  { face1: 'D', index1: 3, face2: 'L', index2: 7 }, // DL
  { face1: 'D', index1: 5, face2: 'R', index2: 7 }, // DR
  { face1: 'D', index1: 7, face2: 'B', index2: 7 }, // DB
];

/**
 * Find an edge piece by its colors
 * @param cube - The cube to search
 * @param color1 - First color of the edge
 * @param color2 - Second color of the edge
 * @returns The edge position if found, null otherwise
 */
export function findEdge(
  cube: RubiksCube,
  color1: Color,
  color2: Color
): EdgePosition | null {
  const state = cube.getState();

  for (const edge of EDGE_POSITIONS) {
    const c1 = state[edge.face1][edge.index1];
    const c2 = state[edge.face2][edge.index2];

    if ((c1 === color1 && c2 === color2) || (c1 === color2 && c2 === color1)) {
      return edge;
    }
  }

  return null;
}

/**
 * Check if an edge is correctly positioned and oriented
 * @param cube - The cube to check
 * @param edge - The edge position to check
 * @returns True if edge is solved
 */
export function isEdgeSolved(cube: RubiksCube, edge: EdgePosition): boolean {
  const state = cube.getState();
  const center1 = state[edge.face1][4]; // Center color
  const center2 = state[edge.face2][4]; // Center color

  const sticker1 = state[edge.face1][edge.index1];
  const sticker2 = state[edge.face2][edge.index2];

  // Edge is solved if both stickers match their respective centers
  return sticker1 === center1 && sticker2 === center2;
}

/**
 * Apply moves and return the cube to simplify chaining
 * @param cube - The cube to modify
 * @param moves - Moves to apply
 * @returns The same cube (for chaining)
 */
export function apply(cube: RubiksCube, moves: Move[]): RubiksCube {
  applyMoves(cube, moves);
  return cube;
}

/**
 * Rotate the top layer until a condition is met (max 4 rotations)
 * @param cube - The cube to rotate
 * @param condition - Condition function to check
 * @param maxRotations - Maximum rotations (default 4)
 * @returns Moves performed
 */
export function rotateUntil(
  cube: RubiksCube,
  condition: (cube: RubiksCube) => boolean,
  maxRotations: number = 4
): Move[] {
  const moves: Move[] = [];

  for (let i = 0; i < maxRotations; i++) {
    if (condition(cube)) {
      return moves;
    }
    applyMoves(cube, ['U']);
    moves.push('U');
  }

  return moves;
}

/**
 * Check if the white cross is complete
 * @param cube - The cube to check
 * @returns True if white cross is solved
 */
export function isWhiteCrossSolved(cube: RubiksCube): boolean {
  const state = cube.getState();

  // Check that white edges are on D face and correctly oriented
  const whiteEdges = [
    { face: 'D', index: 1 }, // DF
    { face: 'D', index: 3 }, // DL
    { face: 'D', index: 5 }, // DR
    { face: 'D', index: 7 }, // DB
  ];

  for (const edge of whiteEdges) {
    if (state[edge.face][edge.index] !== 'W') {
      return false;
    }
  }

  // Also check that the side colors match
  if (state.F[7] !== 'G') return false;
  if (state.R[7] !== 'R') return false;
  if (state.B[7] !== 'B') return false;
  if (state.L[7] !== 'O') return false;

  return true;
}

/**
 * Check if the first layer (white layer) is complete
 * @param cube - The cube to check
 * @returns True if first layer is solved
 */
export function isFirstLayerSolved(cube: RubiksCube): boolean {
  const state = cube.getState();

  // All D face should be white
  if (!state.D.every(c => c === 'W')) {
    return false;
  }

  // Bottom rows of side faces should match centers
  const checks = [
    { face: 'F', row: [6, 7, 8], color: 'G' },
    { face: 'R', row: [6, 7, 8], color: 'R' },
    { face: 'B', row: [6, 7, 8], color: 'B' },
    { face: 'L', row: [6, 7, 8], color: 'O' },
  ];

  for (const check of checks) {
    for (const idx of check.row) {
      if (state[check.face as Face][idx] !== check.color) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if middle layer is solved
 * @param cube - The cube to check
 * @returns True if middle layer is solved
 */
export function isMiddleLayerSolved(cube: RubiksCube): boolean {
  const state = cube.getState();

  // Middle rows of side faces should match centers
  const checks = [
    { face: 'F', indices: [3, 4, 5], color: 'G' },
    { face: 'R', indices: [3, 4, 5], color: 'R' },
    { face: 'B', indices: [3, 4, 5], color: 'B' },
    { face: 'L', indices: [3, 4, 5], color: 'O' },
  ];

  for (const check of checks) {
    for (const idx of check.indices) {
      if (state[check.face as Face][idx] !== check.color) {
        return false;
      }
    }
  }

  return true;
}
