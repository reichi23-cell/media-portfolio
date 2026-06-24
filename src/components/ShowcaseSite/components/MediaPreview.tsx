import React from 'react';
import { Video } from 'lucide-react';
import { ShowcaseMedia } from '../types';
import { isDirectVideo, isImageSource, normalizeEmbedUrl } from '../utils';

export function MediaPreview({ media, className = '', isThumbnail = false }: { media: ShowcaseMedia; className?: string; isThumbnail?: boolean }) {
  if (!media.source) {
    return (
      <div className={`flex h-full items-center justify-center bg-[linear-gradient(120deg,#0f172a,#134e4a_45%,#f59e0b)] p-8 text-center text-white ${className}`}>
        <div>
          <Video className="mx-auto mb-5" size={48} />
          <p className="text-xl font-bold">プレビュー</p>
        </div>
      </div>
    );
  }

  if (media.mediaType === 'image' || isImageSource(media.source)) {
    return <img className={`h-full w-full ${isThumbnail ? 'object-cover' : 'object-contain'} ${className}`} src={media.source} alt={media.title} loading="lazy" />;
  }

  if (isDirectVideo(media.source)) {
    return (
      <video 
        className={`h-full w-full ${isThumbnail ? 'object-cover' : 'object-contain'} ${className}`} 
        src={media.source} 
        controls={!isThumbnail} 
        playsInline 
        muted={isThumbnail}
        loop={isThumbnail}
        preload={isThumbnail ? "metadata" : "auto"}
      />
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      {isThumbnail && <div className="absolute inset-0 z-10" />}
      <iframe
        title={media.title}
        src={normalizeEmbedUrl(media.source)}
        className="h-full w-full pointer-events-auto"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={!isThumbnail}
        loading="lazy"
        tabIndex={isThumbnail ? -1 : 0}
      />
    </div>
  );
}
