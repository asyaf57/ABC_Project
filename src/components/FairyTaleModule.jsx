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
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button 
          onClick={handleBackToList}
          className="self-start md:self-auto flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white/40 group"
        >
          <ArrowLeftCircle size={28} className="text-yellow-300 group-hover:-translate-x-1 transition-transform" />
          <span className="drop-shadow-md">Kembali</span>
        </button>
        
        <div className="flex-1 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] px-4 py-2">
            {selectedStory.title}
          </h2>
        </div>
        
        <div className="hidden md:block w-[140px]"></div> {/* Spacer for center alignment */}
      </div>

      {/* Main Story Panel */}
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative flex-1 min-h-[60vh]">
        
        {/* Progress Bar indicator */}
        <div className="w-full bg-black/20 h-2 absolute top-0 left-0 z-10">
          <div 
            className="bg-yellow-400 h-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentSceneIndex + 1) / selectedStory.scenes.length) * 100}%` }}
          />
        </div>

        {/* Image Panel */}
        <div className="relative w-full h-[45vh] md:h-[55vh] bg-black/60 flex items-center justify-center overflow-hidden rounded-t-[2.5rem] shadow-inner">
          {/* Only render current scene image – key forces re-mount for fresh fade-in */}
          <img
            key={currentScene.id}
            src={currentScene.image}
            alt={`Scene ${currentSceneIndex + 1}`}
            style={{ animation: 'sceneFadeIn 0.8s ease forwards' }}
            className="w-full h-full object-contain p-2 md:p-4 drop-shadow-2xl"
          />

          {/* Scene number badge */}
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border-2 border-white/30">
            Adegan {currentSceneIndex + 1} / {selectedStory.scenes.length}
          </div>
        </div>


        {/* Text and Controls Panel */}
        <div className="bg-white p-6 md:p-8 shadow-[0_-10px_30px_rgba(0,0,0,0.2)] relative z-30 rounded-b-[2.5rem]">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
            
            {/* Playback Controls Row */}
            <div className="flex items-center justify-center gap-6 md:gap-8 bg-gray-50 px-8 py-4 rounded-full shadow-inner border border-gray-100">
              {/* Prev Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrevScene(); kidAudio.playPop(); }}
                disabled={currentSceneIndex === 0}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all transform ${currentSceneIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg hover:scale-110 active:scale-95 border-2 border-white'}`}
              >
                <SkipBack size={28} fill="currentColor" />
              </button>

              {/* Play/Pause Button - Large and prominent */}
              <button 
                onClick={handlePlayPause}
                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all transform hover:scale-110 active:scale-95 ${isPlaying ? 'bg-gradient-to-br from-red-400 to-rose-600 text-white border-4 border-red-200' : 'bg-gradient-to-br from-green-400 to-emerald-600 text-white border-4 border-green-200'}`}
              >
                {isPlaying ? <Pause size={42} fill="currentColor" /> : <Play size={42} fill="currentColor" className="ml-2" />}
              </button>

              {/* Next Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); goToNextScene(); kidAudio.playPop(); }}
                disabled={currentSceneIndex === selectedStory.scenes.length - 1}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all transform ${currentSceneIndex === selectedStory.scenes.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg hover:scale-110 active:scale-95 border-2 border-white'}`}
              >
                <SkipForward size={28} fill="currentColor" />
              </button>
            </div>

            {/* Story Text */}
            <div className="w-full text-center min-h-[100px] flex items-center justify-center bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-100 relative">
              <div className="absolute top-2 left-2 text-yellow-300 opacity-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <p className="text-2xl md:text-3xl text-gray-800 font-medium leading-relaxed font-sans animate-fade-in relative z-10" key={currentSceneIndex}>
                {currentScene.text}
              </p>
            </div>
          </div>
          
          {/* Scene Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {selectedStory.scenes.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSceneIndex ? 'w-8 bg-orange-500' : 'w-2.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
