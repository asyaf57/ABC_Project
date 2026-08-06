import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RefreshCw, Map, Zap, CheckCircle, Trophy, Shuffle } from 'lucide-react';
import { kidAudio } from '../utils/audio';

const AVATARS = [
  { id: 'rabbit', avatar: '🐰', target: '🥕', name: 'Kelinci', color: '#f97316' },
  { id: 'lion',   avatar: '🦁', target: '🍖', name: 'Singa',   color: '#eab308' },
  { id: 'elephant', avatar: '🐘', target: '🍌', name: 'Gajah', color: '#84cc16' },
  { id: 'panda',  avatar: '🐼', target: '🎋', name: 'Panda',   color: '#22c55e' },
  { id: 'cat',    avatar: '🐱', target: '🐟', name: 'Kucing',  color: '#06b6d4' },
];

const GRID = 10;

function randomPos(exclude = []) {
  let r, c, ok;
  do {
    r = Math.floor(Math.random() * GRID);
    c = Math.floor(Math.random() * GRID);
    ok = !exclude.some(p => p.r === r && p.c === c);
  } while (!ok);
  return { r, c };
}

function generateObstacles(level, avatarPos, targetPos) {
  const count = Math.min(level * 2, 18);
  const obs = [];
  for (let i = 0; i < count; i++) {
    let p, tries = 0, valid = false;
    while (!valid && tries < 60) {
      p = randomPos([avatarPos, targetPos, ...obs]);
      const nearAvatar = Math.abs(p.r - avatarPos.r) <= 1 && Math.abs(p.c - avatarPos.c) <= 1;
      const nearTarget = Math.abs(p.r - targetPos.r) <= 1 && Math.abs(p.c - targetPos.c) <= 1;
      if (!nearAvatar && !nearTarget) valid = true;
      tries++;
    }
    if (valid) obs.push(p);
  }
  return obs;
}

function buildBoard(level) {
  const avatarPos = randomPos([]);
  const targetPos = randomPos([avatarPos]);
  const obstacles = generateObstacles(level, avatarPos, targetPos);
  return { avatarPos, targetPos, obstacles };
}

