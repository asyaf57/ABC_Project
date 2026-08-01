import React, { useState, useEffect } from 'react';
import { 
  Binary, Star, Sparkles, CheckCircle, RefreshCw, Volume2, ArrowRight, 
  Award, HelpCircle, Flame, Layers, Divide, Grid, Trophy 
} from 'lucide-react';
import { kidAudio } from '../utils/audio';

// Emojis for visual object counting
const VISUAL_ITEMS = ['🍎', '⭐', '🎈', '🚗', '🍓', '🐱', '🍪', '🚀'];

const MODE_DEFS = [
  { id: 1, name: 'Mode 1: Pemula (1-20)', badge: 'Pemula', color: 'badge-green', icon: VisualMathIcon },
  { id: 2, name: 'Mode 2: Menengah (1-50)', badge: 'Menengah', color: 'badge-blue', icon: Binary },
  { id: 3, name: 'Mode 3: Mahir (1-100)', badge: 'Mahir', color: 'badge-purple', icon: Trophy },
  { id: 4, name: 'Mode 4: Perkalian Ceria', badge: 'Perkalian', color: 'badge-orange', icon: Grid },
  { id: 5, name: 'Mode 5: Pembagian Ceria', badge: 'Pembagian', color: 'badge-red', icon: Divide }
];

function VisualMathIcon() {
  return <span style={{ fontSize: '1.2rem' }}>🍎</span>;
}

