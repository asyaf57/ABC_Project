import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import SpellingModule from './components/SpellingModule';
import MathModule from './components/MathModule';
import CodingModule from './components/CodingModule';
import VoiceRoomPreview from './components/VoiceRoomPreview';
import ColoringModule from './components/ColoringModule';
import TutorialModal from './components/TutorialModal';
import ParentModal from './components/ParentModal';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import KidModuleBoundary from './components/KidModuleBoundary';
import ProfileModal from './components/ProfileModal';
import { supabase } from './utils/supabaseClient';

export default function App() {
  const [account, setAccount] = useState(null);
  const [activeScreen, setActiveScreen] = useState('welcome'); // 'welcome' | 'home' | 'module'
  const [activeModule, setActiveModule] = useState('spelling'); // 'spelling' | 'math' | 'coding' | 'voice'
  const [stars, setStars] = useState(0); // Starts strictly at 0 stars!
  
  // Modals
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load account from Supabase Auth & LocalStorage fallback
  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id, session.user.email);
      } else {
        checkLocalAuth();
      }
    });

    // 2. Listen to Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id, session.user.email);
      } else {
        setAccount(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId, email) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        const remoteAccount = {
          userId: data.user_id_display,
          childName: data.child_name,
          avatar: { emoji: data.avatar_emoji, photoUrl: data.avatar_url, id: 'custom' },
          parentEmail: email,
          stars: data.stars || 0
        };
        setAccount(remoteAccount);
        setStars(data.stars || 0);
        setActiveScreen('home');
      }
    } catch (err) {
      console.warn("Gagal memuat profil Supabase:", err);
      checkLocalAuth(); // Fallback if DB fetch fails
    }
  };

  const checkLocalAuth = () => {
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
  };

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Logout error', e);
    }
    localStorage.removeItem('abc_account_data');
    localStorage.removeItem('abc_stars_count');
    setAccount(null);
    setStars(0);
    setActiveScreen('welcome');
    setIsProfileModalOpen(false);
  };

  const handleSelectModule = (moduleId) => {
    setActiveModule(moduleId);
    setActiveScreen('module');
  };

  const getThemeClass = () => {
    if (activeScreen === 'welcome') return 'bg-theme-welcome';
    if (activeScreen === 'home') return 'bg-theme-home';
    if (activeScreen === 'module') {
      return `bg-theme-${activeModule}`;
    }
    return 'bg-theme-home';
  };

  useEffect(() => {
    // Apply background theme to body
    document.body.className = getThemeClass();
  }, [activeScreen, activeModule]);

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
          onOpenProfile={() => setIsProfileModalOpen(true)}
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

            {activeModule === 'coloring' && (
              <KidModuleBoundary key="coloring-module">
                <ColoringModule onAddStars={handleAddStars} />
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

      {/* Profile Settings & Logout Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        account={account}
        stars={stars}
        onLogout={handleLogout}
      />
    </div>
  );
}
