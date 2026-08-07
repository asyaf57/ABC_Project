import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftCircle, Play, Pause, SkipForward, SkipBack, BookOpen, Home } from 'lucide-react';
import { fairytales } from '../data/fairytales';
import { kidAudio } from '../utils/audio';

export default function FairyTaleModule({ onAddStars }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentSceneIndexRef = useRef(currentSceneIndex);

  useEffect(() => {
    currentSceneIndexRef.current = currentSceneIndex;
  }, [currentSceneIndex]);

  useEffect(() => {
    // Cleanup audio on unmount or when leaving the story
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    const handleHardwareBack = (e) => {
      if (selectedStory) {
        e.preventDefault();
        handleBackToList();
      }
    };
    window.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => window.removeEventListener('hardwareBackPress', handleHardwareBack);
  }, [selectedStory]);

  const handleSelectStory = (story) => {
    kidAudio.playPop();
    setSelectedStory(story);
    setCurrentSceneIndex(0);
    setIsPlaying(false);
    
    // Record reading history (simple local storage implementation for Parent Dashboard)
    try {
      const historyStr = localStorage.getItem('abc_listening_history') || '[]';
      const history = JSON.parse(historyStr);
      history.push({
        title: story.title,
        date: new Date().toISOString(),
      });
      localStorage.setItem('abc_listening_history', JSON.stringify(history));
    } catch(e) {
      console.warn("Failed to save history", e);
    }
  };

  const handleBackToList = () => {
    kidAudio.playPop();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setSelectedStory(null);
    setIsPlaying(false);
  };

  const currentScene = selectedStory?.scenes[currentSceneIndex];

  const handlePlayPause = () => {
    kidAudio.playPop();
    if (!isPlaying) {
      playAudio(currentScene.audio);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  };

  const playAudio = (src) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = src;
    
    // Always attach the latest onended handler
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setTimeout(() => {
        // Auto-advance if not at the end
        if (currentSceneIndexRef.current < selectedStory.scenes.length - 1) {
          goToNextScene(true);
        }
      }, 800);
    };
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => {
      console.error("Audio play failed:", e);
      setIsPlaying(false);
    });
  };

  const goToNextScene = (autoPlay = false) => {
    const currentIndex = currentSceneIndexRef.current;
    if (currentIndex < selectedStory.scenes.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentSceneIndex(nextIndex);
      
      // Stop current
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      if (isPlaying || autoPlay) {
        // Play next after a tiny delay to allow render
        setTimeout(() => {
          playAudio(selectedStory.scenes[nextIndex].audio);
        }, 150);
      }
    }
  };

  const goToPrevScene = () => {
    const currentIndex = currentSceneIndexRef.current;
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentSceneIndex(prevIndex);
      
      // Stop current
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      if (isPlaying) {
        setTimeout(() => {
          playAudio(selectedStory.scenes[prevIndex].audio);
        }, 150);
      }
    }
  };

  // 1. Grid View (Daftar Dongeng)
  if (!selectedStory) {
    return (
      <div className="flex flex-col items-center p-8 w-full h-full animate-fade-in overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-md mb-2 flex items-center justify-center gap-3">
            <BookOpen size={40} className="text-yellow-300" />
            Koleksi Cerita Dongeng
            <BookOpen size={40} className="text-yellow-300" />
          </h2>
          <p className="text-xl text-white/90 font-medium">Pilih cerita yang ingin kamu dengar hari ini!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl w-full px-4">
          {fairytales.map((story) => (
            <div 
              key={story.id}
              onClick={() => handleSelectStory(story)}
              className="bg-white/20 backdrop-blur-md border-4 border-white/40 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-yellow-300 group shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/10">
                <img 
                  src={story.coverImage} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold self-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                    <Play size={16} fill="currentColor" /> Baca Cerita
                  </div>
                </div>
              </div>
              <div className="p-4 text-center bg-white/90 flex-1 flex items-center justify-center">
                <h3 className="text-xl font-bold text-gray-800 leading-tight">{story.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Story View (Detail Cerita)
  return (
    <div className="flex flex-col items-center w-full h-full animate-fade-in p-4 lg:p-8">
      {/* Top Navigation & Title */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <button 
          onClick={handleBackToList}
          className="self-start md:self-auto flex items-center gap-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white px-5 py-2.5 rounded-2xl font-black text-lg transition-all shadow-[0_6px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 border-2 border-white/60 group"
        >
          <div className="bg-white/25 p-1 rounded-xl group-hover:-translate-x-1 transition-transform">
            <ArrowLeftCircle size={24} className="text-yellow-200 drop-shadow" />
          </div>
          <span className="drop-shadow-md tracking-wide">Kembali</span>
        </button>
        
        <div className="flex-1 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-300 to-amber-400 drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] px-4 py-1">
            {selectedStory.title}
          </h2>
        </div>
        
        <div className="hidden md:block w-[130px]"></div> {/* Spacer for center alignment */}
      </div>

      {/* Main Story Panel */}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Progress Bar indicator */}
        <div className="w-full bg-black/20 h-2 absolute top-0 left-0 z-10">
          <div 
            className="bg-gradient-to-r from-yellow-300 to-orange-500 h-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentSceneIndex + 1) / selectedStory.scenes.length) * 100}%` }}
          />
        </div>

        {/* Image Panel - Compact height matching header scale */}
        <div className="relative w-full h-[25vh] md:h-[32vh] max-h-[300px] bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center overflow-hidden rounded-t-[2.5rem] shadow-inner">
          {/* Only render current scene image – key forces re-mount for fresh fade-in */}
          <img
            key={currentScene.id}
            src={currentScene.image}
            alt={`Scene ${currentSceneIndex + 1}`}
            style={{ animation: 'sceneFadeIn 0.8s ease forwards' }}
            className="w-full h-full object-contain p-3 md:p-4 drop-shadow-2xl"
          />

          {/* Scene number badge */}
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs md:text-sm font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white/40">
            Adegan {currentSceneIndex + 1} / {selectedStory.scenes.length}
          </div>
        </div>


        {/* Text and Controls Panel */}
        <div className="bg-white p-5 md:p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.2)] relative z-30 rounded-b-[2.5rem]">
          <div className="w-full flex flex-col items-center gap-5">
            
            {/* Playback Controls Row - Full width matching image panel */}
            <div className="w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-3 md:p-4 rounded-2xl border-2 border-purple-100/80 shadow-inner flex items-center justify-around gap-3 md:gap-6">
              {/* Prev Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrevScene(); kidAudio.playPop(); }}
                disabled={currentSceneIndex === 0}
                className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all transform ${
                  currentSceneIndex === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_6px_16px_rgba(59,130,246,0.4)] hover:scale-110 active:scale-95 border-2 border-white'
                }`}
              >
                <SkipBack size={30} fill="currentColor" className="drop-shadow" />
              </button>

              {/* Play/Pause Button - Prominent & colorful */}
              <button 
                onClick={handlePlayPause}
                className={`flex-shrink-0 w-18 h-18 md:w-22 md:h-22 p-4 rounded-3xl flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all transform hover:scale-110 active:scale-95 border-4 border-white ${
                  isPlaying 
                    ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-pink-500 text-white shadow-red-400/50' 
                    : 'bg-gradient-to-tr from-emerald-400 via-green-500 to-teal-400 text-white shadow-emerald-400/50'
                }`}
              >
                {isPlaying ? (
                  <Pause size={40} fill="currentColor" className="drop-shadow" />
                ) : (
                  <Play size={40} fill="currentColor" className="ml-1 drop-shadow" />
                )}
              </button>

              {/* Next Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); goToNextScene(); kidAudio.playPop(); }}
                disabled={currentSceneIndex === selectedStory.scenes.length - 1}
                className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all transform ${
                  currentSceneIndex === selectedStory.scenes.length - 1 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-[0_6px_16px_rgba(168,85,247,0.4)] hover:scale-110 active:scale-95 border-2 border-white'
                }`}
              >
                <SkipForward size={30} fill="currentColor" className="drop-shadow" />
              </button>
            </div>

            {/* Story Text */}
            <div className="w-full text-center min-h-[90px] flex items-center justify-center bg-yellow-50/80 rounded-2xl p-5 border-2 border-yellow-100 relative">
              <div className="absolute top-2 left-2 text-yellow-300 opacity-50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <p className="text-xl md:text-2xl text-gray-800 font-semibold leading-relaxed font-sans animate-fade-in relative z-10" key={currentSceneIndex}>
                {currentScene.text}
              </p>
            </div>
          </div>
          
          {/* Scene Indicator */}
          <div className="flex justify-center mt-5 gap-2">
            {selectedStory.scenes.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSceneIndex ? 'w-8 bg-gradient-to-r from-orange-400 to-pink-500 shadow-sm' : 'w-2.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
