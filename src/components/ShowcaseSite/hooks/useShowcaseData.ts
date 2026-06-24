import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShowcaseMedia, ShowcaseApp } from '../types';
import { STORAGE_KEY, initialMedia, initialApps } from '../constants';
import { isImageSource } from '../utils';

export function useShowcaseData() {
  const [mediaItems, setMediaItems] = useState<ShowcaseMedia[]>(initialMedia);
  const [apps, setApps] = useState<ShowcaseApp[]>(initialApps);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { videos?: ShowcaseMedia[]; mediaItems?: ShowcaseMedia[]; apps?: ShowcaseApp[] };
      const savedMedia = parsed.mediaItems ?? parsed.videos;
      if (savedMedia?.length) {
        const normalized = savedMedia.map(item => ({
          ...item,
          mediaType: item.mediaType ?? (isImageSource(item.source) ? 'image' : 'video'),
        }));
        setMediaItems(normalized);
      }
      if (parsed.apps?.length) {
        setApps(parsed.apps);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const persistentMedia = mediaItems.filter(item => item.kind !== 'file');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mediaItems: persistentMedia, apps }));
  }, [mediaItems, apps]);

  const addMediaItem = useCallback((item: ShowcaseMedia) => {
    setMediaItems(prev => [item, ...prev.filter(i => i.id !== 'sample-media')]);
  }, []);

  const addLocalMediaItems = useCallback((items: ShowcaseMedia[]) => {
    setMediaItems(prev => [...items, ...prev.filter(i => i.id !== 'sample-media')]);
  }, []);

  const removeMediaItem = useCallback((id: string) => {
    setMediaItems(prev => {
      const next = prev.filter(item => item.id !== id);
      return next.length ? next : initialMedia;
    });
  }, []);

  const addAppItem = useCallback((app: ShowcaseApp) => {
    setApps(prev => [app, ...prev]);
  }, []);

  const removeAppItem = useCallback((id: string) => {
    setApps(prev => {
      const next = prev.filter(app => app.id !== id);
      return next.length ? next : initialApps;
    });
  }, []);

  const publishedMedia = useMemo(() => mediaItems.filter(item => item.source && item.id !== 'sample-media'), [mediaItems]);

  return {
    mediaItems,
    setMediaItems,
    apps,
    setApps,
    addMediaItem,
    addLocalMediaItems,
    removeMediaItem,
    addAppItem,
    removeAppItem,
    publishedMedia
  };
}
