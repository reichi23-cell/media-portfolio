import React, { useState, useMemo } from 'react';
import { Settings, ExternalLink, Grid2X2, Globe2, LayoutDashboard, PlaySquare, Image as ImageIcon, X } from 'lucide-react';
import { ShowcaseMedia, ShowcaseApp } from '../types';
import { MediaPreview } from '../components/MediaPreview';

export function GalleryView({
  publishedMedia, apps,
  setSiteMode, selectedMediaId, setSelectedMediaId,
  onOpenEditor, onOpenRigLab
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const gallerySelectedMedia = useMemo(
    () => publishedMedia.find((m: any) => m.id === selectedMediaId) || publishedMedia[0],
    [publishedMedia, selectedMediaId]
  );

  const handleOpenModal = (id: string) => {
    setSelectedMediaId(id);
    setIsModalOpen(true);
  };

  return (
    <main className="mx-auto min-h-[calc(100dvh-73px)] max-w-[1600px] animate-in fade-in duration-500 border-x border-white/5 bg-[#050505] relative flex flex-col">
      
      {/* Header Area */}
      <div className="flex items-center justify-between px-6 py-8 md:px-12 border-b border-white/10 bg-[#0a0a0a] shadow-md z-10 sticky top-0">
        <div>
          <h2 className="text-[12px] font-black text-teal-400 uppercase tracking-[0.2em] mb-1">Portfolio Gallery</h2>
          <h1 className="text-2xl md:text-3xl font-black text-white">作品ギャラリー</h1>
        </div>
        <button
          onClick={() => setSiteMode('admin')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all shadow-lg"
          title="管理画面へ"
        >
          <Settings size={18} />
          <span className="hidden md:inline font-bold text-sm">管理画面（動画を追加）</span>
        </button>
      </div>

      {/* Media Grid */}
      <section className="flex-1 p-6 md:p-12">
        {publishedMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publishedMedia.map((item: any) => (
              <button
                key={item.id}
                onClick={() => handleOpenModal(item.id)}
                className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black text-left shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-[0_10px_40px_-10px_rgba(20,184,166,0.3)] outline-none"
              >
                <div className="absolute inset-0 z-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                  <MediaPreview media={item} isThumbnail={true} />
                </div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5">
                  <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 border border-white/10 shadow-inner">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.mediaType === 'image' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                      {item.mediaType === 'image' ? 'Image' : 'Video'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{item.note}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 h-[40vh]">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-black/50 border border-white/10 mb-6 shadow-inner">
              <Grid2X2 className="text-zinc-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">作品がありません</h2>
            <p className="text-sm text-zinc-400">右上の「管理画面」から動画や画像を追加してください。</p>
          </div>
        )}
      </section>

      {/* Apps Section */}
      {apps.length > 0 && (
        <section className="px-6 pb-16 md:px-12 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#050505] pt-12">
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/50">
              <Globe2 size={24} />
            </div>
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-1">Applications</h2>
              <h3 className="text-2xl font-black text-white">関連アプリ</h3>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {apps.map((app: any) => (
              <div key={app.id} className="group rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl transition-all hover:border-amber-500/30 hover:bg-[#151515] hover:-translate-y-1 flex flex-col">
                <p className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">{app.name}</p>
                <p className="mt-1 text-xs font-bold text-amber-500/80">{app.stack}</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400 line-clamp-3 flex-1">{app.description}</p>
                {app.url ? (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex w-full justify-center items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-amber-600 hover:border-amber-500 shadow-md"
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
        </section>
      )}

      {/* Modal Player */}
      {isModalOpen && gallerySelectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-6xl h-[85vh] flex flex-col bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10">
            {/* Modal Header */}
            <div className="flex flex-shrink-0 items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]">
              <div className="pr-12">
                <h3 className="text-xl font-black text-white truncate">{gallerySelectedMedia.title}</h3>
                {gallerySelectedMedia.note && <p className="text-sm text-zinc-400 truncate mt-1">{gallerySelectedMedia.note}</p>}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 p-2.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-md"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
               <MediaPreview media={gallerySelectedMedia} />
            </div>

            {/* Modal Footer (Optional external link) */}
            {gallerySelectedMedia.source && (
              <div className="flex-shrink-0 p-4 bg-[#0a0a0a] border-t border-white/10 flex justify-end">
                <a
                  href={gallerySelectedMedia.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5 shadow-md"
                >
                  <ExternalLink size={16} />
                  新しいタブで開く
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