export default function MathModule({ onAddStars }) {
  const [activeModeId, setActiveModeId] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // MODE 1 State (Counting 1-20 / Visual Addition & Subtraction)
  const [mode1SubTab, setMode1SubTab] = useState('count'); // 'count' | 'add' | 'sub'
  const [selectedNum, setSelectedNum] = useState(5);
  const [mode1Question, setMode1Question] = useState(null);

  // MODE 2, 3, 4, 5 Quiz Question State
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // MODE 4 Multiplication Table Selected Cell
  const [selectedMult, setSelectedMult] = useState({ a: 3, b: 4 });

  // Generate Mode 1 Visual Question
  const generateMode1Question = (type) => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setFeedback(null);

    if (type === 'add') {
      const num1 = Math.floor(1 + Math.random() * 8);
      const num2 = Math.floor(1 + Math.random() * 8);
      const correct = num1 + num2;
      const options = generateOptions(correct, 20);
      const item = VISUAL_ITEMS[Math.floor(Math.random() * VISUAL_ITEMS.length)];
      setMode1Question({ type: 'add', num1, num2, correct, options, item });
    } else if (type === 'sub') {
      const num1 = Math.floor(4 + Math.random() * 10);
      const num2 = Math.floor(1 + Math.random() * (num1 - 1));
      const correct = num1 - num2;
      const options = generateOptions(correct, 20);
      const item = VISUAL_ITEMS[Math.floor(Math.random() * VISUAL_ITEMS.length)];
      setMode1Question({ type: 'sub', num1, num2, correct, options, item });
    }
  };

  // Generate Quiz Question for Modes 2, 3, 4, 5
  const generateQuizForMode = (modeId) => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setFeedback(null);

    let num1, num2, operator, correct, maxVal = 50;

    if (modeId === 2) { // 1-50 Addition & Subtraction
      maxVal = 50;
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        num1 = Math.floor(5 + Math.random() * 25);
        num2 = Math.floor(5 + Math.random() * 20);
        operator = '+';
        correct = num1 + num2;
      } else {
        num1 = Math.floor(15 + Math.random() * 30);
        num2 = Math.floor(3 + Math.random() * (num1 - 5));
        operator = '-';
        correct = num1 - num2;
      }
    } else if (modeId === 3) { // 1-100 Advanced Math
      maxVal = 100;
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        num1 = Math.floor(15 + Math.random() * 45);
        num2 = Math.floor(15 + Math.random() * 40);
        operator = '+';
        correct = num1 + num2;
      } else {
        num1 = Math.floor(35 + Math.random() * 60);
        num2 = Math.floor(10 + Math.random() * (num1 - 10));
        operator = '-';
        correct = num1 - num2;
      }
    } else if (modeId === 4) { // Perkalian (Multiplication)
      maxVal = 100;
      num1 = Math.floor(2 + Math.random() * 8);
      num2 = Math.floor(2 + Math.random() * 8);
      operator = '×';
      correct = num1 * num2;
    } else if (modeId === 5) { // Pembagian (Division)
      maxVal = 50;
      num2 = Math.floor(2 + Math.random() * 7);
      correct = Math.floor(1 + Math.random() * 8);
      num1 = num2 * correct; // Ensures whole number division!
      operator = '÷';
    }

    const options = generateOptions(correct, maxVal);
    const item = VISUAL_ITEMS[Math.floor(Math.random() * VISUAL_ITEMS.length)];

    setQuizQuestion({ num1, num2, operator, correct, options, item, modeId });
  };

  // Helper to generate 4 distinct multiple choice options
  const generateOptions = (correct, max = 50) => {
    const opts = new Set([correct]);
    while (opts.size < 4) {
      let offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      let candidate = Math.max(1, correct + offset);
      if (candidate !== correct) opts.add(candidate);
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    kidAudio.speak(`Selamat datang di Modul Berhitung Ceria! Pilih tingkat kesulitan yang kamu inginkan!`);
    generateMode1Question('add');
    generateQuizForMode(2);
  }, []);

  const handleModeChange = (modeId) => {
    kidAudio.playPop();
    setActiveModeId(modeId);
    if (modeId === 1) {
      generateMode1Question(mode1SubTab === 'sub' ? 'sub' : 'add');
    } else {
      generateQuizForMode(modeId);
    }
  };

  const handleNumberClick = (num) => {
    kidAudio.playPop();
    setSelectedNum(num);
    const item = VISUAL_ITEMS[num % VISUAL_ITEMS.length];
    kidAudio.speak(`${num}! ${num} buah ${getItemName(item)}!`, 1.0, 1.3);
  };

  const getItemName = (emoji) => {
    switch (emoji) {
      case '🍎': return 'apel';
      case '⭐': return 'bintang';
      case '🎈': return 'balon';
      case '🚗': return 'mobil';
      case '🍓': return 'stroberi';
      case '🐱': return 'kucing';
      case '🍪': return 'biskuit';
      case '🚀': return 'roket';
      default: return 'benda';
    }
  };

  const handleAnswerClick = (chosenOpt, qObj) => {
    if (isAnswered) return;
    setSelectedAnswer(chosenOpt);
    setIsAnswered(true);

    const isCorrect = chosenOpt === qObj.correct;

    if (isCorrect) {
      kidAudio.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(prev => prev + 10);

      // Stars reward calculation based on mode
      const bonusStars = activeModeId >= 4 ? 5 : activeModeId >= 2 ? 3 : 2;
      if (typeof onAddStars === 'function') {
        onAddStars(bonusStars);
      }

      setFeedback({
        correct: true,
        text: `Hore! Jawabanmu BENAR! +${bonusStars} Bintang Emas! 🎉`
      });

      kidAudio.speakAppreciation(`Hore! ${qObj.num1} ${qObj.operator || '+'} ${qObj.num2} adalah ${qObj.correct}. Jawaban kamu tepat sekali!`);
    } else {
      kidAudio.playWrong();
      setStreak(0);
      setFeedback({
        correct: false,
        text: `Jawaban kurang tepat. Hasil yang benar adalah ${qObj.correct}. Semangat mencoba lagi!`
      });

      kidAudio.speakMotivation(`Jawaban yang benar adalah ${qObj.correct}. Jangan menyerah ya, ayo coba lagi!`);
    }
  };

  return (
    <div className="math-module-container animate-fade-in">
      
      {/* Module Banner */}
      <div className="math-hero-header glass-panel">
        <div className="math-title-box">
          <div className="math-icon-badge animate-bounce-gentle">
            <span>🔢</span>
          </div>
          <div>
            <h2>Modul Berhitung Ceria</h2>
            <p>Belajar Angka, Penjumlahan, Pengurangan, Perkalian &amp; Pembagian Interaktif</p>
          </div>
        </div>

        <div className="math-stats">
          <div className="math-stat-chip">
            <Flame className="text-orange-500 fill-current animate-pulse" size={20} />
            <span>Streak: <strong>{streak}</strong></span>
          </div>
          <div className="math-stat-chip">
            <Trophy className="text-yellow-500 fill-current" size={20} />
            <span>Skor: <strong>{score}</strong></span>
          </div>
        </div>
      </div>

      {/* 5 Difficulty Mode Selector Bar */}
      <div className="math-mode-bar">
        {MODE_DEFS.map((m) => {
          const isActive = activeModeId === m.id;
          return (
            <button
              key={m.id}
              className={`math-mode-btn ${isActive ? 'active' : ''} ${m.color}`}
              onClick={() => handleModeChange(m.id)}
            >
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: Pemula (1-20 & Bergambar) */}
      {activeModeId === 1 && (
        <div className="math-content-card glass-panel animate-scale-up">
          
          {/* Sub Navigation */}
          <div className="math-sub-tabs">
            <button 
              className={`sub-tab-btn ${mode1SubTab === 'count' ? 'active' : ''}`}
              onClick={() => { kidAudio.playPop(); setMode1SubTab('count'); }}
            >
              🍎 Mengenal Angka (1-20)
            </button>
            <button 
              className={`sub-tab-btn ${mode1SubTab === 'add' ? 'active' : ''}`}
              onClick={() => { kidAudio.playPop(); setMode1SubTab('add'); generateMode1Question('add'); }}
            >
              ➕ Penjumlahan Bergambar
            </button>
            <button 
              className={`sub-tab-btn ${mode1SubTab === 'sub' ? 'active' : ''}`}
              onClick={() => { kidAudio.playPop(); setMode1SubTab('sub'); generateMode1Question('sub'); }}
            >
              ➖ Pengurangan Bergambar
            </button>
          </div>

          {/* SubTab 1: Counting Numbers 1-20 */}
          {mode1SubTab === 'count' && (
            <div className="counting-mode-view animate-fade-in">
              <div className="number-display-box">
                <div className="big-number animate-pop">{selectedNum}</div>
                <div className="visual-items-grid">
                  {Array.from({ length: selectedNum }).map((_, i) => (
                    <span key={i} className="visual-item-emoji animate-bounce-gentle">
                      {VISUAL_ITEMS[selectedNum % VISUAL_ITEMS.length]}
                    </span>
                  ))}
                </div>
                <div className="number-audio-caption">
                  {selectedNum} Buah {getItemName(VISUAL_ITEMS[selectedNum % VISUAL_ITEMS.length])}
                </div>
              </div>

              <div className="number-picker-grid">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`num-picker-btn ${selectedNum === n ? 'active' : ''}`}
                    onClick={() => handleNumberClick(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SubTab 2 & 3: Visual Addition & Subtraction Questions */}
          {(mode1SubTab === 'add' || mode1SubTab === 'sub') && mode1Question && (
            <div className="visual-question-view animate-fade-in">
              <h3 className="q-title">
                {mode1SubTab === 'add' ? '➕ Berapa Jumlah Seluruh Benda Ini?' : '➖ Berapa Sisa Benda Ini?'}
              </h3>

              <div className="equation-visual-board">
                {/* First Group */}
                <div className="item-group-box">
                  <div className="group-items">
                    {Array.from({ length: mode1Question.num1 }).map((_, i) => (
                      <span key={i} className="visual-item-emoji">{mode1Question.item}</span>
                    ))}
                  </div>
                  <span className="group-count">{mode1Question.num1}</span>
                </div>

                <div className="operator-sign">
                  {mode1Question.type === 'add' ? '+' : '-'}
                </div>

                {/* Second Group */}
                <div className="item-group-box">
                  <div className="group-items">
                    {Array.from({ length: mode1Question.num2 }).map((_, i) => (
                      <span key={i} className={`visual-item-emoji ${mode1Question.type === 'sub' ? 'faded-sub' : ''}`}>
                        {mode1Question.item}
                      </span>
                    ))}
                  </div>
                  <span className="group-count">{mode1Question.num2}</span>
                </div>

                <div className="operator-sign">=</div>

                <div className="question-mark-box">?</div>
              </div>

              {/* Multiple Choice Options */}
              <div className="options-grid">
                {mode1Question.options.map((opt) => {
                  let btnState = '';
                  if (isAnswered) {
                    if (opt === mode1Question.correct) btnState = 'correct-option';
                    else if (opt === selectedAnswer) btnState = 'wrong-option';
                  }

                  return (
                    <button
                      key={opt}
                      className={`opt-btn ${btnState}`}
                      onClick={() => handleAnswerClick(opt, mode1Question)}
                      disabled={isAnswered}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Banner & Next Button */}
              {feedback && (
                <div className={`feedback-banner ${feedback.correct ? 'banner-correct' : 'banner-wrong'} animate-scale-up`}>
                  <span>{feedback.text}</span>
                  <button 
                    className="btn-kid btn-primary btn-sm ml-auto"
                    onClick={() => generateMode1Question(mode1SubTab)}
                  >
                    <span>Soal Berikutnya</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* MODE 2 & 3: Menengah (1-50) & Mahir (1-100) */}
      {(activeModeId === 2 || activeModeId === 3) && quizQuestion && (
        <div className="math-content-card glass-panel animate-scale-up">
          <div className="quiz-header-row">
            <span className="quiz-level-chip">
              {activeModeId === 2 ? '🔵 Mode 2: Angka 1-50' : '🟣 Mode 3: Angka 1-100'}
            </span>
            <span className="bonus-chip">+ {activeModeId === 3 ? '4' : '3'} Bintang 🌟</span>
          </div>

          <div className="quiz-question-box">
            <div className="math-equation-text animate-pop">
              <span>{quizQuestion.num1}</span>
              <span className="op">{quizQuestion.operator}</span>
              <span>{quizQuestion.num2}</span>
              <span className="op">=</span>
              <span className="q-mark">?</span>
            </div>
          </div>

          {/* Options Grid */}
          <div className="options-grid">
            {quizQuestion.options.map((opt) => {
              let btnState = '';
              if (isAnswered) {
                if (opt === quizQuestion.correct) btnState = 'correct-option';
                else if (opt === selectedAnswer) btnState = 'wrong-option';
              }

              return (
                <button
                  key={opt}
                  className={`opt-btn ${btnState}`}
                  onClick={() => handleAnswerClick(opt, quizQuestion)}
                  disabled={isAnswered}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {feedback && (
            <div className={`feedback-banner ${feedback.correct ? 'banner-correct' : 'banner-wrong'} animate-scale-up`}>
              <span>{feedback.text}</span>
              <button 
                className="btn-kid btn-primary btn-sm ml-auto"
                onClick={() => generateQuizForMode(activeModeId)}
              >
                <span>Soal Berikutnya</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: Perkalian Ceria (1x1 - 10x10 Table & Quiz) */}
      {activeModeId === 4 && (
        <div className="math-content-card glass-panel animate-scale-up">
          <div className="quiz-header-row">
            <h3>📙 Mode 4: Perkalian Ceria &amp; Tabel Perkalian</h3>
            <span className="bonus-chip">+5 Bintang 🌟</span>
          </div>

          {/* Multiplication Table Explorer */}
          <div className="mult-table-section">
            <h4>Tabel Perkalian Interaktif (Tekan Angka untuk Suara):</h4>
            <div className="mult-grid">
              {Array.from({ length: 10 }, (_, r) => r + 1).map((row) => (
                <div key={row} className="mult-row">
                  {Array.from({ length: 10 }, (_, c) => c + 1).map((col) => {
                    const res = row * col;
                    const isSelected = selectedMult.a === row && selectedMult.b === col;
                    return (
                      <button
                        key={`${row}-${col}`}
                        className={`mult-cell ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          kidAudio.playPop();
                          setSelectedMult({ a: row, b: col });
                          kidAudio.speak(`${row} dikali ${col} sama dengan ${res}!`);
                        }}
                      >
                        <span className="cell-expr">{row}×{col}</span>
                        <span className="cell-val">{res}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mult-explanation-box">
              <span>📌 Visualisasi: <strong>{selectedMult.a} kelompok</strong> × <strong>{selectedMult.b} Bintang</strong> = <strong>{selectedMult.a * selectedMult.b} Bintang</strong></span>
            </div>
          </div>

          {/* Quiz Question for Multiplication */}
          {quizQuestion && (
            <div className="mult-quiz-box">
              <h4>Kuis Perkalian:</h4>
              <div className="math-equation-text">
                <span>{quizQuestion.num1}</span>
                <span className="op">×</span>
                <span>{quizQuestion.num2}</span>
                <span className="op">=</span>
                <span className="q-mark">?</span>
              </div>

              <div className="options-grid">
                {quizQuestion.options.map((opt) => {
                  let btnState = '';
                  if (isAnswered) {
                    if (opt === quizQuestion.correct) btnState = 'correct-option';
                    else if (opt === selectedAnswer) btnState = 'wrong-option';
                  }

                  return (
                    <button
                      key={opt}
                      className={`opt-btn ${btnState}`}
                      onClick={() => handleAnswerClick(opt, quizQuestion)}
                      disabled={isAnswered}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`feedback-banner ${feedback.correct ? 'banner-correct' : 'banner-wrong'} animate-scale-up`}>
                  <span>{feedback.text}</span>
                  <button 
                    className="btn-kid btn-primary btn-sm ml-auto"
                    onClick={() => generateQuizForMode(4)}
                  >
                    <span>Soal Perkalian Berikutnya</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 5: Pembagian Ceria */}
      {activeModeId === 5 && quizQuestion && (
        <div className="math-content-card glass-panel animate-scale-up">
          <div className="quiz-header-row">
            <h3>🔴 Mode 5: Pembagian Ceria (Dividing Items)</h3>
            <span className="bonus-chip">+5 Bintang 🌟</span>
          </div>

          <div className="division-visual-card">
            <p className="division-story">
              Ada <strong>{quizQuestion.num1} {getItemName(quizQuestion.item)}</strong> dibagi rata ke dalam <strong>{quizQuestion.num2} kelompok</strong>. Berapa isi tiap kelompok?
            </p>

            <div className="math-equation-text">
              <span>{quizQuestion.num1}</span>
              <span className="op">÷</span>
              <span>{quizQuestion.num2}</span>
              <span className="op">=</span>
              <span className="q-mark">?</span>
            </div>
          </div>

          {/* Options Grid */}
          <div className="options-grid">
            {quizQuestion.options.map((opt) => {
              let btnState = '';
              if (isAnswered) {
                if (opt === quizQuestion.correct) btnState = 'correct-option';
                else if (opt === selectedAnswer) btnState = 'wrong-option';
              }

              return (
                <button
                  key={opt}
                  className={`opt-btn ${btnState}`}
                  onClick={() => handleAnswerClick(opt, quizQuestion)}
                  disabled={isAnswered}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {feedback && (
            <div className={`feedback-banner ${feedback.correct ? 'banner-correct' : 'banner-wrong'} animate-scale-up`}>
              <span>{feedback.text}</span>
              <button 
                className="btn-kid btn-primary btn-sm ml-auto"
                onClick={() => generateQuizForMode(5)}
              >
                <span>Soal Pembagian Berikutnya</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
