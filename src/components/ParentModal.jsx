import React, { useState } from 'react';
import { X, ShieldAlert, Lock, Award, Clock, Users, Key, CheckCircle, BarChart3, Shield, Globe } from 'lucide-react';
import { kidAudio } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { supabase } from '../utils/supabaseClient';

export default function ParentModal({ isOpen, onClose, stars, account }) {
  const { t, lang, countryName, countryCode, detectionMethod, changeLanguage } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPass, setInputPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('progress'); // 'progress' | 'screentime' | 'safety' | 'language' | 'account'

  // Settings State
  const [screenTimeLimit, setScreenTimeLimit] = useState(45); // in minutes
  const [voiceAllowed, setVoiceAllowed] = useState(true);
  const [friendChatAllowed, setFriendChatAllowed] = useState(true);
  const [aiFilterStrict, setAiFilterStrict] = useState(true);

  if (!isOpen) return null;

  const validPassword = account?.parentPassword || '1234';
  const userId = account?.userId || 'ABC-89420';
  const parentEmail = account?.parentEmail || 'admin@aplikasi-abc.com';
  const childName = account?.childName || t('childDefaultName');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    kidAudio.playPop();
    setIsSubmitting(true);
    
    // Allow quick admin simulation for testing UI without real auth
    if (inputPass.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setErrorMsg('');
      kidAudio.playSuccess();
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parentEmail, // We use the one stored in state/props
        password: inputPass,
      });

      if (error) throw error;
      
      setIsAuthenticated(true);
      setErrorMsg('');
      kidAudio.playSuccess();
    } catch (err) {
      setErrorMsg(`Login gagal: ${err.message}`);
      kidAudio.playWrong();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdminLogin = () => {
    kidAudio.playPop();
    setInputPass(validPassword || '1234');
    setIsAuthenticated(true);
    setErrorMsg('');
    kidAudio.playSuccess();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="modal-content parent-web-dashboard glass-panel animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="parent-dash-header">
          <div className="dash-title">
            <ShieldAlert size={28} className="text-orange-500" />
            <div>
              <h2>{t('parentModalTitle')}</h2>
              <p className="subtitle">{t('parentModalSubtitle')}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Tutup Dashboard">
            <X size={24} />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Authentication Gate */
          <div className="parent-auth-gate">
            <div className="auth-card">
              <div className="gate-icon">
                <Lock size={44} className="text-amber-500 animate-bounce-soft" />
              </div>
              <h3>Pintu Masuk Area Orang Tua</h3>
              <p>Masukkan Password Orang Tua yang tertera saat registrasi atau gunakan tombol simulasi Admin:</p>

              <div className="account-info-chip">
                <span>User ID Anak: <strong>{userId}</strong></span>
                <span>Email Terdaftar: <strong>{parentEmail}</strong></span>
              </div>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Masukkan Password Orang Tua / PIN (1234)"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  autoFocus
                />

                <div className="auth-buttons-row">
                  <button type="submit" className="btn-kid btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Memproses...' : 'Buka Web Dashboard'}
                  </button>

                  <button 
                    type="button" 
                    className="btn-kid btn-accent" 
                    onClick={handleQuickAdminLogin}
                    disabled={isSubmitting}
                  >
                    ⚡ Login Simulasi Admin
                  </button>
                </div>
              </form>

              {errorMsg && <p className="error-text mt-3">{errorMsg}</p>}
            </div>
          </div>
        ) : (
          /* Authenticated Web Dashboard Layout */
          <div className="parent-dash-body">
            
            {/* Dashboard Sidebar / Navigation Tabs */}
            <div className="parent-dash-tabs">
              <button 
                className={`dash-tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => { kidAudio.playPop(); setActiveTab('progress'); }}
              >
                <BarChart3 size={20} />
                <span>📊 Progres Belajar</span>
              </button>

              <button 
                className={`dash-tab-btn ${activeTab === 'screentime' ? 'active' : ''}`}
                onClick={() => { kidAudio.playPop(); setActiveTab('screentime'); }}
              >
                <Clock size={20} />
                <span>⏱️ Screen Time</span>
              </button>

              <button 
                className={`dash-tab-btn ${activeTab === 'language' ? 'active' : ''}`}
                onClick={() => { kidAudio.playPop(); setActiveTab('language'); }}
              >
                <Globe size={20} />
                <span>🌐 Bahasa &amp; Lokasi</span>
              </button>

              <button 
                className={`dash-tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
                onClick={() => { kidAudio.playPop(); setActiveTab('safety'); }}
              >
                <Shield size={20} />
                <span>👥 Keamanan Chat</span>
              </button>

              <button 
                className={`dash-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => { kidAudio.playPop(); setActiveTab('account'); }}
              >
                <Key size={20} />
                <span>🔑 Detail Akun ID</span>
              </button>
            </div>

            {/* Dashboard Main Content Area */}
            <div className="parent-dash-content">
              
              {/* Tab 1: Progres Belajar */}
              {activeTab === 'progress' && (
                <div className="tab-pane animate-fade-in">
                  <h3>📊 Laporan Pembelajaran {childName}</h3>
                  <p className="tab-subtitle">Ringkasan aktivitas dan pencapaian anak minggu ini</p>

                  <div className="dash-metrics-grid">
                    <div className="metric-card bg-blue-glow">
                      <Award className="text-yellow-400" size={32} />
                      <div>
                        <span className="metric-val">{stars}</span>
                        <span className="metric-lbl">{t('totalStarsEarned')}</span>
                      </div>
                    </div>

                    <div className="metric-card bg-purple-glow">
                      <BarChart3 className="text-purple-400" size={32} />
                      <div>
                        <span className="metric-val">94%</span>
                        <span className="metric-lbl">Akurasi Belajar</span>
                      </div>
                    </div>

                    <div className="metric-card bg-green-glow">
                      <Clock className="text-green-400" size={32} />
                      <div>
                        <span className="metric-val">25 Menit</span>
                        <span className="metric-lbl">Main Hari Ini</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-table-card">
                    <h4>Pencapaian Modul Terakhir:</h4>
                    <ul className="progress-list">
                      <li>
                        <span>🔤 Belajar Mengeja (Huruf &amp; Suku Kata)</span>
                        <span className="badge-done">Selesai 12 Kata</span>
                      </li>
                      <li>
                        <span>🎙️ Obrolan Ruang Sahabat AI</span>
                        <span className="badge-done">3 Sesi Aktif</span>
                      </li>
                      <li>
                        <span>⭐ Tutorial Interaktif</span>
                        <span className="badge-done">Lulus (+10 Bintang)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Screen Time Management */}
              {activeTab === 'screentime' && (
                <div className="tab-pane animate-fade-in">
                  <h3>⏱️ Pengaturan Batas Waktu Layar (*Screen Time*)</h3>
                  <p className="tab-subtitle">Atur durasi maksimal penggunaan aplikasi agar anak tetap seimbang</p>

                  <div className="setting-box">
                    <label className="setting-label">
                      <span>Batas Waktu Layar Harian:</span>
                      <strong className="text-amber-400">{screenTimeLimit} Menit / Hari</strong>
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      step="15"
                      className="range-slider"
                      value={screenTimeLimit}
                      onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
                    />
                    <div className="slider-markers">
                      <span>15 mnt</span>
                      <span>45 mnt</span>
                      <span>90 mnt</span>
                      <span>120 mnt</span>
                    </div>
                  </div>

                  <div className="screentime-progress-bar-card">
                    <div className="st-info">
                      <span>Penggunaan Hari Ini: <strong>25 dari {screenTimeLimit} Menit</strong></span>
                      <span>Sisa: {Math.max(0, screenTimeLimit - 25)} Menit</span>
                    </div>
                    <div className="st-bar-bg">
                      <div 
                        className="st-bar-fill" 
                        style={{ width: `${Math.min(100, (25 / screenTimeLimit) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Language & GeoIP Location Settings */}
              {activeTab === 'language' && (
                <div className="tab-pane animate-fade-in">
                  <h3>🌐 {t('langSettingTitle')}</h3>
                  <p className="tab-subtitle">{t('autoDetectInfo')}</p>

                  <div className="detail-table-card">
                    <div className="setting-row-item">
                      <div>
                        <h4 className="font-bold text-white text-base">{t('detectedLocation')}</h4>
                        <p className="text-sm text-gray-300">
                          {countryName} ({countryCode}) &bull; Metode: {detectionMethod.toUpperCase()}
                        </p>
                      </div>
                      <span className="badge-done">
                        {countryCode === 'ID' ? '🇮🇩 Indonesia (ID)' : `🌏 Non-Indonesia (${countryCode})`}
                      </span>
                    </div>

                    <div className="setting-row-item mt-4 pt-4 border-t border-gray-700">
                      <div>
                        <h4 className="font-bold text-white text-base">{t('currentLanguage')}</h4>
                        <p className="text-sm text-gray-300">
                          {lang === 'id' ? 'Bahasa Indonesia (Tampilan default Indonesia)' : 'English (Default international view)'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${lang === 'id' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => changeLanguage('id')}
                        >
                          🇮🇩 Indonesia
                        </button>
                        <button 
                          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${lang === 'en' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => changeLanguage('en')}
                        >
                          🇬🇧 English
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Chat Safety & Friends */}
              {activeTab === 'safety' && (
                <div className="tab-pane animate-fade-in">
                  <h3>👥 Keamanan Pertemanan &amp; Filter AI Suara</h3>
                  <p className="tab-subtitle">Kendali penuh terhadap interaksi sosial dan sensor otomatis kata kasar</p>

                  <div className="toggle-setting-row">
                    <div>
                      <h4>Izin Panggilan Suara &amp; Obrolan Sahabat AI</h4>
                      <p>Mengizinkan anak berinteraksi dengan AI suara yang ramah anak</p>
                    </div>
                    <button 
                      className={`toggle-switch ${voiceAllowed ? 'active' : ''}`}
                      onClick={() => setVoiceAllowed(!voiceAllowed)}
                    >
                      {voiceAllowed ? 'AKTIF (DIIZINKAN)' : 'DIBATASI'}
                    </button>
                  </div>

                  <div className="toggle-setting-row">
                    <div>
                      <h4>Fitur Pertemanan &amp; Chat Anak</h4>
                      <p>Mengontrol ruang obrolan teman sebaya yang terdaftar</p>
                    </div>
                    <button 
                      className={`toggle-switch ${friendChatAllowed ? 'active' : ''}`}
                      onClick={() => setFriendChatAllowed(!friendChatAllowed)}
                    >
                      {friendChatAllowed ? 'DIIZINKAN' : 'DIBATASI'}
                    </button>
                  </div>

                  <div className="toggle-setting-row">
                    <div>
                      <h4>Filter Ketat Kata Kasar &amp; Konten Dewasa</h4>
                      <p>Sistem AI otomatis memblokir dan melaporkan bahasa kurang sopan</p>
                    </div>
                    <button 
                      className={`toggle-switch ${aiFilterStrict ? 'active' : ''}`}
                      onClick={() => setAiFilterStrict(!aiFilterStrict)}
                    >
                      {aiFilterStrict ? 'SANGAT AMAN (100%)' : 'STANDAR'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 5: Account Info & Credentials */}
              {activeTab === 'account' && (
                <div className="tab-pane animate-fade-in">
                  <h3>🔑 Informasi Identitas Akun &amp; Kunci Sandi</h3>
                  <p className="tab-subtitle">Gunakan data ini untuk memonitor dari perangkat lain</p>

                  <div className="account-details-grid">
                    <div className="acc-item">
                      <span className="acc-label">Nama Anak:</span>
                      <span className="acc-value">{account?.avatar?.emoji} {childName}</span>
                    </div>

                    <div className="acc-item">
                      <span className="acc-label">User ID Anak (Unik):</span>
                      <span className="acc-value text-amber-400 font-mono">{userId}</span>
                    </div>

                    <div className="acc-item">
                      <span className="acc-label">Email Orang Tua:</span>
                      <span className="acc-value text-blue-400">{parentEmail}</span>
                    </div>

                    <div className="acc-item">
                      <span className="acc-label">Password Area Orang Tua:</span>
                      <span className="acc-value text-green-400 font-mono">{validPassword}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="parent-dash-footer">
          <button className="btn-kid btn-primary" onClick={onClose}>
            <CheckCircle size={18} />
            <span>Simpan &amp; Tutup Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
