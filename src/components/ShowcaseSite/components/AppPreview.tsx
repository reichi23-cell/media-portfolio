import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ShowcaseApp } from '../types';

export function AppPreview({
  app,
  onOpenEditor,
  onOpenRigLab,
}: {
  app: ShowcaseApp;
  onOpenEditor: () => void;
  onOpenRigLab: () => void;
}) {
  if (!app.url) {
    return (
      <div className="grid min-h-[300px] gap-4 md:grid-cols-2">
        <button
          onClick={onOpenEditor}
          className="group flex h-full min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] text-left shadow-lg transition-all duration-300 hover:border-teal-500/50 hover:shadow-teal-500/10"
        >
          <div className="relative h-full w-full bg-[linear-gradient(135deg,#050505_0%,#0f172a_50%,#050505_100%)]">
            <div className="absolute left-6 right-6 top-6 h-10 rounded-lg border border-white/5 bg-white/5 backdrop-blur-md" />
            <div className="absolute bottom-6 left-6 top-24 w-32 rounded-lg border border-white/5 bg-white/5 backdrop-blur-md" />
            <div className="absolute bottom-6 left-44 right-6 top-24 rounded-lg border border-white/5 bg-white/5 backdrop-blur-md flex flex-col">
              <div className="m-6 aspect-video rounded-lg bg-gradient-to-br from-teal-400/20 via-emerald-500/20 to-amber-400/20 shadow-inner" />
              <div className="mx-6 mt-auto mb-4 h-3 w-2/3 rounded-full bg-white/10" />
              <div className="mx-6 mb-6 h-3 w-1/2 rounded-full bg-white/5" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 backdrop-blur-xl px-6 py-5 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 mb-1">Local app</p>
                <p className="text-lg font-bold text-white">動画編集アプリを開く</p>
              </div>
              <ArrowUpRight className="text-white opacity-50 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" size={24} />
            </div>
          </div>
        </button>
        
        <button
          onClick={onOpenRigLab}
          className="group flex h-full min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] text-left shadow-lg transition-all duration-300 hover:border-sky-500/50 hover:shadow-sky-500/10"
        >
          <div className="relative h-full w-full bg-[#050505]">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:24px_24px]" />
            <svg viewBox="0 0 420 260" className="absolute inset-x-6 top-8 h-52 w-[calc(100%-3rem)] opacity-80 group-hover:opacity-100 transition-opacity">
              <line x1="210" y1="25" x2="210" y2="225" stroke="rgba(255,255,255,.1)" strokeDasharray="4 6" />
              <line x1="210" y1="65" x2="210" y2="155" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
              <line x1="210" y1="95" x2="150" y2="145" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" />
              <line x1="150" y1="145" x2="132" y2="210" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" />
              <line x1="210" y1="95" x2="270" y2="145" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" />
              <line x1="270" y1="145" x2="306" y2="205" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" />
              <line x1="210" y1="155" x2="175" y2="220" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
              <line x1="210" y1="155" x2="245" y2="220" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
              {[ [210,38], [210,95], [210,155], [150,145], [132,210], [270,145], [306,205], [175,220], [245,220] ].map(([x, y], index) => (
                <circle key={index} cx={x} cy={y} r="8" fill={index === 6 ? '#f59e0b' : '#0f172a'} stroke="#0ea5e9" strokeWidth="2.5" />
              ))}
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 backdrop-blur-xl px-6 py-5 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-1">Prototype</p>
                <p className="text-lg font-bold text-white">Rig Labを開く</p>
              </div>
              <ArrowUpRight className="text-white opacity-50 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" size={24} />
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <iframe
      title={app.name}
      src={app.url}
      className="h-full min-h-[400px] w-full rounded-xl border border-white/10 bg-white"
      loading="lazy"
    />
  );
}
