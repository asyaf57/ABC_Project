// Web Audio API Synthesizer & Web Speech API Wrapper for Indonesian Preschool EduApp

class KidAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    
    if (this.synth) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  getIndonesianFemaleVoice() {
    let idVoice = this.voices.find(v => (v.lang.includes('id') || v.lang.includes('ID')) && 
      (v.name.includes('Female') || v.name.includes('Gadis') || v.name.includes('Google') || v.name.includes('Wanita')));
    
    if (!idVoice) {
      // Fallback: pick the last Indonesian voice if there are multiple, to try getting a different one
      const idVoices = this.voices.filter(v => v.lang.includes('id') || v.lang.includes('ID'));
      idVoice = idVoices.length > 1 ? idVoices[idVoices.length - 1] : idVoices[0];
    }
    return idVoice;
  }

  // Base Speech Suara Wanita
  speak(text, rate = 0.9, pitch = 1.1) {
    if (!this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = rate;
    utterance.pitch = pitch;

    const idVoice = this.getIndonesianFemaleVoice();
    if (idVoice) {
      utterance.voice = idVoice;
    }

    this.synth.speak(utterance);
  }

  // Speech Pengucapan Abjad dengan Jeda
  speakWithPause(letter, word) {
    if (!this.synth) return;

    this.synth.cancel();

    const u1 = new SpeechSynthesisUtterance(letter);
    u1.lang = 'id-ID';
    u1.rate = 0.85; 
    u1.pitch = 1.15;

    const u2 = new SpeechSynthesisUtterance(`${letter} untuuuk ${word}!`);
    u2.lang = 'id-ID';
    u2.rate = 0.9;
    u2.pitch = 1.1;

    const idVoice = this.getIndonesianFemaleVoice();
    if (idVoice) {
      u1.voice = idVoice;
      u2.voice = idVoice;
    }

    this.synth.speak(u1);
    setTimeout(() => {
      if (this.synth) {
        this.synth.speak(u2);
      }
    }, 450);
  }

  // Speech Fakta Menarik
  speakFunFact(text) {
    if (!this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const idVoice = this.getIndonesianFemaleVoice();
    if (idVoice) {
      utterance.voice = idVoice;
    }

    this.synth.speak(utterance);
  }

  // Speech Apresiasi Benar: Cepat & Energik
  speakAppreciation(text) {
    if (!this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;
    utterance.pitch = 1.15;

    const idVoice = this.getIndonesianFemaleVoice();
    if (idVoice) {
      utterance.voice = idVoice;
    }

    this.synth.speak(utterance);
  }

  // Speech Motivasi Kurang Tepat
  speakMotivation(text) {
    if (!this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0; 
    utterance.pitch = 1.05;

    const idVoice = this.getIndonesianFemaleVoice();
    if (idVoice) {
      utterance.voice = idVoice;
    }

    this.synth.speak(utterance);
  }

  // Synthesize fun sound effects
  playPop() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio pop error:", e);
    }
  }

  playSuccess() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.1);
        osc.stop(ctx.currentTime + index * 0.1 + 0.25);
      });
    } catch (e) {
      console.warn("Audio success error:", e);
    }
  }

  playStar() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio star error:", e);
    }
  }

  playWrong() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio wrong error:", e);
    }
  }
}

export const kidAudio = new KidAudioEngine();
