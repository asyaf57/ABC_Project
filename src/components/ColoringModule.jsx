import React, { useState, useRef, useEffect, useCallback } from 'react';
import { kidAudio } from '../utils/audio';
import { AdsManager } from '../utils/ads';
import { Lock } from 'lucide-react';

// ============================================================
// FULL-COLOR KID-FRIENDLY SVG ICONS (Guaranteed cross-device)
// ============================================================
const IconFill = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#DBEAFE"/>
    <path d="M24 10 L28 6 C30 4 33 7 31 9 L27 13" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" fill="#93C5FD"/>
    <path d="M10 18 L28 18 L26 34 L12 34 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round"/>
    <ellipse cx="19" cy="18" rx="9" ry="4" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2"/>
    <circle cx="9" cy="32" r="3" fill="#60A5FA" opacity="0.8"/>
    <circle cx="5" cy="38" r="2" fill="#60A5FA" opacity="0.6"/>
  </svg>
);

const IconBrush = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#FEF3C7"/>
    <rect x="14" y="8" width="9" height="15" rx="4" fill="#F59E0B" stroke="#92400E" strokeWidth="2"/>
    <path d="M14 23 L23 23 L22 30 L15 30 Z" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5"/>
    <ellipse cx="18.5" cy="32" rx="5" ry="3.5" fill="#F87171" stroke="#92400E" strokeWidth="1.5"/>
    <path d="M15 13 Q18.5 17 22 13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const IconEraser = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#FDF2F8"/>
    <g transform="rotate(-20 20 20)">
      <rect x="8" y="14" width="24" height="14" rx="4" fill="#F472B6" stroke="#831843" strokeWidth="2"/>
      <rect x="8" y="14" width="11" height="14" rx="4" fill="#A5F3FC" stroke="#0E7490" strokeWidth="2"/>
      <line x1="19" y1="15" x2="19" y2="27" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    </g>
    <rect x="10" y="30" width="20" height="3" rx="1.5" fill="#C084FC" opacity="0.5"/>
  </svg>
);

const IconSave = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="#10B981"/>
    <path d="M6 6 L18 6 L22 10 L22 22 L6 22 Z" fill="#ECFDF5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <rect x="10" y="6" width="8" height="7" rx="1" fill="#34D399" stroke="white" strokeWidth="1.5"/>
    <rect x="9" y="15" width="10" height="7" rx="1" fill="#6EE7B7" stroke="white" strokeWidth="1.5"/>
    <line x1="11" y1="19" x2="17" y2="19" stroke="#065F46" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconReset = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="#F43F5E"/>
    <path d="M14 7 A7 7 0 1 1 7 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M7 7 L7 14 L14 14" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
  </svg>
);

const IconDone = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="13" fill="#F59E0B" stroke="#B45309" strokeWidth="2"/>
    <path d="M8 14 L12 18 L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============================================================
// COLORING PAGES — Rich SVG with many separate areas to color
// ============================================================
const PAGES = [
  {
    id: 'page1',
    title: 'Gambar 1',
    emoji: '🎨',
    bg: 'linear-gradient(135deg, #fce7f3, #e9d5ff)',
    imgUrl: '/coloring_pages/page1.png'
  },
  {
    id: 'page2',
    title: 'Gambar 2',
    emoji: '🖼️',
    bg: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    imgUrl: '/coloring_pages/page2.png'
  },
  {
    id: 'page3',
    title: 'Gambar 3',
    emoji: '🖍️',
    bg: 'linear-gradient(135deg, #dbeafe, #e0f2fe)',
    imgUrl: '/coloring_pages/page3.png'
  },
  {
    id: 'page4',
    title: 'Gambar 4',
    emoji: '🖌️',
    bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    imgUrl: '/coloring_pages/page4.png',
    isLocked: true
  },
  {
    id: 'page5',
    title: 'Gambar 5',
    emoji: '✨',
    bg: 'linear-gradient(135deg, #fdf4ff, #fce7f3)',
    imgUrl: '/coloring_pages/page5.png',
    isLocked: true
  },
  {
    id: 'page6',
    title: 'Gambar 6',
    emoji: '🌈',
    bg: 'linear-gradient(135deg, #e0f2fe, #dbeafe)',
    imgUrl: '/coloring_pages/page6.png',
    isLocked: true
  }
];

// ============================================================
// COLOR PALETTE
// ============================================================
const COLORS = [
  // Row 1: Warm
  '#FF2D2D','#FF6B00','#FFD600','#FF69B4',
  // Row 2: Cool
  '#00C853','#00B0FF','#651FFF','#212121',
  // Row 3: Pastel
  '#FFCDD2','#FFE0B2','#F0F4C3','#B2DFDB',
  // Row 4: Pastel 2
  '#BBDEFB','#E1BEE7','#FCE4EC','#FFFFFF',
  // Row 5: Skin tones & natural
  '#FFDFC4','#E0AC69','#8D5524','#4E342E',
  // Row 6: Special
  '#FF8A65','#A5D6A7','#80DEEA','#CE93D8',
];

