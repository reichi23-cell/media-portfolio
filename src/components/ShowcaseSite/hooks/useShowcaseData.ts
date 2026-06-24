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
          kind: item.kind, note: item.note || "",
          aspectRatio: item.aspect_ratio || "16:9",
          createdAt: item.created_at
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
        kind: item.kind, note: item.note || "",
        aspect_ratio: item.aspectRatio || "16:9"
      });
      if (error) {
        console.error('Error saving media:', error);
        alert(`データベースの保存に失敗しました: ${error.message}`);
      }
    }
  }, []);

  const addLocalMediaItems = useCallback((items: ShowcaseMedia[]) => {
    setMediaItems(prev => [...items, ...prev.filter(i => i.id !== 'sample-media')]);
  }, []);

  const updateMediaAspectRatio = useCallback(async (id: string, newRatio: string) => {
    // Optimistic UI update
    setMediaItems(prev => prev.map(item => item.id === id ? { ...item, aspectRatio: newRatio } : item));

    const { error } = await supabase.from('media_items').update({ aspect_ratio: newRatio }).eq('id', id);
    if (error) {
      console.error('Error updating aspect ratio:', error);
      alert(`アスペクト比の更新に失敗しました: ${error.message}`);
    }
  }, []);

  const removeMediaItem = useCallback(async (itemOrId: string | ShowcaseMedia) => {
    // For backward compatibility during hot reloads
    const item = typeof itemOrId === 'string' ? mediaItems.find(i => i.id === itemOrId) : itemOrId;
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id;

    // Confirm deletion
    if (!window.confirm('本当に削除してもよろしいですか？')) return;

    // Optimistic UI update
    setMediaItems(prev => {
      const next = prev.filter(i => i.id !== id);
      return next.length ? next : initialMedia;
    });

    if (item && item.source.includes('supabase.co')) {
      const urlParts = item.source.split('/media_files/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0]; // Remove query params if any
        await supabase.storage.from('media_files').remove([filePath]);
      }
    }

    // Remove from Supabase
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    if (error) {
      console.error('Error deleting media:', error);
      alert(`データベースからの削除に失敗しました: ${error.message}`);
    }
  }, [mediaItems]);

  const removeMultipleMediaItems = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;
    if (!window.confirm(`${ids.length}件のアイテムを本当に削除してもよろしいですか？`)) return;

    const itemsToDelete = mediaItems.filter(item => ids.includes(item.id));
    
    // Optimistic UI update
    setMediaItems(prev => {
      const next = prev.filter(i => !ids.includes(i.id));
      return next.length ? next : initialMedia;
    });

    // Delete from storage
    const filePaths: string[] = [];
    for (const item of itemsToDelete) {
      if (item.source.includes('supabase.co')) {
        const urlParts = item.source.split('/media_files/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1].split('?')[0];
          filePaths.push(filePath);
        }
      }
    }
    
    if (filePaths.length > 0) {
      await supabase.storage.from('media_files').remove(filePaths);
    }

    // Remove from Supabase DB
    const { error } = await supabase.from('media_items').delete().in('id', ids);
    if (error) {
      console.error('Error deleting multiple media:', error);
      alert(`データベースからの削除に失敗しました: ${error.message}`);
    }
  }, [mediaItems]);

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
    updateMediaAspectRatio,
    removeMediaItem,
    removeMultipleMediaItems,
    addAppItem,
    removeAppItem,
    publishedMedia
  };
}
