import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import { kidAudio } from '../utils/audio';

export default function LanguageToggle({ showLabel = true, compact = false }) {
  const { lang, changeLanguage, countryCode, countryName } = useLanguage();

  const handleToggle = () => {
    kidAudio.playPop();
    const nextLang = lang === 'id' ? 'en' : 'id';
    changeLanguage(nextLang);
  };

  return (
    <div className={`language-toggle-wrapper ${compact ? 'compact' : ''}`}>
      <button 
        className={`lang-switch-btn ${lang === 'en' ? 'is-english' : 'is-indonesia'} animate-pop`}
        onClick={handleToggle}
        title={`Ganti Bahasa / Change Language (Aktif: ${lang === 'id' ? 'Bahasa Indonesia 🇮🇩' : 'English 🇬🇧'})`}
        aria-label="Switch Language"
      >
        <span className="lang-flag">{lang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
        <span className="lang-code">{lang.toUpperCase()}</span>
        <Globe size={14} className="globe-icon" />
      </button>

      {showLabel && (
        <span className="location-badge-tag" title={`Terdeteksi dari IP/Negara: ${countryName}`}>
          {countryCode === 'ID' ? '🇮🇩 ID' : `🌏 ${countryCode}`}
        </span>
      )}
    </div>
  );
}
