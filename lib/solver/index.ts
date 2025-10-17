/**
 * Rubik's Cube Solver - Main Export
 *
 * This is the main entry point for the solver library.
 * Import everything you need from this file.
 *
 * @example
 * ```typescript
 * import { RubiksCube, BeginnerSolver, applyMoves } from '@/lib/solver';
 *
 * const cube = new RubiksCube();
 * applyMoves(cube, ['R', 'U', "R'", "U'"]);
 *
 * const solver = new BeginnerSolver();
 * const solution = solver.solve(cube);
 * ```
 */

// Types
export * from './types';

// Core functionality
export * from './core/cube';
export * from './core/moves';
export * from './core/validation';

// Solving algorithms
export * from './algorithms/beginner';
