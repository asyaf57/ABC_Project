import React from 'react';
import { kidAudio } from '../../utils/audio';

export default function SubNav({ subMode, setSubMode, currentGameWord }) {
  return (
    <div className="subnav-container">
      <button
        className={`subnav-btn ${subMode === 'alphabet' ? 'active' : ''}`}
        onClick={() => {
          kidAudio.playPop();
          setSubMode('alphabet');
          kidAudio.speak("Mari mengenal huruf abjad dan suaranya!");
        }}
      >
        <span>🔤 Mengenal Huruf</span>
      </button>

      <button
        className={`subnav-btn ${subMode === 'syllable' ? 'active' : ''}`}
        onClick={() => {
          kidAudio.playPop();
          setSubMode('syllable');
          kidAudio.speak("Mari mengeja suku kata!");
        }}
      >
        <span>🧩 Suku Kata</span>
      </button>

      <button
        className={`subnav-btn ${subMode === 'game' ? 'active' : ''}`}
        onClick={() => {
          kidAudio.playPop();
          setSubMode('game');
          kidAudio.speak(`Mari bermain susun kata! Ayo susun kata ${currentGameWord}!`);
        }}
      >
        <span>🎮 Game Susun Kata</span>
      </button>
    </div>
  );
}
