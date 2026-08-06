import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, ChevronRight, ChevronLeft, Volume2, BookOpen } from 'lucide-react';
import { fairytales } from '../data/fairytales';
import { kidAudio } from '../utils/audio';

export default function FairyTaleModule({ onAddStars }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Cleanup audio on unmount or when leaving the story
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

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
      audioRef.current = new Audio(src);
      
      // When audio ends, auto-advance to next scene
      audioRef.current.onended = () => {
        setTimeout(() => {
          goToNextScene(true);
        }, 1000); // 1 second pause between scenes
      };
    } else {
      audioRef.current.src = src;
    }
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => {
      console.error("Audio play failed:", e);
      setIsPlaying(false);
    });
  };

  const goToNextScene = (autoPlay = false) => {
    if (currentSceneIndex < selectedStory.scenes.length - 1) {
      const nextIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIndex);
      
      if (isPlaying || autoPlay) {
        // Stop current
        if (audioRef.current) audioRef.current.pause();
        // Play next after a tiny delay to allow render
        setTimeout(() => {
          playAudio(selectedStory.scenes[nextIndex].audio);
        }, 100);
      }
    } else {
      // Story finished
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const goToPrevScene = () => {
    if (currentSceneIndex > 0) {
      const prevIndex = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIndex);
      
      if (isPlaying) {
        if (audioRef.current) audioRef.current.pause();
        setTimeout(() => {
          playAudio(selectedStory.scenes[prevIndex].audio);
        }, 100);
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
      {/* Top Navigation */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <button 
          onClick={handleBackToList}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-5 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-x-1 border-2 border-white/30"
        >
          <ArrowLeft size={24} />
          Kembali
        </button>
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center px-4 bg-black/20 rounded-full py-2 border border-white/20">
          {selectedStory.title}
        </h2>
        <div className="w-24"></div> {/* Spacer for center alignment */}
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
        <div className="relative w-full flex-1 min-h-[40vh] bg-black/40 flex items-center justify-center overflow-hidden">
          {/* Only render current scene image – key forces re-mount for fresh fade-in */}
          <img
            key={currentScene.id}
            src={currentScene.image}
            alt={`Scene ${currentSceneIndex + 1}`}
            style={{ animation: 'sceneFadeIn 0.6s ease forwards' }}
            className="w-full h-full object-contain p-4"
          />
          
          {/* Navigation Overlay Controls */}
          <div className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start p-4 z-20">
            {currentSceneIndex > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrevScene(); kidAudio.playPop(); }}
                className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg transform hover:scale-110 opacity-50 hover:opacity-100"
              >
                <ChevronLeft size={40} />
              </button>
            )}
          </div>
          <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end p-4 z-20">
            {currentSceneIndex < selectedStory.scenes.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goToNextScene(); kidAudio.playPop(); }}
                className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg transform hover:scale-110 opacity-50 hover:opacity-100"
              >
                <ChevronRight size={40} />
              </button>
            )}
          </div>

          {/* Scene number badge */}
          <div className="absolute top-3 left-3 z-20 bg-black/50 text-white text-sm font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            Scene {currentSceneIndex + 1} / {selectedStory.scenes.length}
          </div>
        </div>


        {/* Text and Controls Panel */}
        <div className="bg-white p-6 md:p-8 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative z-30">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
            
            {/* Play Button - Large and prominent */}
            <button 
              onClick={handlePlayPause}
              className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.15)] transition-all transform hover:scale-105 active:scale-95 ${isPlaying ? 'bg-amber-100 text-amber-600 border-4 border-amber-300' : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-4 border-white'}`}
            >
              {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
            </button>

            {/* Story Text */}
            <div className="flex-1 text-center md:text-left min-h-[100px] flex items-center">
              <p className="text-2xl md:text-3xl text-gray-800 font-medium leading-relaxed font-sans animate-fade-in" key={currentSceneIndex}>
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
