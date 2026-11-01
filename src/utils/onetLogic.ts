/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DifficultyConfig,
  DifficultyId,
  PathResult,
  Position,
  TileItem,
  TileTheme,
  ThemeId,
  BoardMatrix,
} from '../types/game';

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: '休閒輕鬆 (6×8)',
    description: '48 個方塊，種類適中，充裕時間，適合放鬆遊玩',
    rows: 6,
    cols: 8,
    uniqueTiles: 8,
    timeLimitSec: 180,
    initialHints: 5,
    initialShuffles: 5,
    multiplier: 1.0,
  },
  normal: {
    id: 'normal',
    label: '標準挑戰 (8×10)',
    description: '80 個方塊，考驗眼力與節奏，經典暢玩規格',
    rows: 8,
    cols: 10,
    uniqueTiles: 12,
    timeLimitSec: 150,
    initialHints: 3,
    initialShuffles: 3,
    multiplier: 1.5,
  },
  hard: {
    id: 'hard',
    label: '高難進階 (8×12)',
    description: '96 個方塊，高密度盤面，速度與專注的極限考驗',
    rows: 8,
    cols: 12,
    uniqueTiles: 16,
    timeLimitSec: 120,
    initialHints: 2,
    initialShuffles: 2,
    multiplier: 2.0,
  },
  master: {
    id: 'master',
    label: '大師極限 (10×14)',
    description: '140 個方塊，超大盤面，專為連連看達人打造',
    rows: 10,
    cols: 14,
    uniqueTiles: 20,
    timeLimitSec: 100,
    initialHints: 1,
    initialShuffles: 1,
    multiplier: 3.0,
  },
};

export const THEMES: Record<ThemeId, TileTheme> = {
  fruits: {
    id: 'fruits',
    label: '水果美味',
    icon: '🍎',
    tiles: [
      '🍎', '🍓', '🍌', '🍉', '🍇', '🍊', '🍋', '🍍',
      '🥝', '🍑', '🍒', '🫐', '🥑', '🥥', '🥭', '🍐',
      '🌽', '🍦', '🍰', '🍩'
    ],
    tileNames: [
      '蘋果', '草莓', '香蕉', '西瓜', '葡萄', '橘子', '檸檬', '鳳梨',
      '奇異果', '桃子', '櫻桃', '藍莓', '酪梨', '椰子', '芒果', '梨子',
      '玉米', '霜淇淋', '蛋糕', '甜甜圈'
    ],
  },
  animals: {
    id: 'animals',
    label: '可愛動物',
    icon: '🐱',
    tiles: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐧',
      '🦉', '🦄', '🐝', '🦋'
    ],
    tileNames: [
      '小狗', '小貓', '小鼠', '倉鼠', '兔子', '狐狸', '棕熊', '熊貓',
      '無尾熊', '老虎', '獅子', '乳牛', '小豬', '青蛙', '小猴', '企鵝',
      '貓頭鷹', '獨角獸', '蜜蜂', '蝴蝶'
    ],
  },
  mahjong: {
    id: 'mahjong',
    label: '經典麻將',
    icon: '🀄',
    tiles: [
      '🀄', '🀅', '🀆', '🀙', '🀚', '🀛', '🀜', '🀝',
      '🀞', '🀟', '🀠', '🀡', '🀐', '🀑', '🀒', '🀓',
      '🀔', '🀕', '🀖', '🀗'
    ],
    tileNames: [
      '紅中', '發財', '白板', '一筒', '二筒', '三筒', '四筒', '五筒',
      '六筒', '七筒', '八筒', '九筒', '一條', '二條', '三條', '四條',
      '五條', '六條', '七條', '八條'
    ],
  },
  rpg: {
    id: 'rpg',
    label: '世界冒險',
    icon: '⚔️',
    tiles: [
      '⚔️', '🛡️', '🏹', '🔮', '💎', '👑', '🗝️', '🧪',
      '🪙', '🧭', '📜', '🏆', '🕯️', '💣', '⚓', '🚀',
      '🪐', '⚡', '🌟', '🍄'
    ],
    tileNames: [
      '聖劍', '圓盾', '戰弓', '水晶球', '紅寶石', '皇冠', '鑰匙', '藥水',
      '金幣', '指南針', '羊皮卷', '獎盃', '蠟燭', '炸彈', '鐵錨', '火箭',
      '行星', '閃電', '星星', '蘑菇'
    ],
  },
};

/**
 * Checks if straight path between two points is clear (0 bends)
 * p1 and p2 must share either row or column
 */
