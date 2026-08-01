import React, { useState } from 'react';
import SubNav from './spelling/SubNav';
import AlphabetMode from './spelling/AlphabetMode';
import SyllableMode from './spelling/SyllableMode';
import WordGameMode from './spelling/WordGameMode';
import KidModuleBoundary from './KidModuleBoundary';

export default function SpellingModule({ onAddStars }) {
  const [subMode, setSubMode] = useState('alphabet');

  return (
    <div className="spelling-module">
      {/* Sub Navigation Bar dengan nama props subMode & setSubMode yang 100% pas! */}
      <SubNav 
        subMode={subMode} 
        setSubMode={setSubMode} 
        currentGameWord="BACA" 
      />

      {/* Terisolasi secara independen dengan Error Boundary per Tab */}
      <div className="submode-content-container" style={{ marginTop: '16px' }}>
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
