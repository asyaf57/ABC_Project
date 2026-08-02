import React, { useState } from 'react';
import AlphabetMode from './spelling/AlphabetMode';
import SyllableMode from './spelling/SyllableMode';
import WordGameMode from './spelling/WordGameMode';
import KidModuleBoundary from './KidModuleBoundary';
import { kidAudio } from '../utils/audio';

const SPELLING_MODES = [
  {
    id: 'alphabet',
    title: 'Mengenal Huruf',
    emoji: '🔤',
    bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    desc: 'Belajar abjad dan suaranya'
  },
  {
    id: 'syllable',
    title: 'Suku Kata',
    emoji: '🧩',
    bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    desc: 'Mengeja suku kata dasar'
  },
  {
    id: 'game',
    title: 'Game Susun Kata',
    emoji: '🎮',
    bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    desc: 'Bermain menyusun kata'
  }
];

export default function SpellingModule({ onAddStars }) {
  const [subMode, setSubMode] = useState(null);

  const handleSelectMode = (mode) => {
    kidAudio.playPop();
    setSubMode(mode.id);
    if (mode.id === 'alphabet') {
      kidAudio.speak("Mari mengenal huruf abjad dan suaranya!");
    } else if (mode.id === 'syllable') {
      kidAudio.speak("Mari mengeja suku kata!");
    } else if (mode.id === 'game') {
      kidAudio.speak(`Mari bermain susun kata! Ayo susun kata!`);
    }
  };

  const handleBackToGallery = () => {
    kidAudio.playPop();
    setSubMode(null);
  };

  if (!subMode) {
    return (
      <div className="module-gallery-container">
        <div className="module-gallery-header">
          <h2 className="module-gallery-title">✏️ Modul Ejaan Ceria</h2>
          <p className="module-gallery-subtitle">Pilih permainan ejaan yang kamu sukai!</p>
        </div>
        <div className="module-gallery-grid">
          {SPELLING_MODES.map(mode => (
            <button
              key={mode.id}
              className="module-gallery-card"
              onClick={() => handleSelectMode(mode)}
              style={{ '--card-bg': mode.bg }}
            >
              <div className="module-gallery-preview" style={{ background: mode.bg }}>
                {mode.emoji}
              </div>
              <div className="module-gallery-label">
                <span className="module-gallery-name">{mode.title}</span>
                <span className="module-gallery-desc">{mode.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="spelling-module">
      <button className="module-back-btn" onClick={handleBackToGallery}>
        ← Kembali ke Pilihan Menu
      </button>

      {/* Terisolasi secara independen dengan Error Boundary per Tab */}
      <div className="submode-content-container">
        {subMode === 'alphabet' && (
          <KidModuleBoundary key="alphabet-boundary">
            <AlphabetMode />
          </KidModuleBoundary>
        )}

        {subMode === 'syllable' && (
          <KidModuleBoundary key="syllable-boundary">
            <SyllableMode />
          </KidModuleBoundary>
        )}

        {subMode === 'game' && (
          <KidModuleBoundary key="game-boundary">
            <WordGameMode onAddStars={onAddStars} />
          </KidModuleBoundary>
        )}
      </div>
    </div>
  );
}