export default function PathfindingGame({ onAddStars, setScore }) {
  const [playMode, setPlayMode] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState(null);
  const [avatarPos, setAvatarPos] = useState(null);
  const [commandSequence, setCommandSequence] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [hitObstacle, setHitObstacle] = useState(false);

  const initBoard = useCallback((lvl) => {
    const b = buildBoard(lvl);
    setBoard(b);
    setAvatarPos(b.avatarPos);
    setCommandSequence([]);
    setGameSuccess(false);
    setHitObstacle(false);
  }, []);

  useEffect(() => {
    if (playMode !== null) initBoard(level);
  }, [playMode, level]);

  const handleSelectAvatar = (ava) => {
    kidAudio.playPop();
    setSelectedAvatar(ava);
  };

  const handleSelectMode = (mode) => {
    kidAudio.playPop();
    setPlayMode(mode);
    kidAudio.speak(mode === 'sequence' ? 'Mode Susun Arah dipilih!' : 'Mode Gerak Langsung dipilih!');
  };

  const isObs = (r, c) => board?.obstacles.some(o => o.r === r && o.c === c);

  const checkWin = (r, c) => {
    if (r === board.targetPos.r && c === board.targetPos.c) {
      kidAudio.playSuccess();
      setGameSuccess(true);
      if (setScore) setScore(prev => prev + 25);
      if (typeof onAddStars === 'function') onAddStars(4);
      kidAudio.speak(`Luar biasa! ${selectedAvatar.name} berhasil menemukan makanannya! Naik ke level ${level + 1}!`);
      setTimeout(() => setLevel(prev => prev + 1), 3000);
      return true;
    }
    return false;
  };

  // SEQUENCE MODE
  const addCommand = (dir) => {
    if (isExecuting || gameSuccess || playMode !== 'sequence') return;
    kidAudio.playPop();
    setCommandSequence(prev => [...prev, dir]);
  };

  const removeLastCommand = () => {
    if (isExecuting || commandSequence.length === 0) return;
    kidAudio.playPop();
    setCommandSequence(prev => prev.slice(0, -1));
  };

  const executeCode = async () => {
    if (commandSequence.length === 0 || isExecuting || gameSuccess) return;
    setIsExecuting(true);
    setHitObstacle(false);
    let curr = { ...avatarPos };
    kidAudio.speak('Menjalankan algoritma...');

    for (let i = 0; i < commandSequence.length; i++) {
      await new Promise(res => setTimeout(res, 380));
      const cmd = commandSequence[i];
      let nr = curr.r, nc = curr.c;
      if (cmd === 'RIGHT' && curr.c < GRID - 1) nc++;
      else if (cmd === 'LEFT'  && curr.c > 0)        nc--;
      else if (cmd === 'DOWN'  && curr.r < GRID - 1) nr++;
      else if (cmd === 'UP'    && curr.r > 0)        nr--;

      if (isObs(nr, nc)) {
        kidAudio.playWrong();
        kidAudio.speak('Aduh, menabrak batu!');
        setHitObstacle(true);
        break;
      }
      curr = { r: nr, c: nc };
      setAvatarPos({ ...curr });
      kidAudio.playPop();
      if (checkWin(curr.r, curr.c)) break;
    }
    setIsExecuting(false);
  };

  // DIRECT MODE
  const moveDirect = (dir) => {
    if (isExecuting || gameSuccess || playMode !== 'direct') return;
    let nr = avatarPos.r, nc = avatarPos.c;
    if (dir === 'RIGHT' && avatarPos.c < GRID - 1) nc++;
    else if (dir === 'LEFT'  && avatarPos.c > 0)        nc--;
    else if (dir === 'DOWN'  && avatarPos.r < GRID - 1) nr++;
    else if (dir === 'UP'    && avatarPos.r > 0)        nr--;

    if (isObs(nr, nc)) { kidAudio.playWrong(); return; }
    setAvatarPos({ r: nr, c: nc });
    kidAudio.playPop();
    checkWin(nr, nc);
  };

  const handleArrow = (dir) => {
    if (playMode === 'sequence') addCommand(dir);
    else if (playMode === 'direct') moveDirect(dir);
  };

  const resetBoard = () => {
    kidAudio.playPop();
    initBoard(level);
  };

  const dirIcon = { UP: '↑', DOWN: '↓', LEFT: '←', RIGHT: '→' };

  // ── MODE SELECTION POPUP ──
  if (!playMode) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px', minHeight: '420px',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)',
        borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a5f', margin: 0 }}>Pilih Mode Bermain</h2>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '16px' }}>Bagaimana kamu ingin memandu sahabatmu?</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Sequence Card */}
          <div onClick={() => handleSelectMode('sequence')} style={{
            background: 'white', border: '3px solid #3b82f6', borderRadius: '20px',
            padding: '28px 32px', cursor: 'pointer', width: '220px', textAlign: 'center',
            boxShadow: '0 4px 20px rgba(59,130,246,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(59,130,246,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.15)'; }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1d4ed8', marginBottom: '8px' }}>Susun Arah</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Susun urutan perintah, lalu tekan <b>Play</b> agar avatar bergerak sekaligus.</p>
          </div>
          {/* Direct Card */}
          <div onClick={() => handleSelectMode('direct')} style={{
            background: 'white', border: '3px solid #22c55e', borderRadius: '20px',
            padding: '28px 32px', cursor: 'pointer', width: '220px', textAlign: 'center',
            boxShadow: '0 4px 20px rgba(34,197,94,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(34,197,94,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.15)'; }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#15803d', marginBottom: '8px' }}>Gerak Langsung</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Tekan panah dan avatar langsung bergerak. Kendalikan secara real-time!</p>
          </div>
        </div>
      </div>
    );
  }

  if (!board || !avatarPos) return <div style={{ padding: 40, textAlign: 'center' }}>Memuat papan...</div>;

  const cellSizePx = 42;

  return (
    <div style={{ fontFamily: "'Nunito', 'Poppins', sans-serif", width: '100%', maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      
      {/* ── HEADER ── */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed, #f97316)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: '0 0 6px',
        }}>PathFinding</h1>
        <p style={{ color: '#475569', fontSize: '15px', margin: '0 0 10px' }}>Ayo Antar Sahabat Kita menemukan makanannya!</p>
        <div style={{ display: 'inline-flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', padding: '4px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '14px' }}>
            🏆 Level {level}
          </span>
          <span style={{ background: playMode === 'sequence' ? '#dbeafe' : '#dcfce7', color: playMode === 'sequence' ? '#1d4ed8' : '#15803d', padding: '4px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '14px', border: `2px solid ${playMode === 'sequence' ? '#93c5fd' : '#86efac'}` }}>
            {playMode === 'sequence' ? '📋 Susun Arah' : '⚡ Gerak Langsung'}
          </span>
        </div>
      </div>

      {/* ── AVATAR SELECTION ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', background: 'rgba(255,255,255,0.7)', padding: '12px 16px', borderRadius: '16px', backdropFilter: 'blur(8px)', border: '1.5px solid #e2e8f0' }}>
        {AVATARS.map(ava => (
          <button key={ava.id} onClick={() => handleSelectAvatar(ava)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '14px',
            border: selectedAvatar.id === ava.id ? `3px solid ${ava.color}` : '3px solid transparent',
            background: selectedAvatar.id === ava.id ? 'white' : 'transparent',
            color: selectedAvatar.id === ava.id ? ava.color : '#64748b',
            cursor: 'pointer', transition: 'all 0.2s',
            transform: selectedAvatar.id === ava.id ? 'scale(1.08)' : 'scale(1)',
            boxShadow: selectedAvatar.id === ava.id ? `0 4px 16px ${ava.color}40` : 'none',
          }}>
            <span style={{ fontSize: '20px' }}>{ava.avatar}</span>
            <span>{ava.name}</span>
            {selectedAvatar.id === ava.id && <span style={{ fontSize: '12px' }}>➔</span>}
            <span style={{ fontSize: '18px' }}>{ava.target}</span>
          </button>
        ))}
      </div>

      {/* ── MAIN PLAY AREA ── */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
        
        {/* ── GRID ── */}
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID}, ${cellSizePx}px)`,
            gridTemplateRows: `repeat(${GRID}, ${cellSizePx}px)`,
            gap: '3px',
            background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
            padding: '10px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(37,99,235,0.15), inset 0 2px 8px rgba(255,255,255,0.6)',
            border: '3px solid #bfdbfe',
          }}>
            {Array.from({ length: GRID }).map((_, r) =>
              Array.from({ length: GRID }).map((_, c) => {
                const isAvatar = avatarPos.r === r && avatarPos.c === c;
                const isTarget = board.targetPos.r === r && board.targetPos.c === c;
                const obstacle = isObs(r, c);
                let bg = (r + c) % 2 === 0 ? '#f0f9ff' : '#e0f2fe';
                if (obstacle) bg = '#cbd5e1';
                if (isAvatar) bg = `${selectedAvatar.color}22`;
                if (isTarget && !isAvatar) bg = '#fef9c3';
                return (
                  <div key={`${r}-${c}`} style={{
                    width: `${cellSizePx}px`, height: `${cellSizePx}px`,
                    background: bg, borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', position: 'relative',
                    boxShadow: isAvatar ? `0 0 0 3px ${selectedAvatar.color}, 0 4px 12px ${selectedAvatar.color}50` : isTarget ? '0 0 0 2px #f59e0b, 0 4px 12px #fbbf2440' : obstacle ? 'inset 0 2px 4px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.15s ease',
                  }}>
                    {isAvatar && <span style={{ animation: 'bounce 0.6s infinite alternate', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{selectedAvatar.avatar}</span>}
                    {isTarget && !isAvatar && <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', animation: 'pulse 1.5s infinite' }}>{selectedAvatar.target}</span>}
                    {obstacle && !isAvatar && !isTarget && <span>🪨</span>}
                  </div>
                );
              })
            )}
          </div>

          {/* Success Overlay */}
          {gameSuccess && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '16px',
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 20, animation: 'fadeIn 0.4s ease',
            }}>
              <div style={{ fontSize: '64px', lineHeight: 1 }}>🎉</div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#15803d', margin: '8px 0 4px' }}>Berhasil!</h3>
              <p style={{ color: '#166534', fontWeight: 600 }}>Naik ke Level {level + 1} 🚀</p>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: SEQUENCE + D-PAD ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', minWidth: '200px' }}>

          {/* Memori Algoritma (only Sequence mode) */}
          {playMode === 'sequence' && (
            <div style={{ width: '100%', background: 'white', borderRadius: '16px', padding: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase' }}>📟 Memori Kode</span>
                {commandSequence.length > 0 && (
                  <button onClick={removeLastCommand} disabled={isExecuting} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '3px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    ← Hapus
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', minHeight: '48px', alignItems: 'center', padding: '6px', background: '#f8fafc', borderRadius: '10px', border: '1.5px dashed #cbd5e1', flexWrap: 'wrap' }}>
                {commandSequence.length === 0 ? (
                  <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', margin: '0 auto' }}>Tekan panah untuk menambah arah...</span>
                ) : (
                  commandSequence.map((cmd, idx) => (
                    <div key={idx} style={{ flexShrink: 0, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', padding: '6px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '16px', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                      {dirIcon[cmd]}
                    </div>
                  ))
                )}
              </div>
              {hitObstacle && (
                <div style={{ marginTop: '8px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                  💥 Menabrak batu! Susun ulang arah.
                </div>
              )}
            </div>
          )}

          {/* D-PAD */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.10)', border: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
            
            {/* Tombol Reset di pojok kanan atas */}
            <button onClick={resetBoard} disabled={isExecuting} title="Reset Permainan" style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white',
              border: '2px solid white', borderRadius: '10px', padding: '4px 10px',
              fontWeight: 800, fontSize: '11px', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239,68,68,0.4)', letterSpacing: '0.5px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
              opacity: isExecuting ? 0.5 : 1,
            }}>
              <RefreshCw size={14} />
              <span>RESET</span>
            </button>

            {/* UP */}
            <button onClick={() => handleArrow('UP')} disabled={isExecuting} style={dpadBtnStyle}>
              <ArrowUp size={28} />
            </button>
            
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {/* LEFT */}
              <button onClick={() => handleArrow('LEFT')} disabled={isExecuting} style={dpadBtnStyle}>
                <ArrowLeft size={28} />
              </button>

              {/* CENTER — PLAY (sequence) or indicator (direct) */}
              <button
                onClick={playMode === 'sequence' ? executeCode : undefined}
                disabled={isExecuting || (playMode === 'sequence' && commandSequence.length === 0)}
                title={playMode === 'sequence' ? 'Jalankan Kode' : 'Mode Gerak Langsung'}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%', border: '4px solid white',
                  cursor: playMode === 'sequence' ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px',
                  background: playMode === 'sequence'
                    ? (isExecuting || commandSequence.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #22c55e, #16a34a)')
                    : 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: 'white', boxShadow: '0 6px 20px rgba(0,0,0,0.20)',
                  opacity: (playMode === 'sequence' && (isExecuting || commandSequence.length === 0)) ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}>
                {playMode === 'sequence' ? <Play size={26} style={{ marginLeft: '3px' }} fill="currentColor" /> : '⚡'}
              </button>

              {/* RIGHT */}
              <button onClick={() => handleArrow('RIGHT')} disabled={isExecuting} style={dpadBtnStyle}>
                <ArrowRight size={28} />
              </button>
            </div>

            {/* DOWN */}
            <button onClick={() => handleArrow('DOWN')} disabled={isExecuting} style={dpadBtnStyle}>
              <ArrowDown size={28} />
            </button>

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>
              {playMode === 'sequence' ? '📋 Tekan panah lalu Play' : '⚡ Tekan panah untuk bergerak'}
            </div>
          </div>

          {/* LEGEND */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '12px 16px', width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1.5px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Keterangan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
              <span>{selectedAvatar.avatar} = {selectedAvatar.name} (Kamu)</span>
              <span>{selectedAvatar.target} = Target Makanan</span>
              <span>🪨 = Batu Rintangan</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#f97316', fontWeight: 700 }}>
              Level {level} → {Math.min(level * 2, 18)} rintangan
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

const dpadBtnStyle = {
  width: '60px', height: '60px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: 'white', border: 'none', borderRadius: '14px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: '20px',
  boxShadow: '0 6px 0 #1e40af, 0 8px 20px rgba(37,99,235,0.25)',
  transition: 'all 0.1s ease',
  userSelect: 'none',
};
