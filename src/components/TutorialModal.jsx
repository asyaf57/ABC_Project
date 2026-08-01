import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Star, Sparkles, BookOpen, Mic, ShieldCheck, CheckCircle, Volume2 } from 'lucide-react';
import { kidAudio } from '../utils/audio';

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: '👋 Selamat Datang di Aplikasi ABC!',
    subtitle: 'Platform Belajar & Bermain Interaktif Anak',
    icon: Sparkles,
    content: 'Halo teman pintar! Aplikasi ABC dirancang khusus untuk membantumu belajar mengeja, berbicara, dan berhitung dengan menyenangkan.',
    actionText: 'Tekan Suara Untuk Mendengarkan',
    speech: 'Selamat datang di Aplikasi ABC! Mari kita ikuti petunjuk seru ini dan kumpulkan bintang emas!'
  },
  {
    id: 2,
    title: '🔤 Modul Mengeja & Suara',
    subtitle: 'Mengenal Huruf, Suku Kata, dan Tebak Kata',
    icon: BookOpen,
    content: 'Di modul Belajar Mengeja, kamu bisa menekan tombol huruf untuk mendengar pelafalan suara asli Bahasa Indonesia, serta bermain tebak kata interaktif.',
    speech: 'Di modul Mengeja, kamu bisa belajar huruf, suku kata, dan menebak kata dengan suara yang jernih!'
  },
  {
    id: 3,
    title: '🎙️ Ruang Sahabat AI',
    subtitle: 'Teman Bicara Interaktif Anak Cerdas',
    icon: Mic,
    content: 'Kamu bisa berbicara langsung dengan Sahabat AI anak untuk melatih keberanian berkomunikasi, bernyanyi, dan bertanya apa saja!',
    speech: 'Di Ruang Sahabat, kamu bisa ngobrol dan bertanya apapun pada teman AI yang ramah!'
  },
  {
    id: 4,
    title: '⭐ Koleksi Bintang Emas',
    subtitle: 'Kumpulkan Bintang dan Dapatkan Hadiah!',
    icon: Star,
    content: 'Setiap kali kamu menyelesaikan soal atau tutorial, kamu akan mendapatkan Bintang Emas. Kumpulkan sebanyak-banyaknya ya!',
    speech: 'Kumpulkan bintang emas sebanyak-banyaknya dengan rajin belajar setiap hari!'
  },
  {
    id: 5,
    title: '🛡️ Area Orang Tua & User ID',
    subtitle: 'Keamanan, Screen Time & Monitoring',
    icon: ShieldCheck,
    content: 'Orang tua bisa menggunakan User ID & Password unik untuk memantau waktu belajar (Screen Time) dan mengatur keselamatan pertemanan anak.',
    speech: 'Orang tuamu bisa melihat laporan belajar dan mengelola waktu mainmu di Area Orang Tua.'
  }
];

export default function TutorialModal({ onClose, onRewardStars }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const step = TUTORIAL_STEPS[currentStep];
  const IconComponent = step.icon;

  useEffect(() => {
    // Automatically speak the current step speech guide
    if (step && step.speech) {
      kidAudio.speak(step.speech, 1.0, 1.2);
    }
  }, [currentStep]);

  const handleNext = () => {
    kidAudio.playPop();
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete tutorial
      setIsCompleted(true);
      kidAudio.playFanfare();
      kidAudio.speak('Hore! Kamu berhasil menyelesaikan tutorial! Kamu mendapatkan bonus 10 bintang emas pertama!', 1.0, 1.3);
      if (typeof onRewardStars === 'function') {
        onRewardStars(10);
      }
    }
  };

  const handlePrev = () => {
    kidAudio.playPop();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReplayAudio = () => {
    kidAudio.playPop();
    if (step && step.speech) {
      kidAudio.speak(step.speech, 1.0, 1.2);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content tutorial-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} title="Tutup Tutorial">
          <X size={24} />
        </button>

        {!isCompleted ? (
          <>
            {/* Stepper Progress */}
            <div className="tutorial-stepper">
              {TUTORIAL_STEPS.map((s, idx) => (
                <div 
                  key={s.id} 
                  className={`step-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                  onClick={() => {
                    kidAudio.playPop();
                    setCurrentStep(idx);
                  }}
                  title={`Langkah ${s.id}`}
                />
              ))}
            </div>

            {/* Step Card Body */}
            <div className="tutorial-step-body animate-scale-up" key={step.id}>
              <div className="step-icon-wrapper">
                <IconComponent size={48} className="step-icon text-yellow-500 animate-bounce-gentle" />
              </div>
              <h2 className="step-title">{step.title}</h2>
              <h3 className="step-subtitle">{step.subtitle}</h3>

              <p className="step-description">{step.content}</p>

              <button className="btn-audio-replay" onClick={handleReplayAudio}>
                <Volume2 size={20} />
                <span>Dengar Audio Panduan Suara</span>
              </button>
            </div>

            {/* Footer Navigation */}
            <div className="tutorial-footer">
              <button 
                className="btn-kid btn-secondary" 
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ArrowLeft size={20} />
                <span>Sebelumnya</span>
              </button>

              <span className="step-counter">
                Langkah {currentStep + 1} dari {TUTORIAL_STEPS.length}
              </span>

              <button className="btn-kid btn-primary" onClick={handleNext}>
                <span>{currentStep === TUTORIAL_STEPS.length - 1 ? 'Selesai (+10 🌟)' : 'Berikutnya'}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </>
        ) : (
          /* Completion State */
          <div className="tutorial-complete-view animate-scale-up">
            <div className="reward-icon-badge animate-float">
              <Star size={64} className="fill-current text-yellow-400 text-gold-glow" />
              <Sparkles size={32} className="sparkle-overlay" />
            </div>

            <h2 className="reward-title">Selamat! Tutorial Selesai 🎉</h2>
            <p className="reward-desc">
              Kamu luar biasa! Kamu baru saja mendapatkan **+10 Bintang Emas** pertama untuk koleksimu.
            </p>

            <div className="stars-earned-banner">
              <Star className="fill-current text-yellow-500" size={28} />
              <span>+10 Bintang Emas Ditambahkan!</span>
            </div>

            <button 
              className="btn-kid btn-primary btn-xl w-full pulse-glow"
              onClick={onClose}
            >
              <CheckCircle size={24} />
              <span>Mulai Belajar &amp; Bermain!</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
