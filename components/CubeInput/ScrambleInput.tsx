'use client'

import { useState, useMemo } from 'react';
import { RubiksCube, parseNotation, applyMoves, CubeState } from '@/lib/solver';

interface ScrambleInputProps {
  onChange: (state: CubeState) => void;
}

export function ScrambleInput({ onChange }: ScrambleInputProps) {
  const [scramble, setScramble] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Memoize move count to avoid reparsing on every render
  const moveCount = useMemo(() => {
    if (!scramble || error) return 0;
    try {
      return parseNotation(scramble).length;
    } catch {
      return 0;
    }
  }, [scramble, error]);

  const handleScrambleChange = (value: string) => {
    setScramble(value);
    setError(null);

    if (!value.trim()) {
      // Clear the cube state when input is empty
      onChange(new RubiksCube().getState());
      return;
    }

    try {
      // Parse the scramble notation
      const moves = parseNotation(value);

      // Apply moves to a solved cube
      const cube = new RubiksCube();
      applyMoves(cube, moves);

      // Pass the new state to parent
      onChange(cube.getState());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid scramble');
    }
  };

  const handleRandomScramble = () => {
    // Generate a random scramble (20 moves)
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const scrambleLength = 20;
    const moves: string[] = [];

    let lastFace = '';

    for (let i = 0; i < scrambleLength; i++) {
      // Avoid consecutive moves on same face
      let face = faces[Math.floor(Math.random() * faces.length)];
      while (face === lastFace) {
        face = faces[Math.floor(Math.random() * faces.length)];
      }
      lastFace = face;

      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      moves.push(`${face}${modifier}`);
    }

    const scrambleStr = moves.join(' ');
    setScramble(scrambleStr);
    handleScrambleChange(scrambleStr);
  };

  const examples = [
    "R U R' U'",
    "F R U' R' U' F'",
    "R U R' U R U2 R'",
  ];

  return (
    <div className="space-y-4">
      {/* Scramble Input */}
      <div>
        <label
          htmlFor="scramble"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Enter Scramble Notation
        </label>
        <textarea
          id="scramble"
          value={scramble}
          onChange={(e) => handleScrambleChange(e.target.value)}
          placeholder="e.g., R U R' U' F2 D"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          rows={3}
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Use standard cube notation: U, D, L, R, F, B (with &apos; for counter-clockwise, 2 for 180°)
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Random Scramble Button */}
      <button
        onClick={handleRandomScramble}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Generate Random Scramble
      </button>

      {/* Example Scrambles */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Try these examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => {
                setScramble(example);
                handleScrambleChange(example);
              }}
              className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md transition-colors font-mono"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Current Move Count */}
      {scramble && !error && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current scramble: <span className="font-semibold">{moveCount}</span> moves
        </div>
      )}
    </div>
  );
}
