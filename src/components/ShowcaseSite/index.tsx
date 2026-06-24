import React, { useState, useEffect } from 'react';
import { MonitorPlay, Settings, Grid2X2, LayoutDashboard, Bone } from 'lucide-react';
import { useShowcaseData } from './hooks/useShowcaseData';
import { hashPassword } from './utils';
import { ADMIN_LOCK_KEY } from './constants';
import { AdminView } from './views/AdminView';
import { GalleryView } from './views/GalleryView';
import { AdminLockPanel } from './components/AdminLockPanel';

export default function ShowcaseSite({
  onOpenEditor,
  onOpenRigLab,
}: {
  onOpenEditor: () => void;
  onOpenRigLab: () => void;
}) {
  const {
    mediaItems, apps, addMediaItem, addLocalMediaItems, removeMediaItem,
    addAppItem, removeAppItem, publishedMedia
  } = useShowcaseData();

  const [selectedMediaId, setSelectedMediaId] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [siteMode, setSiteMode] = useState<'admin' | 'gallery'>('gallery');
  const [adminPasswordHash, setAdminPasswordHash] = useState<string | null>(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [adminLockError, setAdminLockError] = useState('');

  useEffect(() => {
    if (mediaItems.length > 0 && !selectedMediaId) setSelectedMediaId(mediaItems[0].id);
    if (apps.length > 0 && !selectedAppId) setSelectedAppId(apps[0].id);
  }, [mediaItems, apps, selectedMediaId, selectedAppId]);

  useEffect(() => {
    setAdminPasswordHash(localStorage.getItem(ADMIN_LOCK_KEY));
  }, []);

  const handleAdminLockSubmit = async () => {
    const trimmed = adminPassword.trim();
    setAdminLockError('');

    if (trimmed.length < 4) {
      setAdminLockError('4文字以上で入力してください。');
      return;
    }

    if (!adminPasswordHash) {
      if (adminPassword !== adminPasswordConfirm) {
        setAdminLockError('確認用パスワードが一致しません。');
        return;
      }
      const nextHash = await hashPassword(adminPassword);
      localStorage.setItem(ADMIN_LOCK_KEY, nextHash);
      setAdminPasswordHash(nextHash);
      setIsAdminUnlocked(true);
      setAdminPassword('');
      setAdminPasswordConfirm('');
      return;
    }

    const inputHash = await hashPassword(adminPassword);
    if (inputHash !== adminPasswordHash) {
      setAdminLockError('パスワードが違います。');
      return;
    }

    setIsAdminUnlocked(true);
    setAdminPassword('');
    setAdminPasswordConfirm('');
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-teal-500/30 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-900/50">
              <MonitorPlay size={24} />
            </div>
            <div>
              <p className="text-base font-black text-white tracking-wide">Media App Showcase</p>
              <p className="text-xs font-semibold text-zinc-500 tracking-wider">PORTFOLIO / SHOWCASE</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-white/10 bg-[#111] p-1 shadow-inner">
              <button
                onClick={() => setSiteMode('admin')}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  siteMode === 'admin' ? 'bg-[#222] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Settings size={16} /> 管理画面
              </button>
              <button
                onClick={() => setSiteMode('gallery')}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  siteMode === 'gallery' ? 'bg-teal-600 text-white shadow-md shadow-teal-900/50' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Grid2X2 size={16} /> ギャラリー
              </button>
            </div>
            <button
              onClick={onOpenEditor}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0"
            >
              <LayoutDashboard size={18} /> Editor
            </button>
            <button
              onClick={onOpenRigLab}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-900/50 transition-all hover:bg-sky-500 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Bone size={18} /> Rig Lab
            </button>
          </div>
        </div>
      </header>

      {siteMode === 'admin' ? (
        isAdminUnlocked ? (
          <AdminView
            mediaItems={mediaItems} apps={apps}
            addMedia={addMediaItem} addLocalMediaItems={addLocalMediaItems} removeMedia={removeMediaItem}
            addApp={addAppItem} removeApp={removeAppItem}
            selectedMediaId={selectedMediaId} setSelectedMediaId={setSelectedMediaId}
            selectedAppId={selectedAppId} setSelectedAppId={setSelectedAppId}
            onOpenEditor={onOpenEditor} onOpenRigLab={onOpenRigLab}
          />
        ) : (
          <AdminLockPanel
            hasPassword={!!adminPasswordHash}
            password={adminPassword}
            confirmPassword={adminPasswordConfirm}
            error={adminLockError}
            onPasswordChange={setAdminPassword}
            onConfirmPasswordChange={setAdminPasswordConfirm}
            onSubmit={handleAdminLockSubmit}
          />
        )
      ) : (
        <GalleryView
          publishedMedia={publishedMedia} apps={apps}
          setSiteMode={setSiteMode} selectedMediaId={selectedMediaId} setSelectedMediaId={setSelectedMediaId}
          onOpenEditor={onOpenEditor} onOpenRigLab={onOpenRigLab}
        />
      )}
    </div>
  );
}
