import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import SpellingModule from './components/SpellingModule';
import MathModule from './components/MathModule';
import CodingModule from './components/CodingModule';
import VoiceRoomPreview from './components/VoiceRoomPreview';
import ColoringModule from './components/ColoringModule';
import FairyTaleModule from './components/FairyTaleModule';
import TutorialModal from './components/TutorialModal';
import ParentModal from './components/ParentModal';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import KidModuleBoundary from './components/KidModuleBoundary';
import ProfileModal from './components/ProfileModal';
import { supabase } from './utils/supabaseClient';
import { LogOut, X } from 'lucide-react';

export default function App() {
  const [account, setAccount] = useState(null);
  const [activeScreen, setActiveScreen] = useState('welcome'); // 'welcome' | 'home' | 'module'
  const [activeModule, setActiveModule] = useState('spelling'); // 'spelling' | 'math' | 'coding' | 'voice'
  const [stars, setStars] = useState(0); // Starts strictly at 0 stars!
  
  // Modals
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Hardware Back Button & Exit Modal State
  const [backPressCount, setBackPressCount] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const activeScreenRef = useRef(activeScreen);

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  // Handle Hardware Back Button
  useEffect(() => {
    // Push dummy state to trap back button
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e) => {
      // Re-push to prevent browser from navigating back and closing app
      window.history.pushState(null, '', window.location.href);

      // Dispatch custom event so modules (like FairyTale) can intercept
      const backEvent = new CustomEvent('hardwareBackPress', { cancelable: true });
      const notIntercepted = window.dispatchEvent(backEvent);

      if (notIntercepted) {
        if (activeScreenRef.current === 'module') {
          setActiveScreen('home');
          setBackPressCount(0);
        } else {
          // On Home or Welcome screen
          setBackPressCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 2) {
              setShowExitConfirm(true);
              return 0; // reset
            } else {
              // Toast or small delay to reset press count
              setTimeout(() => setBackPressCount(0), 2000);
              return newCount;
            }
          });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const confirmExitApp = () => {
    window.close();
    window.location.href = "about:blank"; // Fallback
  };

  // Load account from Supabase Auth & LocalStorage fallback
  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user);
      } else {
        checkLocalAuth();
      }
    });

    // 2. Listen to Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user);
      } else {
        setAccount(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (user) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Jika profil tidak ada, buat baru berdasarkan metadata (kasus konfirmasi email)
      if (error && error.code === 'PGRST116') {
        const meta = user.user_metadata || {};
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role: 'parent',
            child_name: meta.child_name || 'Anak Pintar',
            avatar_emoji: meta.avatar_emoji || '🦁',
            avatar_url: meta.avatar_url || null,
            user_id_display: meta.user_id_display || `ABC-${Math.floor(10000 + Math.random() * 90000)}`,
            stars: 0,
            screen_time_limit: 45,
            voice_allowed: true,
            friend_chat_allowed: true,
            ai_filter_strict: true,
          })
          .select()
          .single();
        
        if (!insertError) {
          data = newProfile;
          error = null;
        }
      }
      
      if (data && !error) {
        const remoteAccount = {
          userId: data.user_id_display,
          childName: data.child_name,
          avatar: { emoji: data.avatar_emoji, photoUrl: data.avatar_url, id: 'custom' },
          parentEmail: user.email,
          stars: data.stars || 0
        };
        setAccount(remoteAccount);
        setStars(data.stars || 0);
        setActiveScreen('home');
      } else {
        checkLocalAuth();
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

            {activeModule === 'dongeng' && (
              <KidModuleBoundary key="dongeng-module">
                <FairyTaleModule onAddStars={handleAddStars} />
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

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl border-4 border-yellow-300 transform transition-all text-center">
            <div className="bg-red-100 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Keluar Aplikasi?</h3>
            <p className="text-gray-600 mb-8">Apakah kamu yakin ingin menutup aplikasi ABC?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-bold transition-colors"
              >
                Tidak
              </button>
              <button 
                onClick={confirmExitApp}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-bold transition-colors shadow-md hover:shadow-lg"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