export function isStraightClear(p1: Position, p2: Position, matrix: BoardMatrix): boolean {
  if (p1.r === p2.r) {
    const minC = Math.min(p1.c, p2.c);
    const maxC = Math.max(p1.c, p2.c);
    for (let c = minC + 1; c < maxC; c++) {
      if (matrix[p1.r][c] !== null) {
        return false;
      }
    }
    return true;
  }

  if (p1.c === p2.c) {
    const minR = Math.min(p1.r, p2.r);
    const maxR = Math.max(p1.r, p2.r);
    for (let r = minR + 1; r < maxR; r++) {
      if (matrix[r][p1.c] !== null) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Checks if two points can connect with exactly 1 bend (L-shape)
 */
export function checkOneBend(p1: Position, p2: Position, matrix: BoardMatrix): Position[] | null {
  // Corner 1: (p1.r, p2.c)
  const c1: Position = { r: p1.r, c: p2.c };
  if (matrix[c1.r][c1.c] === null) {
    if (isStraightClear(p1, c1, matrix) && isStraightClear(c1, p2, matrix)) {
      return [p1, c1, p2];
    }
  }

  // Corner 2: (p2.r, p1.c)
  const c2: Position = { r: p2.r, c: p1.c };
  if (matrix[c2.r][c2.c] === null) {
    if (isStraightClear(p1, c2, matrix) && isStraightClear(c2, p2, matrix)) {
      return [p1, c2, p2];
    }
  }

  return null;
}

/**
 * Checks if two points can connect with at most 2 bends (classic Lianliankan rule)
 * matrix dimensions: (rows+2) x (cols+2) with border cells at r=0, r=rows+1, c=0, c=cols+1
 */
export function checkConnection(p1: Position, p2: Position, matrix: BoardMatrix): PathResult {
  if (p1.r === p2.r && p1.c === p2.c) {
    return { canConnect: false, bends: -1, path: [] };
  }

  const t1 = matrix[p1.r][p1.c];
  const t2 = matrix[p2.r][p2.c];

  if (!t1 || !t2 || t1.typeId !== t2.typeId) {
    return { canConnect: false, bends: -1, path: [] };
  }

  const totalRows = matrix.length;
  const totalCols = matrix[0].length;

  // 1. Check 0 Bends (Straight line)
  if ((p1.r === p2.r || p1.c === p2.c) && isStraightClear(p1, p2, matrix)) {
    return { canConnect: true, bends: 0, path: [p1, p2] };
  }

  // 2. Check 1 Bend (L-shape)
  const oneBendPath = checkOneBend(p1, p2, matrix);
  if (oneBendPath) {
    return { canConnect: true, bends: 1, path: oneBendPath };
  }

  // 3. Check 2 Bends (Z-shape, U-shape, or boundary loop)
  // Raycast horizontally from p1 to find all empty intermediate points k, then check 1-bend to p2
  // Scan Left
  for (let c = p1.c - 1; c >= 0; c--) {
    if (matrix[p1.r][c] !== null) break;
    const k: Position = { r: p1.r, c };
    const rest = checkOneBend(k, p2, matrix);
    if (rest) {
      return { canConnect: true, bends: 2, path: [p1, k, rest[1], p2] };
    }
  }

  // Scan Right
  for (let c = p1.c + 1; c < totalCols; c++) {
    if (matrix[p1.r][c] !== null) break;
    const k: Position = { r: p1.r, c };
    const rest = checkOneBend(k, p2, matrix);
    if (rest) {
      return { canConnect: true, bends: 2, path: [p1, k, rest[1], p2] };
    }
  }

  // Scan Up
  for (let r = p1.r - 1; r >= 0; r--) {
    if (matrix[r][p1.c] !== null) break;
    const k: Position = { r, c: p1.c };
    const rest = checkOneBend(k, p2, matrix);
    if (rest) {
      return { canConnect: true, bends: 2, path: [p1, k, rest[1], p2] };
    }
  }

  // Scan Down
  for (let r = p1.r + 1; r < totalRows; r++) {
    if (matrix[r][p1.c] !== null) break;
    const k: Position = { r, c: p1.c };
    const rest = checkOneBend(k, p2, matrix);
    if (rest) {
      return { canConnect: true, bends: 2, path: [p1, k, rest[1], p2] };
    }
  }

  return { canConnect: false, bends: -1, path: [] };
}

/**
 * Finds any connectable pair on the board (used for Hint and Deadlock detection)
 */
export function findAnyValidMove(matrix: BoardMatrix): {
  p1: Position;
  p2: Position;
  result: PathResult;
} | null {
  const tiles: { pos: Position; tile: TileItem }[] = [];
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const tile = matrix[r][c];
      if (tile !== null) {
        tiles.push({ pos: { r, c }, tile });
      }
    }
  }

  // Group tiles by typeId for optimal comparison
  const typeMap = new Map<number, { pos: Position; tile: TileItem }[]>();
  for (const item of tiles) {
    if (!typeMap.has(item.tile.typeId)) {
      typeMap.set(item.tile.typeId, []);
    }
    typeMap.get(item.tile.typeId)!.push(item);
  }

  for (const [, group] of typeMap.entries()) {
    if (group.length < 2) continue;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const p1 = group[i].pos;
        const p2 = group[j].pos;
        const res = checkConnection(p1, p2, matrix);
        if (res.canConnect) {
          return { p1, p2, result: res };
        }
      }
    }
  }

  return null;
}

