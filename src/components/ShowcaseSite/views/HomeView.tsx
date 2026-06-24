import React from 'react';
import { PlaySquare, Image as ImageIcon, LayoutGrid, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function HomeView({ setSiteMode }: { setSiteMode: (mode: 'video' | 'image' | 'app') => void }) {
  const { t } = useLanguage();

  return (
    <main className="mx-auto min-h-[calc(100dvh-73px)] max-w-7xl animate-in fade-in duration-700 flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
          Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Portfolio</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          {t('home.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Video Gallery Card */}
        <button
          onClick={() => setSiteMode('video')}
          className="group relative flex flex-col items-center text-center p-8 rounded-3xl border border-white/10 bg-[#111] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-teal-500/50 hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-900/50 mb-6 group-hover:scale-110 transition-transform duration-500">
            <PlaySquare size={36} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{t('home.videoGallery')}</h2>
          <p className="text-sm text-zinc-400 mb-8 flex-1">{t('home.videoDesc')}</p>
          <div className="inline-flex items-center gap-2 text-teal-400 font-bold text-sm">
            {t('home.view')} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Image Gallery Card */}
        <button
          onClick={() => setSiteMode('image')}
          className="group relative flex flex-col items-center text-center p-8 rounded-3xl border border-white/10 bg-[#111] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-rose-500/50 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-900/50 mb-6 group-hover:scale-110 transition-transform duration-500">
            <ImageIcon size={36} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{t('home.imageGallery')}</h2>
          <p className="text-sm text-zinc-400 mb-8 flex-1">{t('home.imageDesc')}</p>
          <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-sm">
            {t('home.view')} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* App Gallery Card */}
        <button
          onClick={() => setSiteMode('app')}
          className="group relative flex flex-col items-center text-center p-8 rounded-3xl border border-white/10 bg-[#111] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/50 mb-6 group-hover:scale-110 transition-transform duration-500">
            <LayoutGrid size={36} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{t('home.appGallery')}</h2>
          <p className="text-sm text-zinc-400 mb-8 flex-1">{t('home.appDesc')}</p>
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm">
            {t('home.view')} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </main>
  );
}
