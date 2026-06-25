import React, { useRef, useEffect, useState } from 'react';
import { Video } from 'lucide-react';
import { ShowcaseMedia } from '../types';
import { isDirectVideo, isImageSource, normalizeEmbedUrl } from '../utils';

export function MediaPreview({ media, className = '', isThumbnail = false, isHovered = false }: { media: ShowcaseMedia; className?: string; isThumbnail?: boolean; isHovered?: boolean }) {
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

  const objectFitClass = isThumbnail && media.aspectRatio !== '9:16' ? 'object-cover' : 'object-contain';

  if (media.mediaType === 'image' || isImageSource(media.source)) {
    return (
      <img 
        className={`h-full w-full ${objectFitClass} ${className}`} 
        src={media.source} 
        alt={media.title} 
        loading="lazy"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }

  if (isDirectVideo(media.source)) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [shouldLoad, setShouldLoad] = useState(() => {
      if (typeof window === 'undefined') return true;
      return !isThumbnail || window.innerWidth >= 768;
    });

    useEffect(() => {
      if (shouldLoad || !videoRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: '300px' }
      );

      observer.observe(videoRef.current);

      return () => observer.disconnect();
    }, [shouldLoad]);

    useEffect(() => {
      if (!isThumbnail) return;
      
      const video = videoRef.current;
      if (!video) return;

      if (isHovered) {
        // Play when hovered
        video.play().catch(() => {
          // Ignore autoplay errors
        });
      } else {
        // Pause and reset when unhovered
        video.pause();
      }
    }, [isHovered, isThumbnail, shouldLoad]);

    return (
      <video 
        ref={videoRef}
        className={`h-full w-full ${objectFitClass} ${className}`} 
        src={media.source} 
        controls={!isThumbnail} 
        playsInline 
        muted={isThumbnail}
        loop={isThumbnail}
        preload={isThumbnail ? (shouldLoad ? "metadata" : "none") : "auto"}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
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
