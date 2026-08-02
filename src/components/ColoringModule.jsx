import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { kidAudio } from '../utils/audio';

// Custom Full-Color Kid-Friendly Icons (SVGs)
const PaintBucketIcon = () => (
  <svg viewBox="0 0 100 100" className="w-9 h-9 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M68 25 L82 15 C88 10 95 18 90 25 L75 38" stroke="#1E3A8A" strokeWidth="5" strokeLinecap="round" fill="#93C5FD"/>
    <path d="M20 40 L80 40 L70 90 L30 90 Z" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="5" strokeLinejoin="round" />
    <ellipse cx="50" cy="40" rx="30" ry="12" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="5" />
    <path d="M30 45 C30 75 70 75 70 45" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
    <circle cx="20" cy="82" r="7" fill="#60A5FA" />
    <circle cx="10" cy="94" r="4" fill="#60A5FA" />
    <circle cx="30" cy="97" r="3" fill="#60A5FA" />
  </svg>
);

const BrushIcon = () => (
  <svg viewBox="0 0 100 100" className="w-9 h-9 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 80 L45 80 L55 35 L15 35 Z" fill="#FCD34D" stroke="#92400E" strokeWidth="5" strokeLinejoin="round" />
    <path d="M15 35 C10 15 20 5 35 5 C50 5 60 15 55 35 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="5" />
    <path d="M25 80 L45 80 L35 95 Z" fill="#F87171" stroke="#92400E" strokeWidth="5" strokeLinejoin="round" />
    <path d="M15 35 Q35 45 55 35" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
    <path d="M22 20 Q35 30 48 20" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const EraserIcon = () => (
  <svg viewBox="0 0 100 100" className="w-9 h-9 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-25 50 50)">
      <rect x="25" y="35" width="55" height="35" rx="8" fill="#F472B6" stroke="#831843" strokeWidth="5" />
      <rect x="25" y="35" width="25" height="35" rx="8" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="5" />
      <path d="M35 40 L35 65" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <path d="M60 40 L70 40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 100 100" className="w-6 h-6 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15 L65 15 L85 35 L85 85 L20 85 Z" fill="#34D399" stroke="#064E3B" strokeWidth="8" strokeLinejoin="round" />
    <rect x="35" y="15" width="30" height="25" fill="#ECFDF5" stroke="#064E3B" strokeWidth="6" />
    <rect x="30" y="55" width="40" height="30" fill="#ECFDF5" stroke="#064E3B" strokeWidth="6" />
    <line x1="40" y1="70" x2="60" y2="70" stroke="#064E3B" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 100 100" className="w-6 h-6 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 A30 30 0 1 1 20 50" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
    <path d="M20 20 L20 55 L55 55" stroke="#FFFFFF" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const CheckFinishIcon = () => (
  <svg viewBox="0 0 100 100" className="w-7 h-7 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#FDE68A" stroke="#B45309" strokeWidth="6" />
    <path d="M30 50 L45 65 L70 35" stroke="#B45309" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// High Quality Kid-Friendly SVGs with thick black outlines
const COLORING_PAGES = [
  {
    id: 'princess',
    title: 'Putri Elsa',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 70 L75 85 L90 90 L75 95 L70 110 L65 95 L50 90 L65 85 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M420 80 L424 92 L436 96 L424 100 L420 112 L416 100 L404 96 L416 92 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M430 380 L433 390 L443 393 L433 396 L430 406 L427 396 L417 393 L427 390 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M210 100 L220 60 L235 85 L250 50 L265 85 L280 60 L290 100 Z" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="220" cy="60" r="7" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="250" cy="50" r="9" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="280" cy="60" r="7" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M180 130 C160 80 340 80 320 130 C340 180 350 250 330 320 C310 250 300 200 290 170 C210 200 190 250 170 320 C150 250 160 180 180 130 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="250" cy="140" rx="45" ry="50" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="230" cy="135" rx="8" ry="12" fill="#222"/>
      <circle cx="228" cy="130" r="3" fill="#FFFFFF"/>
      <ellipse cx="270" cy="135" rx="8" ry="12" fill="#222"/>
      <circle cx="268" cy="130" r="3" fill="#FFFFFF"/>
      <path d="M220 120 Q230 115 240 122" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <path d="M260 122 Q270 115 280 120" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="220" cy="148" rx="7" ry="5" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <ellipse cx="280" cy="148" rx="7" ry="5" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <path d="M240 155 Q250 168 260 155" fill="#FFFFFF" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <rect x="240" y="185" width="20" height="20" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M220 200 L280 200 L295 250 L205 250 Z" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <path d="M205 250 C150 330 120 420 100 460 L400 460 C380 420 350 330 295 250 Z" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <path d="M100 460 Q250 490 400 460" fill="none" stroke="#222" stroke-width="5"/>
      <path d="M140 370 Q250 400 360 370" fill="none" stroke="#222" stroke-width="4"/>
      <path d="M170 300 Q250 325 330 300" fill="none" stroke="#222" stroke-width="4"/>
      <circle cx="250" cy="225" r="8" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M220 205 L160 250 L170 260 L215 225" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M280 205 L340 240 L348 225 L285 195" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M340 240 L370 170" fill="none" stroke="#222" stroke-width="5"/>
      <path d="M370 170 L374 158 L386 162 L378 172 L388 180 L375 182 L372 195 L366 183 L354 184 L363 175 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'superhero',
    title: 'Spiderman',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
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
      <path d="M250 50 L100 120" stroke="#222" stroke-width="4" stroke-dasharray="8 6"/>
      <path d="M250 50 L400 120" stroke="#222" stroke-width="4" stroke-dasharray="8 6"/>
      <ellipse cx="250" cy="140" rx="65" ry="75" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <path d="M205 120 C190 100 230 110 240 145 C230 155 200 150 205 120 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <path d="M295 120 C310 100 270 110 260 145 C270 155 300 150 295 120 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <path d="M250 65 L250 215" stroke="#222" stroke-width="3"/>
      <path d="M185 140 L315 140" stroke="#222" stroke-width="3"/>
      <path d="M210 90 L290 190" stroke="#222" stroke-width="3"/>
      <path d="M290 90 L210 190" stroke="#222" stroke-width="3"/>
      <path d="M190 210 L310 210 L330 340 L170 340 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <ellipse cx="250" cy="265" rx="12" ry="18" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M250 255 L220 235 M250 265 L215 265 M250 275 L220 295" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <path d="M250 255 L280 235 M250 265 L285 265 M250 275 L280 295" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <rect x="180" y="340" width="140" height="30" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="235" y="335" width="30" height="40" rx="5" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M180 370 L160 460 L230 460 L240 370" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <path d="M320 370 L340 460 L270 460 L260 370" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <path d="M190 215 L120 260 L140 290 L195 245" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M310 215 L380 260 L360 290 L305 245" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
    </svg>`
  },
  {
    id: 'robot',
    title: 'Robot Canggih',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <line x1="250" y1="40" x2="250" y2="90" stroke="#222" stroke-width="6"/>
      <circle cx="250" cy="30" r="16" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="250" cy="30" r="6" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <rect x="160" y="90" width="180" height="130" rx="30" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <rect x="130" y="130" width="30" height="50" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="340" y="130" width="30" height="50" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="185" y="110" width="130" height="90" rx="15" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="215" cy="145" r="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="215" cy="145" r="6" fill="#222"/>
      <circle cx="285" cy="145" r="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="285" cy="145" r="6" fill="#222"/>
      <path d="M215 175 Q250 190 285 175" stroke="#222" stroke-width="5" stroke-linecap="round" fill="none"/>
      <rect x="220" y="220" width="60" height="25" rx="5" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="150" y="245" width="200" height="170" rx="25" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <circle cx="250" cy="325" r="45" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M250 310 C240 295 220 305 230 325 L250 345 L270 325 C280 305 260 295 250 310 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="180" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="210" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="290" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="320" cy="275" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M150 270 L80 320 L100 350 L150 310" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="85" cy="335" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M350 270 L420 320 L400 350 L350 310" fill="#FFFFFF" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="415" cy="335" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <rect x="180" y="415" width="45" height="55" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <rect x="275" y="415" width="45" height="55" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="202" cy="470" rx="35" ry="15" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="297" cy="470" rx="35" ry="15" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
    </svg>`
  },
  {
    id: 'gnome',
    title: 'Kurcaci Jamur',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M260 140 C180 50 440 50 380 140 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="300" cy="90" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="350" cy="110" r="12" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="280" cy="120" r="10" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M280 140 C270 240 290 320 290 380 L410 380 C410 320 430 240 400 140 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <path d="M325 290 C325 250 375 250 375 290 L375 380 L325 380 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="365" cy="335" r="4" fill="#222"/>
      <circle cx="340" cy="200" r="22" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <line x1="340" y1="178" x2="340" y2="222" stroke="#222" stroke-width="4"/>
      <line x1="318" y1="200" x2="362" y2="200" stroke="#222" stroke-width="4"/>
      <path d="M30 420 Q250 460 470 420" stroke="#222" stroke-width="5" fill="none"/>
      <path d="M100 220 L150 90 L190 230 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="150" cy="80" r="12" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="145" cy="235" r="30" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="145" cy="240" rx="8" ry="6" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="132" cy="228" r="4" fill="#222"/>
      <circle cx="158" cy="228" r="4" fill="#222"/>
      <path d="M115 240 C90 320 200 320 175 240 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M115 290 L85 410 L205 410 L175 290 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <rect x="95" y="340" width="100" height="20" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <rect x="135" y="335" width="20" height="30" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <ellipse cx="110" cy="425" rx="25" ry="12" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="180" cy="425" rx="25" ry="12" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
    </svg>`
  },
  {
    id: 'dino',
    title: 'Dino Cilik',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M320 260 L370 150 L430 150 L470 260 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M360 150 C380 180 410 180 440 150" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M150 180 C130 90 270 90 270 180 C270 230 150 230 150 180 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <circle cx="220" cy="140" r="16" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <circle cx="224" cy="140" r="6" fill="#222"/>
      <circle cx="220" cy="136" r="2" fill="#FFFFFF"/>
      <circle cx="245" cy="170" r="8" fill="#FFFFFF" stroke="#222" stroke-width="3"/>
      <path d="M200 180 Q225 195 240 185" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <path d="M160 210 C100 240 100 360 170 390 C250 410 270 340 260 210 Z" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <path d="M115 320 C40 330 40 400 90 400 C120 400 135 370 135 340 Z" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M160 120 L135 135 L152 148 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M142 160 L115 175 L138 188 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M130 220 L100 235 L125 248 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M115 270 L85 285 L110 298 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <path d="M230 250 C260 260 260 280 240 285 C230 285 225 270 225 255 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <ellipse cx="170" cy="415" rx="30" ry="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <ellipse cx="240" cy="415" rx="30" ry="18" fill="#FFFFFF" stroke="#222" stroke-width="5"/>
      <path d="M190 240 C240 260 240 350 200 380" fill="none" stroke="#222" stroke-width="4" stroke-dasharray="6 4"/>
    </svg>`
  },
  {
    id: 'car',
    title: 'Mobil Balap',
    svg: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 300 L120 200 L250 180 L350 200 L420 300 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <path d="M120 200 L140 130 C150 100 250 100 260 130 L280 200 Z" fill="#FFFFFF" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <rect x="40" y="300" width="420" height="50" rx="10" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <!-- Wheels -->
      <circle cx="140" cy="350" r="40" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <circle cx="140" cy="350" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <circle cx="360" cy="350" r="40" fill="#FFFFFF" stroke="#222" stroke-width="6"/>
      <circle cx="360" cy="350" r="15" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <!-- Headlight -->
      <ellipse cx="430" cy="270" rx="10" ry="20" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
      <!-- Racing Stripe -->
      <path d="M150 250 L350 250 L340 270 L140 270 Z" fill="#FFFFFF" stroke="#222" stroke-width="4"/>
    </svg>`
  }
];

// Rich palette presented directly in SQUARE COLOR TILES (tanpa teks)
const SQUARE_COLORS = [
  // Vibrant Colors
  { hex: '#FF2A2A' },
  { hex: '#FF7A00' },
  { hex: '#FFD600' },
  { hex: '#00E676' },
  { hex: '#00B0FF' },
  { hex: '#651FFF' },
  { hex: '#D500F9' },
  { hex: '#FF1744' },
  // Soft Pastels
  { hex: '#FFB7B2' },
  { hex: '#FFDAC1' },
  { hex: '#E2F0CB' },
  { hex: '#B5EAD7' },
  { hex: '#C7CEEA' },
  { hex: '#E1BEE7' },
  { hex: '#F8BBD0' },
  { hex: '#FFF9C4' },
  // Character & Skin & Neutrals
  { hex: '#FFDFC4' },
  { hex: '#E0AC69' },
  { hex: '#8D6E63' },
  { hex: '#4E342E' },
  { hex: '#FFC107' },
  { hex: '#9E9E9E' },
  { hex: '#1E1E1E' },
  { hex: '#FFFFFF' },
];

export default function ColoringModule({ onAddStars }) {
  const canvasRef = useRef(null);
  
  // Tampilan dua tahap: jika selectedImage null, tampilkan galeri.
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [activeColor, setActiveColor] = useState(SQUARE_COLORS[0].hex);
  const [tool, setTool] = useState('fill'); // 'fill', 'brush', 'eraser'
  const [brushSize, setBrushSize] = useState(14);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Load selected SVG to Canvas
  useEffect(() => {
    if (selectedImage) {
      loadImageToCanvas(selectedImage);
    }
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

  const handleColorSelect = (colorHex) => {
    kidAudio.playPop();
    setActiveColor(colorHex);
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

  // ----------------------------------------------------
  // RENDER TAHAP 1: GALERI PEMILIHAN GAMBAR
  // ----------------------------------------------------
  if (!selectedImage) {
    return (
      <div className="module-container animate-fade-in pb-20 max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-[2.5rem] p-8 shadow-xl border-4 border-white">
          <h2 className="text-4xl font-black text-white drop-shadow-md mb-2">Pilih Gambar Favoritmu!</h2>
          <p className="text-blue-50 font-bold text-lg">Sentuh salah satu gambar di bawah ini untuk mulai mewarnai.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLORING_PAGES.map(img => (
            <button
              key={img.id}
              onClick={() => {
                kidAudio.playPop();
                setSelectedImage(img);
                setIsFinished(false);
                kidAudio.speak(`Mari mewarnai ${img.title}!`);
              }}
              className="bg-white rounded-3xl p-4 shadow-lg border-4 border-amber-200 hover:scale-105 active:scale-95 transition-transform flex flex-col items-center"
            >
              <div 
                className="w-full aspect-square bg-slate-50 rounded-2xl mb-4 border-2 border-slate-100 p-2"
                dangerouslySetInnerHTML={{ __html: img.svg }}
              />
              <span className="font-black text-slate-700 text-xl text-center">{img.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER TAHAP 2: KANVAS MEWARNAI
  // ----------------------------------------------------
  return (
    <div className="module-container animate-fade-in pb-20 max-w-7xl mx-auto px-2">
      
      {/* Header Kecil dengan Tombol Kembali */}
      <div className="mb-4 flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => { kidAudio.playPop(); setSelectedImage(null); }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all active:scale-95"
        >
          <ArrowLeft size={18} /> Ganti Gambar
        </button>
        <span className="font-black text-slate-700 text-lg flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" /> Mewarnai {selectedImage.title}
        </span>
        <button
          onClick={() => kidAudio.speakFunFact('Ketuk kotak warna di sebelah kanan untuk memilih warna, lalu sentuh gambar untuk mengisi warnanya!')}
          className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
        >
          <Volume2 size={18} /> Petunjuk Suara
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL KIRI / TENGAH (8 col): Alat & Kanvas */}
        <div className="lg:col-span-9 flex flex-col items-center w-full">
          
          {/* Selector Alat Mewarnai */}
          <div className="w-full max-w-[600px] bg-white rounded-3xl p-3 shadow-md border-4 border-slate-100 mb-4">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => { kidAudio.playPop(); setTool('fill'); }}
                className={`p-2 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                  tool === 'fill' ? 'border-blue-500 bg-blue-50 shadow-md scale-105' : 'border-slate-100 bg-slate-50 hover:bg-blue-50'
                }`}
              >
                <PaintBucketIcon />
                <span className={`text-xs mt-1 font-bold ${tool === 'fill' ? 'text-blue-700' : 'text-slate-600'}`}>Ember Cat</span>
              </button>

              <button
                onClick={() => { kidAudio.playPop(); setTool('brush'); }}
                className={`p-2 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                  tool === 'brush' ? 'border-amber-500 bg-amber-50 shadow-md scale-105' : 'border-slate-100 bg-slate-50 hover:bg-amber-50'
                }`}
              >
                <BrushIcon />
                <span className={`text-xs mt-1 font-bold ${tool === 'brush' ? 'text-amber-700' : 'text-slate-600'}`}>Kuas</span>
              </button>

              <button
                onClick={() => { kidAudio.playPop(); setTool('eraser'); }}
                className={`p-2 rounded-2xl border-3 flex flex-col items-center justify-center transition-all ${
                  tool === 'eraser' ? 'border-pink-500 bg-pink-50 shadow-md scale-105' : 'border-slate-100 bg-slate-50 hover:bg-pink-50'
                }`}
              >
                <EraserIcon />
                <span className={`text-xs mt-1 font-bold ${tool === 'eraser' ? 'text-pink-700' : 'text-slate-600'}`}>Penghapus</span>
              </button>
            </div>

            {/* Slider Ukuran Kuas */}
            {tool !== 'fill' && (
              <div className="mt-3 pt-3 border-t border-slate-100 px-2 flex items-center gap-3">
                <span className="text-xs font-black text-slate-600 flex-shrink-0">Tebal:</span>
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
          <div className="relative w-full max-w-[600px] bg-white p-4 rounded-[2.5rem] shadow-xl border-4 border-slate-200">
            <div className="bg-white rounded-3xl overflow-hidden shadow-inner border-2 border-slate-100 relative">
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="w-full aspect-square object-contain cursor-crosshair touch-none bg-white"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerOut={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />

              {/* Celebration Overlay */}
              {isFinished && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 animate-fade-in">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-amber-400 flex flex-col items-center animate-bounce-gentle">
                    <CheckFinishIcon />
                    <h4 className="font-black text-3xl text-amber-500 mt-4 mb-2">Hebat Sekali!</h4>
                    <p className="text-sm text-slate-600 font-bold mb-4">Karya mewarnaimu sangat indah!</p>
                    <button
                      onClick={() => setIsFinished(false)}
                      className="bg-amber-400 hover:bg-amber-500 text-white px-8 py-3 rounded-full font-black text-sm shadow-md transition-all active:scale-95"
                    >
                      Lanjut Mewarnai
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Aksi Bawah Kanvas (Simpan & Ulangi) */}
          <div className="w-full max-w-[600px] mt-4 flex gap-3">
            <button 
              onClick={() => {
                kidAudio.playPop();
                loadImageToCanvas(selectedImage);
                setIsFinished(false);
              }}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-md shadow-rose-200 active:scale-95 transition-all text-sm"
            >
              <ResetIcon /> Ulangi Bersih
            </button>
            <button 
              onClick={downloadImage}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-md shadow-emerald-200 active:scale-95 transition-all text-sm"
            >
              <SaveIcon /> Simpan Karya
            </button>
          </div>
          
          {!isFinished && (
            <button 
              onClick={handleFinish}
              className="w-full max-w-[600px] mt-3 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white p-4 rounded-2xl font-black text-lg shadow-md shadow-amber-200 active:scale-95 transition-all"
            >
              Selesai Mewarnai! (+20 🌟)
            </button>
          )}

        </div>

        {/* PANEL KANAN (3 col): PALET KOTAK WARNA VERTIKAL */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-slate-100 flex flex-col h-full max-h-[800px]">
            
            <div className="text-center mb-3 pb-2 border-b-2 border-slate-100">
              <h3 className="font-black text-slate-800 text-lg">Warna</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Pilih Kotak Warna</p>
            </div>

            {/* Grid Kotak Warna (Vertikal, Tegak lurus ke bawah) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-3 overflow-y-auto pr-2 pb-2">
              {SQUARE_COLORS.map((colorObj, idx) => {
                const isSelected = activeColor === colorObj.hex && tool !== 'eraser';
                const isLight = colorObj.hex === '#FFFFFF' || colorObj.hex === '#FFF9C4' || colorObj.hex === '#FFDFC4';

                return (
                  <button
                    key={idx}
                    onClick={() => handleColorSelect(colorObj.hex)}
                    className={`w-full aspect-square rounded-2xl transition-all flex flex-col items-center justify-center border-4 shadow-sm ${
                      isSelected 
                        ? 'scale-110 border-slate-900 shadow-xl z-10' 
                        : 'border-black/10 hover:scale-105 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: colorObj.hex }}
                  >
                    {isSelected && (
                      <div className={`w-4 h-4 rounded-full ${isLight ? 'bg-slate-900' : 'bg-white'} shadow-sm animate-pulse`} />
                    )}
                  </button>
                );
              })}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
