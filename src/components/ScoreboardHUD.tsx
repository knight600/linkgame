/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Shuffle, Pause, Play, Clock, Flame } from 'lucide-react';
import { DifficultyConfig } from '../types/game';

interface ScoreboardHUDProps {
  difficulty: DifficultyConfig;
  score: number;
  combo: number;
  timeLeft: number;
  remainingPairs: number;
  hintsLeft: number;
  shufflesLeft: number;
  isPaused: boolean;
  onUseHint: () => void;
  onUseShuffle: () => void;
  onTogglePause: () => void;
  highScoreForDifficulty: number;
}

export const ScoreboardHUD: React.FC<ScoreboardHUDProps> = ({
  difficulty,
  score,
  combo,
  timeLeft,
  remainingPairs,
  hintsLeft,
  shufflesLeft,
  isPaused,
  onUseHint,
  onUseShuffle,
  onTogglePause,
  highScoreForDifficulty,
}) => {
  const percentage = Math.max(0, Math.min(100, (timeLeft / difficulty.timeLimitSec) * 100));
  const isUrgent = timeLeft <= 20;

  // Format time MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="w-full max-w-5xl mx-auto mb-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-xl">
      {/* Top row: Metrics and Information */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        {/* Left: Score & High score */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">當前得分</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white flex items-baseline gap-2">
              <span>{score.toLocaleString()}</span>
              {combo > 1 && (
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-0.5 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {combo} 連擊 (x{(1 + (combo - 1) * 0.5).toFixed(1)})
                </span>
              )}
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">本難度最高分</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-slate-400">
              {highScoreForDifficulty.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Center: Metadata without pills */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-200">{difficulty.label.split(' ')[0]}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>剩餘對數: <strong className="font-mono text-white">{remainingPairs}</strong></span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>得分加成: <strong className="font-mono text-emerald-400">{difficulty.multiplier}x</strong></span>
        </div>

        {/* Right: Action Buttons (Hint, Shuffle, Pause) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUseHint}
            disabled={hintsLeft <= 0 || isPaused}
            title={`使用提示（剩餘 ${hintsLeft} 次）`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              hintsLeft > 0 && !isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed opacity-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>提示 ({hintsLeft})</span>
          </button>

          <button
            onClick={onUseShuffle}
            disabled={shufflesLeft <= 0 || isPaused}
            title={`重新洗牌（剩餘 ${shufflesLeft} 次）`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              shufflesLeft > 0 && !isPaused
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30'
                : 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed opacity-50'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span>洗牌 ({shufflesLeft})</span>
          </button>

          <button
            onClick={onTogglePause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isPaused ? '繼續' : '暫停'}</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Time Progress bar */}
      <div className="mt-3 flex items-center gap-3">
        <Clock className={`w-4 h-4 shrink-0 ${isUrgent ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
        <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isUrgent
                ? 'bg-rose-500 animate-pulse'
                : percentage > 50
                ? 'bg-emerald-400'
                : 'bg-amber-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span
          className={`font-mono text-xs font-bold tabular-nums min-w-[42px] text-right ${
            isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-300'
          }`}
        >
          {timeFormatted}
        </span>
      </div>
    </div>
  );
};
