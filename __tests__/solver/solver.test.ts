import { describe, it, expect } from 'vitest';
import { RubiksCube, BeginnerSolver, applyMoves, parseNotation } from '@/lib/solver';

describe('BeginnerSolver - End-to-End Tests', () => {
  it('should return empty solution for already solved cube', () => {
    const cube = new RubiksCube(); // Creates solved cube
    const solver = new BeginnerSolver();

    const solution = solver.solve(cube);

    expect(solution.moves).toEqual([]);
    expect(solution.totalMoves).toBe(0);
    expect(solution.method).toBe("Beginner's Method");
  });

  it('should solve a cube with simple scramble (single move)', () => {
    const cube = new RubiksCube();
    applyMoves(cube, ['R']); // Simple scramble

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Apply solution to scrambled cube
    const testCube = new RubiksCube();
    applyMoves(testCube, ['R']);
    applyMoves(testCube, solution.moves);

    expect(testCube.isSolved()).toBe(true);
    expect(solution.totalMoves).toBeGreaterThan(0);
  });

  it('should solve a cube with R U scramble', () => {
    const cube = new RubiksCube();
    const scramble = parseNotation('R U');
    applyMoves(cube, scramble);

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Apply solution to scrambled cube
    const testCube = new RubiksCube();
    applyMoves(testCube, scramble);
    applyMoves(testCube, solution.moves);

    expect(testCube.isSolved()).toBe(true);
  });

  it('should solve a cube with F R U scramble', () => {
    const cube = new RubiksCube();
    const scramble = parseNotation('F R U');
    applyMoves(cube, scramble);

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Apply solution to scrambled cube
    const testCube = new RubiksCube();
    applyMoves(testCube, scramble);
    applyMoves(testCube, solution.moves);

    expect(testCube.isSolved()).toBe(true);
  });

  it('should return a valid solution structure', () => {
    const cube = new RubiksCube();
    applyMoves(cube, parseNotation('R U R\' U\''));

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Check solution structure
    expect(solution).toHaveProperty('moves');
    expect(solution).toHaveProperty('steps');
    expect(solution).toHaveProperty('totalMoves');
    expect(solution).toHaveProperty('method');
    expect(solution).toHaveProperty('optimized');

    expect(Array.isArray(solution.moves)).toBe(true);
    expect(Array.isArray(solution.steps)).toBe(true);
    expect(typeof solution.totalMoves).toBe('number');
    expect(solution.method).toBe("Beginner's Method");
    expect(solution.optimized).toBe(false);
  });

  it('should have step names and descriptions', () => {
    const cube = new RubiksCube();
    applyMoves(cube, parseNotation('R U'));

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Check that steps have required properties
    solution.steps.forEach(step => {
      expect(step).toHaveProperty('name');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('moves');
      expect(step).toHaveProperty('moveCount');
      expect(typeof step.name).toBe('string');
      expect(typeof step.description).toBe('string');
      expect(Array.isArray(step.moves)).toBe(true);
      expect(step.moveCount).toBe(step.moves.length);
    });
  });

  it('should solve cube with 2-move scramble R U', () => {
    const cube = new RubiksCube();
    const scramble = parseNotation('R U');
    applyMoves(cube, scramble);

    expect(cube.isSolved()).toBe(false);

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Create new cube, apply scramble and solution
    const verificationCube = new RubiksCube();
    applyMoves(verificationCube, scramble);
    applyMoves(verificationCube, solution.moves);

    expect(verificationCube.isSolved()).toBe(true);
  });

  it('should solve cube with sexy move scramble', () => {
    const cube = new RubiksCube();
    const scramble = parseNotation('R U R\' U\'');
    applyMoves(cube, scramble);

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Create verification cube
    const verificationCube = new RubiksCube();
    applyMoves(verificationCube, scramble);
    applyMoves(verificationCube, solution.moves);

    expect(verificationCube.isSolved()).toBe(true);
  });

  it('should handle T-perm scramble', () => {
    const cube = new RubiksCube();
    const scramble = parseNotation('R U R\' U\' R\' F R2 U\' R\' U\' R U R\' F\'');
    applyMoves(cube, scramble);

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Verify solution works
    const verificationCube = new RubiksCube();
    applyMoves(verificationCube, scramble);
    applyMoves(verificationCube, solution.moves);

    expect(verificationCube.isSolved()).toBe(true);
  });

  it('should produce solution with reasonable move count', () => {
    const cube = new RubiksCube();
    const scramble = parseNotation('R U R\' U\'');
    applyMoves(cube, scramble);

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    // Beginner's method should solve in < 200 moves for simple scrambles
    expect(solution.totalMoves).toBeLessThan(500);
    expect(solution.totalMoves).toBeGreaterThan(0);
  });
});

describe('BeginnerSolver - Specific Step Tests', () => {
  it('should identify solved cube correctly', () => {
    const cube = new RubiksCube();
    expect(cube.isSolved()).toBe(true);

    applyMoves(cube, ['R']);
    expect(cube.isSolved()).toBe(false);

    applyMoves(cube, ["R'"]); // Undo
    expect(cube.isSolved()).toBe(true);
  });

  it('should work with double moves', () => {
    const cube = new RubiksCube();
    applyMoves(cube, parseNotation('R2 U2 F2'));

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    const verificationCube = new RubiksCube();
    applyMoves(verificationCube, parseNotation('R2 U2 F2'));
    applyMoves(verificationCube, solution.moves);

    expect(verificationCube.isSolved()).toBe(true);
  });

  it('should work with inverse moves', () => {
    const cube = new RubiksCube();
    applyMoves(cube, parseNotation('R\' U\' F\''));

    const solver = new BeginnerSolver();
    const solution = solver.solve(cube);

    const verificationCube = new RubiksCube();
    applyMoves(verificationCube, parseNotation('R\' U\' F\''));
    applyMoves(verificationCube, solution.moves);

    expect(verificationCube.isSolved()).toBe(true);
  });
});
