/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { BoardMatrix, Position, ThemeId } from '../types/game';

interface GameBoardProps {
  matrix: BoardMatrix;
  selectedPos: Position | null;
  hintPair: { p1: Position; p2: Position } | null;
  activePath: Position[] | null;
  eliminatingIds: Set<string>;
  onTileClick: (pos: Position) => void;
  themeId: ThemeId;
  isPaused: boolean;
  comboFloatingText: { text: string; x: number; y: number } | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  matrix,
  selectedPos,
  hintPair,
  activePath,
  eliminatingIds,
  onTileClick,
  themeId,
  isPaused,
  comboFloatingText,
}) => {
  const totalRows = matrix.length;
  const totalCols = matrix[0]?.length || 0;

  // Build SVG polyline points string from activePath
  const polylinePoints = useMemo(() => {
    if (!activePath || activePath.length < 2) return '';
    return activePath
      .map((p) => {
        const x = ((p.c + 0.5) / totalCols) * 100;
        const y = ((p.r + 0.5) / totalRows) * 100;
        return `${x},${y}`;
      })
      .join(' ');
  }, [activePath, totalRows, totalCols]);

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      {/* Board Arena Outer Container */}
      <div className="relative p-2 sm:p-4 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Subtle Felt/Board Texture Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* The Grid Container including buffer border cells */}
        <div
          className="relative grid gap-1 sm:gap-1.5"
          style={{
            gridTemplateRows: `repeat(${totalRows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
          }}
        >
          {matrix.map((row, rIdx) =>
            row.map((tile, cIdx) => {
              const isBorder =
                rIdx === 0 ||
                rIdx === totalRows - 1 ||
                cIdx === 0 ||
                cIdx === totalCols - 1;

              const isSelected =
                selectedPos?.r === rIdx && selectedPos?.c === cIdx;

              const isHinted =
                (hintPair?.p1.r === rIdx && hintPair?.p1.c === cIdx) ||
                (hintPair?.p2.r === rIdx && hintPair?.p2.c === cIdx);

              const isEliminating = Boolean(tile && eliminatingIds.has(tile.id));

              // Empty or border cell
              if (!tile || isBorder) {
                return (
                  <div
                    key={`empty_${rIdx}_${cIdx}`}
                    className="aspect-square flex items-center justify-center pointer-events-none"
                  />
                );
              }

              // Active tile button
              return (
                <button
                  key={tile.id}
                  onClick={() => onTileClick({ r: rIdx, c: cIdx })}
                  disabled={isPaused || isEliminating}
                  aria-label={tile.label}
                  title={tile.label}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-xl transition-all duration-150 cursor-pointer ${
                    isEliminating
                      ? 'scale-110 opacity-0 bg-emerald-400 text-white shadow-lg shadow-emerald-500/50'
                      : isSelected
                      ? 'scale-105 ring-3 sm:ring-4 ring-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/30'
                      : isHinted
                      ? 'ring-3 ring-sky-400 bg-sky-500/20 animate-pulse'
                      : themeId === 'mahjong'
                      ? 'bg-amber-50 hover:bg-white text-slate-900 border-b-2 border-r-2 border-amber-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-0.5'
                      : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/80 shadow-md hover:-translate-y-0.5 hover:border-slate-500'
                  }`}
                >
                  {/* Tile Icon / Symbol */}
                  <span
                    className={`leading-none filter drop-shadow-sm transition-transform ${
                      themeId === 'mahjong'
                        ? 'text-2xl sm:text-3xl font-serif text-slate-900'
                        : 'text-2xl sm:text-3xl md:text-4xl'
                    }`}
                  >
                    {tile.value}
                  </span>

                  {/* Micro label for clarity on hover/mobile */}
                  <span
                    className={`hidden sm:inline-block text-[9px] sm:text-[10px] leading-tight truncate px-1 max-w-full ${
                      themeId === 'mahjong' ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {tile.label}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* SVG Overlay for Connection Energy Polyline */}
        {polylinePoints && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Glow Line */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#laser-glow)"
              opacity="0.8"
            />

            {/* Core White-Hot Line */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {/* Floating Combo Flying Text Overlay */}
        {comboFloatingText && (
          <div
            className="absolute pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2 animate-float-fade font-bold text-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)] text-lg sm:text-xl font-mono whitespace-nowrap"
            style={{
              left: `${comboFloatingText.x}%`,
              top: `${comboFloatingText.y}%`,
            }}
          >
            {comboFloatingText.text}
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-2">遊戲已暫停</h3>
            <p className="text-sm text-slate-400 mb-4">點擊下方按鈕或右上角繼續遊戲</p>
          </div>
        )}
      </div>
    </div>
  );
};
