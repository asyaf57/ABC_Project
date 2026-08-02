import React, { useState, useRef, useEffect } from 'react';
import { Palette, PaintBucket, Pen, Eraser, Download, RotateCcw, CheckCircle, Sparkles, Volume2, Undo, Brush, Image as ImageIcon, Heart } from 'lucide-react';
import { kidAudio } from '../utils/audio';

// High Quality Kid-Friendly SVGs with thick black outlines & clear fillable regions
const COLORING_PAGES = [
  {
    id: 'princess',
    title: 'Putri Elsa',
    icon: '👑',
    category: 'Dongeng',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Background Stars -->
      <path d="M70 70 L75 85 L90 90 L75 95 L70 110 L65 95 L50 90 L65 85 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M420 80 L424 92 L436 96 L424 100 L420 112 L416 100 L404 96 L416 92 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M430 380 L433 390 L443 393 L433 396 L430 406 L427 396 L417 393 L427 390 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      
      <!-- Crown -->
      <path d="M210 100 L220 60 L235 85 L250 50 L265 85 L280 60 L290 100 Z" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="220" cy="60" r="7" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="250" cy="50" r="9" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="280" cy="60" r="7" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      
      <!-- Hair -->
      <path d="M180 130 C160 80 340 80 320 130 C340 180 350 250 330 320 C310 250 300 200 290 170 C210 200 190 250 170 320 C150 250 160 180 180 130 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>

      <!-- Head & Face -->
      <ellipse cx="250" cy="140" rx="45" ry="50" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      
      <!-- Eyes -->
      <ellipse cx="230" cy="135" rx="8" ry="12" fill="#222"/>
      <circle cx="228" cy="130" r="3" fill="#FFFFFF"/>
      <ellipse cx="270" cy="135" rx="8" ry="12" fill="#222"/>
      <circle cx="268" cy="130" r="3" fill="#FFFFFF"/>
      
      <!-- Eyelashes & Brows -->
      <path d="M220 120 Q230 115 240 122" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <path d="M260 122 Q270 115 280 120" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Cheeks & Smile -->
      <ellipse cx="220" cy="148" rx="7" ry="5" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <ellipse cx="280" cy="148" rx="7" ry="5" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <path d="M240 155 Q250 168 260 155" fill="#FFFFFF" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Neck -->
      <rect x="240" y="185" width="20" height="20" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      
      <!-- Magic Dress -->
      <path d="M220 200 L280 200 L295 250 L205 250 Z" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <path d="M205 250 C150 330 120 420 100 460 L400 460 C380 420 350 330 295 250 Z" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      
      <!-- Dress Patterns / Frills -->
      <path d="M100 460 Q250 490 400 460" fill="none" stroke="#222" stroke-width="5"/>
      <path d="M140 370 Q250 400 360 370" fill="none" stroke="#222" stroke-width="4"/>
      <path d="M170 300 Q250 325 330 300" fill="none" stroke="#222" stroke-width="4"/>
      <circle cx="250" cy="225" r="8" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Arms -->
      <path d="M220 205 L160 250 L170 260 L215 225" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M280 205 L340 240 L348 225 L285 195" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Magic Wand -->
      <path d="M340 240 L370 170" fill="none" stroke="#222" stroke-width="5"/>
      <path d="M370 170 L374 158 L386 162 L378 172 L388 180 L375 182 L372 195 L366 183 L354 184 L363 175 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'superhero',
    title: 'Spiderman',
    icon: '🕸️',
    category: 'Aksi',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <!-- City Skyline Background -->
      <rect x="40" y="280" width="70" height="180" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <rect x="55" y="300" width="15" height="20" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <rect x="80" y="300" width="15" height="20" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <rect x="55" y="340" width="15" height="20" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <rect x="80" y="340" width="15" height="20" fill="#FFFFFF" stroke="#222" stroke-width="3"/>

      <rect x="390" y="240" width="80" height="220" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <rect x="410" y="260" width="18" height="25" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <rect x="440" y="260" width="18" height="25" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <rect x="410" y="300" width="18" height="25" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <rect x="440" y="300" width="18" height="25" fill="#FFFFFF" stroke="#222" stroke-width="3"/>

      <!-- Web Lines -->
      <path d="M250 50 L100 120" stroke="#222" stroke-width="4" stroke-dasharray="8 6"/>
      <path d="M250 50 L400 120" stroke="#222" stroke-width="4" stroke-dasharray="8 6"/>
      
      <!-- Superhero Head Mask -->
      <ellipse cx="250" cy="140" rx="65" ry="75" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      
      <!-- Big Spider Mask Eyes -->
      <path d="M205 120 C190 100 230 110 240 145 C230 155 200 150 205 120 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <path d="M295 120 C310 100 270 110 260 145 C270 155 300 150 295 120 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      
      <!-- Mask Web Details -->
      <path d="M250 65 L250 215" stroke="#222" stroke-width="3"/>
      <path d="M185 140 L315 140" stroke="#222" stroke-width="3"/>
      <path d="M210 90 L290 190" stroke="#222" stroke-width="3"/>
      <path d="M290 90 L210 190" stroke="#222" stroke-width="3"/>

      <!-- Superhero Body -->
      <path d="M190 210 L310 210 L330 340 L170 340 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      
      <!-- Spider Chest Emblem -->
      <ellipse cx="250" cy="265" rx="12" ry="18" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M250 255 L220 235 M250 265 L215 265 M250 275 L220 295" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <path d="M250 255 L280 235 M250 265 L285 265 M250 275 L280 295" stroke="#222" stroke-width="4" stroke-linecap="round"/>

      <!-- Strong Muscles Belt -->
      <rect x="180" y="340" width="140" height="30" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="235" y="335" width="30" height="40" rx="5" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Legs -->
      <path d="M180 370 L160 460 L230 460 L240 370" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <path d="M320 370 L340 460 L270 460 L260 370" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>

      <!-- Arms / Flying Pose -->
      <path d="M190 215 L120 260 L140 290 L195 245" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M310 215 L380 260 L360 290 L305 245" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
    </svg>`
  },
  {
    id: 'robot',
    title: 'Robot Canggih',
    icon: '🤖',
    category: 'Teknologi',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Antenna -->
      <line x1="250" y1="40" x2="250" y2="90" stroke="#222" stroke-width="6"/>
      <circle cx="250" cy="30" r="16" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="250" cy="30" r="6" fill="#FFFFFF" stroke="#222" stroke-width="3"/>

      <!-- Head -->
      <rect x="160" y="90" width="180" height="130" rx="30" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      
      <!-- Ears / Screws -->
      <rect x="130" y="130" width="30" height="50" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="340" y="130" width="30" height="50" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>

      <!-- Screen Face -->
      <rect x="185" y="110" width="130" height="90" rx="15" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      
      <!-- Robot Eyes -->
      <circle cx="215" cy="145" r="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="215" cy="145" r="6" fill="#222"/>
      <circle cx="285" cy="145" r="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="285" cy="145" r="6" fill="#222"/>

      <!-- Mouth Screen Grid -->
      <path d="M215 175 Q250 190 285 175" stroke="#222" stroke-width="5" stroke-linecap="round" fill="none"/>

      <!-- Neck Joint -->
      <rect x="220" y="220" width="60" height="25" rx="5" fill="#FFFFFF" stroke="#222" stroke-width="5"/>

      <!-- Robot Body -->
      <rect x="150" y="245" width="200" height="170" rx="25" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      
      <!-- Chest Heart Power Screen -->
      <circle cx="250" cy="325" r="45" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M250 310 C240 295 220 305 230 325 L250 345 L270 325 C280 305 260 295 250 310 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Buttons & Knobs -->
      <circle cx="180" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="210" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="290" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="320" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Arms -->
      <path d="M150 270 L80 320 L100 350 L150 310" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="85" cy="335" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <path d="M350 270 L420 320 L400 350 L350 310" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="415" cy="335" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Legs -->
      <rect x="180" y="415" width="45" height="55" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="275" y="415" width="45" height="55" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="202" cy="470" rx="35" ry="15" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="297" cy="470" rx="35" ry="15" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
    </svg>`
  },
  {
    id: 'gnome',
    title: 'Kurcaci Jamur',
    icon: '🍄',
    category: 'Petualangan',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Mushroom House Roof -->
      <path d="M260 140 C180 50 440 50 380 140 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <!-- Mushroom Dots -->
      <circle cx="300" cy="90" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="350" cy="110" r="12" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="280" cy="120" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Mushroom House Stem -->
      <path d="M280 140 C270 240 290 320 290 380 L410 380 C410 320 430 240 400 140 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <!-- House Door & Window -->
      <path d="M325 290 C325 250 375 250 375 290 L375 380 L325 380 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="365" cy="335" r="4" fill="#222"/>
      <circle cx="340" cy="200" r="22" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <line x1="340" y1="178" x2="340" y2="222" stroke="#222" stroke-width="4"/>
      <line x1="318" y1="200" x2="362" y2="200" stroke="#222" stroke-width="4"/>

      <!-- Ground & Grass -->
      <path d="M30 420 Q250 460 470 420" stroke="#222" stroke-width="5" fill="none"/>
      
      <!-- Dwarf Pointy Hat -->
      <path d="M100 220 L150 90 L190 230 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="150" cy="80" r="12" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Dwarf Face & Beard -->
      <circle cx="145" cy="235" r="30" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="145" cy="240" rx="8" ry="6" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="132" cy="228" r="4" fill="#222"/>
      <circle cx="158" cy="228" r="4" fill="#222"/>
      <!-- Big Fluffy Beard -->
      <path d="M115 240 C90 320 200 320 175 240 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>

      <!-- Dwarf Body & Belt -->
      <path d="M115 290 L85 410 L205 410 L175 290 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <rect x="95" y="340" width="100" height="20" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <rect x="135" y="335" width="20" height="30" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Dwarf Boots -->
      <ellipse cx="110" cy="425" rx="25" ry="12" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="180" cy="425" rx="25" ry="12" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
    </svg>`
  },
  {
    id: 'dino',
    title: 'Dino Cilik',
    icon: '🦖',
    category: 'Hewan',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Volcano in background -->
      <path d="M320 260 L370 150 L430 150 L470 260 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M360 150 C380 180 410 180 440 150" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      
      <!-- Dino Head -->
      <path d="M150 180 C130 90 270 90 270 180 C270 230 150 230 150 180 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      
      <!-- Dino Eye -->
      <circle cx="220" cy="140" r="16" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="224" cy="140" r="6" fill="#222"/>
      <circle cx="220" cy="136" r="2" fill="#FFFFFF"/>
      
      <!-- Cute Cheek & Smile -->
      <circle cx="245" cy="170" r="8" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <path d="M200 180 Q225 195 240 185" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>

      <!-- Dino Body & Tail -->
      <path d="M160 210 C100 240 100 360 170 390 C250 410 270 340 260 210 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <path d="M115 320 C40 330 40 400 90 400 C120 400 135 370 135 340 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>

      <!-- Back Spikes -->
      <path d="M160 120 L135 135 L152 148 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M142 160 L115 175 L138 188 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M130 220 L100 235 L125 248 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M115 270 L85 285 L110 298 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Tiny Arms -->
      <path d="M230 250 C260 260 260 280 240 285 C230 285 225 270 225 255 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>

      <!-- Feet -->
      <ellipse cx="170" cy="415" rx="30" ry="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="240" cy="415" rx="30" ry="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      
      <!-- Belly Spot -->
      <path d="M190 240 C240 260 240 350 200 380" fill="none" stroke="#222" stroke-width="4" stroke-dasharray="6 4"/>
    </svg>`
  }
];

