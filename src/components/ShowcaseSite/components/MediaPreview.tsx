import React from 'react';
import { Video } from 'lucide-react';
import { ShowcaseMedia } from '../types';
import { isDirectVideo, isImageSource, normalizeEmbedUrl } from '../utils';

export function MediaPreview({ media, className = '' }: { media: ShowcaseMedia; className?: string }) {
  if (!media.source) {
    return (
      <div className={`flex h-full items-center justify-center bg-[linear-gradient(120deg,#0f172a,#134e4a_45%,#f59e0b)] p-8 text-center text-white ${className}`}>
        <div>
          <Video className="mx-auto mb-5" size={48} />
          <p className="text-xl font-bold">ここに動画・画像プレビューが表示されます</p>
        </div>
      </div>
    );
  }

  if (media.mediaType === 'image' || isImageSource(media.source)) {
    return <img className={`h-full w-full object-contain ${className}`} src={media.source} alt={media.title} />;
  }

  if (isDirectVideo(media.source)) {
    return <video className={`h-full w-full object-contain ${className}`} src={media.source} controls playsInline />;
  }

  return (
    <iframe
      title={media.title}
      src={normalizeEmbedUrl(media.source)}
      className={`h-full w-full ${className}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
