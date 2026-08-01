import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowRight, HelpCircle, Layers, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SPELLING_LEVELS, APPRECIATION_PRAISES, MOTIVATION_FEEDBACKS } from '../../data/spellingData';
import { kidAudio } from '../../utils/audio';

export default function WordGameMode({ onAddStars }) {
  // Active Level State (Level 1 to 5)
  const [activeLevelIdx, setActiveLevelIdx] = useState(0);
  const [currentGameIdx, setCurrentGameIdx] = useState(0);

  // Safe Fallback Guardians
  const safeLevels = SPELLING_LEVELS && SPELLING_LEVELS.length > 0 ? SPELLING_LEVELS : [];
  const currentLevel = safeLevels[activeLevelIdx] || safeLevels[0];
  const currentGame = currentLevel && currentLevel.games ? (currentLevel.games[currentGameIdx] || currentLevel.games[0]) : null;

  const [placedLetters, setPlacedLetters] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWrongState, setIsWrongState] = useState(false);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  // Initialize tiles when level or game changes
  useEffect(() => {
    if (currentGame && currentGame.letters) {
      // Filter out space characters for available tiles pool if any
      const letterPool = currentGame.letters.filter(c => c !== ' ');
      const shuffled = [...letterPool].sort(() => Math.random() - 0.5);
      setAvailableTiles(shuffled.map((char, index) => ({ id: `${char}-${index}`, char })));
      setPlacedLetters([]);
      setIsCompleted(false);
      setIsWrongState(false);
      setFeedbackBanner(null);
    }
  }, [activeLevelIdx, currentGameIdx, currentGame]);

  if (!currentGame || !currentLevel) {
    return (
      <div className="game-card kid-card">
        <p>Memuat permainan susun kata...</p>
      </div>
    );
  }

  const handleTileClick = (tile, tileIndex) => {
    if (isCompleted || isWrongState) return;

    kidAudio.playPop();
    kidAudio.speak(tile.char, 1.0, 1.4);

    // Auto place spaces if target has spaces
    let nextPlaced = [...placedLetters, tile];

    // Check if next expected character in target word is a space ' '
    const nextExpectedIdx = nextPlaced.length;
    if (currentGame.letters[nextExpectedIdx] === ' ') {
      nextPlaced.push({ id: `space-${Date.now()}`, char: ' ' });
    }

    const newAvailable = availableTiles.filter((_, idx) => idx !== tileIndex);
    
    setPlacedLetters(nextPlaced);
    setAvailableTiles(newAvailable);

    // Check if slots are filled
    if (nextPlaced.length === currentGame.letters.length) {
      const formedWord = nextPlaced.map(t => t.char).join('');
      if (formedWord === currentGame.word) {
        // BENAR! (Apresiasi Cepat & Energik)
        setIsCompleted(true);
        setIsWrongState(false);
        kidAudio.playSuccess();
        if (typeof onAddStars === 'function') {
          onAddStars(10);
        }

        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });

        const randomPraise = APPRECIATION_PRAISES[Math.floor(Math.random() * APPRECIATION_PRAISES.length)];
        setFeedbackBanner({ type: 'success', text: randomPraise });

        setTimeout(() => {
          kidAudio.speakAppreciation(`${randomPraise} ${currentGame.word}! Kamu dapat 10 bintang emas!`);
        }, 200);
      } else {
        // KURANG TEPAT! (Tahan huruf tetap terbuka di layar selama 4.5 DETIK!)
        setIsWrongState(true);
        const randomMotivation = MOTIVATION_FEEDBACKS[Math.floor(Math.random() * MOTIVATION_FEEDBACKS.length)];
        setFeedbackBanner({ type: 'wrong', text: randomMotivation });

        kidAudio.playWrong();
        kidAudio.speakMotivation(randomMotivation);

        // Tepat 4.5 detik (4500ms) seperti permintaan user!
        setTimeout(() => {
          resetGame();
        }, 4500);
      }
    }
  };

  const handleRemovePlaced = (placedTile, placedIndex) => {
    if (isCompleted || isWrongState || placedTile.char === ' ') return;
    kidAudio.playPop();
    setPlacedLetters(placedLetters.filter((_, idx) => idx !== placedIndex));
    setAvailableTiles([...availableTiles, placedTile]);
  };

  const resetGame = () => {
    if (!currentGame || !currentGame.letters) return;
    const letterPool = currentGame.letters.filter(c => c !== ' ');
    const shuffled = [...letterPool].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled.map((char, index) => ({ id: `${char}-${index}`, char })));
    setPlacedLetters([]);
    setIsCompleted(false);
    setIsWrongState(false);
    setFeedbackBanner(null);
  };

  const nextGame = () => {
    kidAudio.playPop();
    if (currentGameIdx + 1 < currentLevel.games.length) {
      setCurrentGameIdx(prev => prev + 1);
    } else {
      // Advance to next level if available!
      if (activeLevelIdx + 1 < safeLevels.length) {
        setActiveLevelIdx(prev => prev + 1);
        setCurrentGameIdx(0);
        kidAudio.speakAppreciation(`HOREEE! Kamu berhasil menamatkan ${currentLevel.title}! Selamat naik ke level berikutnya!`);
      } else {
        setCurrentGameIdx(0); // loop back
      }
    }
  };

  const handleSelectLevel = (idx) => {
    kidAudio.playPop();
    setActiveLevelIdx(idx);
    setCurrentGameIdx(0);
    kidAudio.speakMotivation(`Kamu memilih ${safeLevels[idx].title}`);
  };

  return (
    <div className="mode-game animate-pop">
      {/* LEVEL SELECTOR TABS (Level 1 sampai Level 5) */}
      <div className="game-level-tabs">
        <div className="level-tabs-header">
          <Layers size={20} className="text-orange-500" />
          <span>Pilih Tingkat Kesulitan (Level 1 - 5):</span>
        </div>
        <div className="level-buttons-row">
          {safeLevels.map((lvl, idx) => (
            <button
              key={lvl.levelId}
              className={`level-tab-btn ${activeLevelIdx === idx ? 'active' : ''}`}
              onClick={() => handleSelectLevel(idx)}
            >
              <span className="lvl-num">Level {lvl.levelId}</span>
              <span className="lvl-badge">{lvl.badge}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="game-card kid-card">
        <div className="game-header">
          <div className="level-info-pill">
            <Award size={18} className="text-amber-500" />
            <span>{currentLevel.title} (Soal {currentGameIdx + 1}/{currentLevel.games.length})</span>
          </div>
          <button 
            className="btn-speaker-hint"
            onClick={() => kidAudio.speakMotivation(`Petunjuk: ${currentGame.hint}. Ayo susun kata ${currentGame.word}!`)}
          >
            <Volume2 size={24} />
            <span>Dengarkan Petunjuk</span>
          </button>
        </div>

        <div className="game-target">
          <div className="target-emoji animate-bounce-soft">{currentGame.emoji}</div>
          <p className="hint-text">"{currentGame.hint}"</p>
        </div>

        {/* Dynamic Feedback Banner */}
        {feedbackBanner && (
          <div className={`game-feedback-banner animate-pop ${feedbackBanner.type}`}>
            <span>{feedbackBanner.text}</span>
          </div>
        )}

        {/* Target Slots */}
        <div className="slots-container">
          {currentGame.letters.map((char, index) => {
            const placed = placedLetters[index];
            const isSpace = char === ' ';
            return (
              <div
                key={index}
                className={`letter-slot ${placed ? 'filled' : ''} ${isCompleted ? 'success' : ''} ${isWrongState ? 'wrong-hold' : ''} ${isSpace ? 'space-slot' : ''}`}
                onClick={() => placed && handleRemovePlaced(placed, index)}
              >
                {isSpace ? '␣' : (placed ? placed.char : '')}
              </div>
            );
          })}
        </div>

        {/* Available Tiles */}
        <div className="tiles-pool">
          <p className="pool-label">Sentuh/Pilih Huruf Di Bawah Ini:</p>
          <div className="tiles-row">
            {availableTiles.map((tile, idx) => (
              <button
                key={tile.id}
                className="tile-btn animate-pop"
                disabled={isWrongState}
                onClick={() => handleTileClick(tile, idx)}
              >
                {tile.char}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="game-actions">
          <button className="btn-kid btn-accent" onClick={resetGame} disabled={isWrongState}>
            <RotateCcw size={20} />
            <span>Ulangi</span>
          </button>

          {isCompleted ? (
            <button className="btn-kid btn-secondary animate-bounce-soft" onClick={nextGame}>
              <span>Soal Berikutnya</span>
              <ArrowRight size={22} />
            </button>
          ) : (
            <button 
              className="btn-kid btn-purple" 
              onClick={() => kidAudio.speakMotivation(`Kata ini terdiri dari huruf ${currentGame.letters.filter(c => c !== ' ').join(', ')}`)}
            >
              <HelpCircle size={20} />
              <span>Bantuan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
