import React, { useState, useEffect } from 'react';
import { 
  Code, Star, Sparkles, CheckCircle, RefreshCw, Volume2, ArrowRight, 
  ArrowLeft, ArrowUp, ArrowDown, Award, Play, Box, ShoppingBag, Grid, 
  Palette, Compass, Check, HelpCircle, Trophy, Move 
} from 'lucide-react';
import { kidAudio } from '../utils/audio';import PathfindingGame from './PathfindingGame';

const GAME_TABS = [
  { id: 1, name: 'Balok Ukuran', emoji: '🧱', bg: 'linear-gradient(135deg, #fef08a, #fde047)', desc: 'Pemilahan Ukuran' },
  { id: 2, name: 'Keranjang', emoji: '🧺', bg: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)', desc: 'Klasifikasi Kategori' },
  { id: 3, name: 'Garis Algoritma', emoji: '✏️', bg: 'linear-gradient(135deg, #bfdbfe, #93c5fd)', desc: 'Pathfinding Code' },
  { id: 4, name: 'Puzzle Gambar', emoji: '🧩', bg: 'linear-gradient(135deg, #fbcfe8, #f9a8d4)', desc: 'Pengenalan Pola' },
  { id: 5, name: 'Urutan Warna', emoji: '🎨', bg: 'linear-gradient(135deg, #e9d5ff, #d8b4fe)', desc: 'Pattern Sequencing' }
];

