'use client'

import { useState } from 'react';
import { RubiksCube, BeginnerSolver, Solution, CubeState } from '@/lib/solver';
import { ScrambleInput } from '@/components/CubeInput/ScrambleInput';
import { Cube2D } from '@/components/CubeVisualization/Cube2D';
import { SolutionDisplay } from '@/components/SolutionDisplay/SolutionDisplay';

export default function Home() {
  const [cubeState, setCubeState] = useState<CubeState | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            {cubeState ? (
              <Cube2D state={cubeState} />
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
            <SolutionDisplay solution={solution} />
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
