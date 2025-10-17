'use client'

import { Solution } from '@/lib/solver';
import { useState } from 'react';

interface SolutionDisplayProps {
  solution: Solution;
}

export function SolutionDisplay({ solution }: SolutionDisplayProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = async (text: string, isAll: boolean = false, stepIndex?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isAll) {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else if (stepIndex !== undefined) {
        setCopiedStep(stepIndex);
        setTimeout(() => setCopiedStep(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Filter out empty steps
  const nonEmptySteps = solution.steps.filter(step => step.moves.length > 0);

  return (
    <div className="space-y-6">
      {/* Solution Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Solution Found!
        </h2>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {solution.totalMoves}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            total moves
          </div>
        </div>
      </div>

      {/* Solution Info */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Method</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {solution.method}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Optimized</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {solution.optimized ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Steps */}
      {nonEmptySteps.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Step-by-Step Solution
          </h3>
          {nonEmptySteps.map((step, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Step {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {step.name}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {step.moveCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    moves
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {step.description}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded font-mono text-sm overflow-x-auto">
                  {step.moves.join(' ')}
                </div>
                <button
                  onClick={() => copyToClipboard(step.moves.join(' '), false, index)}
                  className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
                >
                  {copiedStep === index ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Cube is already solved!
        </div>
      )}

      {/* Full Solution */}
      {solution.moves.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Complete Solution
          </h3>
          <div className="flex items-start gap-2">
            <div className="flex-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded font-mono text-sm overflow-x-auto">
              {solution.moves.join(' ')}
            </div>
            <button
              onClick={() => copyToClipboard(solution.moves.join(' '), true)}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
            >
              {copiedAll ? 'Copied!' : 'Copy All'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
