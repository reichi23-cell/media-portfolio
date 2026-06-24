import React, { useState, useEffect } from 'react';
import { MonitorPlay } from 'lucide-react';
import { useShowcaseData } from './hooks/useShowcaseData';
import { hashPassword } from './utils';
import { ADMIN_LOCK_KEY } from './constants';
import { AdminView } from './views/AdminView';
import { GalleryView } from './views/GalleryView';
import { HomeView } from './views/HomeView';
import { AppGalleryView } from './views/AppGalleryView';
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
  
  const [siteMode, setSiteMode] = useState<'home' | 'video' | 'image' | 'app' | 'admin'>('home');
  const [adminPasswordHash, setAdminPasswordHash] = useState<string | null>(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [adminLockError, setAdminLockError] = useState('');

  // Handle Hash routing for admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setSiteMode('admin');
      } else if (siteMode === 'admin') {
        setSiteMode('home');
      }
    };
    
    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [siteMode]);

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

  const renderContent = () => {
    switch (siteMode) {
      case 'admin':
        return isAdminUnlocked ? (
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
        );
      case 'video':
      case 'image':
        return (
          <GalleryView
            publishedMedia={publishedMedia}
            mediaType={siteMode}
            onBack={() => setSiteMode('home')}
          />
        );
      case 'app':
        return (
          <AppGalleryView
            apps={apps}
            onBack={() => setSiteMode('home')}
            onOpenEditor={onOpenEditor}
            onOpenRigLab={onOpenRigLab}
          />
        );
      case 'home':
      default:
        return <HomeView setSiteMode={setSiteMode} />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-teal-500/30 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <button onClick={() => { window.location.hash = ''; setSiteMode('home'); }} className="flex items-center gap-4 text-left outline-none group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-900/50 transition-transform group-hover:scale-105">
              <MonitorPlay size={24} />
            </div>
            <div>
              <p className="text-base font-black text-white tracking-wide group-hover:text-teal-400 transition-colors">Media App Showcase</p>
              <p className="text-xs font-semibold text-zinc-500 tracking-wider">PORTFOLIO / SHOWCASE</p>
            </div>
          </button>
          
          {/* Header Buttons Removed for Clean Public View */}
        </div>
      </header>

      {renderContent()}
    </div>
  );
}
