import React, { useState, useMemo } from 'react';
import { ExternalLink, Grid2X2, PlaySquare, Image as ImageIcon, X, ChevronLeft } from 'lucide-react';
import { ShowcaseMedia } from '../types';
import { MediaPreview } from '../components/MediaPreview';
import { useLanguage } from '../contexts/LanguageContext';

export function GalleryView({
  publishedMedia,
  mediaType,
  onBack,
}: {
  publishedMedia: ShowcaseMedia[];
  mediaType: 'video' | 'image';
  onBack: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState('');
  const { t } = useLanguage();

  const filteredMedia = useMemo(
    () => publishedMedia.filter(m => m.mediaType === mediaType),
    [publishedMedia, mediaType]
  );

  const gallerySelectedMedia = useMemo(
    () => filteredMedia.find((m: any) => m.id === selectedMediaId) || filteredMedia[0],
    [filteredMedia, selectedMediaId]
  );

  const handleOpenModal = (id: string) => {
    setSelectedMediaId(id);
    setIsModalOpen(true);
  };

  const formatTitle = (title: string) => {
    // If title is a long hash/UUID without spaces, return null to hide it
    if (title && title.length > 25 && !title.includes(' ')) {
      return null;
    }
    return title;
  };

  return (
    <main className="mx-auto min-h-[calc(100dvh-73px)] max-w-[1600px] animate-in fade-in duration-500 bg-[#050505] relative flex flex-col">
      
      {/* Header Area */}
      <div className="flex items-center justify-between px-6 py-8 md:px-12 border-b border-white/10 bg-[#0a0a0a] shadow-md z-10 sticky top-0">
        <div>
          <h2 className="text-[12px] font-black text-teal-400 uppercase tracking-[0.2em] mb-1">
            {mediaType === 'image' ? 'Image Gallery' : 'Video Gallery'}
          </h2>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {mediaType === 'image' ? t('gallery.imageTitle') : t('gallery.videoTitle')}
          </h1>
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

      {/* Media Grid */}
      <section className="flex-1 p-6 md:p-12">
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item: any) => (
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
                  {formatTitle(item.title) && (
                    <h3 className="text-lg font-bold text-white line-clamp-1">{formatTitle(item.title)}</h3>
                  )}
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
            <h2 className="text-xl font-bold text-white mb-2">{t('gallery.emptyTitle')}</h2>
            <p className="text-sm text-zinc-400">{t('gallery.emptyDesc')}</p>
          </div>
        )}
      </section>

      {/* Modal Player */}
      {isModalOpen && gallerySelectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-6xl h-[85vh] flex flex-col bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10">
            {/* Modal Header */}
            <div className="flex flex-shrink-0 items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]">
              <div className="pr-12">
                {formatTitle(gallerySelectedMedia.title) && (
                  <h3 className="text-xl font-black text-white truncate">{formatTitle(gallerySelectedMedia.title)}</h3>
                )}
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
                  {t('gallery.openNewTab')}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
