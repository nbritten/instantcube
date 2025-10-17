import { describe, it, expect, beforeEach } from 'vitest';
import { RubiksCube } from '@/lib/solver/core/cube';
import { applyMove, applyMoves, parseNotation, invertMove, invertMoves, isValidMove } from '@/lib/solver/core/moves';
import { Move } from '@/lib/solver/types';

describe('Move Engine', () => {
  let cube: RubiksCube;

  beforeEach(() => {
    cube = new RubiksCube(); // Start with solved cube
  });

  describe('Basic Move Properties', () => {
    it('should return to original state after 4 rotations of same face', () => {
      const original = cube.getState();

      applyMoves(cube, ['U', 'U', 'U', 'U']);
      expect(cube.getState()).toEqual(original);

      // Reset and test other faces
      cube.reset();
      applyMoves(cube, ['R', 'R', 'R', 'R']);
      expect(cube.getState()).toEqual(original);

      cube.reset();
      applyMoves(cube, ['F', 'F', 'F', 'F']);
      expect(cube.getState()).toEqual(original);
    });

    it('should cancel with inverse move', () => {
      const original = cube.getState();

      applyMoves(cube, ['R', "R'"]);
      expect(cube.getState()).toEqual(original);

      cube.reset();
      applyMoves(cube, ['U', "U'"]);
      expect(cube.getState()).toEqual(original);

      cube.reset();
      applyMoves(cube, ['F', "F'"]);
      expect(cube.getState()).toEqual(original);
    });

    it('should handle double moves correctly (R2 = R R)', () => {
      const cube1 = new RubiksCube();
      const cube2 = new RubiksCube();

      applyMove(cube1, 'R2');
      applyMoves(cube2, ['R', 'R']);

      expect(cube1.getState()).toEqual(cube2.getState());
    });

    it('should handle prime moves correctly (R\' = R R R)', () => {
      const cube1 = new RubiksCube();
      const cube2 = new RubiksCube();

      applyMove(cube1, "R'");
      applyMoves(cube2, ['R', 'R', 'R']);

      expect(cube1.getState()).toEqual(cube2.getState());
    });
  });

  describe('Move Sequence Reversibility', () => {
    it('should reverse a sequence with invertMoves', () => {
      const original = cube.getState();
      const sequence: Move[] = ['R', 'U', "R'", "U'"];

      applyMoves(cube, sequence);
      const reversed = invertMoves(sequence);
      applyMoves(cube, reversed);

      expect(cube.getState()).toEqual(original);
    });

    it('should handle complex sequences', () => {
      const original = cube.getState();
      const sequence: Move[] = ['R', 'U', 'R2', "F'", 'D', "L'"];

      applyMoves(cube, sequence);
      expect(cube.isSolved()).toBe(false);

      const reversed = invertMoves(sequence);
      applyMoves(cube, reversed);

      expect(cube.getState()).toEqual(original);
      expect(cube.isSolved()).toBe(true);
    });
  });

  describe('Individual Move Tests', () => {
    it('should correctly rotate U face', () => {
      const original = cube.getState();
      applyMove(cube, 'U');

      // After U move, front top row should move to right
      const newState = cube.getState();
      expect(newState.R[0]).toBe(original.F[0]);
      expect(newState.R[1]).toBe(original.F[1]);
      expect(newState.R[2]).toBe(original.F[2]);

      // Centers should not move
      expect(newState.U[4]).toBe('W'); // Center stays white
      expect(newState.F[4]).toBe('G'); // Centers don't move
    });

    it('should correctly rotate D face', () => {
      const original = cube.getState();
      applyMove(cube, 'D');

      // After D move, front bottom row should move to left
      const newState = cube.getState();
      expect(newState.L[6]).toBe(original.F[6]);
      expect(newState.L[7]).toBe(original.F[7]);
      expect(newState.L[8]).toBe(original.F[8]);

      // Center should not move
      expect(newState.D[4]).toBe('Y'); // Center stays yellow
    });

    it('should correctly rotate R face', () => {
      const original = cube.getState();
      applyMove(cube, 'R');

      const newState = cube.getState();

      // Front right column should move to top right column
      expect(newState.U[2]).toBe(original.F[2]);
      expect(newState.U[5]).toBe(original.F[5]);
      expect(newState.U[8]).toBe(original.F[8]);

      // Center should not move
      expect(newState.R[4]).toBe('R'); // Center stays red
    });

    it('should correctly rotate L face', () => {
      applyMove(cube, 'L');
      expect(cube.getCenterColor('L')).toBe('O'); // Center doesn't move
    });

    it('should correctly rotate F face', () => {
      applyMove(cube, 'F');
      expect(cube.getCenterColor('F')).toBe('G'); // Center doesn't move
    });

    it('should correctly rotate B face', () => {
      applyMove(cube, 'B');
      expect(cube.getCenterColor('B')).toBe('B'); // Center doesn't move
    });
  });

  describe('Centers Never Move', () => {
    it('should keep all centers in place after any sequence', () => {
      const moves: Move[] = ['R', 'U', "R'", "U'", 'F2', 'D', "L'", 'B', 'R2'];

      applyMoves(cube, moves);

      // All centers should still be their original colors
      expect(cube.getCenterColor('U')).toBe('W');
      expect(cube.getCenterColor('D')).toBe('Y');
      expect(cube.getCenterColor('L')).toBe('O');
      expect(cube.getCenterColor('R')).toBe('R');
      expect(cube.getCenterColor('F')).toBe('G');
      expect(cube.getCenterColor('B')).toBe('B');
    });
  });

  describe('Move Parsing', () => {
    it('should parse valid notation string', () => {
      const notation = "R U R' U' F2 D";
      const moves = parseNotation(notation);

      expect(moves).toEqual(['R', 'U', "R'", "U'", 'F2', 'D']);
    });

    it('should handle extra whitespace', () => {
      const notation = "  R   U  R'  ";
      const moves = parseNotation(notation);

      expect(moves).toEqual(['R', 'U', "R'"]);
    });

    it('should throw error on invalid move', () => {
      expect(() => parseNotation('R U X')).toThrow('Invalid move: "X"');
    });
  });

  describe('Move Validation', () => {
    it('should validate correct moves', () => {
      expect(isValidMove('R')).toBe(true);
      expect(isValidMove("R'")).toBe(true);
      expect(isValidMove('R2')).toBe(true);
      expect(isValidMove('U')).toBe(true);
      expect(isValidMove('F2')).toBe(true);
    });

    it('should reject invalid moves', () => {
      expect(isValidMove('X')).toBe(false);
      expect(isValidMove('R3')).toBe(false);
      expect(isValidMove('RR')).toBe(false);
      expect(isValidMove('')).toBe(false);
      expect(isValidMove('r')).toBe(false); // lowercase
    });
  });

  describe('Move Inversion', () => {
    it('should invert basic moves', () => {
      expect(invertMove('R')).toBe("R'");
      expect(invertMove("R'")).toBe('R');
      expect(invertMove('R2')).toBe('R2');
    });

    it('should invert all face moves', () => {
      expect(invertMove('U')).toBe("U'");
      expect(invertMove('D')).toBe("D'");
      expect(invertMove('L')).toBe("L'");
      expect(invertMove('F')).toBe("F'");
      expect(invertMove('B')).toBe("B'");
    });
  });

  describe('Scramble and Solve', () => {
    it('should be able to scramble and reverse', () => {
      const original = cube.getState();

      // Apply a scramble
      const scramble: Move[] = ['R', 'U', "R'", 'U', 'R', 'U2', "R'", 'U'];
      applyMoves(cube, scramble);

      // Cube should be scrambled
      expect(cube.isSolved()).toBe(false);

      // Reverse the scramble
      const solution = invertMoves(scramble);
      applyMoves(cube, solution);

      // Should be back to solved
      expect(cube.getState()).toEqual(original);
      expect(cube.isSolved()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty move sequence', () => {
      const original = cube.getState();
      applyMoves(cube, []);
      expect(cube.getState()).toEqual(original);
    });

    it('should handle single move', () => {
      applyMoves(cube, ['R']);
      expect(cube.isSolved()).toBe(false);
    });

    it('should handle long sequences', () => {
      const longSequence: Move[] = Array(50).fill('R') as Move[];
      applyMoves(cube, longSequence);

      // 50 R moves = 50 % 4 = 2 net rotations = R2
      const expectedCube = new RubiksCube();
      applyMove(expectedCube, 'R2');

      expect(cube.getState()).toEqual(expectedCube.getState());
    });
  });
});
