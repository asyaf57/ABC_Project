import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RefreshCw, Star, Map, Zap, CheckCircle } from 'lucide-react';
import { kidAudio } from '../utils/audio';

const AVATARS = [
  { id: 'rabbit', avatar: '🐰', target: '🥕', name: 'Kelinci' },
  { id: 'lion', avatar: '🦁', target: '🍖', name: 'Singa' },
  { id: 'elephant', avatar: '🐘', target: '🍌', name: 'Gajah' },
  { id: 'panda', avatar: '🐼', target: '🎋', name: 'Panda' },
  { id: 'cat', avatar: '🐱', target: '🐟', name: 'Kucing' }
];

export default function PathfindingGame({ onAddStars, setScore }) {
  const [playMode, setPlayMode] = useState(null); // 'sequence' or 'direct', null shows popup
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [level, setLevel] = useState(1);
  const [avatarPos, setAvatarPos] = useState({ r: 0, c: 0 });
  const [targetPos, setTargetPos] = useState({ r: 9, c: 9 });
  const [obstacles, setObstacles] = useState([]);
  
  const [commandSequence, setCommandSequence] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  useEffect(() => {
    // Only randomize if mode is selected
    if (playMode !== null) {
      randomizeBoard(level);
    }
  }, [playMode, selectedAvatar, level]);

  const randomizeBoard = (currentLevel) => {
    let newAvatarR, newAvatarC, newTargetR, newTargetC;
    do {
      newAvatarR = Math.floor(Math.random() * 10);
      newAvatarC = Math.floor(Math.random() * 10);
      newTargetR = Math.floor(Math.random() * 10);
      newTargetC = Math.floor(Math.random() * 10);
    } while (newAvatarR === newTargetR && newAvatarC === newTargetC);
    
    setAvatarPos({ r: newAvatarR, c: newAvatarC });
    setTargetPos({ r: newTargetR, c: newTargetC });
    
    // Generate obstacles
    let numObstacles = Math.min(currentLevel * 2, 20); // Cap at 20 to ensure solvability loosely
    let obs = [];
    for (let i = 0; i < numObstacles; i++) {
      let obsR, obsC;
      let isOverlap = true;
      let tries = 0;
      while (isOverlap && tries < 50) {
        obsR = Math.floor(Math.random() * 10);
        obsC = Math.floor(Math.random() * 10);
        
        isOverlap = (obsR === newAvatarR && obsC === newAvatarC) || 
                    (obsR === newTargetR && obsC === newTargetC) ||
                    obs.some(o => o.r === obsR && o.c === obsC);
        
        // Very basic check to avoid blocking corners completely (not perfect but helps)
        if (!isOverlap) {
            const isNearAvatar = Math.abs(obsR - newAvatarR) <= 1 && Math.abs(obsC - newAvatarC) <= 1;
            const isNearTarget = Math.abs(obsR - newTargetR) <= 1 && Math.abs(obsC - newTargetC) <= 1;
            if (isNearAvatar || isNearTarget) {
                // Allow it sometimes, but heavily discourage trapping
                if (Math.random() < 0.8) isOverlap = true; 
            }
        }
        tries++;
      }
      if (!isOverlap) obs.push({r: obsR, c: obsC});
    }
    setObstacles(obs);
    setCommandSequence([]);
    setGameSuccess(false);
  };

  const handleSelectMode = (mode) => {
    kidAudio.playPop();
    setPlayMode(mode);
    kidAudio.speak(mode === 'sequence' ? 'Mode Susun Arah dipilih!' : 'Mode Gerak Langsung dipilih!');
  };

  const isObstacle = (r, c) => obstacles.some(o => o.r === r && o.c === c);

  const checkWin = (r, c) => {
    if (r === targetPos.r && c === targetPos.c) {
      kidAudio.playSuccess();
      setGameSuccess(true);
      setScore(prev => prev + 25);
      if (typeof onAddStars === 'function') onAddStars(4);
      kidAudio.speak(`Hebat! ${selectedAvatar.name} menemukan makanannya! Naik ke level berikutnya!`);
      
      setTimeout(() => {
        setLevel(prev => prev + 1);
      }, 3000);
    }
  };

  // --- SEQUENCE MODE ---
  const addCommand = (dir) => {
    if (isExecuting || gameSuccess || playMode !== 'sequence') return;
    kidAudio.playPop();
    setCommandSequence(prev => [...prev, dir]);
  };

  const executeCode = async () => {
    if (commandSequence.length === 0 || isExecuting || gameSuccess) return;
    setIsExecuting(true);
    let curr = { ...avatarPos };
    kidAudio.speak('Menjalankan algoritma...');

    for (let i = 0; i < commandSequence.length; i++) {
      await new Promise(res => setTimeout(res, 500));
      const cmd = commandSequence[i];
      let nextR = curr.r;
      let nextC = curr.c;

      if (cmd === 'RIGHT' && curr.c < 9) nextC++;
      else if (cmd === 'LEFT' && curr.c > 0) nextC--;
      else if (cmd === 'DOWN' && curr.r < 9) nextR++;
      else if (cmd === 'UP' && curr.r > 0) nextR--;

      if (!isObstacle(nextR, nextC)) {
        curr = { r: nextR, c: nextC };
        setAvatarPos(curr);
        kidAudio.playPop();
      } else {
        kidAudio.playWrong();
        kidAudio.speak('Aduh, menabrak rintangan!');
        break; // Stop execution on hit
      }
      
      if (curr.r === targetPos.r && curr.c === targetPos.c) {
        checkWin(curr.r, curr.c);
        break;
      }
    }

    setIsExecuting(false);
    if (curr.r !== targetPos.r || curr.c !== targetPos.c) {
        if(!isObstacle(curr.r, curr.c)) {
             kidAudio.speak('Belum sampai target. Coba susun ulang perintahnya!');
        }
    }
  };

  // --- DIRECT MODE ---
  const moveDirect = (dir) => {
    if (isExecuting || gameSuccess || playMode !== 'direct') return;
    
    let nextR = avatarPos.r;
    let nextC = avatarPos.c;

    if (dir === 'RIGHT' && avatarPos.c < 9) nextC++;
    else if (dir === 'LEFT' && avatarPos.c > 0) nextC--;
    else if (dir === 'DOWN' && avatarPos.r < 9) nextR++;
    else if (dir === 'UP' && avatarPos.r > 0) nextR--;

    if (!isObstacle(nextR, nextC)) {
      setAvatarPos({ r: nextR, c: nextC });
      kidAudio.playPop();
      checkWin(nextR, nextC);
    } else {
      kidAudio.playWrong();
    }
  };

  const handleArrowPress = (dir) => {
    if (playMode === 'sequence') addCommand(dir);
    else if (playMode === 'direct') moveDirect(dir);
  };

  const resetBoard = () => {
    kidAudio.playPop();
    randomizeBoard(level);
  };

  // POPUP SELECTION
  if (playMode === null) {
    return (
      <div className="coding-content-card glass-panel animate-scale-up flex flex-col items-center justify-center p-8 min-h-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 font-poppins drop-shadow-sm">Pilih Mode Permainan</h2>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          {/* Sequence Mode Card */}
          <div 
            onClick={() => handleSelectMode('sequence')}
            className="flex-1 bg-white/60 hover:bg-white border-4 border-blue-300 hover:border-blue-500 rounded-3xl p-6 cursor-pointer transition-all transform hover:scale-105 shadow-lg flex flex-col items-center text-center group"
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
              <Map size={48} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Mode Susun Arah</h3>
            <p className="text-gray-700 text-sm">Susun urutan panah (algoritma) terlebih dahulu, lalu tekan Play agar avatar bergerak sesuai urutan!</p>
          </div>

          {/* Direct Mode Card */}
          <div 
            onClick={() => handleSelectMode('direct')}
            className="flex-1 bg-white/60 hover:bg-white border-4 border-green-300 hover:border-green-500 rounded-3xl p-6 cursor-pointer transition-all transform hover:scale-105 shadow-lg flex flex-col items-center text-center group"
          >
            <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
              <Zap size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Mode Gerak Langsung</h3>
            <p className="text-gray-700 text-sm">Tekan panah dan avatar akan langsung bergerak. Hindari rintangan secara langsung!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="coding-content-card glass-panel animate-scale-up p-4 md:p-6 w-full max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center mb-6 border-b-2 border-white/20 pb-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 mb-2 tracking-wide drop-shadow-sm font-poppins">
          PathFinding
        </h2>
        <p className="text-lg md:text-xl font-medium text-gray-700">Ayo Antar Sahabat Kita menemukan makanannya!</p>
        <div className="mt-2 text-sm font-bold bg-white/40 inline-block px-4 py-1 rounded-full text-blue-800 border border-white/50">
          Level {level} | Mode: {playMode === 'sequence' ? 'Susun Arah' : 'Gerak Langsung'}
        </div>
      </div>

      {/* AVATAR SELECTION */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 bg-white/30 p-3 rounded-2xl border border-white/40">
        {AVATARS.map(ava => (
          <button 
            key={ava.id}
            onClick={() => { kidAudio.playPop(); setSelectedAvatar(ava); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border-2 ${selectedAvatar.id === ava.id ? 'bg-white border-blue-500 text-blue-700 shadow-md scale-105' : 'bg-white/50 border-transparent text-gray-600 hover:bg-white hover:scale-105'}`}
          >
            <span className="text-2xl">{ava.avatar}</span>
            <span className="hidden sm:inline">{ava.name}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start justify-center">
        
        {/* 10x10 GRID MAP */}
        <div className="relative bg-white/50 p-2 rounded-xl border-4 border-blue-200 shadow-inner">
          <div 
            className="grid gap-1"
            style={{ 
              gridTemplateColumns: 'repeat(10, minmax(25px, 40px))', 
              gridTemplateRows: 'repeat(10, minmax(25px, 40px))' 
            }}
          >
            {Array.from({ length: 10 }).map((_, r) => (
              Array.from({ length: 10 }).map((_, c) => {
                const isAvatar = avatarPos.r === r && avatarPos.c === c;
                const isTarget = targetPos.r === r && targetPos.c === c;
                const isObs = isObstacle(r, c);

                return (
                  <div 
                    key={`${r}-${c}`} 
                    className={`w-full h-full rounded-md flex items-center justify-center text-xl md:text-2xl border border-white/30 ${isAvatar ? 'bg-blue-100/50' : 'bg-white/40'} ${isObs ? 'bg-gray-200/60' : ''}`}
                  >
                    {isAvatar && <span className="animate-bounce-gentle drop-shadow-md z-10 relative">{selectedAvatar.avatar}</span>}
                    {isTarget && !isAvatar && <span className="drop-shadow-md z-0 relative">{selectedAvatar.target}</span>}
                    {isObs && !isAvatar && !isTarget && <span className="drop-shadow-sm opacity-80">🪨</span>}
                  </div>
                );
              })
            ))}
          </div>
          
          {gameSuccess && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center animate-fade-in z-20">
              <CheckCircle size={64} className="text-green-500 mb-2" />
              <h3 className="text-2xl font-bold text-green-700">Berhasil!</h3>
              <p className="text-green-900 font-medium">Naik ke Level {level + 1}</p>
            </div>
          )}
        </div>

        {/* CONTROLS (D-PAD & SEQUENCE TRACK) */}
        <div className="flex flex-col items-center w-full max-w-sm">
          
          {/* Sequence Track (Only for Sequence mode) */}
          {playMode === 'sequence' && (
            <div className="w-full bg-white/60 p-4 rounded-2xl border-2 border-white/50 mb-6 shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-2 text-center uppercase tracking-wider">Memori Algoritma:</h4>
              <div className="flex gap-2 overflow-x-auto min-h-[50px] p-2 bg-white/50 rounded-xl items-center snap-x custom-scrollbar">
                {commandSequence.length === 0 ? (
                  <span className="text-gray-400 text-sm italic w-full text-center">Tekan panah untuk menambah arah...</span>
                ) : (
                  commandSequence.map((cmd, idx) => (
                    <div key={idx} className="flex-shrink-0 bg-blue-100 text-blue-800 p-2 rounded-lg font-bold shadow-sm border border-blue-200 snap-center animate-scale-up">
                      {cmd === 'UP' && '⬆️'}
                      {cmd === 'DOWN' && '⬇️'}
                      {cmd === 'LEFT' && '⬅️'}
                      {cmd === 'RIGHT' && '➡️'}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* D-Pad Controls */}
          <div className="relative flex flex-col items-center justify-center scale-90 sm:scale-100">
            {/* Reset Button (placed to the top right) */}
            <button 
              onClick={resetBoard}
              disabled={isExecuting}
              className="absolute -top-4 -right-16 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-full shadow-[0_4px_10px_rgba(239,68,68,0.4)] border-2 border-white transform transition-all hover:scale-110 active:scale-95 disabled:opacity-50 flex items-center justify-center flex-col gap-1 z-10"
              title="Reset Permainan"
            >
              <RefreshCw size={20} />
              <span className="text-[10px] font-bold tracking-wider">RESET</span>
            </button>

            {/* UP */}
            <button 
              onClick={() => handleArrowPress('UP')} disabled={isExecuting}
              className="bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white w-16 h-16 rounded-t-2xl shadow-[0_4px_0_#2563eb] active:shadow-[0_0_0_#2563eb] active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <ArrowUp size={32} />
            </button>
            
            <div className="flex">
              {/* LEFT */}
              <button 
                onClick={() => handleArrowPress('LEFT')} disabled={isExecuting}
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white w-16 h-16 rounded-l-2xl shadow-[0_4px_0_#2563eb] active:shadow-[0_0_0_#2563eb] active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-50"
              >
                <ArrowLeft size={32} />
              </button>
              
              {/* CENTER PLAY BUTTON */}
              <button 
                onClick={playMode === 'sequence' ? executeCode : () => { kidAudio.playPop(); kidAudio.speak('Ini mode Gerak Langsung, gunakan panah untuk bergerak!'); }}
                disabled={isExecuting || (playMode === 'sequence' && commandSequence.length === 0)}
                className={`w-16 h-16 flex items-center justify-center z-10 border-4 border-white rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                  playMode === 'sequence' 
                    ? 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title={playMode === 'sequence' ? "Jalankan Kode" : "Mode Gerak Langsung aktif"}
              >
                {playMode === 'sequence' ? <Play size={28} className="ml-1" fill="currentColor" /> : <Map size={24} />}
              </button>
              
              {/* RIGHT */}
              <button 
                onClick={() => handleArrowPress('RIGHT')} disabled={isExecuting}
                className="bg-gradient-to-l from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white w-16 h-16 rounded-r-2xl shadow-[0_4px_0_#2563eb] active:shadow-[0_0_0_#2563eb] active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-50"
              >
                <ArrowRight size={32} />
              </button>
            </div>
            
            {/* DOWN */}
            <button 
              onClick={() => handleArrowPress('DOWN')} disabled={isExecuting}
              className="bg-gradient-to-t from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white w-16 h-16 rounded-b-2xl shadow-[0_4px_0_#2563eb] active:shadow-[0_0_0_#2563eb] active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <ArrowDown size={32} />
            </button>
          </div>

        </div>
      </div>
      
    </div>
  );
}
