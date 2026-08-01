import React from 'react';
import { Sparkles, HelpCircle, ShieldCheck, PlayCircle, ArrowRight, Lock } from 'lucide-react';
import { kidAudio } from '../utils/audio';

export default function HomeScreen({ account, stars, onSelectModule, onOpenTutorial, onOpenParentModal }) {
  const childName = account?.childName || 'Teman Pintar';

  const activeModules = [
    {
      id: 'spelling',
      title: 'Belajar Mengeja',
      image: '/spelling_kids.jpg',
      color: 'card-blue',
      badge: 'Aktif',
      available: true
    },
    {
      id: 'math',
      title: 'Berhitung Ceria',
      image: '/math_kids.jpg',
      color: 'card-green',
      badge: 'Aktif',
      available: true
    },
    {
      id: 'coding',
      title: 'Coding Anak',
      image: '/coding_kids.jpg',
      color: 'card-orange',
      badge: 'Aktif',
      available: true
    },
    {
      id: 'voice',
      title: 'Ruang Sahabat AI',
      image: '/social_kids.jpg',
      color: 'card-purple',
      badge: 'Suara',
      available: true
    }
  ];

  const upcomingModules = [
    {
      id: 'minigames',
      title: 'Mini Games Ceria',
      image: '/minigames_kids.jpg',
      color: 'card-pink',
      badge: 'Segera',
      available: false
    },
    {
      id: 'dongeng',
      title: 'Cerita Dongeng',
      image: '/dongeng_kids.jpg',
      color: 'card-yellow',
      badge: 'Segera',
      available: false
    },
    {
      id: 'hijaiyah',
      title: 'Belajar Hijaiyah',
      image: '/hijaiyah_kids.jpg',
      color: 'card-emerald',
      badge: 'Segera',
      available: false
    },
    {
      id: 'nabi',
      title: 'Kisah Nabi & Sahabat',
      image: '/nabi_kids.jpg',
      color: 'card-amber',
      badge: 'Segera',
      available: false
    },
    {
      id: 'singing',
      title: 'Menyanyi Bersama',
      image: '/singing_kids.jpg',
      color: 'card-indigo',
      badge: 'Segera',
      available: false
    },
    {
      id: 'coloring',
      title: 'Modul Mewarnai',
      image: '/coloring_kids.jpg',
      color: 'card-rose',
      badge: 'Segera',
      available: false
    },
    {
      id: 'drawing',
      title: 'Modul Menggambar',
      image: '/drawing_kids.jpg',
      color: 'card-cyan',
      badge: 'Segera',
      available: false
    },
    {
      id: 'sports',
      title: 'Modul Olahraga',
      image: '/sports_kids.jpg',
      color: 'card-lime',
      badge: 'Segera',
      available: false
    }
  ];

  const handleCardClick = (mod) => {
    kidAudio.playPop();
    if (!mod.available) {
      kidAudio.speak(`Modul ${mod.title} akan segera hadir dalam pembaruan berikutnya ya teman-teman! Tetap semangat!`);
      return;
    }
    onSelectModule(mod.id);
  };

  return (
    <div className="home-screen-container animate-fade-in">
      
      {/* Sleek Greeting Sub-Header */}
      <section className="home-greeting-bar glass-panel">
        <div className="greeting-text">
          <h2>Selamat Datang, {childName}! 👋</h2>
          <p>Pilih modul favoritmu dan mainkan bersama teman-teman!</p>
        </div>
      </section>

      {/* ACTIVE MODULES GRID */}
      <section className="home-section">
        <div className="section-title-row">
          <h3>🌟 Modul Utama (Siap Dimainkan)</h3>
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
                  <span>Mulai Main</span>
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
          <h3>🚀 Modul Petualangan Baru (Akan Datang)</h3>
          <span className="section-subtitle">Nantikan keseruan modul-modul ini dalam pembaruan berikutnya!</span>
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
                  <span>Segera Hadir</span>
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
            <h4>Tutorial &amp; Petunjuk</h4>
            <p>Pelajari cara bermain &amp; kumpulkan bintang</p>
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
            <h4>Area Orang Tua &amp; Dashboard</h4>
            <p>Pantau screen time, progres, &amp; kontrol pertemanan</p>
          </div>
        </div>
      </section>

    </div>
  );
}
