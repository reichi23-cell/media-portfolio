import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShowcaseMedia, ShowcaseApp } from '../types';
import { initialMedia, initialApps } from '../constants';
import { isImageSource } from '../utils';
import { supabase } from '../../../lib/supabase';

export function useShowcaseData() {
  const [mediaItems, setMediaItems] = useState<ShowcaseMedia[]>(initialMedia);
  const [apps, setApps] = useState<ShowcaseApp[]>(initialApps);

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching media:', error);
        return;
      }

      if (data && data.length > 0) {
        const normalized: ShowcaseMedia[] = data.map(item => ({
          id: item.id,
          title: item.title,
          source: item.source,
          mediaType: item.media_type,
          kind: item.kind
        }));
        setMediaItems(normalized);
      }
    };

    fetchMedia();
    
    // For apps, we keep them static or local for now since it's just media items that are dynamic
    // If you want to also store apps in Supabase, you would create an `apps` table
  }, []);

  const addMediaItem = useCallback(async (item: ShowcaseMedia) => {
    // Optimistic UI update
    setMediaItems(prev => [item, ...prev.filter(i => i.id !== 'sample-media')]);

    // Save to Supabase (if it's not a local file)
    if (item.kind !== 'file') {
      const { error } = await supabase.from('media_items').insert({
        id: item.id,
        title: item.title,
        source: item.source,
        media_type: item.mediaType,
        kind: item.kind
      });
      if (error) {
        console.error('Error saving media:', error);
      }
    }
  }, []);

  const addLocalMediaItems = useCallback((items: ShowcaseMedia[]) => {
    setMediaItems(prev => [...items, ...prev.filter(i => i.id !== 'sample-media')]);
  }, []);

  const removeMediaItem = useCallback(async (id: string) => {
    // Optimistic UI update
    setMediaItems(prev => {
      const next = prev.filter(item => item.id !== id);
      return next.length ? next : initialMedia;
    });

    // Remove from Supabase
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    if (error) {
      console.error('Error deleting media:', error);
    }
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
