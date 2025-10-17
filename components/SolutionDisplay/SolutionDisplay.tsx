'use client'

import { Solution } from '@/lib/solver';
import { useState, useEffect, useMemo } from 'react';

interface SolutionDisplayProps {
  solution: Solution;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

export function SolutionDisplay({ solution, currentStepIndex, onStepChange }: SolutionDisplayProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  // Auto-reset copiedAll state after 2 seconds (with cleanup)
  useEffect(() => {
    if (copiedAll) {
      const timer = setTimeout(() => setCopiedAll(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedAll]);

  // Auto-reset copiedStep state after 2 seconds (with cleanup)
  useEffect(() => {
    if (copiedStep !== null) {
      const timer = setTimeout(() => setCopiedStep(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedStep]);

  const copyToClipboard = async (text: string, isAll: boolean = false, stepIndex?: number) => {
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      setCopyError('Clipboard not available. Please use HTTPS.');
      setTimeout(() => setCopyError(null), 3000);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyError(null);
      if (isAll) {
        setCopiedAll(true);
      } else if (stepIndex !== undefined) {
        setCopiedStep(stepIndex);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to copy';
      setCopyError(errorMsg);
      setTimeout(() => setCopyError(null), 3000);
    }
  };

  // Filter out empty steps (memoized to avoid recalculating on every render)
  const nonEmptySteps = useMemo(
    () => solution.steps.filter(step => step.moves.length > 0),
    [solution.steps]
  );

  return (
    <div className="space-y-6">
      {/* Copy Error Display */}
      {copyError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{copyError}</p>
        </div>
      )}

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

      {/* Step Navigation Controls */}
      {nonEmptySteps.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Step-by-Step Playback
            </h3>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {currentStepIndex === -1 ? (
                <span>Initial State</span>
              ) : currentStepIndex === nonEmptySteps.length ? (
                <span className="text-green-600 dark:text-green-400">✓ Solved!</span>
              ) : (
                <span>
                  Step {currentStepIndex + 1} of {nonEmptySteps.length}
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / (nonEmptySteps.length + 1)) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Current Step Info */}
          {currentStepIndex >= 0 && currentStepIndex < nonEmptySteps.length && (
            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-600">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                {nonEmptySteps[currentStepIndex].name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {nonEmptySteps[currentStepIndex].description}
              </div>
              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                {nonEmptySteps[currentStepIndex].moves.join(' ')}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onStepChange(-1)}
              disabled={currentStepIndex === -1}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded transition-colors"
            >
              ⏮ Reset
            </button>
            <button
              onClick={() => onStepChange(Math.max(-1, currentStepIndex - 1))}
              disabled={currentStepIndex === -1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => onStepChange(Math.min(nonEmptySteps.length, currentStepIndex + 1))}
              disabled={currentStepIndex >= nonEmptySteps.length}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded transition-colors"
            >
              {currentStepIndex === nonEmptySteps.length - 1 ? '→ Finish' : '→ Next Step'}
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      {nonEmptySteps.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Step-by-Step Solution
          </h3>
          {nonEmptySteps.map((step, index) => {
            const isCurrentStep = index === currentStepIndex;
            const isCompletedStep = currentStepIndex > index;

            return (
              <div
                key={step.name}
                className={`border rounded-lg p-4 transition-all ${
                  isCurrentStep
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                    : isCompletedStep
                    ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                }`}
              >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Step {index + 1}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {isCurrentStep && '▶ '}
                      {step.name}
                      {isCompletedStep && ' ✓'}
                    </h4>
                  </div>
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
            );
          })}
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