// Rich palette presented directly in SQUARE COLOR TILES (Kotak Warna)
const SQUARE_COLORS = [
  // Vibrant Colors
  { name: 'Merah Cabai', hex: '#FF2A2A', tag: 'Cerah' },
  { name: 'Oranye Sunkist', hex: '#FF7A00', tag: 'Cerah' },
  { name: 'Kuning Lemon', hex: '#FFD600', tag: 'Cerah' },
  { name: 'Hijau Daun', hex: '#00E676', tag: 'Cerah' },
  { name: 'Biru Laut', hex: '#00B0FF', tag: 'Cerah' },
  { name: 'Nila Terang', hex: '#651FFF', tag: 'Cerah' },
  { name: 'Ungu Permen', hex: '#D500F9', tag: 'Cerah' },
  { name: 'Merah Muda', hex: '#FF1744', tag: 'Cerah' },

  // Soft Pastels
  { name: 'Stroberi Soft', hex: '#FFB7B2', tag: 'Pastel' },
  { name: 'Peach Soft', hex: '#FFDAC1', tag: 'Pastel' },
  { name: 'Kuning Mentega', hex: '#E2F0CB', tag: 'Pastel' },
  { name: 'Hijau Mint', hex: '#B5EAD7', tag: 'Pastel' },
  { name: 'Biru Awan', hex: '#C7CEEA', tag: 'Pastel' },
  { name: 'Lavender', hex: '#E1BEE7', tag: 'Pastel' },
  { name: 'Merah Balet', hex: '#F8BBD0', tag: 'Pastel' },
  { name: 'Krem Susu', hex: '#FFF9C4', tag: 'Pastel' },

  // Character & Skin & Neutrals
  { name: 'Kulit Cerah', hex: '#FFDFC4', tag: 'Alam' },
  { name: 'Kulit Sawo', hex: '#E0AC69', tag: 'Alam' },
  { name: 'Cokelat Kayu', hex: '#8D6E63', tag: 'Alam' },
  { name: 'Cokelat Tua', hex: '#4E342E', tag: 'Alam' },
  { name: 'Emas Mewah', hex: '#FFC107', tag: 'Alam' },
  { name: 'Abu Robot', hex: '#9E9E9E', tag: 'Alam' },
  { name: 'Hitam Pekat', hex: '#1E1E1E', tag: 'Alam' },
  { name: 'Putih Bersih', hex: '#FFFFFF', tag: 'Alam' },
];

