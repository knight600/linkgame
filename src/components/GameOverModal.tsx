/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, SlidersHorizontal, Star, Flame, Clock, Zap, AlertTriangle } from 'lucide-react';
import { DifficultyConfig } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  isVictory: boolean;
  score: number;
  baseScore: number;
  comboBonus: number;
  timeBonus: number;
  maxCombo: number;
  timeLeft: number;
  clearTimeSec: number;
  stars: number;
  isNewBest: boolean;
  difficulty: DifficultyConfig;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onOpenDifficulty: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isVictory,
  score,
  baseScore,
  comboBonus,
  timeBonus,
  maxCombo,
  timeLeft,
  clearTimeSec,
  stars,
  isNewBest,
  difficulty,
  onPlayAgain,
  onOpenLeaderboard,
  onOpenDifficulty,
}) => {
  useEffect(() => {
    if (isOpen && isVictory) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34d399', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, isVictory]);

  if (!isOpen) return null;

  const mins = Math.floor(clearTimeSec / 60);
  const secs = clearTimeSec % 60;
  const timeFormatted = `${mins}分${secs}秒`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-center">
        {/* Glow Header */}
        <div className="mb-4">
          {isVictory ? (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3 shadow-lg shadow-emerald-500/20 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-3 shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mb-1">
            {isVictory ? '太棒了，完美通關！' : '時間耗盡，挑戰結束！'}
          </h2>
          <p className="text-xs text-slate-400">
            {isVictory
              ? `成功清空 ${difficulty.label} 所有方塊！`
              : '別灰心，重新調整節奏再次挑戰吧！'}
          </p>
        </div>

        {/* Stars Rating (if victory) */}
        {isVictory && (
          <div className="flex items-center justify-center gap-2 mb-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`w-7 h-7 transition-all ${
                  i < stars
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* New Best High Score Banner */}
        {isNewBest && (
          <div className="mb-4 py-2 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>恭喜刷新本難度歷史最高分！已寫入榮譽榜</span>
          </div>
        )}

        {/* Score and Stats Breakdown Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-baseline justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">最終得分</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-500" />
                基礎消除得分
              </span>
              <span className="font-mono text-slate-200 tabular-nums">+{baseScore}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                連擊獎勵 ({maxCombo}x 最高連擊)
              </span>
              <span className="font-mono text-amber-400 tabular-nums">+{comboBonus}</span>
            </div>

            {isVictory && (
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  剩餘時間獎勵 ({timeLeft}秒 × {difficulty.multiplier}x)
                </span>
                <span className="font-mono text-sky-400 tabular-nums">+{timeBonus}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800/80">
              <span>遊戲耗時</span>
              <span className="font-mono text-slate-300 tabular-nums">{timeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Primary and Secondary Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再玩一局</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>榮譽榜單</span>
            </button>

            <button
              onClick={onOpenDifficulty}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>切換難度</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