/**
 * Generates an initial board with an guaranteed solvable initial state
 */
export function generateBoard(
  difficulty: DifficultyConfig,
  theme: TileTheme
): BoardMatrix {
  const { rows, cols, uniqueTiles } = difficulty;
  const totalPlayableCells = rows * cols;

  // Make sure total playable cells is even
  if (totalPlayableCells % 2 !== 0) {
    throw new Error('Total playable cells must be even');
  }

  // Pick uniqueTiles from the theme
  const availableTiles = theme.tiles.slice(0, uniqueTiles);
  const availableNames = theme.tileNames.slice(0, uniqueTiles);

  // Distribute pairs equally among available tile types
  const tileItems: TileItem[] = [];
  const pairsNeeded = totalPlayableCells / 2;

  let instanceCounter = 0;
  for (let i = 0; i < pairsNeeded; i++) {
    const typeIdx = i % availableTiles.length;
    const value = availableTiles[typeIdx];
    const label = availableNames[typeIdx];

    // Push pair
    tileItems.push({
      id: `tile_${instanceCounter++}`,
      typeId: typeIdx,
      value,
      label,
    });
    tileItems.push({
      id: `tile_${instanceCounter++}`,
      typeId: typeIdx,
      value,
      label,
    });
  }

  // Matrix with 1 cell border around: (rows + 2) x (cols + 2)
  let matrix: BoardMatrix = createEmptyMatrix(rows + 2, cols + 2);
  let attempts = 0;

  do {
    // Shuffle array
    shuffleArray(tileItems);

    matrix = createEmptyMatrix(rows + 2, cols + 2);
    let idx = 0;
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        matrix[r][c] = tileItems[idx++];
      }
    }

    attempts++;
    // Verify that at least one valid move exists
    if (findAnyValidMove(matrix) !== null) {
      break;
    }
  } while (attempts < 50);

  return matrix;
}

/**
 * Reshuffle remaining tiles on the board, ensuring at least one connectable pair
 */
export function shuffleBoard(matrix: BoardMatrix): BoardMatrix {
  const totalRows = matrix.length;
  const totalCols = matrix[0].length;

  // Collect all existing tiles and their positions
  const positions: Position[] = [];
  const tiles: TileItem[] = [];

  for (let r = 1; r < totalRows - 1; r++) {
    for (let c = 1; c < totalCols - 1; c++) {
      if (matrix[r][c] !== null) {
        positions.push({ r, c });
        tiles.push(matrix[r][c]!);
      }
    }
  }

  if (tiles.length <= 2) {
    return matrix;
  }

  const newMatrix = cloneMatrix(matrix);
  let attempts = 0;

  do {
    shuffleArray(tiles);
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      newMatrix[pos.r][pos.c] = tiles[i];
    }
    attempts++;
    if (findAnyValidMove(newMatrix) !== null) {
      break;
    }
  } while (attempts < 50);

  return newMatrix;
}

/**
 * Count remaining tiles
 */
export function countRemainingTiles(matrix: BoardMatrix): number {
  let count = 0;
  for (let r = 1; r < matrix.length - 1; r++) {
    for (let c = 1; c < matrix[0].length - 1; c++) {
      if (matrix[r][c] !== null) {
        count++;
      }
    }
  }
  return count;
}

// Utility Helpers
function createEmptyMatrix(rows: number, cols: number): BoardMatrix {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

export function cloneMatrix(matrix: BoardMatrix): BoardMatrix {
  return matrix.map((row) => [...row]);
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
