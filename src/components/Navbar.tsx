/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Trophy, HelpCircle, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  onNewGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenRules: () => void;
  onOpenDifficulty: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewGame,
  onOpenLeaderboard,
  onOpenRules,
  onOpenDifficulty,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900 border-b border-slate-800 text-white">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
          連連看大冒險
        </span>
        <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
          經典消除益智
        </span>
      </div>

      {/* Zone 2: Clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={onOpenDifficulty}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span>難度設定</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>榮譽榜單</span>
        </button>

        <button
          onClick={onOpenRules}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-sky-400" />
          <span>玩法規則</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action button + sound toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? '開啟音效' : '靜音'}
          title={isMuted ? '開啟音效' : '靜音'}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>

        {/* Mobile controls dropdown triggers */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={onOpenLeaderboard}
            aria-label="榮譽榜單"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
          </button>
          <button
            onClick={onOpenDifficulty}
            aria-label="難度設定"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
          </button>
        </div>

        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>新的一局</span>
        </button>
      </div>
    </header>
  );
};
