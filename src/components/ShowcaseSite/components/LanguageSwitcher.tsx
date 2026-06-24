import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
          language === 'en'
            ? 'bg-teal-500/20 text-teal-400'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ja')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
          language === 'ja'
            ? 'bg-teal-500/20 text-teal-400'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        JA
      </button>
    </div>
  );
}