export default function ColoringModule({ onAddStars }) {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const isFillingRef = useRef(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [tool, setTool] = useState('fill');
  const [brushSize, setBrushSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);
  
  // Track unlocked pages
  const [unlockedPages, setUnlockedPages] = useState(() => {
    try {
      const saved = localStorage.getItem('abc_unlocked_coloring');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const unlockPage = (pageId) => {
    const newUnlocked = [...unlockedPages, pageId];
    setUnlockedPages(newUnlocked);
    try {
      localStorage.setItem('abc_unlocked_coloring', JSON.stringify(newUnlocked));
    } catch (e) {}
  };

  // Initialize Web Worker for flood fill
  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/fillWorker.js', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      if (e.data.imgData && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.putImageData(e.data.imgData, 0, 0);
      }
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'crosshair';
        canvasRef.current.style.pointerEvents = 'auto';
      }
      isFillingRef.current = false;
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedPage) drawPageToCanvas(selectedPage);
  }, [selectedPage]);

  const drawPageToCanvas = (page) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = page.imgUrl;
  };

  const getXY = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    const src = e.touches?.[0] ?? e;
    return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const {x, y} = getXY(e);
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (tool === 'fill') {
      // Guard: ignore tap if a fill is still running
      if (isFillingRef.current) return;
      isFillingRef.current = true;
      kidAudio.playPop();
      
      // Disable pointer events so double-tap doesn't queue another fill
      canvasRef.current.style.pointerEvents = 'none';
      canvasRef.current.style.cursor = 'wait';
      
      // Send data to Web Worker
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      const imgData = ctx.getImageData(0, 0, W, H);
      
      workerRef.current.postMessage({
        imgData,
        W,
        H,
        sx: x,
        sy: y,
        colorHex: activeColor
      });

    } else {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawing || tool === 'fill') return;
    const {x, y} = getXY(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : activeColor;
    ctx.stroke();
  };

  const handlePointerUp = (e) => {
    e?.preventDefault();
    if (isDrawing) {
      canvasRef.current.getContext('2d').closePath();
      setIsDrawing(false);
    }
  };

  const handleFinish = () => {
    if (!isFinished) {
      kidAudio.playSuccess();
      onAddStars?.(20);
      setIsFinished(true);
      setCelebrationCount(c => c+1);
    }
  };

  const handleSave = () => {
    kidAudio.playPop();
    const a = document.createElement('a');
    a.download = `karya-${selectedPage.id}.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  };

  const handleReset = () => {
    kidAudio.playPop();
    drawPageToCanvas(selectedPage);
    setIsFinished(false);
  };

  // ============================================================
  // GALLERY VIEW
  // ============================================================
  if (!selectedPage) {
    return (
      <div className="coloring-gallery-container">
        <div className="coloring-gallery-header">
          <div className="coloring-gallery-title-wrap">
            <h2 className="coloring-gallery-title">🎨 Pilih Gambar Favoritmu!</h2>
            <p className="coloring-gallery-subtitle">Sentuh gambar untuk mulai mewarnai</p>
          </div>
        </div>
        <div className="coloring-gallery-grid">
          {PAGES.map(page => {
            const locked = page.isLocked && !unlockedPages.includes(page.id);
            return (
              <button
                key={page.id}
                className="coloring-gallery-card relative"
                onClick={() => {
                  kidAudio.playPop();
                  if (locked) {
                    kidAudio.speak('Tonton video sebentar untuk membuka gambar ini ya!');
                    AdsManager.showRewarded((success) => {
                      if (success) {
                        unlockPage(page.id);
                        kidAudio.playSuccess();
                        kidAudio.speak('Hore! Gambar sudah terbuka!');
                      }
                    });
                  } else {
                    setSelectedPage(page); 
                    setIsFinished(false);
                  }
                }}
                style={{ '--card-bg': page.bg, opacity: locked ? 0.8 : 1 }}
              >
                {locked && (
                  <div className="absolute inset-0 bg-black/30 z-10 flex flex-col items-center justify-center rounded-[24px]">
                    <div className="bg-white/90 p-3 rounded-full mb-2 animate-bounce">
                      <Lock size={32} className="text-yellow-500" />
                    </div>
                    <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-full text-sm">
                      Tonton Iklan
                    </span>
                  </div>
                )}
                <div className="coloring-gallery-preview" style={{ background: page.bg }}>
                  <img src={page.imgUrl} alt={page.title} className="coloring-gallery-svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="coloring-gallery-label">
                  <span className="coloring-gallery-emoji">{page.emoji}</span>
                  <span className="coloring-gallery-name">{page.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================
  // CANVAS VIEW
  // ============================================================
  return (
    <div className="coloring-canvas-container">

      {/* Header Bar */}
      <div className="coloring-header-bar">
        <button className="coloring-back-btn" onClick={() => { kidAudio.playPop(); setSelectedPage(null); }}>
          ← Pilih Gambar
        </button>
        <span className="coloring-current-title">{selectedPage.emoji} {selectedPage.title}</span>
        <button className="coloring-hint-btn" onClick={() => kidAudio.speak('Pilih warna di sebelah kanan, lalu sentuh gambar untuk mewarnainya!')}>
          🔊 Petunjuk
        </button>
      </div>

      {/* Main Area: Tools + Canvas + Palette */}
      <div className="coloring-main-area">

        {/* Left Column: Toolbar + Canvas + Buttons */}
        <div className="coloring-left-column">

          {/* Tool Selector */}
          <div className="coloring-toolbar">
            <button
              className={`coloring-tool-btn ${tool === 'fill' ? 'active-fill' : ''}`}
              onClick={() => { kidAudio.playPop(); setTool('fill'); }}
              title="Ember Cat (isi penuh)"
            >
              <IconFill />
              <span>Ember Cat</span>
            </button>
            <button
              className={`coloring-tool-btn ${tool === 'brush' ? 'active-brush' : ''}`}
              onClick={() => { kidAudio.playPop(); setTool('brush'); }}
              title="Kuas Mewarnai"
            >
              <IconBrush />
              <span>Kuas</span>
            </button>
            <button
              className={`coloring-tool-btn ${tool === 'eraser' ? 'active-eraser' : ''}`}
              onClick={() => { kidAudio.playPop(); setTool('eraser'); }}
              title="Penghapus"
            >
              <IconEraser />
              <span>Hapus</span>
            </button>
          </div>

          {/* Brush Size Slider */}
          {tool !== 'fill' && (
            <div className="coloring-size-row">
              <span className="coloring-size-label">Tebal:</span>
              <input
                type="range" min="4" max="50" value={brushSize}
                onChange={e => setBrushSize(+e.target.value)}
                className="coloring-size-slider"
              />
              <div className="coloring-size-preview" style={{ width: Math.max(8, brushSize/2), height: Math.max(8, brushSize/2) }} />
            </div>
          )}

          {/* Canvas Frame */}
          <div className="coloring-canvas-frame">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="coloring-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerOut={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            {isFinished && (
              <div className="coloring-celebration-overlay">
                <div className="coloring-celebration-card">
                  <div style={{fontSize:'4rem'}}>🎉</div>
                  <h3>Luar Biasa!</h3>
                  <p>Karya mewarnaimu sangat indah! +20 ⭐</p>
                  <button onClick={() => setIsFinished(false)} className="coloring-continue-btn">
                    Lanjut Mewarnai
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons BELOW canvas */}
          <div className="coloring-action-row">
            <button className="coloring-action-btn btn-reset" onClick={handleReset}>
              <IconReset /> Ulangi Bersih
            </button>
            <button className="coloring-action-btn btn-save" onClick={handleSave}>
              <IconSave /> Simpan Karya
            </button>
            {!isFinished && (
              <button className="coloring-action-btn btn-done" onClick={handleFinish}>
                <IconDone /> Selesai! +20⭐
              </button>
            )}
          </div>

        </div>

        {/* Right Column: COLOR PALETTE — strictly vertical, right of canvas */}
        <div className="coloring-palette-column">
          <div className="coloring-palette-panel">
            <div className="coloring-palette-header">🎨 Warna</div>
            <div className="coloring-palette-grid">
              {COLORS.map((hex, i) => {
                const isLight = ['#FFFFFF','#F0F4C3','#FFDFC4','#FFE0B2','#FFCDD2','#FFD600'].includes(hex);
                const selected = activeColor === hex && tool !== 'eraser';
                return (
                  <button
                    key={i}
                    className={`coloring-color-swatch ${selected ? 'selected' : ''}`}
                    style={{ backgroundColor: hex, outline: selected ? `4px solid ${isLight ? '#333' : hex}` : undefined, outlineOffset: selected ? '3px' : undefined, boxShadow: selected ? `0 0 0 2px white, 0 0 0 5px ${hex}` : undefined }}
                    onClick={() => {
                      kidAudio.playPop();
                      setActiveColor(hex);
                      if (tool === 'eraser') setTool('fill');
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
