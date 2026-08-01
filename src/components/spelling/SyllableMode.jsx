import React, { useState } from 'react';
import { Volume2, Play } from 'lucide-react';
import { SYLLABLE_GROUPS } from '../../data/spellingData';
import { kidAudio } from '../../utils/audio';

export default function SyllableMode() {
  const safeGroups = SYLLABLE_GROUPS && SYLLABLE_GROUPS.length > 0 ? SYLLABLE_GROUPS : [];
  
  const [selectedGroup, setSelectedGroup] = useState(safeGroups[0] || null);
  const [selectedSyllable, setSelectedSyllable] = useState(safeGroups[0]?.items?.[0] || null);

  if (!selectedGroup || !selectedSyllable) {
    return (
      <div className="mode-syllable animate-pop">
        <div className="kid-card">Memuat data suku kata...</div>
      </div>
    );
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    if (group.items && group.items.length > 0) {
      setSelectedSyllable(group.items[0]);
    }
    kidAudio.playPop();
  };

  const handleSyllableClick = (item) => {
    setSelectedSyllable(item);
    kidAudio.playPop();
    kidAudio.speak(`${item.text}!`, 0.8, 1.4);
  };

  const handleSpellFull = (item) => {
    kidAudio.playPop();
    kidAudio.speak(`${item.spell}... dibaca ${item.read}! Contoh kata: ${item.example}`, 0.75, 1.45);
  };

  return (
    <div className="mode-syllable animate-pop">
      {/* Selector Abjad Suku Kata (26 Huruf A - Z) */}
      <div className="syllable-group-selector">
        <p className="selector-label">Pilih Kelompok Huruf Suku Kata (A - Z):</p>
        <div className="group-tabs-scroll">
          {safeGroups.map((group) => (
            <button
              key={group.prefix}
              className={`group-btn ${selectedGroup.prefix === group.prefix ? 'active' : ''}`}
              style={{ '--grp-color': group.color }}
              onClick={() => handleGroupSelect(group)}
            >
              <span>{group.prefix}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Syllable Interactive Stage */}
      <div className="syllable-showcase kid-card">
        {/* Top Hero Card */}
        <div className="syllable-hero" style={{ borderColor: selectedGroup.color }}>
          <div className="syllable-big animate-bounce-soft" style={{ color: selectedGroup.color }}>
            {selectedSyllable.text}
          </div>
          <div className="syllable-detail">
            <h3>Pengejaan: <span>{selectedSyllable.spell}</span></h3>
            <p>Dibaca: <strong>"{selectedSyllable.read}"</strong> — Contoh: <strong>{selectedSyllable.example}</strong></p>
            <button 
              className="btn-kid btn-sound-vibrant" 
              style={{ '--btn-theme-color': selectedGroup.color }}
              onClick={() => handleSpellFull(selectedSyllable)}
            >
              <Volume2 size={24} className="animate-pulse" />
              <span>🔊 SEBUTKAN PENGEJAAN & CONTOH KATA</span>
            </button>
          </div>
        </div>

        {/* List of 5 Syllables (BA, BI, BU, BE, BO dst.) */}
        <div className="syllable-grid-label">
          <h4>Sentuh Kartu Suku Kata Di Bawah Ini:</h4>
        </div>
        
        <div className="syllable-list">
          {selectedGroup.items.map((item) => (
            <div
              key={item.text}
              className={`syllable-card ${selectedSyllable.text === item.text ? 'active' : ''}`}
              style={{ '--card-color': selectedGroup.color }}
              onClick={() => handleSyllableClick(item)}
            >
              <span className="s-text" style={{ color: selectedGroup.color }}>{item.text}</span>
              <span className="s-icon">{item.icon}</span>
              <span className="s-example">{item.example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
