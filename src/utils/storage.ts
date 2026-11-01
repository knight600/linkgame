/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DifficultyId, GameStats, ScoreRecord, ThemeId } from '../types/game';

const HIGH_SCORES_KEY = 'onet_lianliankan_high_scores';
const STATS_KEY = 'onet_lianliankan_stats';

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalScore: 0,
  bestCombo: 0,
  highestScore: 0,
};

export function getHighScores(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(HIGH_SCORES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHighScore(record: Omit<ScoreRecord, 'id' | 'timestamp'>): {
  isNewBest: boolean;
  savedRecord: ScoreRecord;
} {
  const current = getHighScores();
  const difficultyRecords = current.filter((r) => r.difficulty === record.difficulty);
  const prevBest = difficultyRecords.length > 0 ? Math.max(...difficultyRecords.map((r) => r.score)) : 0;

  const newRecord: ScoreRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  const updated = [...current, newRecord]
    .sort((a, b) => b.score - a.score)
    .slice(0, 50); // Keep top 50 scores overall

  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save high scores to localStorage', e);
  }

  // Update overall stats
  updateStatsOnGameEnd(true, record.score, record.maxCombo);

  return {
    isNewBest: record.score > prevBest,
    savedRecord: newRecord,
  };
}

export function clearHighScores(): void {
  try {
    localStorage.removeItem(HIGH_SCORES_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function getStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function updateStatsOnGameStart(): void {
  try {
    const stats = getStats();
    stats.gamesPlayed += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error(e);
  }
}

export function updateStatsOnGameEnd(won: boolean, score: number, combo: number): void {
  try {
    const stats = getStats();
    if (won) {
      stats.gamesWon += 1;
    }
    stats.totalScore += score;
    if (score > stats.highestScore) {
      stats.highestScore = score;
    }
    if (combo > stats.bestCombo) {
      stats.bestCombo = combo;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error(e);
  }
}
