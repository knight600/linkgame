/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DifficultyId = 'easy' | 'normal' | 'hard' | 'master';

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  description: string;
  rows: number; // inner game board rows
  cols: number; // inner game board cols
  uniqueTiles: number; // number of distinct tile types to use
  timeLimitSec: number;
  initialHints: number;
  initialShuffles: number;
  multiplier: number;
}

export type ThemeId = 'fruits' | 'animals' | 'mahjong' | 'rpg';

export interface TileTheme {
  id: ThemeId;
  label: string;
  icon: string;
  tiles: string[]; // List of emojis or character representations
  tileNames: string[];
}

export interface Position {
  r: number; // row index in padded matrix (0 .. rows+1)
  c: number; // col index in padded matrix (0 .. cols+1)
}

export interface TileItem {
  id: string; // unique id per tile instance
  typeId: number; // numeric type identifying the tile character
  value: string; // symbol or emoji
  label: string; // localized name
}

export type BoardMatrix = (TileItem | null)[][];

export interface PathResult {
  canConnect: boolean;
  bends: number; // 0, 1, or 2
  path: Position[]; // Sequence of grid coordinates from start to end
}

export interface ScoreRecord {
  id: string;
  difficulty: DifficultyId;
  score: number;
  clearTimeSec: number;
  maxCombo: number;
  stars: number;
  timestamp: number;
  themeId: ThemeId;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestCombo: number;
  highestScore: number;
}
