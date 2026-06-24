import React, { useState } from 'react';
import { BadgeInfo, Film, Globe2, PlaySquare, Image as ImageIcon, Plus, Upload, Trash2, ExternalLink } from 'lucide-react';
import { ShowcaseMedia } from '../types';
import { MediaPreview } from '../components/MediaPreview';
import { AppPreview } from '../components/AppPreview';

export function AdminView({
  mediaItems, apps, addMedia, addLocalMediaItems, removeMedia, addApp, removeApp,
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

  const selectedMedia = mediaItems.find((m: any) => m.id === selectedMediaId) || mediaItems[0];
  const selectedApp = apps.find((a: any) => a.id === selectedAppId) || apps[0];

  const handleAddMedia = () => {
    if (!mediaTitle.trim() || !mediaSource.trim()) return;
    addMedia({
      id: `media-${Date.now()}`,
      title: mediaTitle.trim(),
      source: mediaSource.trim(),
      note: mediaNote.trim() || (mediaType === 'video' ? '制作動画' : '制作画像'),
      kind: 'url',
      mediaType,
    });
    setMediaTitle(''); setMediaSource(''); setMediaNote('');
  };

  const handleAddLocalMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const items = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/')).map((file, i): ShowcaseMedia => {
      const isImage = file.type.startsWith('image/');
      return {
        id: `media-file-${Date.now()}-${i}`,
        title: file.name.replace(/\.[^.]+$/, ''),
        source: URL.createObjectURL(file),
        note: `ローカルプレビュー用${isImage ? '画像' : '動画'}`,
        kind: 'file',
        mediaType: isImage ? 'image' : 'video',
      };
    });
    if (items.length) {
      addLocalMediaItems(items);
      setSelectedMediaId(items[0].id);
    }
    event.target.value = '';
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
              <h2 className="text-base font-bold text-white">メディアを追加</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 rounded-xl bg-black/40 p-1 border border-white/5">
                <button
                  onClick={() => setMediaType('video')}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    mediaType === 'video' ? 'bg-[#1a1a1a] text-teal-400 shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <PlaySquare size={16} /> 動画
                </button>
                <button
                  onClick={() => setMediaType('image')}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    mediaType === 'image' ? 'bg-[#1a1a1a] text-rose-400 shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <ImageIcon size={16} /> 画像
                </button>
              </div>
              <input value={mediaTitle} onChange={e => setMediaTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-zinc-600" placeholder="タイトル" />
              <input value={mediaSource} onChange={e => setMediaSource(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-zinc-600" placeholder={mediaType === 'video' ? 'YouTube / Vimeo / mp4 URL' : '画像URL'} />
              <textarea value={mediaNote} onChange={e => setMediaNote(e.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-zinc-600 resize-none" placeholder="短い説明" />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleAddMedia} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all hover:bg-teal-500 hover:-translate-y-0.5 active:translate-y-0">
                  <Plus size={16} /> 追加
                </button>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5">
                  <Upload size={16} /> ファイル
                  <input className="hidden" type="file" accept="video/*,image/*" multiple onChange={handleAddLocalMedia} />
                </label>
              </div>
              <p className="flex items-start gap-2 text-xs leading-5 text-zinc-500">
                <BadgeInfo className="mt-0.5 shrink-0" size={14} />
                URLは保存されます。ローカルファイルはブラウザを閉じるまでのプレビューです。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Globe2 size={20} /></div>
              <h2 className="text-base font-bold text-white">アプリを追加</h2>
            </div>
            <div className="space-y-4">
              <input value={appName} onChange={e => setAppName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600" placeholder="アプリ名" />
              <input value={appUrl} onChange={e => setAppUrl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600" placeholder="アプリURL" />
              <textarea value={appDescription} onChange={e => setAppDescription(e.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600 resize-none" placeholder="アプリの説明" />
              <input value={appStack} onChange={e => setAppStack(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600" placeholder="技術スタック" />
              <button onClick={handleAddApp} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-500 hover:-translate-y-0.5 active:translate-y-0">
                <Plus size={16} /> 追加
              </button>
            </div>
          </div>
        </section>
      </aside>

      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
          <div className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl flex flex-col">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 mb-2">Featured Media</p>
                <h1 className="text-3xl font-black text-white">{selectedMedia.title}</h1>
              </div>
              {selectedMedia.source && (
                <a href={selectedMedia.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white">
                  <ExternalLink size={16} /> 開く
                </a>
              )}
            </div>
            <div className="flex-1 aspect-video overflow-hidden rounded-xl bg-[#050505] border border-white/5 shadow-inner">
              <MediaPreview media={selectedMedia} />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400">{selectedMedia.note}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl flex flex-col h-[600px]">
            <h2 className="mb-4 text-base font-bold text-white">メディアリスト</h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {mediaItems.map((item: any) => (
                <div key={item.id} className={`group flex items-center gap-3 rounded-xl border p-3 transition-all ${selectedMediaId === item.id ? 'border-teal-500/50 bg-teal-500/10' : 'border-white/5 bg-black/20 hover:border-white/20'}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${item.mediaType === 'image' ? 'bg-rose-500/10 text-rose-400' : 'bg-teal-500/10 text-teal-400'}`}>
                    {item.mediaType === 'image' ? <ImageIcon size={18} /> : <PlaySquare size={18} />}
                  </span>
                  <button onClick={() => setSelectedMediaId(item.id)} className="min-w-0 flex-1 text-left outline-none">
                    <p className="truncate text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{item.title}</p>
                    <p className="truncate text-xs text-zinc-500">{item.kind === 'file' ? 'Local file' : item.source || 'No URL'}</p>
                  </button>
                  <button onClick={() => removeMedia(item.id)} className="rounded-lg p-2 text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-400" title="削除">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-xl flex flex-col h-[500px]">
            <h2 className="mb-4 text-base font-bold text-white">アプリリスト</h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {apps.map((app: any) => (
                <div key={app.id} className={`group rounded-xl border p-4 transition-all ${selectedAppId === app.id ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/5 bg-black/20 hover:border-white/20'}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => setSelectedAppId(app.id)} className="min-w-0 flex-1 text-left outline-none">
                      <p className="truncate text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{app.name}</p>
                      <p className="mt-1 text-xs text-amber-500/80">{app.stack}</p>
                    </button>
                    <button onClick={() => removeApp(app.id)} className="rounded-lg p-2 text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-400" title="削除">
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
                <h2 className="text-3xl font-black text-white">{selectedApp.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">{selectedApp.description}</p>
              </div>
            </div>
            <div className="flex-1 mt-2">
              <AppPreview app={selectedApp} onOpenEditor={onOpenEditor} onOpenRigLab={onOpenRigLab} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