export default function CodingModule({ onAddStars }) {
  const [activeGameId, setActiveGameId] = useState(null);
  const [score, setScore] = useState(0);

  // GAME 1: SIZE SORTING DRAG & DROP STATE
  const [game1State, setGame1State] = useState({
    smallPlaced: false,
    mediumPlaced: false,
    largePlaced: false
  });
  const [game1SelectedBlock, setGame1SelectedBlock] = useState(null);
  const [draggedBlockSize, setDraggedBlockSize] = useState(null);

  // GAME 2: CATEGORY GROUPING STATE
  const [categoryItems, setCategoryItems] = useState([
    { id: 1, emoji: '🍎', name: 'Apel', category: 'fruit', placed: false },
    { id: 2, emoji: '🧸', name: 'Boneka', category: 'toy', placed: false },
    { id: 3, emoji: '🐱', name: 'Kucing', category: 'animal', placed: false },
    { id: 4, emoji: '🍓', name: 'Stroberi', category: 'fruit', placed: false },
    { id: 5, emoji: '🚗', name: 'Mobil', category: 'toy', placed: false },
    { id: 6, emoji: '🐰', name: 'Kelinci', category: 'animal', placed: false }
  ]);
  const [selectedCatItem, setSelectedCatItem] = useState(null);

  // GAME 3: PATHFINDING LOGIC STATE
  // Dipindahkan ke PathfindingGame.jsx

  // GAME 4: PUZZLE STATE
  const [puzzleTiles, setPuzzleTiles] = useState([
    { id: 1, label: '🧩 1', correctIdx: 0, currentIdx: 2 },
    { id: 2, label: '🧩 2', correctIdx: 1, currentIdx: 0 },
    { id: 3, label: '🧩 3', correctIdx: 2, currentIdx: 3 },
    { id: 4, label: '🧩 4', correctIdx: 3, currentIdx: 1 }
  ]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // GAME 5: COLOR PATTERN STATE
  const [patternLevel, setPatternLevel] = useState(0);
  const patterns = [
    { sequence: ['🔴', '🔵', '🔴'], target: '🔵', options: ['🔴', '🔵', '🟡', '🟢'] },
    { sequence: ['🟡', '🟢', '🟡', '🟢'], target: '🟡', options: ['🔴', '🔵', '🟡', '🟢'] },
    { sequence: ['🟣', '🟠', '🟣'], target: '🟠', options: ['🟣', '🟠', '🔴', '🔵'] }
  ];
  const [patternSuccess, setPatternSuccess] = useState(false);

  useEffect(() => {
    kidAudio.speak('Selamat datang di Modul Coding & Pemecahan Masalah Anak! Mari kita selesaikan permainan logika yang seru ini!');
  }, []);

  const handleSelectGame = (gameId) => {
    kidAudio.playPop();
    setActiveGameId(gameId);
    if (gameId === 1) {
      kidAudio.speak('Game 1: Geser dan letakkan balok ke wadah yang ukurannya pas! Geser balok kecil, sedang, atau besar.');
    } else if (gameId === 2) {
      kidAudio.speak('Game 2: Sortir benda ke keranjang buah, keranjang mainan, atau keranjang hewan!');
    } else if (gameId === 3) {
      kidAudio.speak('Ayo Antar Sahabat Kita menemukan makanannya!');
    } else if (gameId === 4) {
      kidAudio.speak('Game 4: Tukar posisi kepingan puzzle sampai gambar tersusun dengan sempurna!');
    } else if (gameId === 5) {
      kidAudio.speak('Game 5: Perhatikan urutan pola warna dan pilih warna pelengkap yang tepat!');
    }
  };

  const handleBackToGallery = () => {
    kidAudio.playPop();
    setActiveGameId(null);
  };

  // GAME 1 DRAG & DROP LOGIC
  const handleDragStartBlock = (size, e) => {
    kidAudio.playPop();
    setDraggedBlockSize(size);
    setGame1SelectedBlock(size);
    if (e.dataTransfer) {
      e.dataTransfer.setData('block-size', size);
    }
    const sizeText = size === 'small' ? 'kecil' : size === 'medium' ? 'sedang' : 'besar';
    kidAudio.speak(`Menggeser balok ${sizeText}`);
  };

  const handleDropOnContainer = (targetContainerSize, e) => {
    if (e) e.preventDefault();
    const blockSize = draggedBlockSize || game1SelectedBlock || (e?.dataTransfer ? e.dataTransfer.getData('block-size') : null);

    if (!blockSize) {
      kidAudio.speak('Geser atau sentuh baloknya terlebih dahulu!');
      return;
    }

    if (blockSize === targetContainerSize) {
      kidAudio.playSuccess();
      const updated = { ...game1State, [`${targetContainerSize}Placed`]: true };
      setGame1State(updated);
      setGame1SelectedBlock(null);
      setDraggedBlockSize(null);
      
      const sizeText = targetContainerSize === 'small' ? 'kecil' : targetContainerSize === 'medium' ? 'sedang' : 'besar';
      kidAudio.speak(`Hebat! Balok ${sizeText} diletakkan tepat di wadahnya!`);

      if (updated.smallPlaced && updated.mediumPlaced && updated.largePlaced) {
        setScore(prev => prev + 20);
        if (typeof onAddStars === 'function') onAddStars(3);
        kidAudio.speak('Hore! Semua balok berhasil diletakkan sesuai ukurannya! Kamu hebat sekali!');
      }
    } else {
      kidAudio.playWrong();
      kidAudio.speak('Ukuran balok belum cocok dengan wadah ini. Geser ke wadah yang ukurannya pas ya!');
    }
  };

  const resetGame1 = () => {
    kidAudio.playPop();
    setGame1State({ smallPlaced: false, mediumPlaced: false, largePlaced: false });
    setGame1SelectedBlock(null);
    setDraggedBlockSize(null);
  };

  // GAME 2 LOGIC: Category Grouping
  const handleGame2BasketClick = (basketCat) => {
    if (!selectedCatItem) {
      kidAudio.speak('Pilih bendanya terlebih dahulu!');
      return;
    }

    if (selectedCatItem.category === basketCat) {
      kidAudio.playSuccess();
      const updated = categoryItems.map(item => item.id === selectedCatItem.id ? { ...item, placed: true } : item);
      setCategoryItems(updated);
      setSelectedCatItem(null);

      const catText = basketCat === 'fruit' ? 'buah' : basketCat === 'toy' ? 'mainan' : 'hewan';
      kidAudio.speak(`Pintar! ${selectedCatItem.name} berhasil dimasukkan ke keranjang ${catText}!`);

      if (updated.every(i => i.placed)) {
        setScore(prev => prev + 20);
        if (typeof onAddStars === 'function') onAddStars(3);
        kidAudio.speak('Luar biasa! Semua benda telah disortir dengan rapi ke keranjangnya masing-masing!');
      }
    } else {
      kidAudio.playWrong();
      kidAudio.speak(`Oops! ${selectedCatItem.name} tidak cocok di keranjang ini. Coba keranjang yang lain ya!`);
    }
  };

  const resetGame2 = () => {
    kidAudio.playPop();
    setCategoryItems(categoryItems.map(i => ({ ...i, placed: false })));
    setSelectedCatItem(null);
  };

  // GAME 3 LOGIC: Pathfinding Code
  // Dipindahkan ke PathfindingGame.jsx

  // GAME 4 LOGIC: Picture Puzzle
  const handleTileClick = (clickedTile) => {
    if (puzzleSolved) return;
    kidAudio.playPop();

    if (!selectedTile) {
      setSelectedTile(clickedTile);
    } else {
      // Swap currentIdx
      const updated = puzzleTiles.map(t => {
        if (t.id === selectedTile.id) return { ...t, currentIdx: clickedTile.currentIdx };
        if (t.id === clickedTile.id) return { ...t, currentIdx: selectedTile.currentIdx };
        return t;
      });

      setPuzzleTiles(updated);
      setSelectedTile(null);

      // Check if all correct
      const isSolved = updated.every(t => t.correctIdx === t.currentIdx);
      if (isSolved) {
        setPuzzleSolved(true);
        kidAudio.playSuccess();
        setScore(prev => prev + 25);
        if (typeof onAddStars === 'function') onAddStars(4);
        kidAudio.speak('Selamat! Puzzle gambar berhasil tersusun dengan sempurna! Keterampilan visualmu sangat hebat!');
      }
    }
  };

  const resetGame4 = () => {
    kidAudio.playPop();
    setPuzzleTiles([
      { id: 1, label: '🧩 1', correctIdx: 0, currentIdx: 2 },
      { id: 2, label: '🧩 2', correctIdx: 1, currentIdx: 0 },
      { id: 3, label: '🧩 3', correctIdx: 2, currentIdx: 3 },
      { id: 4, label: '🧩 4', correctIdx: 3, currentIdx: 1 }
    ]);
    setSelectedTile(null);
    setPuzzleSolved(false);
  };

  // GAME 5 LOGIC: Pattern Sequencing
  const currPattern = patterns[patternLevel % patterns.length];

  const handlePatternAnswer = (ans) => {
    if (patternSuccess) return;
    if (ans === currPattern.target) {
      kidAudio.playSuccess();
      setPatternSuccess(true);
      setScore(prev => prev + 20);
      if (typeof onAddStars === 'function') onAddStars(3);
      kidAudio.speak(`Tepat sekali! Warna ${ans} melengkapi urutan pola dengan sempurna!`);
    } else {
      kidAudio.playWrong();
      kidAudio.speak('Kurang tepat. Perhatikan lagi urutan warna dari depan ya!');
    }
  };

  const nextPattern = () => {
    kidAudio.playPop();
    setPatternLevel(prev => prev + 1);
    setPatternSuccess(false);
  };

  return (
    <div className="coding-module-container animate-fade-in">
      
      {/* Banner Header */}
      <div className="coding-hero-header glass-panel">
        <div className="coding-title-box">
          <div className="coding-icon-badge animate-bounce-gentle">
            <span>💻</span>
          </div>
          <div>
            <h2>Modul Coding Anak &amp; Logika Pemecahan Masalah</h2>
            <p>Melatih *Computational Thinking*, Algoritma Dasar, &amp; Spasial Visual</p>
          </div>
        </div>

        <div className="coding-score-chip">
          <Trophy size={20} className="text-yellow-500 fill-current" />
          <span>Skor Logika: <strong>{score}</strong></span>
        </div>
      </div>

      {activeGameId === null ? (
        <div className="module-gallery-container" style={{ marginTop: '20px' }}>
          <div className="module-gallery-grid">
            {GAME_TABS.map(tab => (
              <button
                key={tab.id}
                className="module-gallery-card"
                onClick={() => handleSelectGame(tab.id)}
                style={{ '--card-bg': tab.bg }}
              >
                <div className="module-gallery-preview" style={{ background: tab.bg }}>
                  {tab.emoji}
                </div>
                <div className="module-gallery-label">
                  <span className="module-gallery-name">{tab.name}</span>
                  <span className="module-gallery-desc">{tab.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 20px', marginBottom: '10px' }}>
          <button className="module-back-btn" onClick={handleBackToGallery}>
            ← Kembali ke Menu Coding
          </button>
        </div>
      )}

      {/* GAME 1: MEMINDAHKAN BALOK SESUAI UKURAN (DRAG & DROP) */}
      {activeGameId === 1 && (
        <div className="coding-content-card glass-panel animate-scale-up">
          <div className="game-instruction-bar">
            <h3>🧱 Game 1: Geser &amp; Letakkan Balok Sesuai Ukuran (*Drag &amp; Drop*)</h3>
            <p>Geser (drag) balok kayu di bawah ini dan letakkan (drop) ke wadah cetakan yang ukurannya pas!</p>
          </div>

          {/* Draggable Source Blocks */}
          <div className="blocks-source-area">
            <div className="drag-hint">
              <Move size={18} />
              <span>Geser balok ke wadah di bawahnya:</span>
            </div>

            <div className="blocks-row">
              {!game1State.smallPlaced && (
                <div
                  className={`block-item block-small draggable-item ${game1SelectedBlock === 'small' ? 'selected' : ''}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStartBlock('small', e)}
                  onClick={() => {
                    kidAudio.playPop();
                    setGame1SelectedBlock('small');
                    setDraggedBlockSize('small');
                    kidAudio.speak('Balok Kecil dipilih. Geser atau sentuh wadah kecil di bawah!');
                  }}
                  title="Geser Balok Kecil"
                >
                  <Box size={24} />
                  <span>Kecil</span>
                  <Move size={14} className="drag-icon-overlay" />
                </div>
              )}

              {!game1State.mediumPlaced && (
                <div
                  className={`block-item block-medium draggable-item ${game1SelectedBlock === 'medium' ? 'selected' : ''}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStartBlock('medium', e)}
                  onClick={() => {
                    kidAudio.playPop();
                    setGame1SelectedBlock('medium');
                    setDraggedBlockSize('medium');
                    kidAudio.speak('Balok Sedang dipilih. Geser atau sentuh wadah sedang di bawah!');
                  }}
                  title="Geser Balok Sedang"
                >
                  <Box size={34} />
                  <span>Sedang</span>
                  <Move size={14} className="drag-icon-overlay" />
                </div>
              )}

              {!game1State.largePlaced && (
                <div
                  className={`block-item block-large draggable-item ${game1SelectedBlock === 'large' ? 'selected' : ''}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStartBlock('large', e)}
                  onClick={() => {
                    kidAudio.playPop();
                    setGame1SelectedBlock('large');
                    setDraggedBlockSize('large');
                    kidAudio.speak('Balok Besar dipilih. Geser atau sentuh wadah besar di bawah!');
                  }}
                  title="Geser Balok Besar"
                >
                  <Box size={46} />
                  <span>Besar</span>
                  <Move size={14} className="drag-icon-overlay" />
                </div>
              )}
            </div>
          </div>

          {/* Matching Drop Target Containers */}
          <div className="containers-target-area">
            <h4>Wadah Cetakan Target Drop:</h4>
            <div className="containers-row">
              
              <div 
                className={`container-box container-small ${game1State.smallPlaced ? 'filled' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnContainer('small', e)}
                onClick={() => handleDropOnContainer('small')}
              >
                {game1State.smallPlaced ? (
                  <div className="filled-content"><CheckCircle size={28} /> <span>Terisi (Kecil)</span></div>
                ) : (
                  <span>Letakkan (Drop) Wadah Kecil</span>
                )}
              </div>

              <div 
                className={`container-box container-medium ${game1State.mediumPlaced ? 'filled' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnContainer('medium', e)}
                onClick={() => handleDropOnContainer('medium')}
              >
                {game1State.mediumPlaced ? (
                  <div className="filled-content"><CheckCircle size={32} /> <span>Terisi (Sedang)</span></div>
                ) : (
                  <span>Letakkan (Drop) Wadah Sedang</span>
                )}
              </div>

              <div 
                className={`container-box container-large ${game1State.largePlaced ? 'filled' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnContainer('large', e)}
                onClick={() => handleDropOnContainer('large')}
              >
                {game1State.largePlaced ? (
                  <div className="filled-content"><CheckCircle size={38} /> <span>Terisi (Besar)</span></div>
                ) : (
                  <span>Letakkan (Drop) Wadah Besar</span>
                )}
              </div>

            </div>
          </div>

          <div className="game-footer-actions">
            <button className="btn-kid btn-secondary" onClick={resetGame1}>
              <RefreshCw size={18} />
              <span>Main Lagi</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME 2: PENGELOMPOKAN BENDA KE KERANJANG */}
      {activeGameId === 2 && (
        <div className="coding-content-card glass-panel animate-scale-up">
          <div className="game-instruction-bar">
            <h3>🧺 Game 2: Sortir Benda ke Keranjang Kategori</h3>
            <p>Pilih benda di atas, lalu klik keranjang yang tepat!</p>
          </div>

          {/* Items to sort */}
          <div className="items-to-sort-area">
            <div className="items-sort-grid">
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  className={`sort-item-card ${item.placed ? 'placed' : ''} ${selectedCatItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => {
                    if (item.placed) return;
                    kidAudio.playPop();
                    setSelectedCatItem(item);
                    kidAudio.speak(`Kamu memilih ${item.name}`);
                  }}
                  disabled={item.placed}
                >
                  <span className="item-emoji">{item.emoji}</span>
                  <span className="item-name">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Baskets */}
          <div className="baskets-grid">
            <div className="basket-card bg-red-basket" onClick={() => handleGame2BasketClick('fruit')}>
              <span className="basket-icon">🧺🍎</span>
              <h4>Keranjang Buah</h4>
            </div>

            <div className="basket-card bg-blue-basket" onClick={() => handleGame2BasketClick('toy')}>
              <span className="basket-icon">🧺🧸</span>
              <h4>Keranjang Mainan</h4>
            </div>

            <div className="basket-card bg-green-basket" onClick={() => handleGame2BasketClick('animal')}>
              <span className="basket-icon">🧺🐱</span>
              <h4>Keranjang Hewan</h4>
            </div>
          </div>

          <div className="game-footer-actions">
            <button className="btn-kid btn-secondary" onClick={resetGame2}>
              <RefreshCw size={18} />
              <span>Reset Permainan</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME 3: PATHFINDING (ALGORITMA) */}
      {activeGameId === 3 && (
        <PathfindingGame 
          onAddStars={onAddStars} 
          setScore={setScore} 
        />
      )}

      {/* GAME 4: MENYUSUN PUZZLE GAMBAR */}
      {activeGameId === 4 && (
        <div className="coding-content-card glass-panel animate-scale-up">
          <div className="game-instruction-bar">
            <h3>🧩 Game 4: Menyusun Puzzle Gambar Maskot</h3>
            <p>Klik 2 kepingan puzzle untuk menukar posisinya sampai gambar utuh!</p>
          </div>

          <div className="puzzle-board-container">
            <div className="puzzle-grid-2x2">
              {puzzleTiles.map((tile) => {
                const isSelected = selectedTile?.id === tile.id;
                return (
                  <button
                    key={tile.id}
                    className={`puzzle-tile-btn ${isSelected ? 'selected' : ''} tile-pos-${tile.currentIdx}`}
                    onClick={() => handleTileClick(tile)}
                  >
                    <span>{tile.label}</span>
                  </button>
                );
              })}
            </div>

            {puzzleSolved && (
              <div className="puzzle-success-banner animate-scale-up">
                <CheckCircle size={32} className="text-green-500" />
                <div>
                  <h4>Puzzle Selesai Disusun! 🎉 (+4 🌟)</h4>
                  <p>Kemampuan logika visual kamu luar biasa!</p>
                </div>
              </div>
            )}
          </div>

          <div className="game-footer-actions">
            <button className="btn-kid btn-secondary" onClick={resetGame4}>
              <RefreshCw size={18} />
              <span>Acak Puzzle Lagi</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME 5: MENGURUTKAN POLA WARNA */}
      {activeGameId === 5 && (
        <div className="coding-content-card glass-panel animate-scale-up">
          <div className="game-instruction-bar">
            <h3>🎨 Game 5: Mengurutkan Pola Warna (*Pattern Sequencing*)</h3>
            <p>Perhatikan pola warna berulang di bawah ini dan pilih warna pelengkap yang tepat!</p>
          </div>

          <div className="pattern-board-view">
            <div className="pattern-sequence-row">
              {currPattern.sequence.map((c, i) => (
                <span key={i} className="pattern-circle animate-pop">{c}</span>
              ))}
              <span className="pattern-circle missing-target animate-pulse">❓</span>
            </div>

            {/* Color Option Buttons */}
            <div className="pattern-options-row">
              {currPattern.options.map((optColor, i) => (
                <button
                  key={i}
                  className="pattern-opt-btn"
                  onClick={() => handlePatternAnswer(optColor)}
                  disabled={patternSuccess}
                >
                  <span className="opt-circle">{optColor}</span>
                </button>
              ))}
            </div>

            {patternSuccess && (
              <div className="pattern-success-banner animate-scale-up">
                <Award size={32} className="text-yellow-500" />
                <div>
                  <h4>Jawaban Tepat! Pola Berhasil Dilengkapi! 🎉 (+3 🌟)</h4>
                  <button className="btn-kid btn-primary btn-sm mt-2" onClick={nextPattern}>
                    <span>Pola Berikutnya</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