export default function ColoringModule({ onAddStars }) {
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(COLORING_PAGES[0]);
  const [activeColor, setActiveColor] = useState(SQUARE_COLORS[0].hex);
  const [activeColorName, setActiveColorName] = useState(SQUARE_COLORS[0].name);
  const [tool, setTool] = useState('fill'); // 'fill', 'brush', 'eraser'
  const [brushSize, setBrushSize] = useState(14);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Load selected SVG to Canvas
  useEffect(() => {
    loadImageToCanvas(selectedImage);
  }, [selectedImage]);

  const loadImageToCanvas = (imageObj) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Fill background with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to Image & Draw
    const img = new Image();
    const svgBlob = new Blob([imageObj.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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

  // Robust Flood-fill algorithm
  const floodFill = (ctx, startX, startY, fillColorHex) => {
    const startXInt = Math.floor(startX);
    const startYInt = Math.floor(startY);
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    if (startXInt < 0 || startXInt >= canvasWidth || startYInt < 0 || startYInt >= canvasHeight) return;

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    
    const startPos = (startYInt * canvasWidth + startXInt) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    const fillRgb = hexToRgb(fillColorHex);
    if (!fillRgb) return;

    // Avoid filling black lines (stroke border protection)
    if (startR < 40 && startG < 40 && startB < 40) return;

    // If filling same color, return
    if (Math.abs(startR - fillRgb.r) < 5 && Math.abs(startG - fillRgb.g) < 5 && Math.abs(startB - fillRgb.b) < 5) {
      return;
    }

    const tolerance = 75; // Tolerance for anti-aliased SVG shapes
    
    const matchStartColor = (pos) => {
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      
      // Stop at dark black outlines
      if (r < 50 && g < 50 && b < 50) return false;

      return (
        Math.abs(r - startR) <= tolerance &&
        Math.abs(g - startG) <= tolerance &&
        Math.abs(b - startB) <= tolerance
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

  const handleColorSelect = (colorObj) => {
    kidAudio.playPop();
    setActiveColor(colorObj.hex);
    setActiveColorName(colorObj.name);
    // Maintain tool if brush/fill, switch back if eraser
    if (tool === 'eraser') {
      setTool('fill');
    }
  };

  const handleFinish = () => {
    if (!isFinished) {
      kidAudio.playSuccess();
      onAddStars(20);
      setIsFinished(true);
      kidAudio.speakAppreciation('Wah, luar biasa! Karya mewarnaimu sangat indah!');
    }
  };

  const downloadImage = () => {
    kidAudio.playPop();
    const link = document.createElement('a');
    link.download = `karya-mewarnai-${selectedImage.id}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="module-container animate-fade-in pb-20 max-w-7xl mx-auto px-2">
      
      {/* Header Ceria Kid-Friendly dengan Icon & Badge Baru */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-5 rounded-3xl mb-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-4 border-white/50 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="bg-amber-400 text-purple-950 p-4 rounded-2xl border-2 border-white shadow-lg animate-bounce-gentle flex items-center justify-center">
            <Palette size={42} className="drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-300 text-purple-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles size={14} /> Dunia Seni Anak 🎨
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black drop-shadow-md tracking-wide mt-1">Modul Mewarnai Ajaib</h2>
            <p className="text-white/95 text-xs md:text-sm font-semibold">Pilih karakter, klik kotak warna di kanan, lalu gunakan ember atau kuas!</p>
          </div>
        </div>
        
        <button
          onClick={() => kidAudio.speakFunFact('Ketuk kotak warna di sebelah kanan untuk memilih warna, lalu sentuh gambar!')}
          className="z-10 bg-white/20 hover:bg-white/30 border-2 border-white/60 text-white px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md text-sm"
        >
          <Volume2 size={20} className="text-amber-300" />
          <span>Suara Petunjuk</span>
        </button>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Layout: Left (Karakter) | Center (Canvas & Tools) | Right (Kotak Warna Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Panel Kiri (3 col): Galeri Karakter & Tombol Simpan */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Galeri Karakter */}
          <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-purple-200">
            <h3 className="font-black text-slate-800 text-base mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon size={20} className="text-purple-600" /> Pilih Gambar:
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-black">
                {COLORING_PAGES.length} Gambar
              </span>
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              {COLORING_PAGES.map(img => (
                <button
                  key={img.id}
                  onClick={() => {
                    kidAudio.playPop();
                    setSelectedImage(img);
                    setIsFinished(false);
                    kidAudio.speak(`Mari mewarnai ${img.title}!`);
                  }}
                  className={`p-3 rounded-2xl border-3 flex items-center gap-3 transition-all text-left relative overflow-hidden ${
                    selectedImage.id === img.id
                      ? 'border-purple-500 bg-purple-100/80 shadow-md scale-[1.02] font-black text-purple-950'
                      : 'border-slate-100 bg-slate-50 hover:border-purple-300 text-slate-700 font-bold'
                  }`}
                >
                  <span className="text-3xl bg-white p-2 rounded-xl shadow-xs border border-purple-100 flex-shrink-0">
                    {img.icon}
                  </span>
                  <div className="overflow-hidden">
                    <span className="text-xs text-purple-700 font-bold uppercase block tracking-wider">{img.category}</span>
                    <span className="text-sm line-clamp-1">{img.title}</span>
                  </div>
                  {selectedImage.id === img.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-600 rounded-full animate-ping" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tombol Aksi Tambahan (Reset & Simpan) */}
          <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-amber-200 flex flex-col gap-2.5">
            <button 
              onClick={downloadImage}
              className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white p-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-200 active:scale-95 transition-all text-sm"
            >
              <Download size={22} className="animate-bounce-gentle" /> Simpan Hasil Gambar
            </button>

            <button 
              onClick={() => {
                kidAudio.playPop();
                loadImageToCanvas(selectedImage);
                setIsFinished(false);
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200 p-3 rounded-2xl font-extrabold flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
            >
              <RotateCcw size={18} className="text-slate-500" /> Ulangi Gambar Ini
            </button>
          </div>

        </div>

        {/* Panel Tengah (5 col): Canvas & Peralatan Baru */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Selector Alat Mewarnai (Bar Atas Canvas) */}
          <div className="w-full bg-white rounded-3xl p-3 shadow-lg border-4 border-blue-200 mb-4">
            <div className="grid grid-cols-3 gap-2">
              
              {/* Ember Fill Button (Attractive 3D Style) */}
              <button
                onClick={() => { kidAudio.playPop(); setTool('fill'); }}
                className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                  tool === 'fill'
                    ? 'border-blue-600 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-300/60 scale-105 font-black'
                    : 'border-slate-100 bg-slate-50 hover:bg-blue-50 text-slate-700 font-extrabold'
                }`}
              >
                <PaintBucket size={28} className={tool === 'fill' ? 'animate-bounce-gentle text-amber-300' : 'text-blue-500'} />
                <span className="text-xs mt-1">Ember Ketuk</span>
              </button>

              {/* Kuas Drawing Button (Attractive 3D Style) */}
              <button
                onClick={() => { kidAudio.playPop(); setTool('brush'); }}
                className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                  tool === 'brush'
                    ? 'border-amber-500 bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-300/60 scale-105 font-black'
                    : 'border-slate-100 bg-slate-50 hover:bg-amber-50 text-slate-700 font-extrabold'
                }`}
              >
                <Brush size={28} className={tool === 'brush' ? 'animate-bounce-gentle text-white' : 'text-amber-500'} />
                <span className="text-xs mt-1">Kuas Bebas</span>
              </button>

              {/* Penghapus Button (Attractive 3D Style) */}
              <button
                onClick={() => { kidAudio.playPop(); setTool('eraser'); }}
                className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                  tool === 'eraser'
                    ? 'border-pink-500 bg-gradient-to-b from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-300/60 scale-105 font-black'
                    : 'border-slate-100 bg-slate-50 hover:bg-pink-50 text-slate-700 font-extrabold'
                }`}
              >
                <Eraser size={28} className={tool === 'eraser' ? 'animate-bounce-gentle text-white' : 'text-pink-500'} />
                <span className="text-xs mt-1">Penghapus</span>
              </button>
            </div>

            {/* Slider Ukuran Kuas */}
            {tool !== 'fill' && (
              <div className="mt-3 pt-3 border-t border-slate-100 px-2 flex items-center gap-3">
                <span className="text-xs font-black text-slate-600 flex-shrink-0">Ukuran:</span>
                <input 
                  type="range" min="4" max="40" value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div 
                  className="rounded-full bg-slate-800 flex-shrink-0 border border-white shadow-xs" 
                  style={{ width: Math.max(8, brushSize/1.8), height: Math.max(8, brushSize/1.8) }}
                />
              </div>
            )}
          </div>

          {/* Canvas Main Frame */}
          <div className="relative w-full bg-amber-100 p-4 rounded-[2.5rem] shadow-2xl border-4 border-amber-300/90">
            
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                <Sparkles size={16} className="text-amber-500" />
                {selectedImage.title}
              </span>
              <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full uppercase">
                {tool === 'fill' ? ' Mode Ketuk Warna' : tool === 'brush' ? ' Mode Kuas' : ' Mode Penghapus'}
              </span>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-inner border-2 border-amber-200 relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full aspect-square object-contain cursor-crosshair touch-none bg-white"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerOut={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />

              {/* Celebration Overlay */}
              {isFinished && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10 animate-fade-in">
                  <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-amber-400 max-w-xs flex flex-col items-center animate-bounce-gentle">
                    <span className="text-6xl mb-2">🌟</span>
                    <h4 className="font-black text-2xl text-amber-500">Hebat Sekali!</h4>
                    <p className="text-xs text-slate-600 font-bold my-2">Kamu dapat +20 Bintang Mewarnai!</p>
                    <button
                      onClick={() => setIsFinished(false)}
                      className="mt-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2.5 rounded-full font-black text-xs shadow-md"
                    >
                      Lanjut Mewarnai
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Indicator Warna Aktif */}
            <div className="mt-3 bg-white rounded-full py-2 px-4 flex items-center justify-between border-2 border-amber-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-6 h-6 rounded-lg shadow-inner border-2 border-slate-400"
                  style={{ backgroundColor: tool === 'eraser' ? '#FFFFFF' : activeColor }}
                />
                <span className="text-xs font-black text-slate-800">
                  {tool === 'eraser' ? 'Penghapus Aktif' : activeColorName}
                </span>
              </div>
              <span className="text-[10px] text-amber-800 font-black">
                {tool === 'fill' ? 'Sentuh bagian gambar!' : 'Goreskan kuas!'}
              </span>
            </div>

          </div>

          {/* Tombol Selesai */}
          {!isFinished && (
            <button 
              onClick={handleFinish}
              className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500 text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all w-full"
            >
              <CheckCircle size={24} /> Selesai Mewarnai! (+20 🌟)
            </button>
          )}

        </div>

        {/* Panel Kanan (4 col): PALET KOTAK WARNA (SQUARE COLOR TILES GRID) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-4.5 shadow-xl border-4 border-pink-200">
            
            {/* Header Kotak Warna */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-pink-100">
              <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                <Palette size={22} className="text-pink-500" /> Kotak Warna:
              </h3>
              <span className="text-xs font-black bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full">
                {SQUARE_COLORS.length} Warna
              </span>
            </div>

            <p className="text-xs text-slate-500 font-bold mb-3">
              Ketuk salah satu **kotak warna** di bawah ini:
            </p>

            {/* Grid Kotak Warna (Chunky Square Tiles) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2.5 max-h-[480px] overflow-y-auto pr-1 p-1 bg-slate-50 rounded-2xl border-2 border-slate-100">
              {SQUARE_COLORS.map((colorObj, idx) => {
                const isSelected = activeColor === colorObj.hex && tool !== 'eraser';
                const isLight = colorObj.hex === '#FFFFFF' || colorObj.hex === '#FFF9C4' || colorObj.hex === '#FFDFC4' || colorObj.hex === '#FFF9C4';

                return (
                  <button
                    key={idx}
                    onClick={() => handleColorSelect(colorObj)}
                    className={`w-full aspect-square rounded-2xl transition-all flex flex-col items-center justify-center relative border-3 shadow-md ${
                      isSelected 
                        ? 'scale-105 border-slate-900 shadow-xl ring-4 ring-pink-400 z-10' 
                        : 'border-slate-200/80 hover:scale-105 hover:border-pink-300'
                    }`}
                    style={{ backgroundColor: colorObj.hex }}
                    title={colorObj.name}
                  >
                    {isSelected && (
                      <div className={`p-1 rounded-full ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-md animate-bounce-gentle`}>
                        <CheckCircle size={16} strokeWidth={3} />
                      </div>
                    )}

                    {/* Badge Tag tipis di sudut bawah */}
                    <span 
                      className={`absolute bottom-1 text-[8px] font-black tracking-tighter px-1 rounded ${
                        isLight ? 'text-slate-800 bg-black/10' : 'text-white bg-black/30'
                      }`}
                    >
                      {colorObj.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Papan Info Warna Aktif */}
            <div className="mt-4 p-3.5 bg-pink-50 rounded-2xl border-2 border-pink-200 flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl shadow-md border-3 border-white flex-shrink-0"
                style={{ backgroundColor: tool === 'eraser' ? '#FFFFFF' : activeColor }}
              />
              <div className="overflow-hidden">
                <span className="text-[10px] text-pink-700 font-extrabold uppercase block tracking-wider">Terpilih:</span>
                <span className="font-black text-slate-800 text-sm truncate block">
                  {tool === 'eraser' ? 'Penghapus Putih' : activeColorName}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
