import React, { useState } from 'react';
import { Volume2, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALPHABET_DATA } from '../../data/spellingData';
import { kidAudio } from '../../utils/audio';

export default function AlphabetMode() {
  const [selectedLetter, setSelectedLetter] = useState(ALPHABET_DATA[0]);
  const [popupData, setPopupData] = useState(null); // Data for Carousel Popup
  const [carouselIndex, setCarouselIndex] = useState(0); // Active index in carousel

  // Click on Alphabet Tile (A - Z) -> Suara Anak Ceria dengan Jeda Hening
  const handleLetterClick = (item) => {
    setSelectedLetter(item);
    kidAudio.playPop();

    // Utarakan Suara Anak Ceria dengan Jeda Hening: " G ... G untuuuk GAJAH! "
    kidAudio.speakWithPause(item.char, item.word);
  };

  // Click on Sound Button -> Speaks Fun Fact Story at Normal Speaking Speed!
  const playFunFactSound = (item) => {
    kidAudio.playPop();
    // Kecepatan & intonasi bercerita normal
    kidAudio.speakFunFact(item.funFact);
  };

  // Click on Big Picture Showcase (Right) -> Opens Popup Carousel Gallery!
  const handleOpenObjectPopup = () => {
    kidAudio.playStar();
    setCarouselIndex(0);
    setPopupData(selectedLetter);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.5 }
    });

    const firstItem = selectedLetter.relatedItems[0];
    kidAudio.speak(`${firstItem.name}!`, 0.75, 1.4);
  };

  // Carousel Navigation: Next & Prev
  const handlePrevItem = () => {
    if (!popupData) return;
    kidAudio.playPop();
    const newIdx = (carouselIndex - 1 + popupData.relatedItems.length) % popupData.relatedItems.length;
    setCarouselIndex(newIdx);

    const item = popupData.relatedItems[newIdx];
    kidAudio.speak(`${item.name}!`, 0.75, 1.4);
  };

  const handleNextItem = () => {
    if (!popupData) return;
    kidAudio.playPop();
    const newIdx = (carouselIndex + 1) % popupData.relatedItems.length;
    setCarouselIndex(newIdx);

    const item = popupData.relatedItems[newIdx];
    kidAudio.speak(`${item.name}!`, 0.75, 1.4);
  };

  return (
    <div className="mode-alphabet animate-pop">
      {/* Hero Display Card */}
      <div className="alphabet-display-card kid-card" style={{ borderColor: selectedLetter.color }}>
        
        {/* Kiri: Huruf & Tombol Fakta Suara */}
        <div className="display-card-left">
          <div className="big-char-circle animate-bounce-soft" style={{ backgroundColor: selectedLetter.color }}>
            <span>{selectedLetter.char}</span>
            <small className="circle-lower">{selectedLetter.lower}</small>
          </div>

          <div className="char-info">
            <h2 className="char-head-title">Huruf {selectedLetter.char}</h2>
            <p className="sound-text">" {selectedLetter.char} ... {selectedLetter.char} untuk {selectedLetter.word} "</p>

            {/* Tombol Fakta Menarik */}
            <button 
              className="btn-kid btn-sound-vibrant"
              style={{ '--btn-theme-color': selectedLetter.color }}
              onClick={() => playFunFactSound(selectedLetter)}
            >
              <div className="speaker-icon-wrapper">
                <Volume2 size={30} className="speaker-icon animate-pulse" />
              </div>
              <div className="btn-sound-text">
                <span className="text-main">🔊 CERITA FAKTA SERU {selectedLetter.char}!</span>
                <span className="text-sub">Sentuh untuk mendengar cerita menarik</span>
              </div>
            </button>
          </div>
        </div>

        {/* Kanan: Gambar Benda Raksasa (Klik untuk Buka Galeri Pop-up) */}
        <div className="display-card-right">
          <div 
            className="big-object-box clickable-object-box animate-pop" 
            style={{ borderColor: selectedLetter.color }}
            onClick={handleOpenObjectPopup}
            title="Sentuh untuk melihat benda lainnya!"
          >
            <div className="touch-hint-badge">
              <Sparkles size={16} /> Sentuh Gambar!
            </div>
            <div className="big-emoji-img animate-float">{selectedLetter.emoji}</div>
            <div className="object-name-tag" style={{ backgroundColor: selectedLetter.color }}>
              <span>{selectedLetter.word}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Abjad Grid (A - Z) */}
      <div className="grid-header-label">
        <h3>Sentuh Huruf Mana Saja Di Bawah Ini:</h3>
      </div>
      
      <div className="alphabet-grid">
        {ALPHABET_DATA.map((item) => (
          <button
            key={item.char}
            className={`letter-tile ${selectedLetter.char === item.char ? 'selected' : ''}`}
            style={{ '--tile-color': item.color }}
            onClick={() => handleLetterClick(item)}
          >
            <span className="tile-char">{item.char} <small className="tile-lower">{item.lower}</small></span>
            <span className="tile-emoji">{item.emoji}</span>
            <span className="tile-word">{item.word}</span>
          </button>
        ))}
      </div>

      {/* POP-UP CAROUSEL GALERI BENDA SEKITAR */}
      {popupData && (
        <div className="modal-overlay animate-pop" onClick={() => setPopupData(null)}>
          <div 
            className="popup-carousel-modal kid-card" 
            style={{ borderColor: popupData.color }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="popup-close-btn" onClick={() => setPopupData(null)}>
              <X size={28} />
            </button>

            {/* Header Pop-up */}
            <div className="popup-carousel-header">
              <div className="popup-char-badge" style={{ backgroundColor: popupData.color }}>
                <span>{popupData.char}</span>
                <span className="lower">{popupData.lower}</span>
              </div>
              <div className="popup-title">
                <h2>Galeri Benda Huruf {popupData.char}</h2>
                <p>Geser panah untuk melihat benda sekitar lainnya!</p>
              </div>
            </div>

            {/* Carousel Item Display */}
            <div className="carousel-stage">
              <button className="carousel-nav-btn prev-btn" onClick={handlePrevItem}>
                <ChevronLeft size={36} />
              </button>

              <div className="carousel-card-active">
                <div className="carousel-emoji animate-bounce-soft">
                  {popupData.relatedItems[carouselIndex].emoji}
                </div>
                <h3 className="carousel-item-name" style={{ color: popupData.color }}>
                  {popupData.relatedItems[carouselIndex].name}
                </h3>
                <span className="item-counter-badge">
                  {carouselIndex + 1} dari {popupData.relatedItems.length} Benda
                </span>
              </div>

              <button className="carousel-nav-btn next-btn" onClick={handleNextItem}>
                <ChevronRight size={36} />
              </button>
            </div>

            {/* Carousel Dots Indicator */}
            <div className="carousel-dots">
              {popupData.relatedItems.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === carouselIndex ? 'active' : ''}`}
                  style={{ backgroundColor: idx === carouselIndex ? popupData.color : '#CFD8DC' }}
                  onClick={() => {
                    kidAudio.playPop();
                    setCarouselIndex(idx);
                    const item = popupData.relatedItems[idx];
                    kidAudio.speak(`${item.name}!`, 0.75, 1.4);
                  }}
                />
              ))}
            </div>

            {/* Speak Active Item Button */}
            <button 
              className="btn-kid btn-sound-vibrant btn-full"
              style={{ '--btn-theme-color': popupData.color }}
              onClick={() => {
                kidAudio.playPop();
                const item = popupData.relatedItems[carouselIndex];
                kidAudio.speak(`${item.name}!`, 0.75, 1.4);
              }}
            >
              <Volume2 size={28} className="animate-pulse" />
              <span>🔊 SEBUTKAN NAMA BENDA: {popupData.relatedItems[carouselIndex].name}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
