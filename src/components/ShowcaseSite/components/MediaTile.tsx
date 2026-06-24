import React from 'react';
import { PlaySquare, Image as ImageIcon } from 'lucide-react';
import { ShowcaseMedia } from '../types';
import { isDirectVideo, isImageSource } from '../utils';

export function MediaTile({ item, isSelected, onSelect }: { item: ShowcaseMedia; isSelected: boolean; onSelect: () => void }) {
  const isImage = item.mediaType === 'image' || isImageSource(item.source);

  return (
    <button
      onClick={onSelect}
      className={`group overflow-hidden rounded-xl border bg-[#111] text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-teal-500/50 ${
        isSelected ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-white/10'
      }`}
    >
      <div className="aspect-video bg-[#050505] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-50 z-10 pointer-events-none" />
        {item.source ? (
          isImage ? (
            <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={item.source} alt={item.title} />
          ) : isDirectVideo(item.source) ? (
            <video className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={item.source} muted playsInline preload="metadata" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#0a0a0a] text-white">
              <PlaySquare size={34} className="opacity-50 group-hover:opacity-100 transition" />
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center bg-[#0a0a0a] text-white">
            <ImageIcon size={34} className="opacity-50 group-hover:opacity-100 transition" />
          </div>
        )}
      </div>
      <div className="p-4 relative z-20">
        <div className="mb-2 flex items-center gap-2">
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${isImage ? 'bg-rose-500/10 text-rose-400' : 'bg-teal-500/10 text-teal-400'}`}>
            {isImage ? <ImageIcon size={16} /> : <PlaySquare size={16} />}
          </span>
          <p className="truncate text-sm font-bold text-zinc-100">{item.title}</p>
        </div>
        <p className="line-clamp-2 min-h-10 text-xs leading-relaxed text-zinc-400">{item.note}</p>
      </div>
    </button>
  );
}
