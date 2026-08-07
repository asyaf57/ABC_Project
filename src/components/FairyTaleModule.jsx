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
      <div className="ft-grid-container animate-fade-in">
        <div className="ft-grid-header">
          <h2 className="ft-grid-title">
            <BookOpen size={36} />
            Koleksi Cerita Dongeng
            <BookOpen size={36} />
          </h2>
          <p className="ft-grid-subtitle">Pilih cerita yang ingin kamu dengar hari ini!</p>
        </div>

        <div className="ft-stories-grid">
          {fairytales.map((story) => (
            <div 
              key={story.id}
              onClick={() => handleSelectStory(story)}
              className="ft-story-card"
            >
              <div className="ft-card-image-wrap">
                <img 
                  src={story.coverImage} 
                  alt={story.title} 
                />
                <div className="ft-card-overlay">
                  <div className="ft-card-play-badge">
                    <Play size={16} fill="currentColor" /> Baca Cerita
                  </div>
                </div>
              </div>
              <div className="ft-card-title-bar">
                <h3>{story.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Story View (Detail Cerita)
  return (
    <div className="ft-story-view animate-fade-in">
      {/* Top Navigation & Title */}
      <div className="ft-top-nav">
        <button 
          onClick={handleBackToList}
          className="ft-back-btn"
        >
          <div className="ft-back-icon-wrap">
            <ArrowLeftCircle size={24} />
          </div>
          <span>Kembali</span>
        </button>
        
        <div className="ft-title-center">
          <h2 className="ft-story-title">
            {selectedStory.title}
          </h2>
        </div>
        
        <div className="ft-spacer"></div>
      </div>

      {/* Main Story Panel */}
      <div className="ft-main-panel">
        
        {/* Progress Bar indicator */}
        <div className="ft-progress-bar">
          <div 
            className="ft-progress-fill" 
            style={{ width: `${((currentSceneIndex + 1) / selectedStory.scenes.length) * 100}%` }}
          />
        </div>

        {/* Image Panel - Compact height */}
        <div className="ft-image-panel">
          <img
            key={currentScene.id}
            src={currentScene.image}
            alt={`Scene ${currentSceneIndex + 1}`}
            className="ft-scene-image"
          />

          {/* Scene number badge */}
          <div className="ft-scene-badge">
            Adegan {currentSceneIndex + 1} / {selectedStory.scenes.length}
          </div>
        </div>


        {/* Text and Controls Panel */}
        <div className="ft-controls-panel">
          <div className="ft-controls-inner">
            
            {/* Playback Controls Row - Full width */}
            <div className="ft-playback-row">
              {/* Prev Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrevScene(); kidAudio.playPop(); }}
                disabled={currentSceneIndex === 0}
                className="ft-btn-prev"
              >
                <SkipBack size={28} fill="currentColor" />
              </button>

              {/* Play/Pause Button */}
              <button 
                onClick={handlePlayPause}
                className={`ft-btn-play ${isPlaying ? 'playing' : 'paused'}`}
              >
                {isPlaying ? (
                  <Pause size={38} fill="currentColor" />
                ) : (
                  <Play size={38} fill="currentColor" style={{ marginLeft: '3px' }} />
                )}
              </button>

              {/* Next Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); goToNextScene(); kidAudio.playPop(); }}
                disabled={currentSceneIndex === selectedStory.scenes.length - 1}
                className="ft-btn-next"
              >
                <SkipForward size={28} fill="currentColor" />
              </button>
            </div>

            {/* Story Text */}
            <div className="ft-text-box">
              <div className="ft-quote-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <p className="ft-scene-text" key={currentSceneIndex}>
                {currentScene.text}
              </p>
            </div>
          </div>
          
          {/* Scene Indicator */}
          <div className="ft-scene-dots">
            {selectedStory.scenes.map((_, idx) => (
              <div 
                key={idx} 
                className={`ft-dot ${idx === currentSceneIndex ? 'active' : 'inactive'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
