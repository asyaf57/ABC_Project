import React from 'react';
import { Sparkles, HelpCircle, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { kidAudio } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function HomeScreen({ account, stars, onSelectModule, onOpenTutorial, onOpenParentModal }) {
  const { t, lang } = useLanguage();
  const childName = account?.childName || t('childDefaultName');

  const activeModules = [
    {
      id: 'spelling',
      title: t('spellingTitle'),
      image: '/spelling_kids.jpg',
      color: 'card-blue',
      badge: lang === 'id' ? 'Aktif' : 'Active',
      available: true
    },
    {
      id: 'math',
      title: t('mathTitle'),
      image: '/math_kids.jpg',
      color: 'card-green',
      badge: lang === 'id' ? 'Aktif' : 'Active',
      available: true
    },
    {
      id: 'coding',
      title: t('codingTitle'),
      image: '/coding_kids.jpg',
      color: 'card-orange',
      badge: lang === 'id' ? 'Aktif' : 'Active',
      available: true
    },
    {
      id: 'voice',
      title: t('voiceTitle'),
      image: '/social_kids.jpg',
      color: 'card-purple',
      badge: lang === 'id' ? 'Suara' : 'Voice',
      available: true
    },
    {
      id: 'coloring',
      title: lang === 'id' ? 'Modul Mewarnai' : 'Coloring Fun',
      image: '/coloring_kids.jpg', // we don't have this image, but it's fine as a placeholder
      color: 'card-rose',
      badge: lang === 'id' ? 'Aktif' : 'Active',
      available: true
    },
    {
      id: 'dongeng',
      title: lang === 'id' ? 'Cerita Dongeng' : 'Fairy Tales',
      image: '/fairytales/cover.jpg',
      color: 'card-yellow',
      badge: lang === 'id' ? 'Aktif' : 'Active',
      available: true
    }
  ];

  const upcomingModules = [
    {
      id: 'minigames',
      title: lang === 'id' ? 'Mini Games Ceria' : 'Fun Mini Games',
      image: '/minigames_kids.jpg',
      color: 'card-pink',
      badge: lang === 'id' ? 'Segera' : 'Soon',
      available: false
    },
    {
      id: 'hijaiyah',
      title: lang === 'id' ? 'Belajar Hijaiyah' : 'Hijaiyah Letters',
      image: '/hijaiyah_kids.jpg',
      color: 'card-emerald',
      badge: lang === 'id' ? 'Segera' : 'Soon',
      available: false
    },
    {
      id: 'nabi',
      title: lang === 'id' ? 'Kisah Nabi' : 'Prophet Stories',
      image: '/nabi_kids.jpg',
      color: 'card-amber',
      badge: lang === 'id' ? 'Segera' : 'Soon',
      available: false
    },
    {
      id: 'singing',
      title: lang === 'id' ? 'Menyanyi Bersama' : 'Sing Along',
      image: '/singing_kids.jpg',
      color: 'card-indigo',
      badge: lang === 'id' ? 'Segera' : 'Soon',
      available: false
    }
  ];

  const handleCardClick = (mod) => {
    kidAudio.playPop();
    if (!mod.available) {
      const msg = lang === 'id'
        ? `Modul ${mod.title} akan segera hadir dalam pembaruan berikutnya ya teman-teman! Tetap semangat!`
        : `Module ${mod.title} is coming soon in the next update! Stay tuned!`;
      kidAudio.speak(msg);
      return;
    }
    onSelectModule(mod.id);
  };

  return (
    <div className="home-screen-container animate-fade-in">
      
      {/* Sleek Greeting Sub-Header */}
      <section className="home-greeting-bar glass-panel">
        <div className="greeting-text">
          <h2>{t('welcomeUser', { name: childName })}</h2>
          <p>{t('readyMessage')}</p>
        </div>
      </section>

      {/* ACTIVE MODULES GRID */}
      <section className="home-section">
        <div className="section-title-row">
          <h3>🌟 {lang === 'id' ? 'Modul Utama (Siap Dimainkan)' : 'Main Modules (Ready to Play)'}</h3>
        </div>

        <div className="modules-grid-visual">
          {activeModules.map((mod) => (
            <div
              key={mod.id}
              className={`module-visual-card ${mod.color}`}
              onClick={() => handleCardClick(mod)}
            >
              <div className="visual-card-image-wrapper">
                <img src={mod.image} alt={mod.title} className="visual-card-img" />
                <span className="visual-badge badge-active">{mod.badge}</span>
              </div>

              <div className="visual-card-footer">
                <h4 className="visual-card-title">{mod.title}</h4>
                <button className="btn-visual-play">
                  <span>{lang === 'id' ? 'Mulai Main' : 'Start Play'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING MODULES PLACEHOLDERS GRID */}
      <section className="home-section mt-8">
        <div className="section-title-row">
          <h3>🚀 {lang === 'id' ? 'Modul Petualangan Baru (Akan Datang)' : 'New Adventure Modules (Coming Soon)'}</h3>
          <span className="section-subtitle">
            {lang === 'id' 
              ? 'Nantikan keseruan modul-modul ini dalam pembaruan berikutnya!'
              : 'Look forward to these exciting modules in upcoming updates!'}
          </span>
        </div>

        <div className="modules-grid-visual">
          {upcomingModules.map((mod) => (
            <div
              key={mod.id}
              className={`module-visual-card upcoming-card ${mod.color}`}
              onClick={() => handleCardClick(mod)}
            >
              <div className="visual-card-image-wrapper">
                <img src={mod.image} alt={mod.title} className="visual-card-img upcoming-img" />
                <span className="visual-badge badge-soon">
                  <Lock size={12} className="inline mr-1" />
                  {mod.badge}
                </span>
              </div>

              <div className="visual-card-footer">
                <h4 className="visual-card-title text-muted-title">{mod.title}</h4>
                <button className="btn-visual-play btn-upcoming-soon">
                  <span>{lang === 'id' ? 'Segera Hadir' : 'Coming Soon'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Utilities & Guidance */}
      <section className="home-quick-actions">
        <div 
          className="quick-action-card tutorial-action"
          onClick={() => {
            kidAudio.playPop();
            onOpenTutorial();
          }}
        >
          <div className="action-icon">
            <HelpCircle size={28} />
          </div>
          <div>
            <h4>{t('quickTutorial')}</h4>
            <p>{lang === 'id' ? 'Pelajari cara bermain & kumpulkan bintang' : 'Learn how to play & collect stars'}</p>
          </div>
          <Sparkles className="sparkle-icon" size={20} />
        </div>

        <div 
          className="quick-action-card parent-action"
          onClick={() => {
            kidAudio.playPop();
            onOpenParentModal();
          }}
        >
          <div className="action-icon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4>{t('parentDashboard')}</h4>
            <p>{lang === 'id' ? 'Pantau screen time, progres, & kontrol pertemanan' : 'Monitor screen time, progress, & safety'}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
