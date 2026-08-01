import React from 'react';
import { Home, BookOpen, Binary, Code, Mic, ShieldCheck } from 'lucide-react';
import { kidAudio } from '../utils/audio';

export default function BottomNav({ activeScreen, activeModule, onNavigateHome, onSelectModule, onOpenTutorial, onOpenParentModal }) {
  const navItems = [
    {
      id: 'home',
      label: 'Beranda',
      icon: Home,
      action: () => onNavigateHome()
    },
    {
      id: 'spelling',
      label: 'Mengeja',
      icon: BookOpen,
      action: () => onSelectModule('spelling')
    },
    {
      id: 'math',
      label: 'Berhitung',
      icon: Binary,
      action: () => onSelectModule('math')
    },
    {
      id: 'coding',
      label: 'Coding',
      icon: Code,
      action: () => onSelectModule('coding')
    },
    {
      id: 'voice',
      label: 'Sahabat AI',
      icon: Mic,
      action: () => onSelectModule('voice')
    }
  ];

  const handleItemClick = (item) => {
    kidAudio.playPop();
    item.action();
  };

  return (
    <nav className="bottom-nav-container">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            (item.id === 'home' && activeScreen === 'home') ||
            (item.id === activeModule && activeScreen === 'module');

          return (
            <button
              key={item.id}
              className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {isActive && <div className="active-dot" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
