import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { kidAudio } from '../utils/audio';

export default function LanguageToggle() {
  const { lang, changeLanguage } = useLanguage();

  const handleToggle = () => {
    kidAudio.playPop();
    const nextLang = lang === 'id' ? 'en' : 'id';
    changeLanguage(nextLang);
  };

  return (
    <button 
      className="lang-switch-mini"
      onClick={handleToggle}
      title={lang === 'id' ? 'Ganti ke English' : 'Switch to Indonesia'}
    >
      <span className="lang-flag">{lang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
      <span className="lang-text">{lang.toUpperCase()}</span>
    </button>
  );
}
