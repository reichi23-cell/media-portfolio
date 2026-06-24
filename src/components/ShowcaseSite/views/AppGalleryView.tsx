import React from 'react';
import { ExternalLink, LayoutDashboard, Globe2, LayoutGrid, Bone, ChevronLeft } from 'lucide-react';
import { ShowcaseApp } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export function AppGalleryView({
  apps,
  onBack,
  onOpenEditor,
  onOpenRigLab,
}: {
  apps: ShowcaseApp[];
  onBack: () => void;
  onOpenEditor: () => void;
  onOpenRigLab: () => void;
}) {
  const { t } = useLanguage();

  return (
    <main className="mx-auto min-h-[calc(100dvh-73px)] max-w-[1600px] animate-in fade-in duration-500 bg-[#050505] relative flex flex-col">
      {/* Header Area */}
      <div className="flex items-center justify-between px-6 py-8 md:px-12 border-b border-white/10 bg-[#0a0a0a] shadow-md z-10 sticky top-0">
        <div>
          <h2 className="text-[12px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Applications</h2>
          <h1 className="text-2xl md:text-3xl font-black text-white">{t('appGallery.title')}</h1>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all shadow-lg"
          title={t('gallery.backToHome')}
        >
          <ChevronLeft size={18} />
          <span className="hidden md:inline font-bold text-sm">{t('gallery.backToHome')}</span>
        </button>
      </div>

      <div className="p-6 md:p-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Editor App (Hardcoded) */}
        <div className="group rounded-3xl border border-white/10 bg-[#111] p-8 shadow-xl transition-all hover:border-teal-500/50 hover:bg-[#151515] hover:-translate-y-2 flex flex-col">
          <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-900/50">
            <LayoutDashboard size={28} />
          </div>
          <p className="text-2xl font-black text-white group-hover:text-teal-400 transition-colors">Editor</p>
          <p className="mt-1 text-sm font-bold text-teal-500/80">Web Tool</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 flex-1">
            {t('appGallery.editorDesc')}
          </p>
          <button
            onClick={onOpenEditor}
            className="mt-8 inline-flex w-full justify-center items-center gap-2 rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-500"
          >
            <LayoutDashboard size={18} /> {t('appGallery.openEditor')}
          </button>
        </div>

        {/* Rig Lab App (Hardcoded) */}
        <div className="group rounded-3xl border border-white/10 bg-[#111] p-8 shadow-xl transition-all hover:border-sky-500/50 hover:bg-[#151515] hover:-translate-y-2 flex flex-col">
          <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-900/50">
            <Bone size={28} />
          </div>
          <p className="text-2xl font-black text-white group-hover:text-sky-400 transition-colors">Rig Lab</p>
          <p className="mt-1 text-sm font-bold text-sky-500/80">3D Tool</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 flex-1">
            {t('appGallery.rigLabDesc')}
          </p>
          <button
            onClick={onOpenRigLab}
            className="mt-8 inline-flex w-full justify-center items-center gap-2 rounded-xl bg-sky-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-900/50 transition-all hover:bg-sky-500"
          >
            <Bone size={18} /> {t('appGallery.openRigLab')}
          </button>
        </div>

        {/* Database Apps */}
        {apps.map((app) => (
          <div key={app.id} className="group rounded-3xl border border-white/10 bg-[#111] p-8 shadow-xl transition-all hover:border-amber-500/50 hover:bg-[#151515] hover:-translate-y-2 flex flex-col">
            <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/50">
              <Globe2 size={28} />
            </div>
            <p className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">{app.name}</p>
            <p className="mt-1 text-sm font-bold text-amber-500/80">{app.stack}</p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 flex-1">{app.description}</p>
            {app.url ? (
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-full justify-center items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-amber-600 hover:border-amber-500 shadow-md"
              >
                <ExternalLink size={18} /> {t('appGallery.openApp')}
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </main>
  );
}
