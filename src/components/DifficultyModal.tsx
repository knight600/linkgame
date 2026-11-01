/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, SlidersHorizontal, Check, Zap, Clock, ShieldCheck, Palette } from 'lucide-react';
import { DifficultyId, ThemeId } from '../types/game';
import { DIFFICULTIES, THEMES } from '../utils/onetLogic';

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDifficulty: DifficultyId;
  onSelectDifficulty: (id: DifficultyId) => void;
  selectedTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  onStartNewGame: (dId?: DifficultyId, tId?: ThemeId) => void;
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  isOpen,
  onClose,
  selectedDifficulty,
  onSelectDifficulty,
  selectedTheme,
  onSelectTheme,
  onStartNewGame,
}) => {
  if (!isOpen) return null;

  const handleStart = () => {
    onStartNewGame(selectedDifficulty, selectedTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">自訂難度與主題</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section 1: Difficulty Selection */}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>選擇挑戰難度</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(DIFFICULTIES) as DifficultyId[]).map((dId) => {
                const conf = DIFFICULTIES[dId];
                const isSelected = selectedDifficulty === dId;

                return (
                  <button
                    key={dId}
                    onClick={() => onSelectDifficulty(dId)}
                    className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">
                          {conf.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{conf.description}</p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {conf.timeLimitSec} 秒
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{conf.rows * conf.cols} 個方塊</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="font-semibold text-emerald-400 font-mono">
                        {conf.multiplier}x 獎勵
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Tile Theme Selection */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-sky-400" />
              <span>方塊圖案風格</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                const theme = THEMES[tId];
                const isSelected = selectedTheme === tId;

                return (
                  <button
                    key={tId}
                    onClick={() => onSelectTheme(tId)}
                    className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-2xl mb-1">{theme.icon}</div>
                    <div className="text-xs font-bold text-white mb-1.5">{theme.label}</div>
                    <div className="flex items-center justify-center gap-1 text-xs opacity-75">
                      {theme.tiles.slice(0, 3).map((item, idx) => (
                        <span key={idx}>{item}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            切換難度或主題將以新設定開始新遊戲
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleStart}
              className="px-5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              套用並開局
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
