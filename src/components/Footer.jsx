import React from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="kid-footer">
      <div className="footer-content">
        <p>
          <span>Dibuat dengan</span> <Heart size={16} className="text-red-500 fill-current inline-block" /> <span>untuk Anak Pra-Sekolah, TK & SD Indonesia</span>
        </p>
        <div className="footer-badge">
          <ShieldCheck size={18} />
          <span>Aplikasi ABC - Platform Belajar & Komunitas Aman Anak</span>
        </div>
      </div>
    </footer>
  );
}
