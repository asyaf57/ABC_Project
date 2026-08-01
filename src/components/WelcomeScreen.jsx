import React, { useState } from 'react';
import { Sparkles, Mail, User, ShieldCheck, ArrowRight, BookOpen, Key, CheckCircle2, Copy, Camera, Upload } from 'lucide-react';
import { kidAudio } from '../utils/audio';

const AVATARS = [
  { id: 'lion', emoji: '🦁', name: 'Singa Berani' },
  { id: 'rabbit', emoji: '🐰', name: 'Kelinci Pintar' },
  { id: 'fox', emoji: '🦊', name: 'Rubah Cerdas' },
  { id: 'panda', emoji: '🐼', name: 'Panda Ceria' },
  { id: 'rocket', emoji: '🚀', name: 'Kapten Roket' }
];

const ADMIN_EMAIL = 'admin@aplikasi-abc.com';

export default function WelcomeScreen({ onCompleteRegistration, onStartTutorialDirectly }) {
  const [parentEmail, setParentEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'credentials'
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleUseAdminEmail = () => {
    kidAudio.playPop();
    setParentEmail(ADMIN_EMAIL);
    if (!childName) setChildName('Budi Kecil');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      kidAudio.playPop();
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setCustomPhotoUrl(result);
        const customAvatarObj = {
          id: 'custom_photo',
          emoji: '📸',
          photoUrl: result,
          name: 'Foto Saya'
        };
        setSelectedAvatar(customAvatarObj);
        kidAudio.speak('Foto profil berhasil diunggah!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!parentEmail || !childName) {
      kidAudio.speak('Mohon isi email orang tua dan nama anak terlebih dahulu ya!');
      return;
    }

    kidAudio.playSuccess();
    
    // Generate unique User ID and Parent Password
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const randomPass = Math.floor(1000 + Math.random() * 9000);
    const userId = `ABC-${randomNum}`;
    const parentPassword = `PARENT-${randomPass}`;

    const creds = {
      parentEmail,
      childName,
      avatar: selectedAvatar,
      userId,
      parentPassword,
      registeredAt: new Date().toISOString()
    };

    setGeneratedCredentials(creds);
    setStep('credentials');

    kidAudio.speak(`Hore! Akun ${childName} berhasil dibuat. ID Pengguna kamu adalah ${userId}. Password untuk orang tua telah disimulasikan terkirim ke ${parentEmail}!`);
  };

  const handleCopyCredentials = () => {
    if (!generatedCredentials) return;
    const text = `User ID: ${generatedCredentials.userId}\nPassword Orang Tua: ${generatedCredentials.parentPassword}\nEmail: ${generatedCredentials.parentEmail}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    kidAudio.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartPlaying = (startWithTutorial = false) => {
    kidAudio.playPop();
    if (generatedCredentials) {
      onCompleteRegistration(generatedCredentials, startWithTutorial);
    }
  };

  return (
    <div className="welcome-screen-container animate-fade-in">
      <div className="welcome-card glass-panel">
        
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="mascot-badge animate-bounce-gentle">
            {selectedAvatar.photoUrl ? (
              <img src={selectedAvatar.photoUrl} alt="Foto Profil" className="mascot-custom-img" />
            ) : (
              <span className="mascot-emoji">{selectedAvatar.emoji}</span>
            )}
          </div>
          <h1 className="welcome-title">
            Selamat Datang di <span className="highlight-text">ABC (Ayo Belajar Cerdas)</span>
          </h1>
          <p className="welcome-subtitle">
            Platform Pembelajaran Interaktif &amp; Aman untuk Anak Cerdas! 🌟
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleRegister} className="welcome-form">
            
            {/* Child Name & Avatar */}
            <div className="form-section">
              <label className="form-label">
                <User size={18} />
                <span>Nama Anak / Panggilan:</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Budi, Annisa, Adit..."
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                maxLength={20}
                required
              />

              <div className="avatar-selection-label">Pilih Avatar Karakter atau Unggah Foto Anak:</div>
              
              <div className="avatar-grid">
                {/* Preset Avatars */}
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    className={`avatar-btn ${selectedAvatar.id === avatar.id ? 'active' : ''}`}
                    onClick={() => {
                      kidAudio.playPop();
                      setSelectedAvatar(avatar);
                    }}
                  >
                    <span className="avatar-emoji">{avatar.emoji}</span>
                    <span className="avatar-name">{avatar.name}</span>
                  </button>
                ))}

                {/* Upload Photo Option */}
                <label className={`avatar-btn upload-photo-btn ${selectedAvatar.id === 'custom_photo' ? 'active' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden-file-input"
                  />
                  {customPhotoUrl ? (
                    <img src={customPhotoUrl} alt="Foto Anak" className="uploaded-avatar-thumb" />
                  ) : (
                    <Camera size={28} className="text-orange-500" />
                  )}
                  <span className="avatar-name">{customPhotoUrl ? 'Foto Terpasang' : '📷 Unggah Foto'}</span>
                </label>
              </div>
            </div>

            {/* Parent Email & Credentials */}
            <div className="form-section accent-box">
              <div className="form-label-header">
                <label className="form-label">
                  <Mail size={18} />
                  <span>Email Orang Tua (Untuk Monitoring &amp; Akun):</span>
                </label>
                <button
                  type="button"
                  className="btn-quick-admin"
                  onClick={handleUseAdminEmail}
                  title="Gunakan Email Uji Coba Admin"
                >
                  ⚡ Gunakan Email Admin Uji Coba
                </button>
              </div>

              <input
                type="email"
                className="form-input"
                placeholder="contoh: orangtua@gmail.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
              />

              <p className="form-helper">
                ℹ️ Sistem akan meng-generate <strong>User ID</strong> &amp; <strong>Password Orang Tua</strong> secara otomatis dan menyimulasikan konfirmasi ke email ini.
              </p>
            </div>

            {/* Submit Action */}
            <button type="submit" className="btn-kid btn-primary btn-xl w-full pulse-glow">
              <span>Buat Akun &amp; Mulai Petualangan!</span>
              <ArrowRight size={22} />
            </button>
          </form>
        ) : (
          /* Credentials Confirmation Step */
          <div className="credentials-step animate-scale-up">
            <div className="success-banner">
              <CheckCircle2 size={32} className="text-green-500" />
              <div>
                <h3>Akun Pembelajaran Berhasil Dibuat! 🎉</h3>
                <p>Simulasi konfirmasi email telah dikirimkan ke <strong>{generatedCredentials.parentEmail}</strong></p>
              </div>
            </div>

            <div className="credentials-card">
              <div className="cred-item">
                <span className="cred-label">Identitas Anak:</span>
                <span className="cred-value">
                  {generatedCredentials.avatar.photoUrl ? (
                    <img src={generatedCredentials.avatar.photoUrl} alt="Foto" className="cred-thumb-img" />
                  ) : (
                    <span>{generatedCredentials.avatar.emoji}</span>
                  )}
                  {' '}{generatedCredentials.childName}
                </span>
              </div>
              <div className="cred-item">
                <span className="cred-label">User ID (ID Pengguna):</span>
                <span className="cred-value highlight">{generatedCredentials.userId}</span>
              </div>
              <div className="cred-item">
                <span className="cred-label">Password Orang Tua:</span>
                <span className="cred-value highlight-secondary">{generatedCredentials.parentPassword}</span>
              </div>

              <button type="button" className="btn-copy" onClick={handleCopyCredentials}>
                <Copy size={16} />
                <span>{copied ? 'Tersalin!' : 'Salin Detail Akun'}</span>
              </button>
            </div>

            <div className="welcome-actions">
              <button 
                type="button"
                className="btn-kid btn-accent btn-lg" 
                onClick={() => handleStartPlaying(true)}
              >
                <Sparkles size={20} />
                <span>Ikuti Tutorial Interaktif (+10 Bintang 🌟)</span>
              </button>

              <button 
                type="button"
                className="btn-kid btn-primary btn-lg"
                onClick={() => handleStartPlaying(false)}
              >
                <BookOpen size={20} />
                <span>Langsung Ke Beranda</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
