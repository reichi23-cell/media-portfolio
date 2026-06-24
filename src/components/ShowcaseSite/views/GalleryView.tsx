import React, { useMemo } from 'react';
import { Settings, ExternalLink, Grid2X2, Globe2, LayoutDashboard, PlaySquare, Image as ImageIcon } from 'lucide-react';
import { ShowcaseMedia, ShowcaseApp } from '../types';
import { MediaPreview } from '../components/MediaPreview';

export function GalleryView({
  publishedMedia, apps,
  setSiteMode, selectedMediaId, setSelectedMediaId,
  onOpenEditor, onOpenRigLab
}: any) {
  const gallerySelectedMedia = useMemo(
    () => publishedMedia.find((m: any) => m.id === selectedMediaId) || publishedMedia[0],
    [publishedMedia, selectedMediaId]
  );

  return (
    <main className="mx-auto flex flex-col-reverse lg:flex-row h-[calc(100dvh-73px)] max-w-[1600px] animate-in fade-in duration-500 border-x border-white/5 bg-[#050505]">
      
      {/* Sidebar: Media List */}
      <aside className="w-full h-[45vh] lg:h-auto lg:w-[340px] flex-shrink-0 lg:border-r lg:border-t-0 border-t border-white/10 bg-[#0a0a0a] flex flex-col relative z-10 shadow-2xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div>
            <h2 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em]">Library</h2>
            <p className="text-white font-bold text-sm mt-0.5">制作ファイル</p>
          </div>
          <button
            onClick={() => setSiteMode('admin')}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            title="管理画面へ"
          >
            <Settings size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {publishedMedia.length > 0 ? publishedMedia.map((item: any) => (
            <button
              key={item.id}
              onClick={() => setSelectedMediaId(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left outline-none group ${
                selectedMediaId === item.id 
                  ? 'bg-teal-500/10 border border-teal-500/50 shadow-inner' 
                  : 'bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg shadow-inner transition-colors ${
                selectedMediaId === item.id 
                  ? (item.mediaType === 'image' ? 'bg-rose-500 text-white shadow-rose-900' : 'bg-teal-500 text-white shadow-teal-900')
                  : (item.mediaType === 'image' ? 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20' : 'bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20')
              }`}>
                {item.mediaType === 'image' ? <ImageIcon size={18} /> : <PlaySquare size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-bold transition-colors ${selectedMediaId === item.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                  {item.title}
                </p>
                <p className={`truncate text-xs mt-0.5 transition-colors ${selectedMediaId === item.id ? 'text-teal-200/70' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                  {item.mediaType === 'image' ? 'Image File' : 'Video File'}
                </p>
              </div>
            </button>
          )) : (
            <div className="p-8 text-center text-zinc-500 text-sm border-2 border-dashed border-white/5 rounded-xl">
              <Grid2X2 className="mx-auto mb-3 opacity-50" size={24} />
              ファイルがありません
            </div>
          )}
        </div>
      </aside>

      {/* Main: Preview Area */}
      <section className="flex-1 overflow-y-auto custom-scrollbar relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-[#050505] to-[#050505]">
        {publishedMedia.length > 0 && gallerySelectedMedia ? (
          <div className="p-5 lg:p-12 max-w-5xl mx-auto flex flex-col min-h-full">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_50px_-12px_rgba(20,184,166,0.15)]">
              <div className="aspect-video w-full bg-[#020202]">
                <MediaPreview media={gallerySelectedMedia} />
              </div>
            </div>

            <div className="mt-5 lg:mt-8 rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl p-5 lg:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex-1 min-w-[280px]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${gallerySelectedMedia.mediaType === 'image' ? 'bg-rose-400' : 'bg-teal-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${gallerySelectedMedia.mediaType === 'image' ? 'bg-rose-500' : 'bg-teal-500'}`}></span>
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                      {gallerySelectedMedia.mediaType === 'image' ? 'Image Viewer' : 'Video Player'}
                    </p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">{gallerySelectedMedia.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400 max-w-3xl">{gallerySelectedMedia.note}</p>
                </div>
                {gallerySelectedMedia.source && (
                  <a
                    href={gallerySelectedMedia.source}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex w-full lg:w-auto justify-center items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ExternalLink size={18} />
                    別タブで開く
                  </a>
                )}
              </div>
            </div>

            {apps.length > 0 && (
              <div className="mt-16 pt-16 border-t border-white/10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/50">
                    <Globe2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-1">Applications</h2>
                    <h3 className="text-2xl font-black text-white">関連アプリ</h3>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {apps.map((app: any) => (
                    <div key={app.id} className="group rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl transition-all hover:border-amber-500/30 hover:bg-[#151515] hover:-translate-y-1">
                      <p className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">{app.name}</p>
                      <p className="mt-1 text-xs font-bold text-amber-500/80">{app.stack}</p>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{app.description}</p>
                      {app.url ? (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex w-full justify-center items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-amber-600 hover:border-amber-500"
                        >
                          <ExternalLink size={16} /> アプリを開く
                        </a>
                      ) : (
                        <button
                          onClick={onOpenEditor}
                          className="mt-6 inline-flex w-full justify-center items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-500"
                        >
                          <LayoutDashboard size={16} /> エディターを開く
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white/5 border border-white/10 mb-6">
              <Grid2X2 className="text-zinc-600" size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">ファイルがありません</h2>
            <p className="text-sm leading-relaxed text-zinc-400">管理画面から動画や画像を追加してください。</p>
          </div>
        )}
      </section>
    </main>
  );
}
