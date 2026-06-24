import React, { useState } from 'react';
import { BadgeInfo, Film, Globe2, PlaySquare, Image as ImageIcon, Plus, Upload, Trash2, ExternalLink } from 'lucide-react';
import { ShowcaseMedia } from '../types';
import { MediaPreview } from '../components/MediaPreview';
import { AppPreview } from '../components/AppPreview';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export function AdminView({
  mediaItems, apps, addMedia, addLocalMediaItems, updateMediaAspectRatio, removeMedia, removeMultipleMedia, addApp, removeApp,
  selectedMediaId, setSelectedMediaId, selectedAppId, setSelectedAppId,
  onOpenEditor, onOpenRigLab
}: any) {
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaSource, setMediaSource] = useState('');
  const [mediaNote, setMediaNote] = useState('');
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [appName, setAppName] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [appStack, setAppStack] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const { t } = useLanguage();
  const selectedApp = apps.find((a: any) => a.id === selectedAppId) || apps[0];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItemIds(mediaItems.map((m: any) => m.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedItemIds.length === 0) return;
    removeMultipleMedia(selectedItemIds);
    setSelectedItemIds([]);
  };

  const calculateAspectRatio = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          resolve(video.videoWidth >= video.videoHeight ? '16:9' : '9:16');
        };
        video.src = url;
      } else {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img.width >= img.height ? '16:9' : '9:16');
        };
        img.src = url;
      }
    });
  };

  const handleAddMedia = () => {
    if (!mediaTitle.trim() || !mediaSource.trim()) return;
    addMedia({
      id: `media-${Date.now()}`,
      title: mediaTitle.trim(),
      source: mediaSource.trim(),
      note: mediaNote.trim(),
      kind: 'url',
      mediaType,
      aspectRatio: '16:9', // Default for URL
    });
    setMediaTitle(''); setMediaSource(''); setMediaNote('');
  };

  const handleAddLocalMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      for (const file of files) {
        const isImage = file.type.startsWith('image/');
        if (!isImage && !file.type.startsWith('video/')) continue;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media_files')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          alert(`${t('admin.uploadFailed')}${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media_files')
          .getPublicUrl(filePath);

        addMedia({
          id: `media-${Date.now()}`,
          title: file.name.replace(/\.[^.]+$/, ''),
          source: publicUrl,
          note: '',
          kind: 'url',
          mediaType: isImage ? 'image' : 'video',
          aspectRatio: await calculateAspectRatio(file),
        });
      }
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleAddApp = () => {
    if (!appName.trim()) return;
    addApp({
      id: `app-${Date.now()}`,
      name: appName.trim(),
      url: appUrl.trim(),
      description: appDescription.trim() || '開発したアプリ',
      stack: appStack.trim() || 'Web app',
    });
    setAppName(''); setAppUrl(''); setAppDescription(''); setAppStack('');
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 xl:grid-cols-[380px_minmax(0,1fr)] animate-in fade-in duration-500">
      <aside className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400"><Film size={20} /></div>
              <h2 className="text-base font-bold text-white">{t('admin.addMedia')}</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 rounded-xl bg-black/40 p-1 border border-white/5">
                <button
                  onClick={() => setMediaType('video')}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    mediaType === 'video' ? 'bg-[#1a1a1a] text-teal-400 shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <PlaySquare size={16} /> {t('admin.video')}
                </button>
                <button
                  onClick={() => setMediaType('image')}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    mediaType === 'image' ? 'bg-[#1a1a1a] text-rose-400 shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <ImageIcon size={16} /> {t('admin.image')}
                </button>
              </div>
              <input value={mediaTitle} onChange={e => setMediaTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-zinc-600" placeholder={t('admin.title')} />
              <input value={mediaSource} onChange={e => setMediaSource(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-zinc-600" placeholder={mediaType === 'video' ? t('admin.urlPlaceholderVideo') : t('admin.urlPlaceholderImage')} />
              <textarea value={mediaNote} onChange={e => setMediaNote(e.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-zinc-600 resize-none" placeholder={t('admin.shortDescription')} />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleAddMedia} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all hover:bg-teal-500 hover:-translate-y-0.5 active:translate-y-0">
                  <Plus size={16} /> {t('admin.add')}
                </button>
                <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white transition-all ${isUploading ? 'bg-white/20 cursor-not-allowed opacity-50' : 'bg-white/5 hover:bg-white/10 hover:-translate-y-0.5'}`}>
                  <Upload size={16} /> {isUploading ? t('admin.uploading') : t('admin.file')}
                  <input className="hidden" type="file" accept="video/*,image/*" multiple onChange={handleAddLocalMedia} disabled={isUploading} />
                </label>
              </div>
              <p className="flex items-start gap-2 text-xs leading-5 text-zinc-500">
                <BadgeInfo className="mt-0.5 shrink-0" size={14} />
                {t('admin.uploadNotice')}
              </p>
            </div>
          </div>
        </section>

        {/* App Section Hidden for now
        <section className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Globe2 size={20} /></div>
              <h2 className="text-base font-bold text-white">{t('admin.addApp')}</h2>
            </div>
            <div className="space-y-4">
              <input value={appName} onChange={e => setAppName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600" placeholder={t('admin.appName')} />
              <input value={appUrl} onChange={e => setAppUrl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600" placeholder={t('admin.appUrl')} />
              <textarea value={appDescription} onChange={e => setAppDescription(e.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600 resize-none" placeholder={t('admin.appDescription')} />
              <input value={appStack} onChange={e => setAppStack(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600" placeholder={t('admin.techStack')} />
              <button onClick={handleAddApp} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-500 hover:-translate-y-0.5 active:translate-y-0">
                <Plus size={16} /> {t('admin.add')}
              </button>
            </div>
          </div>
        </section>
        */}
      </aside>

      <div className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">{t('admin.managedMedia')} ({mediaItems.length})</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input type="checkbox" onChange={handleSelectAll} checked={mediaItems.length > 0 && selectedItemIds.length === mediaItems.length} className="w-4 h-4 rounded border-white/20 bg-black/50 accent-teal-500" />
                <span>すべて選択</span>
              </label>
              <button
                onClick={handleBulkDelete}
                disabled={selectedItemIds.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20"
              >
                <Trash2 size={16} /> 選択した項目を削除 ({selectedItemIds.length})
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item: any) => (
              <div key={item.id} className={`group relative rounded-xl border transition-all flex flex-col ${selectedItemIds.includes(item.id) ? 'border-teal-500 bg-teal-500/10' : 'border-white/10 bg-[#1a1a1a] hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]'}`}>
                
                <div className="absolute top-2 left-2 z-30">
                  <input type="checkbox" checked={selectedItemIds.includes(item.id)} onChange={() => toggleSelection(item.id)} className="w-5 h-5 rounded border-white/20 bg-black/50 accent-teal-500 cursor-pointer" />
                </div>
                <button
                  onClick={() => removeMedia(item)}
                  className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-all hover:bg-rose-500 hover:text-white"
                  title={t('admin.delete')}
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="aspect-video w-full bg-black relative rounded-t-xl overflow-hidden">
                  <MediaPreview media={item} isThumbnail={true} />
                  <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
                </div>
                
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center justify-center h-6 w-6 rounded bg-black/30 ${item.mediaType === 'image' ? 'text-rose-400' : 'text-teal-400'}`}>
                      {item.mediaType === 'image' ? <ImageIcon size={14} /> : <PlaySquare size={14} />}
                    </span>
                    <h3 className="font-bold text-white truncate text-sm flex-1">{item.title}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <div className="flex rounded-lg bg-black/40 p-0.5 border border-white/5">
                      <button
                        onClick={() => updateMediaAspectRatio(item.id, '16:9')}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${item.aspectRatio !== '9:16' ? 'bg-[#222] text-teal-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        16:9 (横長)
                      </button>
                      <button
                        onClick={() => updateMediaAspectRatio(item.id, '9:16')}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${item.aspectRatio === '9:16' ? 'bg-[#222] text-amber-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        9:16 (縦長)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* App Section Hidden for now
        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl flex flex-col h-[500px]">
            <h2 className="mb-4 text-base font-bold text-white">{t('admin.appList')}</h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {apps.map((app: any) => (
                <div key={app.id} className={`group rounded-xl border p-4 transition-all ${selectedAppId === app.id ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/5 bg-black/20 hover:border-white/20'}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => setSelectedAppId(app.id)} className="min-w-0 flex-1 text-left outline-none">
                      <p className="truncate text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{app.name}</p>
                      <p className="mt-1 text-xs text-amber-500/80">{app.stack}</p>
                    </button>
                    <button onClick={() => removeApp(app.id)} className="rounded-lg p-2 text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-400" title={t('admin.delete')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl flex flex-col">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">Featured App</p>
                <h2 className="text-3xl font-black text-white">{selectedApp?.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">{selectedApp?.description}</p>
              </div>
            </div>
            <div className="flex-1 mt-2">
              {selectedApp && <AppPreview app={selectedApp} onOpenEditor={onOpenEditor} onOpenRigLab={onOpenRigLab} />}
            </div>
          </div>
        </section>
        */}
      </div>
    </main>
  );
}
