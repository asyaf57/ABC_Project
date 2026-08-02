import React, { useState } from 'react';
import { Sparkles, Mail, User, ShieldCheck, ArrowRight, BookOpen, Key, CheckCircle2, Copy, Camera, Upload, Lock } from 'lucide-react';
import { kidAudio } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

const AVATARS = [
  { id: 'indo_boy', emoji: '🧑🏽', photoUrl: '/assets/avatars/avatar_indo_boy.jpg', name: 'Bagus (Indonesia)' },
  { id: 'indo_girl', emoji: '👧🏽', photoUrl: '/assets/avatars/avatar_indo_girl.jpg', name: 'Putri (Indonesia)' },
  { id: 'china_boy', emoji: '🧑🏻', photoUrl: '/assets/avatars/avatar_china_boy.jpg', name: 'Wei (Tiongkok)' },
  { id: 'china_girl', emoji: '👧🏻', photoUrl: '/assets/avatars/avatar_china_girl.jpg', name: 'Mei (Tiongkok)' },
  { id: 'india_boy', emoji: '🧑🏾', photoUrl: '/assets/avatars/avatar_india_boy.jpg', name: 'Raj (India)' },
  { id: 'india_girl', emoji: '👧🏾', photoUrl: '/assets/avatars/avatar_india_girl.jpg', name: 'Priya (India)' },
  { id: 'euro_boy', emoji: '👱🏼‍♂️', photoUrl: '/assets/avatars/avatar_euro_boy.jpg', name: 'Leo (Eropa)' },
  { id: 'euro_girl', emoji: '👱🏼‍♀️', photoUrl: '/assets/avatars/avatar_euro_girl.jpg', name: 'Emma (Eropa)' },
  { id: 'robot', emoji: '🤖', photoUrl: '/assets/avatars/avatar_robot.jpg', name: 'Robo Pintar' },
  { id: 'superhero', emoji: '🦸🏻', photoUrl: '/assets/avatars/avatar_superhero.jpg', name: 'Pahlawan Super' },
  { id: 'lion', emoji: '🦁', name: 'Singa Berani' }
];

