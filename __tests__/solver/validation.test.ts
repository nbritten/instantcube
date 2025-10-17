import { describe, it, expect } from 'vitest';
import { validateCubeState, isBasicValid, isSolved } from '@/lib/solver/core/validation';
import { CubeState } from '@/lib/solver/types';

describe('Validation', () => {
  const validSolvedState: CubeState = {
    U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
  };

  describe('validateCubeState', () => {
    it('should validate a solved cube', () => {
      const result = validateCubeState(validSolvedState);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a scrambled but legal cube', () => {
      const scrambledState: CubeState = {
        U: ['W', 'G', 'W', 'O', 'W', 'R', 'W', 'B', 'W'],
        D: ['Y', 'B', 'Y', 'R', 'Y', 'O', 'Y', 'G', 'Y'],
        L: ['O', 'W', 'O', 'G', 'O', 'B', 'O', 'Y', 'O'],
        R: ['R', 'Y', 'R', 'B', 'R', 'G', 'R', 'W', 'R'],
        F: ['G', 'O', 'G', 'Y', 'G', 'W', 'G', 'R', 'G'],
        B: ['B', 'R', 'B', 'W', 'B', 'Y', 'B', 'O', 'B'],
      };

      const result = validateCubeState(scrambledState);
      expect(result.valid).toBe(true);
    });

    it('should reject cube with wrong color count', () => {
      const invalidState: CubeState = {
        U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['W', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'], // Extra W, missing Y
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      const result = validateCubeState(invalidState);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.includes('W'))).toBe(true);
      expect(result.errors.some(e => e.includes('Y'))).toBe(true);
    });

    it('should reject cube with duplicate centers', () => {
      const invalidState: CubeState = {
        U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'W', 'Y', 'Y', 'Y', 'Y'], // Center is W instead of Y
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'Y', 'B'],
      };

      const result = validateCubeState(invalidState);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Centers'))).toBe(true);
    });

    it('should reject incomplete cube', () => {
      const incompleteState = {
        U: ['W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      } as unknown as CubeState;

      const result = validateCubeState(incompleteState);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('incomplete'))).toBe(true);
    });
  });

  describe('isBasicValid', () => {
    it('should return true for valid cube', () => {
      expect(isBasicValid(validSolvedState)).toBe(true);
    });

    it('should return false for invalid color counts', () => {
      const invalidState: CubeState = {
        U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['W', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      expect(isBasicValid(invalidState)).toBe(false);
    });
  });

  describe('isSolved', () => {
    it('should detect solved cube', () => {
      expect(isSolved(validSolvedState)).toBe(true);
    });

    it('should detect unsolved cube', () => {
      const unsolvedState: CubeState = {
        U: ['W', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'W', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      expect(isSolved(unsolvedState)).toBe(false);
    });

    it('should detect mixed face as unsolved', () => {
      const mixedState: CubeState = {
        U: ['W', 'R', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['W', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      expect(isSolved(mixedState)).toBe(false);
    });
  });

  describe('Color Count Validation', () => {
    it('should require exactly 9 of each color', () => {
      const tooManyWhite: CubeState = {
        U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['W', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      const result = validateCubeState(tooManyWhite);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Color W appears 10 times (expected 9)');
      expect(result.errors).toContain('Color Y appears 8 times (expected 9)');
    });
  });
});
