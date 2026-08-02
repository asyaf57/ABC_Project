import React, { useState, useRef, useEffect } from 'react';
import { Palette, PaintBucket, Pen, Eraser, Download, RotateCcw, CheckCircle } from 'lucide-react';
import { kidAudio } from '../utils/audio';

const COLORING_PAGES = [
  {
    id: 'princess',
    title: 'Putri Cantik',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path d="M200 50 C180 80 180 120 200 150 C220 120 220 80 200 50 Z" fill="none" stroke="black" stroke-width="4"/>
      <path d="M200 150 C150 200 100 300 100 350 L300 350 C300 300 250 200 200 150" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="200" cy="110" r="30" fill="none" stroke="black" stroke-width="4"/>
      <path d="M185 105 Q200 120 215 105" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="190" cy="100" r="3" fill="black"/><circle cx="210" cy="100" r="3" fill="black"/>
      <path d="M170 80 Q200 60 230 80" fill="none" stroke="black" stroke-width="4"/>
      <path d="M100 350 Q200 380 300 350" fill="none" stroke="black" stroke-width="4"/>
      <path d="M150 200 L120 250 L140 260" fill="none" stroke="black" stroke-width="4"/>
      <path d="M250 200 L280 250 L260 260" fill="none" stroke="black" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'superhero',
    title: 'Pahlawan Super',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="120" rx="40" ry="50" fill="none" stroke="black" stroke-width="4"/>
      <path d="M175 110 Q190 90 225 110" fill="none" stroke="black" stroke-width="4"/>
      <path d="M175 130 Q190 150 225 130" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="190" cy="120" r="5" fill="black"/><circle cx="210" cy="120" r="5" fill="black"/>
      <path d="M200 170 L200 280" fill="none" stroke="black" stroke-width="4"/>
      <path d="M150 190 Q200 220 250 190" fill="none" stroke="black" stroke-width="4"/>
      <path d="M160 280 L140 360 L170 360 L200 280 L230 360 L260 360 L240 280" fill="none" stroke="black" stroke-width="4"/>
      <path d="M160 180 L100 220 L120 230 L170 190" fill="none" stroke="black" stroke-width="4"/>
      <path d="M240 180 L300 220 L280 230 L230 190" fill="none" stroke="black" stroke-width="4"/>
      <path d="M160 170 C100 170 100 300 160 300" fill="none" stroke="black" stroke-width="4"/>
      <path d="M240 170 C300 170 300 300 240 300" fill="none" stroke="black" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'robot',
    title: 'Robot Canggih',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="150" y="80" width="100" height="80" rx="10" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="175" cy="110" r="10" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="225" cy="110" r="10" fill="none" stroke="black" stroke-width="4"/>
      <path d="M170 140 L230 140" fill="none" stroke="black" stroke-width="4"/>
      <line x1="200" y1="50" x2="200" y2="80" stroke="black" stroke-width="4"/>
      <circle cx="200" cy="40" r="10" fill="none" stroke="black" stroke-width="4"/>
      <rect x="130" y="170" width="140" height="120" rx="10" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="200" cy="230" r="30" fill="none" stroke="black" stroke-width="4"/>
      <rect x="90" y="180" width="40" height="80" rx="20" fill="none" stroke="black" stroke-width="4"/>
      <rect x="270" y="180" width="40" height="80" rx="20" fill="none" stroke="black" stroke-width="4"/>
      <rect x="150" y="290" width="30" height="70" rx="10" fill="none" stroke="black" stroke-width="4"/>
      <rect x="220" y="290" width="30" height="70" rx="10" fill="none" stroke="black" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'dwarf',
    title: 'Kurcaci Rajin',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path d="M150 150 L200 50 L250 150 Z" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="200" cy="170" r="40" fill="none" stroke="black" stroke-width="4"/>
      <path d="M170 190 C170 230 230 230 230 190" fill="none" stroke="black" stroke-width="4"/>
      <ellipse cx="200" cy="180" rx="10" ry="15" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="185" cy="160" r="4" fill="black"/><circle cx="215" cy="160" r="4" fill="black"/>
      <path d="M160 210 L160 300 L240 300 L240 210" fill="none" stroke="black" stroke-width="4"/>
      <path d="M160 250 L120 270 L130 290 L160 280" fill="none" stroke="black" stroke-width="4"/>
      <path d="M240 250 L280 270 L270 290 L240 280" fill="none" stroke="black" stroke-width="4"/>
      <rect x="160" y="300" width="30" height="40" fill="none" stroke="black" stroke-width="4"/>
      <rect x="210" y="300" width="30" height="40" fill="none" stroke="black" stroke-width="4"/>
      <ellipse cx="175" cy="345" rx="25" ry="10" fill="none" stroke="black" stroke-width="4"/>
      <ellipse cx="225" cy="345" rx="25" ry="10" fill="none" stroke="black" stroke-width="4"/>
    </svg>`
  }
];

const COLORS = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF',
  '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40', '#FFFFFF', '#9E9E9E', '#000000',
  // Pastel colors
  '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB',
  '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3',
  '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC'
];

export default function ColoringModule({ onAddStars }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(COLORING_PAGES[0]);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [tool, setTool] = useState('fill'); // 'fill', 'brush', 'eraser'
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // State to handle canvas initialization
  useEffect(() => {
    loadImageToCanvas(selectedImage);
  }, [selectedImage]);

  const loadImageToCanvas = (imageObj) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG string to image and draw
    const img = new Image();
    const svgBlob = new Blob([imageObj.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Draw image scaled to fit canvas
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 255
    } : null;
  };

  // Flood fill algorithm
  const floodFill = (ctx, startX, startY, fillColorHex) => {
    const startXInt = Math.floor(startX);
    const startYInt = Math.floor(startY);
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    
    const startPos = (startYInt * canvasWidth + startXInt) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    const fillRgb = hexToRgb(fillColorHex);
    if (!fillRgb) return;

    // If filling same color, return
    if (startR === fillRgb.r && startG === fillRgb.g && startB === fillRgb.b && startA === fillRgb.a) {
      return;
    }

    const tolerance = 50; // Tolerance for anti-aliasing
    
    const matchStartColor = (pos) => {
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const a = data[pos + 3];
      return (
        Math.abs(r - startR) <= tolerance &&
        Math.abs(g - startG) <= tolerance &&
        Math.abs(b - startB) <= tolerance &&
        Math.abs(a - startA) <= tolerance
      );
    };

    const pixelStack = [[startXInt, startYInt]];

    while (pixelStack.length > 0) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * canvasWidth + x) * 4;
      while (y-- >= 0 && matchStartColor(pixelPos)) {
        pixelPos -= canvasWidth * 4;
      }
      pixelPos += canvasWidth * 4;
      ++y;

      let reachLeft = false;
      let reachRight = false;

      while (y++ < canvasHeight - 1 && matchStartColor(pixelPos)) {
        data[pixelPos] = fillRgb.r;
        data[pixelPos + 1] = fillRgb.g;
        data[pixelPos + 2] = fillRgb.b;
        data[pixelPos + 3] = 255;

        if (x > 0) {
          if (matchStartColor(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < canvasWidth - 1) {
          if (matchStartColor(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
        pixelPos += canvasWidth * 4;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'fill') {
      kidAudio.playPop();
      floodFill(ctx, coords.x, coords.y, activeColor);
    } else {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawing || tool === 'fill') return;
    
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    
    ctx.lineTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    
    if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
    } else {
      ctx.strokeStyle = activeColor;
    }
    
    ctx.stroke();
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const handleFinish = () => {
    if (!isFinished) {
      kidAudio.playSuccess();
      onAddStars(20);
      setIsFinished(true);
      
      kidAudio.speak('Wah, gambarmu bagus sekali! Kamu mendapat 20 bintang!');
    }
  };

  const downloadImage = () => {
    kidAudio.playPop();
    const link = document.createElement('a');
    link.download = `mewarnai-${selectedImage.id}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="module-container animate-fade-in pb-24">
      <div className="module-header bg-white/60 backdrop-blur-md p-4 rounded-3xl mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-rose-500 text-white p-3 rounded-2xl shadow-lg shadow-rose-200">
            <Palette size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Mewarnai Seru</h2>
            <p className="text-slate-600 font-medium">Pilih gambar, alat, dan warna kesukaanmu!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Toolbar Kiri: Gambar & Alat */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-slate-100">
            <h3 className="font-bold text-slate-700 mb-3">Pilih Gambar:</h3>
            <div className="grid grid-cols-2 gap-2">
              {COLORING_PAGES.map(img => (
                <button
                  key={img.id}
                  onClick={() => { kidAudio.playPop(); setSelectedImage(img); setIsFinished(false); }}
                  className={`p-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedImage.id === img.id ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:border-rose-300'}`}
                >
                  {img.title}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-slate-100">
            <h3 className="font-bold text-slate-700 mb-3">Alat:</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { kidAudio.playPop(); setTool('fill'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 ${tool === 'fill' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}
              >
                <PaintBucket size={24} />
                <span className="text-xs font-bold mt-1">Ember</span>
              </button>
              <button
                onClick={() => { kidAudio.playPop(); setTool('brush'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 ${tool === 'brush' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500'}`}
              >
                <Pen size={24} />
                <span className="text-xs font-bold mt-1">Kuas</span>
              </button>
              <button
                onClick={() => { kidAudio.playPop(); setTool('eraser'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 ${tool === 'eraser' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 text-slate-500'}`}
              >
                <Eraser size={24} />
                <span className="text-xs font-bold mt-1">Hapus</span>
              </button>
            </div>
            
            {tool === 'brush' && (
              <div className="mt-4">
                <label className="text-sm font-bold text-slate-600 mb-1 block">Ukuran Kuas:</label>
                <input 
                  type="range" min="2" max="40" value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-slate-100">
            <h3 className="font-bold text-slate-700 mb-3">Aksi:</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => loadImageToCanvas(selectedImage)}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl font-bold"
              >
                <RotateCcw size={18} /> Ulangi
              </button>
              <button 
                onClick={downloadImage}
                className="flex items-center justify-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-3 rounded-xl font-bold"
              >
                <Download size={18} /> Simpan Gambar
              </button>
            </div>
          </div>
        </div>

        {/* Tengah: Canvas area */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div 
            className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 border-4 border-white relative overflow-hidden"
            ref={containerRef}
            style={{ touchAction: 'none' }} // Prevent scrolling on touch
          >
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="bg-white rounded-3xl w-full max-w-[500px] h-auto object-contain cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerOut={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            {isFinished && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-3xl pointer-events-none animate-fade-in">
                <div className="bg-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-bounce-gentle">
                  <span className="text-3xl">🌟</span>
                  <span className="font-black text-xl text-amber-500">+20 Bintang!</span>
                </div>
              </div>
            )}
          </div>
          
          {!isFinished && (
            <button 
              onClick={handleFinish}
              className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-4 rounded-full font-black text-lg shadow-lg hover:scale-105 active:scale-95 transition-all w-full max-w-[500px]"
            >
              <CheckCircle size={24} /> Selesai Mewarnai!
            </button>
          )}
        </div>

        {/* Kanan: Palette Warna */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100 h-full">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Palette size={20} className="text-rose-500"/> Palet Warna
            </h3>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3">
              {COLORS.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => { kidAudio.playPop(); setActiveColor(color); setTool('fill'); }}
                  className={`w-full aspect-square rounded-full shadow-inner border-2 transition-transform ${activeColor === color && tool !== 'eraser' ? 'scale-110 border-slate-800 shadow-md' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm font-bold text-slate-500 mb-2">Warna Terpilih:</p>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full shadow-md border-4 border-white"
                  style={{ backgroundColor: tool === 'eraser' ? '#FFFFFF' : activeColor }}
                />
                <span className="font-mono text-slate-600 font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {tool === 'eraser' ? 'Penghapus' : activeColor}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
