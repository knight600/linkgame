/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  DifficultyConfig,
  DifficultyId,
  Position,
  ThemeId,
  BoardMatrix,
} from './types/game';
import {
  DIFFICULTIES,
  THEMES,
  generateBoard,
  checkConnection,
  findAnyValidMove,
  shuffleBoard,
  countRemainingTiles,
} from './utils/onetLogic';
import { soundManager } from './utils/audio';
import {
  getHighScores,
  saveHighScore,
  updateStatsOnGameStart,
  updateStatsOnGameEnd,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { ScoreboardHUD } from './components/ScoreboardHUD';
import { GameBoard } from './components/GameBoard';
import { LeaderboardModal } from './components/LeaderboardModal';
import { RulesModal } from './components/RulesModal';
import { DifficultyModal } from './components/DifficultyModal';
import { GameOverModal } from './components/GameOverModal';
import { RefreshCw, Sparkles, Shuffle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Game Configuration State
  const [difficultyId, setDifficultyId] = useState<DifficultyId>('easy');
  const [themeId, setThemeId] = useState<ThemeId>('fruits');
  const difficulty = DIFFICULTIES[difficultyId];
  const theme = THEMES[themeId];

  // Game Board & Logic State
  const [matrix, setMatrix] = useState<BoardMatrix>(() => generateBoard(difficulty, theme));
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [hintPair, setHintPair] = useState<{ p1: Position; p2: Position } | null>(null);
  const [activePath, setActivePath] = useState<Position[] | null>(null);
  const [eliminatingIds, setEliminatingIds] = useState<Set<string>>(new Set());

  // Metrics & Progression State
  const [score, setScore] = useState<number>(0);
  const [baseScore, setBaseScore] = useState<number>(0);
  const [comboBonus, setComboBonus] = useState<number>(0);
  const [timeBonus, setTimeBonus] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lastMatchTime, setLastMatchTime] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<number>(difficulty.timeLimitSec);
  const [hintsLeft, setHintsLeft] = useState<number>(difficulty.initialHints);
  const [shufflesLeft, setShufflesLeft] = useState<number>(difficulty.initialShuffles);

  // Status & Control State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);
  const [autoShuffleMessage, setAutoShuffleMessage] = useState<string | null>(null);

  // Floating combo text state
  const [comboFloatingText, setComboFloatingText] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  // Audio preference
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState<boolean>(false);

  // Time remaining ref to avoid interval closure capture issues
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  // Highest score for current difficulty
  const currentHighScores = getHighScores().filter((s) => s.difficulty === difficultyId);
  const highScoreForDifficulty = currentHighScores.length > 0 ? Math.max(...currentHighScores.map((s) => s.score)) : 0;

  // Initialize a new game
  const startNewGame = useCallback(
    (newDiffId?: DifficultyId, newThemeId?: ThemeId) => {
      const activeDiff = newDiffId ? DIFFICULTIES[newDiffId] : difficulty;
      const activeTheme = newThemeId ? THEMES[newThemeId] : theme;

      if (newDiffId) setDifficultyId(newDiffId);
      if (newThemeId) setThemeId(newThemeId);

      const newBoard = generateBoard(activeDiff, activeTheme);
      setMatrix(newBoard);
      setSelectedPos(null);
      setHintPair(null);
      setActivePath(null);
      setEliminatingIds(new Set());

      setScore(0);
      setBaseScore(0);
      setComboBonus(0);
      setTimeBonus(0);
      setCombo(0);
      setMaxCombo(0);
      setLastMatchTime(0);

      setTimeLeft(activeDiff.timeLimitSec);
      setHintsLeft(activeDiff.initialHints);
      setShufflesLeft(activeDiff.initialShuffles);

      setIsPaused(false);
      setIsVictory(false);
      setIsGameOverModalOpen(false);
      setIsNewBest(false);
      setStars(0);
      setAutoShuffleMessage(null);
      setComboFloatingText(null);

      updateStatsOnGameStart();
    },
    [difficulty, theme]
  );

  // Audio toggle
  const handleToggleMute = () => {
    const updated = soundManager.toggleMute();
    setIsMuted(updated);
  };

  // Timer loop
  useEffect(() => {
    if (isPaused || isGameOverModalOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up - Game Over
          handleDefeat();
          return 0;
        }

        // Ticking warning blip when under 15 seconds
        if (prev <= 15 && prev % 2 === 0) {
          soundManager.playTimeWarning();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isGameOverModalOpen]);

  // Handle Defeat
  const handleDefeat = useCallback(() => {
    soundManager.playDefeat();
    setIsVictory(false);
    setIsGameOverModalOpen(true);
    updateStatsOnGameEnd(false, score, maxCombo);
  }, [score, maxCombo]);

  // Handle Victory
  const handleVictory = useCallback(
    (finalScore: number, finalBase: number, finalComboBonus: number, finalTimeBonus: number) => {
      soundManager.playVictory();
      setIsVictory(true);

      // Star calculation
      const timePercent = timeLeftRef.current / difficulty.timeLimitSec;
      let calculatedStars = 1;
      if (timePercent >= 0.5 && maxCombo >= 3) {
        calculatedStars = 3;
      } else if (timePercent >= 0.25 || maxCombo >= 2) {
        calculatedStars = 2;
      }
      setStars(calculatedStars);

      const clearTimeSec = difficulty.timeLimitSec - timeLeftRef.current;
      const res = saveHighScore({
        difficulty: difficultyId,
        score: finalScore,
        clearTimeSec,
        maxCombo,
        stars: calculatedStars,
        themeId,
      });

      setIsNewBest(res.isNewBest);
      setIsGameOverModalOpen(true);
    },
    [difficulty, difficultyId, maxCombo, themeId]
  );

  // Handle Tile Click
  const handleTileClick = (pos: Position) => {
    if (isPaused || isGameOverModalOpen) return;
    const clickedTile = matrix[pos.r]?.[pos.c];
    if (!clickedTile) return;

    // No tile currently selected: select this one
    if (!selectedPos) {
      setSelectedPos(pos);
      setHintPair(null);
      soundManager.playSelect();
      return;
    }

    // Clicked the exact same tile: deselect
    if (selectedPos.r === pos.r && selectedPos.c === pos.c) {
      setSelectedPos(null);
      soundManager.playDeselect();
      return;
    }

    const firstTile = matrix[selectedPos.r]?.[selectedPos.c];
    if (!firstTile) {
      setSelectedPos(pos);
      soundManager.playSelect();
      return;
    }

    // If tiles are of different types, switch selection to new tile
    if (firstTile.typeId !== clickedTile.typeId) {
      setSelectedPos(pos);
      soundManager.playSelect();
      return;
    }

    // Same type! Test connection path
    const result = checkConnection(selectedPos, pos, matrix);

    if (!result.canConnect) {
      // Cannot connect with <= 2 bends
      soundManager.playInvalid();
      // Keep or switch selection
      setSelectedPos(pos);
      return;
    }

    // Valid Connection Found!
    const now = Date.now();
    const isCombo = lastMatchTime > 0 && now - lastMatchTime <= 3500;
    const currentCombo = isCombo ? combo + 1 : 1;
    const newMaxCombo = Math.max(maxCombo, currentCombo);

    setCombo(currentCombo);
    setMaxCombo(newMaxCombo);
    setLastMatchTime(now);

    // Score calculations
    const matchBase = 100 * difficulty.multiplier;
    const matchComboBonus = currentCombo > 1 ? (currentCombo - 1) * 50 * difficulty.multiplier : 0;
    const addedScore = Math.round(matchBase + matchComboBonus);

    setScore((prev) => prev + addedScore);
    setBaseScore((prev) => prev + Math.round(matchBase));
    setComboBonus((prev) => prev + Math.round(matchComboBonus));

    // Sound effect
    soundManager.playMatch(currentCombo);

    // Visual feedback: show energy polyline & animate elimination
    setActivePath(result.path);
    setEliminatingIds(new Set([firstTile.id, clickedTile.id]));

    // Floating text at midpoint between tiles
    const totalCols = matrix[0].length;
    const totalRows = matrix.length;
    const midX = (((selectedPos.c + pos.c) / 2 + 0.5) / totalCols) * 100;
    const midY = (((selectedPos.r + pos.r) / 2 + 0.5) / totalRows) * 100;

    setComboFloatingText({
      text: currentCombo > 1 ? `+${addedScore} (${currentCombo}連擊!)` : `+${addedScore}`,
      x: midX,
      y: midY,
    });

    // Capture positions for delayed removal
    const p1 = selectedPos;
    const p2 = pos;

    setTimeout(() => {
      // Clear line, floating text and selections
      setActivePath(null);
      setSelectedPos(null);
      setHintPair(null);
      setComboFloatingText(null);

      // Mutate matrix to remove the two matched tiles
      const nextMatrix = matrix.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if ((rIdx === p1.r && cIdx === p1.c) || (rIdx === p2.r && cIdx === p2.c)) {
            return null;
          }
          return cell;
        })
      );

      setMatrix(nextMatrix);
      setEliminatingIds(new Set());

      // Check remaining tiles
      const remaining = countRemainingTiles(nextMatrix);
      if (remaining === 0) {
        // Victory!
        const remainingTimeSec = timeLeftRef.current;
        const timeBonusPoints = Math.round(remainingTimeSec * difficulty.multiplier * 10);
        setTimeBonus(timeBonusPoints);
        const finalScore = score + addedScore + timeBonusPoints;
        setScore(finalScore);

        handleVictory(
          finalScore,
          baseScore + Math.round(matchBase),
          comboBonus + Math.round(matchComboBonus),
          timeBonusPoints
        );
      } else {
        // Check if deadlocked (no moves left)
        const nextMove = findAnyValidMove(nextMatrix);
        if (!nextMove) {
          // Auto-shuffle
          setAutoShuffleMessage('檢測到盤面無解，正在為您自動重新洗牌...');
          soundManager.playShuffle();

          setTimeout(() => {
            const reshuffled = shuffleBoard(nextMatrix);
            setMatrix(reshuffled);
            setAutoShuffleMessage(null);
          }, 800);
        }
      }
    }, 220);
  };

  // Manual Hint action
  const handleUseHint = () => {
    if (hintsLeft <= 0 || isPaused) return;
    const move = findAnyValidMove(matrix);
    if (!move) {
      // Auto-shuffle if somehow stuck
      handleUseShuffle();
      return;
    }

    setHintsLeft((prev) => prev - 1);
    setHintPair({ p1: move.p1, p2: move.p2 });
    soundManager.playHint();

    // Auto clear hint highlight after 3 seconds
    setTimeout(() => {
      setHintPair(null);
    }, 3500);
  };

  // Manual Shuffle action
  const handleUseShuffle = () => {
    if (shufflesLeft <= 0 || isPaused) return;
    setShufflesLeft((prev) => prev - 1);
    setSelectedPos(null);
    setHintPair(null);
    soundManager.playShuffle();

    const reshuffled = shuffleBoard(matrix);
    setMatrix(reshuffled);
  };

  // Toggle Pause
  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const remainingTilesCount = countRemainingTiles(matrix);
  const remainingPairs = Math.floor(remainingTilesCount / 2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 3-Zone Navigation Header */}
      <Navbar
        onNewGame={() => startNewGame()}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenDifficulty={() => setIsDifficultyOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Game Stage */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-start">
        {/* Auto Shuffle Toast Alert */}
        {autoShuffleMessage && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 animate-bounce shadow-lg shadow-amber-500/10">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            <span>{autoShuffleMessage}</span>
          </div>
        )}

        {/* In-Game Heads-Up Display (Score, Timer, Controls) */}
        <ScoreboardHUD
          difficulty={difficulty}
          score={score}
          combo={combo}
          timeLeft={timeLeft}
          remainingPairs={remainingPairs}
          hintsLeft={hintsLeft}
          shufflesLeft={shufflesLeft}
          isPaused={isPaused}
          onUseHint={handleUseHint}
          onUseShuffle={handleUseShuffle}
          onTogglePause={handleTogglePause}
          highScoreForDifficulty={highScoreForDifficulty}
        />

        {/* The Game Board */}
        <GameBoard
          matrix={matrix}
          selectedPos={selectedPos}
          hintPair={hintPair}
          activePath={activePath}
          eliminatingIds={eliminatingIds}
          onTileClick={handleTileClick}
          themeId={themeId}
          isPaused={isPaused}
          comboFloatingText={comboFloatingText}
        />

        {/* Bottom Quick Bar */}
        <div className="w-full max-w-5xl mx-auto mt-4 px-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>主題: <strong className="text-slate-300">{theme.label}</strong></span>
            <span aria-hidden="true">·</span>
            <span>規則: <strong>不超過 2 個轉彎 (0~2折)</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              規則教學
            </button>
            <button
              onClick={() => setIsDifficultyOpen(true)}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              切換難度/主題
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        activeDifficulty={difficultyId}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <DifficultyModal
        isOpen={isDifficultyOpen}
        onClose={() => setIsDifficultyOpen(false)}
        selectedDifficulty={difficultyId}
        onSelectDifficulty={(id) => setDifficultyId(id)}
        selectedTheme={themeId}
        onSelectTheme={(id) => setThemeId(id)}
        onStartNewGame={startNewGame}
      />

      <GameOverModal
        isOpen={isGameOverModalOpen}
        isVictory={isVictory}
        score={score}
        baseScore={baseScore}
        comboBonus={comboBonus}
        timeBonus={timeBonus}
        maxCombo={maxCombo}
        timeLeft={timeLeft}
        clearTimeSec={difficulty.timeLimitSec - timeLeft}
        stars={stars}
        isNewBest={isNewBest}
        difficulty={difficulty}
        onPlayAgain={() => startNewGame()}
        onOpenLeaderboard={() => {
          setIsGameOverModalOpen(false);
          setIsLeaderboardOpen(true);
        }}
        onOpenDifficulty={() => {
          setIsGameOverModalOpen(false);
          setIsDifficultyOpen(true);
        }}
      />
    </div>
  );
}
