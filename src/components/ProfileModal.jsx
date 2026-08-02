import React from 'react';
import { X, LogOut, Star, User, Mail, ShieldCheck } from 'lucide-react';
import { kidAudio } from '../utils/audio';

export default function ProfileModal({ isOpen, onClose, account, onLogout, stars }) {
  if (!isOpen || !account) return null;

  const handleClose = () => {
    kidAudio.playPop();
    onClose();
  };

  const handleLogout = () => {
    kidAudio.playPop();
    const confirmLogout = window.confirm('Apakah kamu yakin ingin keluar dari akun ini?');
    if (confirmLogout) {
      onLogout();
    }
  };

  const childName = account.childName || 'Anak Cerdas';
  const avatarObj = account.avatar || { emoji: '🦁', photoUrl: null };
  const userId = account.userId || 'ABC-00000';
  const email = account.parentEmail || 'email@orangtua.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border-4 border-orange-400">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-6 text-center relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-3 overflow-hidden text-5xl">
            {avatarObj.photoUrl ? (
              <img src={avatarObj.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span>{avatarObj.emoji}</span>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {childName}
          </h2>
          <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-white/90 text-sm font-semibold backdrop-blur-sm">
            ID: {userId}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Mail className="text-blue-500" size={20} />
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Email Orang Tua</div>
                <div className="text-sm font-medium text-slate-700 truncate">{email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              <div>
                <div className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Total Bintang</div>
                <div className="text-sm font-medium text-slate-700">{stars} Bintang Terkumpul</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
              <ShieldCheck className="text-green-500" size={20} />
              <div>
                <div className="text-xs text-green-500 font-bold uppercase tracking-wider">Status Akun</div>
                <div className="text-sm font-medium text-slate-700">Aman & Terlindungi</div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 border-2 border-red-200 hover:border-red-500 shadow-sm"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <LogOut size={22} />
            <span>Keluar dari Aplikasi</span>
          </button>
        </div>

      </div>
    </div>
  );
}
