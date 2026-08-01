import React from 'react';
import { Heart, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, countryName, countryCode, lang } = useLanguage();

  return (
    <footer className="kid-footer">
      <div className="footer-content">
        <p>
          <span>{t('madeWithLove')}</span> <Heart size={16} className="text-red-500 fill-current inline-block" />
        </p>
        <div className="footer-badge">
          <ShieldCheck size={18} />
          <span>{t('safePlatformBadge')}</span>
          <span className="footer-lang-badge" title={`Detected Access Point: ${countryName}`}>
            <Globe size={14} className="inline-block mr-1" />
            {t('autoDetectedBadge')} {countryName} ({countryCode}) [{lang.toUpperCase()}]
          </span>
        </div>
      </div>
    </footer>
  );
}
