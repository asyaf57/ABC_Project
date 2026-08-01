import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import SpellingModule from './components/SpellingModule';
import MathModule from './components/MathModule';
import CodingModule from './components/CodingModule';
import VoiceRoomPreview from './components/VoiceRoomPreview';
import TutorialModal from './components/TutorialModal';
import ParentModal from './components/ParentModal';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import KidModuleBoundary from './components/KidModuleBoundary';

export default function App() {
  const [account, setAccount] = useState(null);
  const [activeScreen, setActiveScreen] = useState('welcome'); // 'welcome' | 'home' | 'module'
  const [activeModule, setActiveModule] = useState('spelling'); // 'spelling' | 'math' | 'coding' | 'voice'
  const [stars, setStars] = useState(0); // Starts strictly at 0 stars!
  
  // Modals
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  // Load account from localStorage on mount
  useEffect(() => {
    try {
      const savedAccount = localStorage.getItem('abc_account_data');
      const savedStars = localStorage.getItem('abc_stars_count');
      if (savedAccount) {
        const parsedAcc = JSON.parse(savedAccount);
        setAccount(parsedAcc);
        setActiveScreen('home');
      }
      if (savedStars !== null) {
        setStars(parseInt(savedStars, 10) || 0);
      } else {
        setStars(0);
      }
    } catch (err) {
      console.warn('Error reading from localStorage:', err);
    }
  }, []);

  const handleCompleteRegistration = (newAccount, startWithTutorial = false) => {
    setAccount(newAccount);
    setStars(0); // Initial stars start at 0
    try {
      localStorage.setItem('abc_account_data', JSON.stringify(newAccount));
      localStorage.setItem('abc_stars_count', '0');
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    setActiveScreen('home');
    if (startWithTutorial) {
      setIsTutorialOpen(true);
    }
  };

  const handleAddStars = (amount) => {
    setStars((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('abc_stars_count', next.toString());
      } catch (e) {}
      return next;
    });
  };

  const handleNavigateHome = () => {
    setActiveScreen('home');
  };

  const handleSelectModule = (moduleId) => {
    setActiveModule(moduleId);
    setActiveScreen('module');
  };

  return (
    <div className="app-container">
      {/* Show Header on Home & Module screens */}
      {activeScreen !== 'welcome' && (
        <Header 
          activeScreen={activeScreen}
          activeModule={activeModule}
          onNavigateHome={handleNavigateHome}
          onSelectModule={handleSelectModule}
          stars={stars}
          account={account}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenParentModal={() => setIsParentModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {activeScreen === 'welcome' && (
          <WelcomeScreen 
            onCompleteRegistration={handleCompleteRegistration}
            onStartTutorialDirectly={() => setIsTutorialOpen(true)}
          />
        )}

        {activeScreen === 'home' && (
          <HomeScreen 
            account={account}
            stars={stars}
            onSelectModule={handleSelectModule}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenParentModal={() => setIsParentModalOpen(true)}
          />
        )}

        {activeScreen === 'module' && (
          <>
            {activeModule === 'spelling' && (
              <KidModuleBoundary key="spelling-module">
                <SpellingModule onAddStars={handleAddStars} />
              </KidModuleBoundary>
            )}

            {activeModule === 'math' && (
              <KidModuleBoundary key="math-module">
                <MathModule onAddStars={handleAddStars} />
              </KidModuleBoundary>
            )}

            {activeModule === 'coding' && (
              <KidModuleBoundary key="coding-module">
                <CodingModule onAddStars={handleAddStars} />
              </KidModuleBoundary>
            )}

            {activeModule === 'voice' && (
              <KidModuleBoundary key="voice-module">
                <VoiceRoomPreview account={account} onAddStars={handleAddStars} />
              </KidModuleBoundary>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Ergonomic Navigation Bar */}
      {activeScreen !== 'welcome' && (
        <BottomNav 
          activeScreen={activeScreen}
          activeModule={activeModule}
          onNavigateHome={handleNavigateHome}
          onSelectModule={handleSelectModule}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenParentModal={() => setIsParentModalOpen(true)}
        />
      )}

      {/* Interactive Tutorial Modal */}
      {isTutorialOpen && (
        <TutorialModal 
          onClose={() => setIsTutorialOpen(false)}
          onRewardStars={(bonus) => handleAddStars(bonus)}
        />
      )}

      {/* Parent Area & Web Dashboard Modal */}
      {isParentModalOpen && (
        <ParentModal 
          isOpen={isParentModalOpen}
          onClose={() => setIsParentModalOpen(false)} 
          stars={stars}
          account={account}
        />
      )}
    </div>
  );
}
