'use client'

import { CubeState, Face, Color } from '@/lib/solver';
import { useState, useEffect } from 'react';

interface Cube2DProps {
  state: CubeState | Readonly<CubeState>;
}

export function Cube2D({ state }: Cube2DProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trigger transition animation when state changes
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`inline-block transition-all duration-300 ${
          isTransitioning ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        {/* Cube Net Layout:
                [U]
            [L] [F] [R]
                [D]
                [B]
        */}
        <div className="grid gap-1">
          {/* Row 1: U face */}
          <div className="grid grid-cols-12 gap-1">
            <div className="col-start-5 col-span-4">
              <FaceGrid face="U" colors={state.U} label="U" />
            </div>
          </div>

          {/* Row 2: L F R B faces */}
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-4">
              <FaceGrid face="L" colors={state.L} label="L" />
            </div>
            <div className="col-span-4">
              <FaceGrid face="F" colors={state.F} label="F" />
            </div>
            <div className="col-span-4">
              <FaceGrid face="R" colors={state.R} label="R" />
            </div>
          </div>

          {/* Row 3: D face */}
          <div className="grid grid-cols-12 gap-1">
            <div className="col-start-5 col-span-4">
              <FaceGrid face="D" colors={state.D} label="D" />
            </div>
          </div>

          {/* Row 4: B face (offset to the right for clarity) */}
          <div className="grid grid-cols-12 gap-1">
            <div className="col-start-5 col-span-4">
              <FaceGrid face="B" colors={state.B} label="B" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FaceGridProps {
  face: Face;
  colors: readonly Color[];
  label: string;
}

function FaceGrid({ face, colors, label }: FaceGridProps) {
  return (
    <div className="relative">
      {/* Face Label */}
      <div className="absolute -top-6 left-0 right-0 text-center text-sm font-bold text-gray-600 dark:text-gray-400">
        {label}
      </div>

      {/* 3x3 Grid of Stickers */}
      <div className="grid grid-cols-3 gap-0.5 bg-gray-800 dark:bg-gray-600 p-1 rounded">
        {colors.map((color, i) => (
          <Sticker key={`${face}-${i}`} color={color} index={i} />
        ))}
      </div>
    </div>
  );
}

interface StickerProps {
  color: Color;
  index: number;
}

// Color map for cube faces (defined at module level to avoid recreating on every render)
const COLOR_MAP: Record<Color, string> = {
  W: 'bg-white border-gray-300',
  Y: 'bg-yellow-400 border-yellow-600',
  R: 'bg-red-500 border-red-700',
  O: 'bg-orange-500 border-orange-700',
  B: 'bg-blue-500 border-blue-700',
  G: 'bg-green-500 border-green-700',
};

function Sticker({ color, index }: StickerProps) {
  const colorClass = COLOR_MAP[color];
  const isCenter = index === 4;

  return (
    <div
      className={`
        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
        ${colorClass}
        border-2
        ${isCenter ? 'ring-2 ring-gray-900 ring-inset' : ''}
        transition-all
        rounded-sm
      `}
      title={`${color} (${index})`}
    />
  );
}