export default function WelcomeScreen({ onCompleteRegistration, onStartTutorialDirectly }) {
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'credentials' | 'loading'
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!parentEmail || !parentPassword || !childName) {
      kidAudio.speak('Mohon lengkapi semua isian terlebih dahulu ya!');
      return;
    }
    if (parentPassword.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    setStep('loading');
    setErrorMsg('');
    kidAudio.playPop();
    
    // Generate unique User ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const userId = `ABC-${randomNum}`;

    try {
      // 1. Daftar ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: parentEmail,
        password: parentPassword,
        options: {
          data: {
            child_name: childName,
            avatar_emoji: selectedAvatar.emoji,
            avatar_url: selectedAvatar.photoUrl || null,
            user_id_display: userId
          }
        }
      });

      if (authError) throw authError;

      // 2. Simpan profil anak ke tabel 'profiles'
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id, // Gunakan UUID dari Auth
            role: 'parent',
            child_name: childName,
            avatar_emoji: selectedAvatar.emoji,
            avatar_url: selectedAvatar.photoUrl || null,
            user_id_display: userId,
            stars: 0,
            screen_time_limit: 45,
            voice_allowed: true,
            friend_chat_allowed: true,
            ai_filter_strict: true,
          });

        if (profileError) {
          console.warn('Gagal menyimpan ke profiles (mungkin karena belum verifikasi email):', profileError);
        }
      }

      // 3. Cek apakah butuh verifikasi email (jika session null)
      if (authData.user && !authData.session) {
        setStep('verification');
        kidAudio.playSuccess();
        kidAudio.speak('Pendaftaran berhasil! Silakan periksa email untuk verifikasi.');
        return;
      }

      const creds = {
        parentEmail,
        childName,
        avatar: selectedAvatar,
        userId,
        parentPassword, // Kita bisa sembunyikan ini saat produksi, tapi untuk demo kita tunjukkan
        registeredAt: new Date().toISOString()
      };

      setGeneratedCredentials(creds);
      setStep('credentials');
      kidAudio.playSuccess();
      kidAudio.speak(`Hore! Akun ${childName} berhasil dibuat. Selamat bermain!`);

    } catch (error) {
      console.error('Error saat pendaftaran:', error);
      setErrorMsg(`Terjadi kesalahan pendaftaran: ${error.message}`);
      setStep('form');
      kidAudio.playWrong();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!parentEmail || !parentPassword) {
      kidAudio.speak('Mohon lengkapi email dan password terlebih dahulu!');
      return;
    }

    setStep('loading');
    setErrorMsg('');
    kidAudio.playPop();

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: parentEmail,
        password: parentPassword,
      });

      if (authError) throw authError;

      // Ambil data profil dari tabel profiles
      if (authData.user) {
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        // Jika profil tidak ditemukan (mungkin terblokir saat daftar karena butuh verifikasi)
        if (profileError && profileError.code === 'PGRST116') {
          const meta = authData.user.user_metadata || {};
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
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

          if (insertError) throw insertError;
          profile = newProfile;
        } else if (profileError) {
          throw profileError;
        }

        const creds = {
          parentEmail,
          childName: profile.child_name,
          avatar: {
            id: 'fetched_avatar',
            emoji: profile.avatar_emoji || '🦁',
            photoUrl: profile.avatar_url,
            name: 'Foto Saya'
          },
          userId: profile.user_id_display,
          parentPassword: '***',
          registeredAt: new Date().toISOString()
        };

        // Langsung masuk bermain
        kidAudio.playSuccess();
        kidAudio.speak(`Selamat datang kembali, ${profile.child_name}!`);
        onCompleteRegistration(creds, false);
      }

    } catch (error) {
      console.error('Error saat login:', error);
      setErrorMsg(`Login gagal: Email atau Password salah.`);
      setStep('form');
      kidAudio.playWrong();
    }
  };

  const handleGoogleLogin = async () => {
    kidAudio.playPop();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      // Redirect occurs
    } catch (error) {
      console.error('Google OAuth Error:', error);
      setErrorMsg(`Google OAuth Error: ${error.message}`);
    }
  };

  const handleDummyOAuth = (provider) => {
    kidAudio.playPop();
    alert(`Mohon maaf, terjadi sedikit kesalahan ketika tombol ${provider} di-klik. Fitur ini masih dalam tahap integrasi.`);
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
    <div className="welcome-screen-bg animate-fade-in">
      <div className="welcome-glass-card">
        
        {/* Welcome Header */}
        <div className="welcome-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="mascot-badge animate-bounce-gentle" style={{ margin: '0 auto 16px auto', display: 'flex', justifyContent: 'center' }}>
            {selectedAvatar.photoUrl ? (
              <img src={selectedAvatar.photoUrl} alt="Foto Profil" className="mascot-custom-img" style={{ width: '90px', height: '90px' }} />
            ) : (
              <span className="mascot-emoji" style={{ fontSize: '4rem' }}>{selectedAvatar.emoji}</span>
            )}
          </div>
          <h1 className="bouncing-letters">
            <span>A</span><span>B</span><span>C</span> <span>K</span><span>I</span><span>D</span><span>S</span>
          </h1>
          <p className="welcome-subtitle">
            {authMode === 'register' ? 'Daftar sekarang untuk mulai belajar dan bermain dengan gembira!' : 'Selamat datang kembali, Pahlawan Cilik! Ayo lanjutkan petualanganmu!'}
          </p>
        </div>

        {step === 'form' ? (
          <>

            <form onSubmit={authMode === 'register' ? handleRegister : handleLogin} className="welcome-form">
              
              {/* Child Name & Avatar (Hanya muncul saat mendaftar) */}
              {authMode === 'register' && (
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
                    required={authMode === 'register'}
                  />

                  <div className="avatar-selection-label">Pilih Avatar Karakter atau Unggah Foto Anak:</div>
                  
                  <div className="avatar-selection-grid">
                {AVATARS.map((av) => (
                  <div 
                    key={av.id} 
                    className={`avatar-ai-img-wrapper`}
                    onClick={() => { kidAudio.playPop(); setSelectedAvatar(av); }}
                    style={{ textAlign: 'center' }}
                  >
                    {av.photoUrl ? (
                      <img 
                        src={av.photoUrl} 
                        alt={av.name} 
                        className={`avatar-ai-img ${selectedAvatar.id === av.id ? 'selected' : ''}`} 
                      />
                    ) : (
                      <div className={`avatar-item ${selectedAvatar.id === av.id ? 'selected' : ''}`} style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: 'white', borderRadius: '50%', border: selectedAvatar.id === av.id ? '4px solid #4CAF50' : '3px solid #FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                        {av.emoji}
                      </div>
                    )}
                  </div>
                ))}
              </div>

                  <div className="avatar-grid">
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
              )}

              {/* Email & Password */}
              <div className="form-section accent-box">
                <div className="form-label-header">
                  <label className="form-label">
                    <Mail size={18} />
                    <span>Email {authMode === 'register' ? 'Orang Tua (Untuk Monitor & Akun)' : 'Orang Tua'}:</span>
                  </label>
                </div>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contoh: orangtua@gmail.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  required
                />
                
                <div className="form-label-header" style={{ marginTop: '16px' }}>
                  <label className="form-label">
                    <Lock size={18} />
                    <span>Password:</span>
                  </label>
                </div>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Minimal 6 karakter"
                  value={parentPassword}
                  onChange={(e) => setParentPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Action */}
              {errorMsg && (
                <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm font-medium mb-4">
                  {errorMsg}
                </div>
              )}
              <button type="submit" className={`btn-kid btn-xl w-full pulse-glow ${authMode === 'register' ? 'btn-primary' : 'btn-accent'}`} disabled={step === 'loading'}>
                {step === 'loading' ? (
                  <span>Memproses... ⏳</span>
                ) : (
                  <>
                    <span>{authMode === 'register' ? 'Buat Akun & Mulai!' : 'Masuk & Bermain!'}</span>
                    {authMode === 'register' ? <Sparkles size={22} /> : <ArrowRight size={22} />}
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', margin: '20px 0', color: '#888', fontWeight: 'bold' }}>ATAU</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 'bold', color: '#444' }}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="24" height="24" />
                  Masuk dengan Google
                </button>
                <button 
                  type="button" 
                  onClick={() => handleDummyOAuth('Facebook')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: 'none', background: '#1877F2', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width="24" height="24" style={{ filter: 'brightness(0) invert(1)' }} />
                  Masuk dengan Facebook
                </button>
                <button 
                  type="button" 
                  onClick={() => handleDummyOAuth('GitHub')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: 'none', background: '#333', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
                  <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" width="24" height="24" style={{ filter: 'brightness(0) invert(1)' }} />
                  Masuk dengan GitHub
                </button>
              </div>

              <div className="auth-toggle-link">
                {authMode === 'register' ? (
                  <>Sudah punya akun orang tua? <span onClick={() => { kidAudio.playPop(); setAuthMode('login'); setErrorMsg(''); }}>Masuk di sini</span></>
                ) : (
                  <>Belum punya akun orang tua? <span onClick={() => { kidAudio.playPop(); setAuthMode('register'); setErrorMsg(''); }}>Daftar di sini</span></>
                )}
              </div>
            </form>
          </>
        ) : step === 'loading' ? (
          <div className="welcome-loading text-center p-8 animate-pulse">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Mempersiapkan Petualanganmu... 🚀</h2>
            <p>Menyimpan data dengan aman...</p>
          </div>
        ) : (
          /* Credentials Confirmation Step (Only for register) */
          <div className="credentials-step animate-scale-up">
            <div className="success-banner">
              <CheckCircle2 size={32} className="text-green-500" />
              <div>
                <h3>Akun Pembelajaran Berhasil Dibuat! 🎉</h3>
                <p>Email pendaftaran: <strong>{generatedCredentials.parentEmail}</strong></p>
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
        ) : step === 'verification' ? (
          /* Verification Step */
          <div className="credentials-step animate-scale-up text-center p-6">
            <div className="success-banner justify-center flex-col gap-4 mb-6">
              <Mail size={48} className="text-blue-500 animate-bounce-gentle" />
              <div>
                <h3 className="text-2xl font-bold text-blue-600">Satu Langkah Lagi! 📧</h3>
                <p className="text-slate-600 mt-2">Kami telah mengirimkan tautan verifikasi ke email:</p>
                <p className="text-lg font-bold text-slate-800 bg-white/50 inline-block px-4 py-2 rounded-xl mt-2">{parentEmail}</p>
              </div>
            </div>
            
            <p className="text-slate-600 font-medium mb-8">
              Silakan periksa kotak masuk (atau folder spam) Anda, klik tautan verifikasi, lalu kembali ke sini untuk masuk (Login).
            </p>

            <button 
              type="button"
              className="btn-kid btn-primary btn-lg w-full"
              onClick={() => {
                setStep('form');
                setAuthMode('login');
              }}
            >
              <ArrowRight size={20} />
              <span>Kembali untuk Masuk Akun</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
