import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, ShieldCheck, Users, Radio, MessageCircle, 
  Heart, ThumbsUp, Smile, PhoneCall, PhoneOff, Send, Sparkles, UserPlus, 
  Lock, CheckCircle2, Play, Music, BookOpen, VolumeX 
} from 'lucide-react';
import { kidAudio } from '../utils/audio';

const AI_COMPANIONS = [
  { id: 'ami', name: 'Ami Si Kelinci 🐰', role: 'Teman Cerdas', status: 'Online', avatar: '🐰', speechPitch: 1.5 },
  { id: 'bruno', name: 'Bruno Si Singa 🦁', role: 'Teman Berani', status: 'Online', avatar: '🦁', speechPitch: 1.3 },
  { id: 'caca', name: 'Caca Si Rubah 🦊', role: 'Teman Cerita', status: 'Online', avatar: '🦊', speechPitch: 1.4 }
];

const PRESET_CHATS = [
  'Apa kabar hari ini? 😊',
  'Ceritakan dongeng lucu! 📖',
  'Bantu aku belajar mengeja! 🔤',
  'Nyanyikan lagu anak! 🎵',
  'Berapa hasil 5 ditambah 5? 🔢'
];

export default function VoiceRoomModule({ account, onAddStars }) {
  // Read Parent Control Settings from localStorage / Props
  const [parentSettings, setParentSettings] = useState({
    voiceAllowed: true,
    friendChatAllowed: true,
    aiFilterStrict: true
  });

  // Active Sub Tab
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'call' | 'group' | 'sandbox'

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Ami 🐰', text: 'Halo teman pintar! Aku Ami. Kamu mau belajar atau ngobrol apa hari ini? 😊', isAi: true }
  ]);
  const [inputText, setInputText] = useState('');

  // Call State (1-on-1)
  const [callState, setCallState] = useState('idle'); // 'idle' | 'calling' | 'connected'
  const [selectedCallTarget, setSelectedCallTarget] = useState(AI_COMPANIONS[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Friend Connection System (Connect with real users by User ID)
  const [friendUserIdInput, setFriendUserIdInput] = useState('');
  const [friendsList, setFriendsList] = useState([
    { id: 'ABC-92814', name: 'Adit (Teman TK B)', avatar: '👦', online: true },
    { id: 'ABC-55102', name: 'Siti (Teman SD 1)', avatar: '👧', online: true }
  ]);
  const [friendAddSuccess, setFriendAddSuccess] = useState('');

  // Group Call State
  const [isInGroupCall, setIsInGroupCall] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Load Parent Settings
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('abc_account_data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.parentSettings) {
          setParentSettings(parsed.parentSettings);
        }
      }
    } catch (e) {}
  }, []);

  // Call Timer Effect
  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Handle Adding Friend by User ID
  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!friendUserIdInput.trim()) return;
    kidAudio.playSuccess();
    
    const newFriend = {
      id: friendUserIdInput.trim().toUpperCase(),
      name: `Teman (${friendUserIdInput.trim().toUpperCase()})`,
      avatar: '🧒',
      online: true
    };

    setFriendsList(prev => [...prev, newFriend]);
    setFriendAddSuccess(`Berhasil terhubung dengan temanku (${newFriend.id})! 🤝`);
    setFriendUserIdInput('');
    kidAudio.speak(`Berhasil terhubung dengan ID ${newFriend.id}! Kamu bisa meneleponnya sekarang.`);
    setTimeout(() => setFriendAddSuccess(''), 3000);
  };

  // Handle Sending Chat
  const handleSendChat = (textToSend) => {
    const message = textToSend || inputText;
    if (!message.trim()) return;

    kidAudio.playPop();

    // Check Safety Filter
    const badWords = ['anjing', 'babi', 'bodoh', 'goblok'];
    const hasBadWord = badWords.some(w => message.toLowerCase().includes(w));

    if (hasBadWord && parentSettings.aiFilterStrict) {
      kidAudio.playWrong();
      kidAudio.speak('Ami menyukai kata-kata santun dan ramah! Yuk gunakan bahasa yang baik ya teman!');
      return;
    }

    const userMsg = { id: Date.now(), sender: account?.childName || 'Kamu', text: message, isAi: false };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');

    // AI Companion Auto-Response with Voice
    setTimeout(() => {
      let aiReplyText = 'Wah, menarik sekali! Mari kita pelajari bersama-sama!';
      if (message.includes('kabar')) aiReplyText = 'Aku sangat gembira dan siap bermain bersamamu! Kamu bagaimana? 😄';
      else if (message.includes('dongeng')) aiReplyText = 'Dahulu kala, ada kelinci cerdik yang suka membantu teman-temannya mengeja kata! 🐰✨';
      else if (message.includes('mengeja')) aiReplyText = 'Ayo kita eja kata: S-A-H-A-B-A-T... Sahabat! Bagus sekali!';
      else if (message.includes('lagu')) aiReplyText = '🎵 Balonku ada lima... rupa-rupa warnanya! Hijau, kuning, kelabu, merah muda dan biru! 🎈';

      const aiMsg = { id: Date.now() + 1, sender: 'Ami 🐰', text: aiReplyText, isAi: true };
      setChatMessages(prev => [...prev, aiMsg]);
      kidAudio.speak(aiReplyText, 0.95, 1.5);
    }, 600);
  };

  // Start 1-on-1 Call
  const handleStartCall = (target) => {
    if (!parentSettings.voiceAllowed) {
      kidAudio.playWrong();
      kidAudio.speak('Panggilan suara sedang dibatasi oleh orang tuamu di Web Dashboard.');
      return;
    }

    kidAudio.playPop();
    setSelectedCallTarget(target);
    setCallState('calling');
    kidAudio.speak(`Menghubungkan panggilan suara dengan ${target.name}...`);

    setTimeout(() => {
      setCallState('connected');
      kidAudio.playSuccess();
      kidAudio.speak(`Panggilan terhubung! Halo, ini ${target.name}! Senang sekali ngobrol bersamamu!`);
    }, 2000);
  };

  const handleEndCall = () => {
    kidAudio.playPop();
    setCallState('idle');
    kidAudio.speak('Panggilan suara diakhiri.');
  };

  const sendReaction = (emoji) => {
    kidAudio.playStar();
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji }]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => e.id !== id)), 2000);
  };

  return (
    <div className="voice-room-module animate-fade-in">
      
      {/* Banner */}
      <div className="voice-hero-header glass-panel">
        <div className="voice-title-box">
          <div className="voice-icon-badge animate-bounce-gentle">
            <span>🎙️</span>
          </div>
          <div>
            <h2>Ruang Sahabat AI &amp; Obrolan Teman</h2>
            <p>Fitur Komunikasi Aman Anak Pra-Sekolah &amp; SD dengan Perlindungan Orang Tua</p>
          </div>
        </div>

        <div className="safe-shield-chip">
          <ShieldCheck size={18} className="text-green-500" />
          <span>Aman &amp; Terfilter AI</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="voice-tabs-bar">
        <button 
          className={`voice-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => { kidAudio.playPop(); setActiveTab('chat'); }}
        >
          💬 Ruang Chat
        </button>

        <button 
          className={`voice-tab-btn ${activeTab === 'call' ? 'active' : ''}`}
          onClick={() => { kidAudio.playPop(); setActiveTab('call'); }}
        >
          🎙️ Voice Call 1-on-1
        </button>

        <button 
          className={`voice-tab-btn ${activeTab === 'group' ? 'active' : ''}`}
          onClick={() => { kidAudio.playPop(); setActiveTab('group'); }}
        >
          👥 Obrolan Kelompok
        </button>

        <button 
          className={`voice-tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => { kidAudio.playPop(); setActiveTab('sandbox'); }}
        >
          🌟 Ruang Bebas
        </button>
      </div>

      {/* TAB 1: RUANG CHAT (TEXT CHAT) */}
      {activeTab === 'chat' && (
        <div className="voice-content-card glass-panel animate-scale-up">
          {!parentSettings.friendChatAllowed && (
            <div className="parent-lock-banner">
              <Lock size={20} />
              <span>Fitur Obrolan Teks Dibatasi Orang Tua di Dashboard Orang Tua.</span>
            </div>
          )}

          <div className="chat-window">
            <div className="chat-messages-box">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.isAi ? 'ai-msg' : 'user-msg'}`}>
                  <div className="chat-bubble">
                    <span className="sender-name">{msg.sender}</span>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="preset-chips-row">
              {PRESET_CHATS.map((chip, i) => (
                <button
                  key={i}
                  className="preset-chip-btn"
                  onClick={() => handleSendChat(chip)}
                  disabled={!parentSettings.friendChatAllowed}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="chat-input-bar">
              <input
                type="text"
                className="chat-input-field"
                placeholder="Ketik pesan sopan untuk Ami..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                disabled={!parentSettings.friendChatAllowed}
              />
              <button 
                className="btn-kid btn-primary btn-send"
                onClick={() => handleSendChat()}
                disabled={!parentSettings.friendChatAllowed}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VOICE CALL 1-ON-1 (AI & REAL FRIENDS) */}
      {activeTab === 'call' && (
        <div className="voice-content-card glass-panel animate-scale-up">
          {!parentSettings.voiceAllowed && (
            <div className="parent-lock-banner">
              <Lock size={20} />
              <span>Panggilan Suara Dibatasi Orang Tua di Web Dashboard.</span>
            </div>
          )}

          {callState === 'idle' ? (
            <div className="call-setup-view">
              
              {/* Connect Real Friend by User ID Section */}
              <div className="friend-connector-card">
                <h3>🤝 Hubungkan Teman Asli (Input User ID)</h3>
                <p>Ingin menelepon teman sekelas? Minta User ID temanmu (contoh: <code>ABC-78492</code>) dan hubungkan di sini:</p>

                <form onSubmit={handleAddFriend} className="friend-form-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Masukkan User ID Teman (misal: ABC-78492)"
                    value={friendUserIdInput}
                    onChange={(e) => setFriendUserIdInput(e.target.value)}
                  />
                  <button type="submit" className="btn-kid btn-primary">
                    <UserPlus size={18} />
                    <span>Tambah</span>
                  </button>
                </form>

                {friendAddSuccess && <p className="success-text mt-2">{friendAddSuccess}</p>}
              </div>

              {/* List of Available Contacts (AI Companions & Friends) */}
              <div className="contacts-section">
                <h4>Pilih Kontak Sahabat Untuk Ditelepon:</h4>
                <div className="contacts-grid">
                  
                  {/* AI Companions */}
                  {AI_COMPANIONS.map((comp) => (
                    <div key={comp.id} className="contact-card">
                      <div className="contact-avatar">{comp.avatar}</div>
                      <div className="contact-info">
                        <h5>{comp.name}</h5>
                        <span>{comp.role}</span>
                      </div>
                      <button 
                        className="btn-kid btn-primary btn-sm ml-auto"
                        onClick={() => handleStartCall(comp)}
                        disabled={!parentSettings.voiceAllowed}
                      >
                        <PhoneCall size={18} />
                        <span>Telepon</span>
                      </button>
                    </div>
                  ))}

                  {/* Real Friends List */}
                  {friendsList.map((f) => (
                    <div key={f.id} className="contact-card friend-card">
                      <div className="contact-avatar">{f.avatar}</div>
                      <div className="contact-info">
                        <h5>{f.name}</h5>
                        <span className="user-id-tag">ID: {f.id}</span>
                      </div>
                      <button 
                        className="btn-kid btn-accent btn-sm ml-auto"
                        onClick={() => handleStartCall({ id: f.id, name: f.name, role: 'Teman Asli', avatar: f.avatar })}
                        disabled={!parentSettings.voiceAllowed}
                      >
                        <PhoneCall size={18} />
                        <span>Telepon</span>
                      </button>
                    </div>
                  ))}

                </div>
              </div>

            </div>
          ) : (
            /* Active Call Screen (Calling / Connected) */
            <div className="active-call-view animate-scale-up">
              <div className="call-target-avatar animate-bounce-gentle">
                <span>{selectedCallTarget.avatar}</span>
                {callState === 'connected' && <div className="sound-wave-ring animate-pulse" />}
              </div>

              <h3>{selectedCallTarget.name}</h3>
              <p className="call-status-text">
                {callState === 'calling' ? 'Menghubungkan...' : `Terhubung (${Math.floor(callDuration / 60)}:${('0' + (callDuration % 60)).slice(-2)})`}
              </p>

              {/* Sound Wave Visualizer */}
              {callState === 'connected' && (
                <div className="sound-wave-visualizer">
                  <div className="bar bar1 animate-pulse" />
                  <div className="bar bar2 animate-pulse" />
                  <div className="bar bar3 animate-pulse" />
                  <div className="bar bar4 animate-pulse" />
                  <div className="bar bar5 animate-pulse" />
                </div>
              )}

              {/* Controls */}
              <div className="call-actions-bar">
                <button 
                  className={`btn-call-control ${isMuted ? 'muted' : ''}`}
                  onClick={() => {
                    setIsMuted(!isMuted);
                    kidAudio.playPop();
                  }}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button 
                  className="btn-call-end"
                  onClick={handleEndCall}
                >
                  <PhoneOff size={28} />
                </button>

                <button 
                  className={`btn-call-control ${!isSpeakerOn ? 'muted' : ''}`}
                  onClick={() => {
                    setIsSpeakerOn(!isSpeakerOn);
                    kidAudio.playPop();
                  }}
                >
                  {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OBROLAN KELOMPOK (GROUP CALL) */}
      {activeTab === 'group' && (
        <div className="voice-content-card glass-panel animate-scale-up">
          <div className="group-header">
            <h3>👥 Ruang Obrolan Kelompok Suara Aman</h3>
            <p>Obrolan ramah bersama sahabat AI dan teman terhubung yang diawasi moderator.</p>
          </div>

          <div className="group-participants-grid">
            <div className="group-p-card speaking-active">
              <span className="p-avatar">🐰</span>
              <span className="p-name">Ami (AI)</span>
              <span className="p-badge">Berbicara...</span>
            </div>

            <div className="group-p-card">
              <span className="p-avatar">🦁</span>
              <span className="p-name">Bruno (AI)</span>
            </div>

            <div className="group-p-card">
              <span className="p-avatar">👩‍🏫</span>
              <span className="p-name">Bunda Rina</span>
              <span className="p-badge mod">Moderator</span>
            </div>

            <div className="group-p-card">
              <span className="p-avatar">{account?.avatar?.emoji || '🐱'}</span>
              <span className="p-name">{account?.childName || 'Kamu'}</span>
            </div>
          </div>

          {/* Floating Emoji Reactions */}
          <div className="group-reactions-bar">
            <button onClick={() => sendReaction('👏')}>👏</button>
            <button onClick={() => sendReaction('⭐')}>⭐</button>
            <button onClick={() => sendReaction('❤️')}>❤️</button>
            <button onClick={() => sendReaction('🎈')}>🎈</button>
          </div>

          <div className="floating-reactions-area">
            {floatingEmojis.map(item => (
              <span key={item.id} className="floating-emoji animate-float-up">
                {item.emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RUANG BEBAS (SANDBOX INTERAKTIF) */}
      {activeTab === 'sandbox' && (
        <div className="voice-content-card glass-panel animate-scale-up">
          <h3>🌟 Ruang Bebas &amp; Eksplorasi Ceria</h3>
          <p>Dengarkan lagu anak, fakta hewan unik, atau bagikan ceritamu hari ini untuk mendapat bintang bonus!</p>

          <div className="sandbox-grid">
            <div 
              className="sandbox-card bg-orange-glow"
              onClick={() => {
                kidAudio.playSuccess();
                kidAudio.speakFunFact('Tahukah kamu? Gajah adalah satu-satunya mamalia yang tidak bisa melompat, tapi ingatan gajah sangat kuat!');
                if (typeof onAddStars === 'function') onAddStars(2);
              }}
            >
              <BookOpen size={32} className="text-orange-500" />
              <h4>Dengar Fakta Unik Hewan</h4>
              <p>Dapatkan +2 Bintang 🌟</p>
            </div>

            <div 
              className="sandbox-card bg-purple-glow"
              onClick={() => {
                kidAudio.playSuccess();
                kidAudio.speak('🎵 Pelangi-pelangi alangkah indahmu... Merah, kuning, hijau, di langit yang biru! 🌈');
                if (typeof onAddStars === 'function') onAddStars(2);
              }}
            >
              <Music size={32} className="text-purple-500" />
              <h4>Putar Lagu Anak</h4>
              <p>Dapatkan +2 Bintang 🌟</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
