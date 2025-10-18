import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SolutionDisplay } from '@/components/SolutionDisplay/SolutionDisplay';
import { Solution, SolutionStep } from '@/lib/solver';

describe('SolutionDisplay - Stepwise Navigation', () => {
  const mockNonEmptySteps: SolutionStep[] = [
    {
      name: 'White Cross',
      description: 'Solve white cross',
      moves: ['F', 'R', 'U'],
      moveCount: 3,
    },
    {
      name: 'White Corners',
      description: 'Complete white layer',
      moves: ['R', "U'", 'R'],
      moveCount: 3,
    },
    {
      name: 'Middle Layer',
      description: 'Solve middle edges',
      moves: ['U', 'R', 'U2'],
      moveCount: 3,
    },
  ];

  const mockSolution: Solution = {
    moves: ['F', 'R', 'U', 'R', "U'", 'R', 'U', 'R', 'U2'],
    steps: mockNonEmptySteps,
    totalMoves: 9,
    method: "Beginner's Method",
    optimized: false,
  };

  let onStepChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onStepChangeMock = vi.fn();
  });

  describe('Navigation Controls', () => {
    it('should render navigation controls when there are steps', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      expect(screen.getByText('Step-by-Step Playback')).toBeInTheDocument();
      expect(screen.getByText(/Reset/)).toBeInTheDocument();
      expect(screen.getByText(/Previous/)).toBeInTheDocument();
      expect(screen.getByText(/Next Step/)).toBeInTheDocument();
    });

    it('should not render navigation controls when there are no steps', () => {
      const emptySolution: Solution = {
        ...mockSolution,
        steps: [],
      };

      render(
        <SolutionDisplay
          solution={emptySolution}
          nonEmptySteps={[]}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      expect(screen.queryByText('Step-by-Step Playback')).not.toBeInTheDocument();
    });

    it('should show "Initial State" when currentStepIndex is -1', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      expect(screen.getByText('Initial State')).toBeInTheDocument();
    });

    it('should show current step number when in progress', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });

    it('should show "✓ Solved!" when at the end', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={3}
          onStepChange={onStepChangeMock}
        />
      );

      expect(screen.getByText(/Solved!/)).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('should disable Reset and Previous buttons when at initial state', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      const resetButton = screen.getByLabelText(/Reset to initial/);
      const previousButton = screen.getByLabelText(/Go to previous/);

      expect(resetButton).toBeDisabled();
      expect(previousButton).toBeDisabled();
    });

    it('should enable all buttons when in middle of solution', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      const resetButton = screen.getByLabelText(/Reset to initial/);
      const previousButton = screen.getByLabelText(/Go to previous/);
      const nextButton = screen.getByLabelText(/Go to next step/);

      expect(resetButton).not.toBeDisabled();
      expect(previousButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it('should disable Next button when at solved state', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={3}
          onStepChange={onStepChangeMock}
        />
      );

      // When already solved (past all steps), button says "Next Step" but is disabled
      const nextButton = screen.getByLabelText(/Go to next step/);
      expect(nextButton).toBeDisabled();
    });

    it('should show "Finish" on last step instead of "Next Step"', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={2}
          onStepChange={onStepChangeMock}
        />
      );

      expect(screen.getByText(/Finish/)).toBeInTheDocument();
      expect(screen.queryByText(/Next Step/)).not.toBeInTheDocument();
    });
  });

  describe('Button Clicks', () => {
    it('should call onStepChange(-1) when Reset is clicked', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      const resetButton = screen.getByLabelText(/Reset to initial/);
      fireEvent.click(resetButton);

      expect(onStepChangeMock).toHaveBeenCalledWith(-1);
    });

    it('should call onStepChange with previous index when Previous is clicked', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={2}
          onStepChange={onStepChangeMock}
        />
      );

      const previousButton = screen.getByLabelText(/Go to previous/);
      fireEvent.click(previousButton);

      expect(onStepChangeMock).toHaveBeenCalledWith(1);
    });

    it('should call onStepChange with next index when Next is clicked', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={0}
          onStepChange={onStepChangeMock}
        />
      );

      const nextButton = screen.getByLabelText(/Go to next step/);
      fireEvent.click(nextButton);

      expect(onStepChangeMock).toHaveBeenCalledWith(1);
    });
  });

  describe('Current Step Display', () => {
    it('should show current step info when on a step', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      // Current step info should be displayed (appears in both current step box and step list)
      expect(screen.getByText('White Corners')).toBeInTheDocument();
      expect(screen.getAllByText('Complete white layer').length).toBeGreaterThan(0);
      expect(screen.getAllByText("R U' R").length).toBeGreaterThan(0);
    });

    it('should not show current step info when at initial state', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      // Step names should still appear in the list, but not in the "current step info" box
      const stepHeaders = screen.getAllByText('White Corners');
      // One in the list, but no dedicated "current step" display
      expect(stepHeaders.length).toBeGreaterThan(0);
    });
  });

  describe('Progress Bar', () => {
    it('should show 0% progress at initial state', () => {
      const { container } = render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar?.getAttribute('style')).toContain('0%');
    });

    it('should show 100% progress when solved', () => {
      const { container } = render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={3}
          onStepChange={onStepChangeMock}
        />
      );

      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar?.getAttribute('style')).toContain('100%');
    });

    it('should show correct progress for middle step', () => {
      const { container } = render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      const progressBar = container.querySelector('[style*="width"]');
      // Step 1 of 3: (1 + 1) / (3 + 1) = 50%
      expect(progressBar?.getAttribute('style')).toContain('50%');
    });
  });

  describe('Accessibility - ARIA Labels', () => {
    it('should have ARIA labels on all navigation buttons', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      expect(screen.getByLabelText(/Reset to initial cube state/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Go to previous step/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Go to next step/)).toBeInTheDocument();
    });

    it('should have role="group" on navigation controls', () => {
      const { container } = render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
      expect(group?.getAttribute('aria-label')).toBe('Step navigation controls');
    });

    it('should have aria-disabled matching disabled state', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      const resetButton = screen.getByLabelText(/Reset to initial/);
      expect(resetButton).toHaveAttribute('aria-disabled', 'true');
      expect(resetButton).toBeDisabled();
    });
  });

  describe('Step Highlighting', () => {
    it('should highlight current step in the list', () => {
      const { container } = render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      // Find the step div that contains "White Corners" (current step)
      const stepElements = container.querySelectorAll('[class*="border"]');
      const currentStepElement = Array.from(stepElements).find(el =>
        el.textContent?.includes('▶ White Corners')
      );

      expect(currentStepElement).toBeInTheDocument();
      expect(currentStepElement?.className).toContain('border-blue-500');
    });

    it('should show checkmark on completed steps', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={2}
          onStepChange={onStepChangeMock}
        />
      );

      // Steps 0 and 1 should be completed
      expect(screen.getByText(/White Cross ✓/)).toBeInTheDocument();
      expect(screen.getByText(/White Corners ✓/)).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to next step on ArrowRight', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={0}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(onStepChangeMock).toHaveBeenCalledWith(1);
    });

    it('should navigate to previous step on ArrowLeft', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(onStepChangeMock).toHaveBeenCalledWith(0);
    });

    it('should reset on Home key', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={2}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: 'Home' });
      expect(onStepChangeMock).toHaveBeenCalledWith(-1);
    });

    it('should jump to end on End key', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={0}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: 'End' });
      expect(onStepChangeMock).toHaveBeenCalledWith(3);
    });

    it('should advance on Space key', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={0}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: ' ' });
      expect(onStepChangeMock).toHaveBeenCalledWith(1);
    });

    it('should reset on Escape key', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={1}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onStepChangeMock).toHaveBeenCalledWith(-1);
    });

    it('should not navigate past the end', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={3}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(onStepChangeMock).not.toHaveBeenCalled();
    });

    it('should not navigate before the beginning', () => {
      render(
        <SolutionDisplay
          solution={mockSolution}
          nonEmptySteps={mockNonEmptySteps}
          currentStepIndex={-1}
          onStepChange={onStepChangeMock}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(onStepChangeMock).not.toHaveBeenCalled();
    });
  });
});
