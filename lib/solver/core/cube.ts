import { CubeState, Color, Face } from '../types';
import { validateCubeState } from './validation';

/**
 * Represents a Rubik's Cube state and operations
 * This class provides the core data structure and methods for manipulating cube state
 */
export class RubiksCube {
  private state: CubeState;

  /**
   * Create a new Rubik's Cube
   * @param state - Optional initial state. If not provided, creates a solved cube
   * @throws Error if the provided state is invalid
   */
  constructor(state?: CubeState) {
    const initialState = state ?? this.getSolvedState();

    // Validate the cube state
    const validation = validateCubeState(initialState);
    if (!validation.valid) {
      throw new Error(`Invalid cube state: ${validation.errors.join(', ')}`);
    }

    this.state = initialState;
  }

  /**
   * Get current cube state (returns a deep copy for immutability)
   * @returns Readonly copy of the current cube state
   */
  getState(): Readonly<CubeState> {
    return structuredClone(this.state);
  }

  /**
   * Set cube state (accepts a new state and makes a deep copy)
   * @param state - The new cube state to set
   * @throws Error if the provided state is invalid
   */
  setState(state: CubeState): void {
    // Validate the cube state
    const validation = validateCubeState(state);
    if (!validation.valid) {
      throw new Error(`Invalid cube state: ${validation.errors.join(', ')}`);
    }

    this.state = structuredClone(state);
  }

  /**
   * Create a deep copy of this cube
   * @returns New RubiksCube instance with the same state
   */
  clone(): RubiksCube {
    return new RubiksCube(this.getState());
  }

  /**
   * Check if cube is in solved state
   * @returns True if cube is solved (all faces are uniform color)
   */
  isSolved(): boolean {
    const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

    return faces.every(face => {
      const faceColors = this.state[face];
      const centerColor = faceColors[4]; // Center sticker is the reference

      // All stickers on this face should match the center
      return faceColors.every(sticker => sticker === centerColor);
    });
  }

  /**
   * Get a solved cube state
   * Standard color scheme:
   * - White (W) opposite Yellow (Y)
   * - Red (R) opposite Orange (O)
   * - Blue (B) opposite Green (G)
   *
   * @returns A solved cube state
   */
  private getSolvedState(): CubeState {
    return {
      U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
      D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
      L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
      F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
      B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    };
  }

  /**
   * Reset to solved state
   */
  reset(): void {
    this.state = this.getSolvedState();
  }

  /**
   * Get color at specific position
   * @param face - The face to query
   * @param index - The sticker index (0-8)
   * @returns The color at that position
   */
  getSticker(face: Face, index: number): Color {
    if (index < 0 || index > 8) {
      throw new Error(`Invalid sticker index: ${index}. Must be 0-8.`);
    }
    return this.state[face][index];
  }

  /**
   * Get all colors for a specific face
   * @param face - The face to query
   * @returns Array of 9 colors for that face
   */
  getFace(face: Face): readonly Color[] {
    return [...this.state[face]];
  }

  /**
   * Serialize cube state to JSON string
   * @returns JSON string representation of cube state
   */
  toJSON(): string {
    return JSON.stringify(this.state);
  }

  /**
   * Deserialize cube from JSON string
   * @param json - JSON string representation of cube state
   * @returns New RubiksCube instance
   */
  static fromJSON(json: string): RubiksCube {
    const state = JSON.parse(json) as CubeState;
    return new RubiksCube(state);
  }

  /**
   * Create a cube from a simple string representation
   * Useful for testing and debugging
   * @returns String representation of cube state
   */
  toString(): string {
    const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    return faces.map(face => {
      const colors = this.state[face];
      return `${face}: [${colors.join(', ')}]`;
    }).join('\n');
  }

  /**
   * Get center color for a face (always at index 4)
   * Centers never move in a standard Rubik's cube
   * @param face - The face to query
   * @returns The center color of that face
   */
  getCenterColor(face: Face): Color {
    return this.state[face][4];
  }

  /**
   * Check if two cubes have the same state
   * @param other - Another RubiksCube to compare against
   * @returns True if both cubes have identical states
   */
  equals(other: RubiksCube): boolean {
    const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

    return faces.every(face => {
      const thisFace = this.state[face];
      const otherFace = other.state[face];

      return thisFace.every((color, i) => color === otherFace[i]);
    });
  }
}
