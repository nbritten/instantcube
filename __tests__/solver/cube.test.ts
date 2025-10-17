import { describe, it, expect } from 'vitest';
import { RubiksCube } from '@/lib/solver/core/cube';
import { CubeState } from '@/lib/solver/types';

describe('RubiksCube', () => {
  describe('Constructor and Initialization', () => {
    it('should create a solved cube by default', () => {
      const cube = new RubiksCube();
      expect(cube.isSolved()).toBe(true);
    });

    it('should create cube with custom state', () => {
      const customState: CubeState = {
        U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      const cube = new RubiksCube(customState);
      expect(cube.isSolved()).toBe(true);
      expect(cube.getState()).toEqual(customState);
    });
  });

  describe('State Management', () => {
    it('should get and set state correctly', () => {
      const cube = new RubiksCube();
      const originalState = cube.getState();

      const newState: CubeState = {
        U: ['R', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      cube.setState(newState);
      expect(cube.getState()).toEqual(newState);
      expect(cube.getState()).not.toEqual(originalState);
    });

    it('should return immutable state copy', () => {
      const cube = new RubiksCube();
      const state = cube.getState();

      // Try to modify returned state
      state.U[0] = 'R';

      // Original cube state should not change
      expect(cube.getState().U[0]).toBe('W');
    });
  });

  describe('Clone', () => {
    it('should create independent copy', () => {
      const cube1 = new RubiksCube();
      const cube2 = cube1.clone();

      expect(cube1.getState()).toEqual(cube2.getState());

      // Modify cube2
      const newState = cube2.getState() as CubeState;
      newState.U[0] = 'R';
      cube2.setState(newState);

      // cube1 should be unchanged
      expect(cube1.getState().U[0]).toBe('W');
      expect(cube2.getState().U[0]).toBe('R');
    });
  });

  describe('Reset', () => {
    it('should reset to solved state', () => {
      const cube = new RubiksCube();

      // Scramble the cube
      const scrambledState: CubeState = {
        U: ['R', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['W', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      cube.setState(scrambledState);
      expect(cube.isSolved()).toBe(false);

      cube.reset();
      expect(cube.isSolved()).toBe(true);
    });
  });

  describe('isSolved', () => {
    it('should detect solved cube', () => {
      const cube = new RubiksCube();
      expect(cube.isSolved()).toBe(true);
    });

    it('should detect unsolved cube', () => {
      const cube = new RubiksCube();
      const state = cube.getState() as CubeState;

      // Swap two colors
      state.U[0] = 'R';
      state.R[0] = 'W';

      cube.setState(state);
      expect(cube.isSolved()).toBe(false);
    });
  });

  describe('Sticker Access', () => {
    it('should get sticker by face and index', () => {
      const cube = new RubiksCube();

      expect(cube.getSticker('U', 0)).toBe('W');
      expect(cube.getSticker('D', 4)).toBe('Y');
      expect(cube.getSticker('R', 8)).toBe('R');
    });

    it('should throw error for invalid index', () => {
      const cube = new RubiksCube();

      expect(() => cube.getSticker('U', -1)).toThrow('Invalid sticker index');
      expect(() => cube.getSticker('U', 9)).toThrow('Invalid sticker index');
    });

    it('should get entire face', () => {
      const cube = new RubiksCube();
      const face = cube.getFace('U');

      expect(face).toEqual(['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']);
    });
  });

  describe('Center Colors', () => {
    it('should get center color for each face', () => {
      const cube = new RubiksCube();

      expect(cube.getCenterColor('U')).toBe('W');
      expect(cube.getCenterColor('D')).toBe('Y');
      expect(cube.getCenterColor('L')).toBe('O');
      expect(cube.getCenterColor('R')).toBe('R');
      expect(cube.getCenterColor('F')).toBe('G');
      expect(cube.getCenterColor('B')).toBe('B');
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON', () => {
      const cube = new RubiksCube();
      const json = cube.toJSON();

      expect(typeof json).toBe('string');
      expect(JSON.parse(json)).toBeDefined();
    });

    it('should deserialize from JSON', () => {
      const cube1 = new RubiksCube();
      const json = cube1.toJSON();

      const cube2 = RubiksCube.fromJSON(json);
      expect(cube2.getState()).toEqual(cube1.getState());
    });

    it('should maintain state through serialization', () => {
      const originalState: CubeState = {
        U: ['R', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        R: ['W', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      };

      const cube1 = new RubiksCube(originalState);
      const json = cube1.toJSON();
      const cube2 = RubiksCube.fromJSON(json);

      expect(cube2.getState()).toEqual(originalState);
    });
  });

  describe('String Representation', () => {
    it('should create string representation', () => {
      const cube = new RubiksCube();
      const str = cube.toString();

      expect(str).toContain('U:');
      expect(str).toContain('D:');
      expect(str).toContain('L:');
      expect(str).toContain('R:');
      expect(str).toContain('F:');
      expect(str).toContain('B:');
    });
  });

  describe('Equality', () => {
    it('should detect equal cubes', () => {
      const cube1 = new RubiksCube();
      const cube2 = new RubiksCube();

      expect(cube1.equals(cube2)).toBe(true);
    });

    it('should detect different cubes', () => {
      const cube1 = new RubiksCube();
      const cube2 = new RubiksCube();

      const state = cube2.getState() as CubeState;
      state.U[0] = 'R';
      cube2.setState(state);

      expect(cube1.equals(cube2)).toBe(false);
    });
  });
});
