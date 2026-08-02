import React from 'react';
import { Star, ShieldCheck, Sparkles, Home, Flame } from 'lucide-react';
import { kidAudio } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Header({ 
  activeScreen, 
  onNavigateHome, 
  stars, 
  account,
  onOpenParentModal,
  onOpenProfile 
}) {
  const { t, lang } = useLanguage();
  const childName = account?.childName || t('childDefaultName');
  const avatarObj = account?.avatar;
  const userId = account?.userId || 'ABC-89420';

  return (
    <header className="kid-header sleek-header compact-header">
      
      {/* ROW 1: CENTERED TITLE + ABC LOGO & LANGUAGE TOGGLE */}
      <div className="header-top-row">
        {/* Left Side: Language Toggle with Auto-location badge */}
        <div className="header-top-left-toggle">
          <LanguageToggle showLabel={true} compact={true} />
        </div>

        {/* Centered Playful Colorful Title */}
        <div className="header-title-centered">
          <h1 className="app-title-cheerful" onClick={() => onNavigateHome()}>
            <span className="title-letter letter-a">A</span>
            <span className="title-letter letter-b">B</span>
            <span className="title-letter letter-c">C</span>
            <span className="title-subtext"> {t('appSubTitle')}</span>
          </h1>
        </div>

        {/* ABC Icon Logo on Far Right */}
        <div 
          className="logo-brand animate-float header-right-logo" 
          onClick={() => onNavigateHome()} 
          title="ABC App"
        >
          <div className="logo-png-wrapper-compact">
            <img src="/ABC_icon.png" alt="ABC Logo" className="abc-logo-img-compact" />
          </div>
        </div>
      </div>

      {/* ROW 2: LEFT AVATAR & USER INFO + RIGHT STATS & PARENT SHIELD */}
      <div className="header-bottom-row">
        
        {/* LEFT SIDE: User Photo Avatar + Name & ID */}
        <div className="header-left-avatar" onClick={onOpenProfile} style={{ cursor: 'pointer' }} title="Pengaturan Profil">
          <div className="header-user-profile animate-pop hover:scale-105 transition-transform">
            {avatarObj?.photoUrl ? (
              <img src={avatarObj.photoUrl} alt="Foto Profil" className="header-avatar-photo-compact" />
            ) : (
              <div className="avatar-emoji-compact">{avatarObj?.emoji || '🦁'}</div>
            )}
            <div className="user-text-info">
              <span className="user-name-title">{childName}</span>
              <span className="id-chip-tag">ID: {userId}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Home Button (in module), Streak, Stars, Parental Shield */}
        <div className="header-right-actions">
          {/* Return to Home button placed on right when inside a module */}
          {activeScreen === 'module' && (
            <button 
              className="btn-home-colorful animate-pop"
              onClick={() => {
                kidAudio.playPop();
                onNavigateHome();
              }}
              title={t('home')}
            >
              <div className="home-icon-bg">
                <Home size={18} className="text-white" />
              </div>
              <span>{t('home')}</span>
            </button>
          )}

          {/* Streak Counter */}
          <div className="header-stat-chip streak-chip" title="Streak">
            <Flame className="text-orange-500 fill-current animate-pulse" size={20} />
            <span>1 {t('streak')}</span>
          </div>

          {/* Star Counter (Nilai Bintang) */}
          <div 
            className="star-badge animate-pop" 
            onClick={() => {
              kidAudio.playStar();
              const voiceMsg = lang === 'id' 
                ? `Hore! Kamu sudah mengumpulkan ${stars} bintang emas!`
                : `Hooray! You collected ${stars} golden stars!`;
              kidAudio.speak(voiceMsg, 1.0, 1.3);
            }}
            title={t('starsTitle')}
          >
            <Star className="star-icon fill-current text-yellow-500 animate-spin-slow" size={22} />
            <span>{stars}</span>
            <Sparkles size={14} />
          </div>

          {/* Golden Shield Parental Dashboard Button */}
          <button 
            className="parent-shield-btn animate-pop"
            onClick={() => {
              kidAudio.playPop();
              onOpenParentModal();
            }}
            title={t('parentDashboard')}
            aria-label={t('parentDashboard')}
          >
            <ShieldCheck size={24} className="shield-icon" />
            <span className="tooltip-text">{t('parentDashboard')}</span>
          </button>
        </div>

      </div>

    </header>
  );
}
