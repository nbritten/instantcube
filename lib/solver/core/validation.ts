import { CubeState, Color, Face, ValidationResult } from '../types';

/**
 * Validate a cube state is legal and solvable
 * @param state - The cube state to validate
 * @returns Validation result with errors if any
 */
export function validateCubeState(state: CubeState): ValidationResult {
  const errors: string[] = [];

  // Check all stickers are present
  if (!hasAllStickers(state)) {
    errors.push('Cube state is incomplete - missing stickers');
    return { valid: false, errors }; // Can't continue validation
  }

  // Check color counts (must have exactly 9 of each color)
  const colorErrors = validateColorCounts(state);
  errors.push(...colorErrors);

  // Check that centers are unique (no two faces with same center color)
  const centerErrors = validateCenters(state);
  errors.push(...centerErrors);

  // Check parity (is this configuration possible?)
  // Note: Full parity checking is complex, we implement basic version
  if (errors.length === 0 && !hasValidParity(state)) {
    errors.push('Cube configuration is impossible (invalid parity)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check all 54 stickers are present (6 faces × 9 stickers)
 * @param state - The cube state to check
 * @returns True if all stickers present
 */
function hasAllStickers(state: CubeState): boolean {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

  return faces.every(face => {
    return state[face] && state[face].length === 9;
  });
}

/**
 * Validate there are exactly 9 of each color
 * @param state - The cube state to check
 * @returns Array of error messages (empty if valid)
 */
function validateColorCounts(state: CubeState): string[] {
  const errors: string[] = [];
  const colorCounts: Partial<Record<Color, number>> = {};

  // Count all colors
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  faces.forEach(face => {
    state[face].forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
  });

  // Check each color has exactly 9
  const colors: Color[] = ['W', 'Y', 'R', 'O', 'B', 'G'];
  colors.forEach(color => {
    const count = colorCounts[color] || 0;
    if (count !== 9) {
      errors.push(`Color ${color} appears ${count} times (expected 9)`);
    }
  });

  return errors;
}

/**
 * Validate that centers are unique (standard cube property)
 * On a standard cube, each face has a different center color
 * @param state - The cube state to check
 * @returns Array of error messages (empty if valid)
 */
function validateCenters(state: CubeState): string[] {
  const errors: string[] = [];
  const centers: Color[] = [];
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

  // Collect all center colors
  faces.forEach(face => {
    const centerColor = state[face][4]; // Index 4 is always the center
    centers.push(centerColor);
  });

  // Check for duplicates
  const uniqueCenters = new Set(centers);
  if (uniqueCenters.size !== 6) {
    errors.push('Centers must all be different colors');
  }

  return errors;
}

/**
 * Check cube has valid parity (can be solved)
 * This is a simplified parity check
 *
 * Full parity validation is complex and requires:
 * 1. Corner permutation parity
 * 2. Edge permutation parity
 * 3. Corner orientation parity
 * 4. Edge orientation parity
 *
 * For MVP, we do basic validation. Can enhance later.
 *
 * @param state - The cube state to check
 * @returns True if basic parity checks pass
 */
function hasValidParity(state: CubeState): boolean {
  // For now, if color counts and centers are correct,
  // we assume parity is valid
  // TODO: Implement full parity checking in Phase 2

  // Basic check: make sure we have valid colors
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const validColors: Color[] = ['W', 'Y', 'R', 'O', 'B', 'G'];

  for (const face of faces) {
    for (const color of state[face]) {
      if (!validColors.includes(color)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Quick check if basic cube properties are valid
 * Useful for fast validation without full error messages
 * @param state - The cube state to check
 * @returns True if basic validation passes
 */
export function isBasicValid(state: CubeState): boolean {
  return hasAllStickers(state) && validateColorCounts(state).length === 0;
}

/**
 * Check if a cube state is in solved configuration
 * (Alternative to RubiksCube.isSolved() for validation purposes)
 * @param state - The cube state to check
 * @returns True if cube is solved
 */
export function isSolved(state: CubeState): boolean {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

  return faces.every(face => {
    const faceColors = state[face];
    const centerColor = faceColors[4];

    // All stickers on this face should match the center
    return faceColors.every(sticker => sticker === centerColor);
  });
}

/**
 * Get a human-readable summary of validation errors
 * @param result - Validation result
 * @returns Formatted error message
 */
export function formatValidationErrors(result: ValidationResult): string {
  if (result.valid) {
    return 'Cube state is valid';
  }

  return `Invalid cube state:\n${result.errors.map(e => `  - ${e}`).join('\n')}`;
}
