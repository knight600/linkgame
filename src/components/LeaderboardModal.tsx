/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, X, Trash2, Award, Star, Flame, Clock } from 'lucide-react';
import { DifficultyId, ScoreRecord } from '../types/game';
import { clearHighScores, getHighScores, getStats } from '../utils/storage';
import { DIFFICULTIES } from '../utils/onetLogic';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDifficulty: DifficultyId;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  activeDifficulty,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyId | 'all'>(activeDifficulty);
  const [scores, setScores] = useState<ScoreRecord[]>(getHighScores());
  const [stats, setStats] = useState(getStats());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const filteredScores = scores.filter((s) =>
    filterDifficulty === 'all' ? true : s.difficulty === filterDifficulty
  );

  const handleClear = () => {
    clearHighScores();
    setScores([]);
    setStats(getStats());
    setShowClearConfirm(false);
  };

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">玩家最高分榮譽榜</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Stats Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 text-center">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">總遊玩次數</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">{stats.gamesPlayed}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">通關勝率</div>
            <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">{winRate}%</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">生涯最高分</div>
            <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {stats.highestScore.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">最高連擊</div>
            <div className="text-lg font-bold font-mono text-rose-400 tabular-nums flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-rose-400" />
              {stats.bestCombo}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-lg">
            <button
              onClick={() => setFilterDifficulty('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterDifficulty === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              全部難度
            </button>
            {(Object.keys(DIFFICULTIES) as DifficultyId[]).map((dId) => (
              <button
                key={dId}
                onClick={() => setFilterDifficulty(dId)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterDifficulty === dId
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {DIFFICULTIES[dId].label.split(' ')[0]}
              </button>
            ))}
          </div>

          {scores.length > 0 && !showClearConfirm && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空記錄</span>
            </button>
          )}

          {showClearConfirm && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-300">確定清空所有記錄？</span>
              <button
                onClick={handleClear}
                className="px-2 py-0.5 text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded cursor-pointer"
              >
                確定
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-0.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded cursor-pointer"
              >
                取消
              </button>
            </div>
          )}
        </div>

        {/* Records Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredScores.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">尚無該難度的紀錄，快去挑戰一局吧！</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-medium">
                  <th className="py-2 px-2 text-center w-12">排名</th>
                  <th className="py-2 px-3">難度</th>
                  <th className="py-2 px-3 text-right">得分</th>
                  <th className="py-2 px-3 text-center">通關耗時</th>
                  <th className="py-2 px-3 text-center">最高連擊</th>
                  <th className="py-2 px-3 text-center">評星</th>
                  <th className="py-2 px-3 text-right">達成時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredScores.map((record, index) => {
                  const mins = Math.floor(record.clearTimeSec / 60);
                  const secs = record.clearTimeSec % 60;
                  const timeStr = `${mins}分${secs}秒`;
                  const dateStr = new Date(record.timestamp).toLocaleDateString('zh-TW', {
                    month: 'numeric',
                    day: 'numeric',
                  });

                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        index === 0 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-2.5 px-2 text-center font-bold">
                        {index === 0 ? (
                          <span className="text-amber-400 font-bold">🥇 1</span>
                        ) : index === 1 ? (
                          <span className="text-slate-300 font-bold">🥈 2</span>
                        ) : index === 2 ? (
                          <span className="text-amber-600 font-bold">🥉 3</span>
                        ) : (
                          <span className="text-slate-500 tabular-nums">{index + 1}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                        {DIFFICULTIES[record.difficulty]?.label.split(' ')[0] || record.difficulty}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400 tabular-nums">
                        {record.score.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-300 tabular-nums">
                        <span className="inline-flex items-center gap-1 font-sans">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {timeStr}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-rose-300 tabular-nums">
                        {record.maxCombo > 1 ? `${record.maxCombo}x` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-0.5 text-amber-400">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < record.stars ? 'fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 font-sans">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
