import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('id'); // 'id' | 'en'
  const [countryCode, setCountryCode] = useState('ID'); // 'ID', 'US', etc.
  const [countryName, setCountryName] = useState('Indonesia');
  const [detectionMethod, setDetectionMethod] = useState('auto'); // 'manual' | 'geoip' | 'browser'
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    // 1. Check if user manually set language previously
    const savedOverride = localStorage.getItem('abc_language_override');
    if (savedOverride && (savedOverride === 'id' || savedOverride === 'en')) {
      setLangState(savedOverride);
      setDetectionMethod('manual');
      setIsDetecting(false);
      return;
    }

    // 2. Perform GeoIP lookup with fast timeout + Browser Locale fallback
    const detectLocationAndLanguage = async () => {
      let detectedLang = 'id';
      let detectedCountry = 'ID';
      let detectedName = 'Indonesia';
      let method = 'browser';

      // Check browser navigator.language first
      const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      const isIndonesianLocale = browserLang.startsWith('id') || browserLang.startsWith('in');

      try {
        // Fast GeoIP Lookup (timeout 2.5s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.country_code) {
            detectedCountry = data.country_code;
            detectedName = data.country_name || data.country_code;
            method = 'geoip';
            
            // If country is ID, set 'id'. Otherwise set 'en'.
            if (detectedCountry === 'ID') {
              detectedLang = 'id';
            } else {
              detectedLang = 'en';
            }
          }
        }
      } catch (err) {
        // Fallback to browser language if GeoIP service is unreachable or timed out
        console.log('GeoIP lookup fallback to browser locale:', browserLang);
        if (isIndonesianLocale) {
          detectedLang = 'id';
          detectedCountry = 'ID';
          detectedName = 'Indonesia';
        } else {
          detectedLang = 'en';
          detectedCountry = 'US';
          detectedName = 'International / Outside Indonesia';
        }
      }

      setLangState(detectedLang);
      setCountryCode(detectedCountry);
      setCountryName(detectedName);
      setDetectionMethod(method);
      setIsDetecting(false);
    };

    detectLocationAndLanguage();
  }, []);

  const changeLanguage = (newLang) => {
    setLangState(newLang);
    setDetectionMethod('manual');
    try {
      localStorage.setItem('abc_language_override', newLang);
    } catch (e) {}
  };

  // Helper translation function with parameter interpolation
  const t = (key, params = {}) => {
    const currentDict = translations[lang] || translations['id'];
    let text = currentDict[key] || translations['id'][key] || key;

    // Replace placeholders like {name}
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        countryCode,
        countryName,
        detectionMethod,
        isDetecting,
        changeLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
