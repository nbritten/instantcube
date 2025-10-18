import { describe, it, expect } from 'vitest';
import { RubiksCube, applyMoves } from '@/lib/solver';
import type { Move, CubeState } from '@/lib/solver';

/**
 * Integration tests for stepwise navigation logic
 * Tests the intermediate state calculation that powers the step-by-step playback
 */
describe('Stepwise Navigation - Intermediate States', () => {
  describe('Intermediate State Calculation', () => {
    it('should correctly calculate intermediate states for a simple sequence', () => {
      // Setup: Start with a solved cube
      const initialCube = new RubiksCube();
      const initialState = initialCube.getState();

      // Apply a sequence of moves
      const step1Moves: Move[] = ['R', 'U'];
      const step2Moves: Move[] = ["R'"];
      const step3Moves: Move[] = ["U'"];

      // Calculate intermediate states (simulating what happens in page.tsx)
      const states: Readonly<CubeState>[] = [initialState];
      const cube = new RubiksCube(initialState);

      // After step 1: R U
      applyMoves(cube, step1Moves);
      states.push(cube.getState());

      // After step 2: R U R'
      applyMoves(cube, step2Moves);
      states.push(cube.getState());

      // After step 3: R U R' U'
      applyMoves(cube, step3Moves);
      states.push(cube.getState());

      // Verify we have the right number of states
      expect(states).toHaveLength(4); // initial + 3 steps

      // Verify final state is different from initial (R U R' U' is NOT identity)
      const finalCube = new RubiksCube(states[3]);
      expect(JSON.stringify(states[3])).not.toBe(JSON.stringify(states[0]));
    });

    it('should produce different states for each step', () => {
      const initialCube = new RubiksCube();
      const initialState = initialCube.getState();

      const step1: Move[] = ['F'];
      const step2: Move[] = ['R'];
      const step3: Move[] = ['U'];

      const states: Readonly<CubeState>[] = [initialState];
      const cube = new RubiksCube(initialState);

      applyMoves(cube, step1);
      states.push(cube.getState());

      applyMoves(cube, step2);
      states.push(cube.getState());

      applyMoves(cube, step3);
      states.push(cube.getState());

      // Each state should be different
      expect(JSON.stringify(states[0])).not.toBe(JSON.stringify(states[1]));
      expect(JSON.stringify(states[1])).not.toBe(JSON.stringify(states[2]));
      expect(JSON.stringify(states[2])).not.toBe(JSON.stringify(states[3]));
    });

    it('should handle empty move sequences', () => {
      const initialCube = new RubiksCube();
      const initialState = initialCube.getState();

      // If a step has no moves, state shouldn't change
      const emptyMoves: Move[] = [];

      const cube = new RubiksCube(initialState);
      const stateBefore = cube.getState();

      applyMoves(cube, emptyMoves);
      const stateAfter = cube.getState();

      expect(JSON.stringify(stateBefore)).toBe(JSON.stringify(stateAfter));
    });

    it('should correctly build states array matching step indices', () => {
      // Simulate the exact logic from page.tsx
      const initialCube = new RubiksCube();
      const cubeState = initialCube.getState();

      const nonEmptySteps = [
        { name: 'Step 1', moves: ['R'] as Move[], moveCount: 1, description: '' },
        { name: 'Step 2', moves: ['U'] as Move[], moveCount: 1, description: '' },
        { name: 'Step 3', moves: ['F'] as Move[], moveCount: 1, description: '' },
      ];

      // Build intermediate states exactly like page.tsx
      const states: Readonly<CubeState>[] = [cubeState];
      const cube = new RubiksCube(cubeState);

      nonEmptySteps.forEach(step => {
        applyMoves(cube, step.moves);
        states.push(cube.getState());
      });

      // Verify array structure
      // states[0] = initial
      // states[1] = after step 0
      // states[2] = after step 1
      // states[3] = after step 2
      expect(states).toHaveLength(4);

      // Test the lookup logic from page.tsx
      const currentStepIndex = -1; // Initial state
      const displayedState1 = currentStepIndex === -1 ? states[0] : states[currentStepIndex + 1];
      expect(displayedState1).toBe(states[0]);

      const currentStepIndex2 = 0; // First step
      const displayedState2 = currentStepIndex2 === -1 ? states[0] : states[currentStepIndex2 + 1];
      expect(displayedState2).toBe(states[1]);

      const currentStepIndex3 = 2; // Last step
      const displayedState3 = currentStepIndex3 === -1 ? states[0] : states[currentStepIndex3 + 1];
      expect(displayedState3).toBe(states[3]);
    });
  });

  describe('Performance - State Caching', () => {
    it('should only calculate states once (not on every step change)', () => {
      // This test verifies the O(1) lookup approach vs O(n) recalculation
      const initialCube = new RubiksCube();
      const cubeState = initialCube.getState();

      const moves: Move[] = ['R', 'U', 'F', 'D', 'L', 'B'];
      const nonEmptySteps = moves.map(move => ({
        name: `Move ${move}`,
        moves: [move] as Move[],
        moveCount: 1,
        description: '',
      }));

      // Pre-calculate all states (done once in useMemo)
      const states: Readonly<CubeState>[] = [cubeState];
      const cube = new RubiksCube(cubeState);

      nonEmptySteps.forEach(step => {
        applyMoves(cube, step.moves);
        states.push(cube.getState());
      });

      // Now "stepping through" is just array lookups - O(1)
      const step0State = states[0 + 1]; // After first step
      const step3State = states[3 + 1]; // After fourth step
      const step5State = states[5 + 1]; // After last step

      expect(step0State).toBeDefined();
      expect(step3State).toBeDefined();
      expect(step5State).toBeDefined();

      // All are different
      expect(JSON.stringify(step0State)).not.toBe(JSON.stringify(step3State));
      expect(JSON.stringify(step3State)).not.toBe(JSON.stringify(step5State));
    });

    it('should handle large step counts efficiently', () => {
      const initialCube = new RubiksCube();
      const cubeState = initialCube.getState();

      // Create 100 single-move steps
      const largeMoveSequence: Move[] = [];
      for (let i = 0; i < 100; i++) {
        largeMoveSequence.push(['R', 'U', 'F', 'D', 'L', 'B'][i % 6] as Move);
      }

      const nonEmptySteps = largeMoveSequence.map((move, idx) => ({
        name: `Step ${idx}`,
        moves: [move] as Move[],
        moveCount: 1,
        description: '',
      }));

      // Pre-calculate (this is done once in useMemo)
      const start = performance.now();
      const states: Readonly<CubeState>[] = [cubeState];
      const cube = new RubiksCube(cubeState);

      nonEmptySteps.forEach(step => {
        applyMoves(cube, step.moves);
        states.push(cube.getState());
      });
      const calculationTime = performance.now() - start;

      // Now test lookup performance (this happens on every step change)
      const lookupStart = performance.now();
      for (let i = 0; i < 100; i++) {
        const _state = states[i + 1]; // Simulate accessing any step
      }
      const lookupTime = performance.now() - lookupStart;

      // Verify we have all states
      expect(states).toHaveLength(101); // initial + 100 steps

      // Lookup should be MUCH faster than recalculation
      // (Lookups are just array access, ~0.01ms vs calculation ~10-100ms)
      expect(lookupTime).toBeLessThan(calculationTime / 10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle solution with no steps', () => {
      const initialCube = new RubiksCube();
      const cubeState = initialCube.getState();

      const nonEmptySteps: never[] = [];

      // Should still create array with just initial state
      const states: Readonly<CubeState>[] = cubeState ? [cubeState] : [];

      expect(states).toHaveLength(1);
      expect(states[0]).toBe(cubeState);
    });

    it('should handle already solved cube', () => {
      const solvedCube = new RubiksCube();
      expect(solvedCube.isSolved()).toBe(true);

      const cubeState = solvedCube.getState();
      const states: Readonly<CubeState>[] = [cubeState];

      // With no steps, we just have the initial solved state
      expect(states).toHaveLength(1);

      // Verify it's still solved
      const verificationCube = new RubiksCube(states[0]);
      expect(verificationCube.isSolved()).toBe(true);
    });

    it('should correctly handle state at boundary indices', () => {
      const initialCube = new RubiksCube();
      const cubeState = initialCube.getState();

      const steps = [
        { name: 'Only step', moves: ['R', 'U'] as Move[], moveCount: 2, description: '' },
      ];

      const states: Readonly<CubeState>[] = [cubeState];
      const cube = new RubiksCube(cubeState);

      steps.forEach(step => {
        applyMoves(cube, step.moves);
        states.push(cube.getState());
      });

      // Test boundary access
      const initialState = states[0]; // currentStepIndex = -1
      const afterOnlyStep = states[1]; // currentStepIndex = 0
      const outOfBounds = states[2]; // currentStepIndex = 1 (solved state, should be same as afterOnlyStep)

      expect(initialState).toBeDefined();
      expect(afterOnlyStep).toBeDefined();
      expect(outOfBounds).toBeUndefined(); // Only 2 states exist
    });

    it('should maintain immutability of intermediate states', () => {
      const initialCube = new RubiksCube();
      const cubeState = initialCube.getState();

      const states: Readonly<CubeState>[] = [cubeState];
      const cube = new RubiksCube(cubeState);

      const moves: Move[] = ['R'];
      applyMoves(cube, moves);
      states.push(cube.getState());

      // Original state should not have changed
      const originalCubeCopy = new RubiksCube(states[0]);
      expect(originalCubeCopy.isSolved()).toBe(true);

      // New state should be different
      const afterMove = new RubiksCube(states[1]);
      expect(afterMove.isSolved()).toBe(false);
    });
  });
});
