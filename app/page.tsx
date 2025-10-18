'use client'

import { useState, useMemo, useEffect } from 'react';
import { RubiksCube, BeginnerSolver, Solution, CubeState, applyMoves } from '@/lib/solver';
import { ScrambleInput } from '@/components/CubeInput/ScrambleInput';
import { Cube2D } from '@/components/CubeVisualization/Cube2D';
import { SolutionDisplay } from '@/components/SolutionDisplay/SolutionDisplay';

export default function Home() {
  const [cubeState, setCubeState] = useState<CubeState | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1); // -1 = initial state

  // Reset step index whenever solution changes
  useEffect(() => {
    setCurrentStepIndex(-1);
  }, [solution]);

  // Filter out empty steps once (avoid duplicate filtering in child components)
  const nonEmptySteps = useMemo(
    () => solution?.steps.filter(step => step.moves.length > 0) ?? [],
    [solution]
  );

  // Pre-calculate all intermediate cube states when solution changes
  // This avoids O(n²) complexity when stepping through the solution
  const intermediateStates = useMemo(() => {
    if (!cubeState || nonEmptySteps.length === 0) return [];

    const states: Readonly<CubeState>[] = [cubeState];
    const cube = new RubiksCube(cubeState);

    // Build array of states: [initial, afterStep1, afterStep2, ..., solved]
    nonEmptySteps.forEach(step => {
      applyMoves(cube, step.moves);
      states.push(cube.getState());
    });

    return states;
  }, [cubeState, nonEmptySteps]);

  // Get the cube state to display based on current step (O(1) lookup)
  const displayedCubeState = useMemo(() => {
    if (currentStepIndex === -1) {
      return intermediateStates[0] ?? null;
    }
    return intermediateStates[currentStepIndex + 1] ?? null;
  }, [intermediateStates, currentStepIndex]);

  const handleSolve = () => {
    if (!cubeState) return;

    setIsLoading(true);
    setError(null);

    try {
      // Run solver (in browser!)
      const cube = new RubiksCube(cubeState);
      const solver = new BeginnerSolver();
      const result = solver.solve(cube);

      setSolution(result);
      setCurrentStepIndex(-1); // Reset to initial state when solving
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to solve cube');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCubeState(null);
    setSolution(null);
    setError(null);
    setCurrentStepIndex(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            InstantCube
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Solve any Rubik&apos;s Cube instantly - works offline!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <section className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Input Your Cube
              </h2>
              <ScrambleInput onChange={setCubeState} />
            </div>

            {/* Solve Button */}
            {cubeState && (
              <div className="flex gap-4">
                <button
                  onClick={handleSolve}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
                >
                  {isLoading ? 'Solving...' : 'Solve Cube'}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  Error: {error}
                </p>
              </div>
            )}
          </section>

          {/* Right Column: Visualization */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Cube Visualization
            </h2>
            {displayedCubeState ? (
              <Cube2D state={displayedCubeState} />
            ) : (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                Enter a scramble to see your cube
              </div>
            )}
          </section>
        </div>

        {/* Solution Display */}
        {solution && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <SolutionDisplay
              solution={solution}
              nonEmptySteps={nonEmptySteps}
              currentStepIndex={currentStepIndex}
              onStepChange={setCurrentStepIndex}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
          <p className="mt-2 text-sm">Works completely offline as a PWA</p>
        </div>
      </footer>
    </div>
  );
}
