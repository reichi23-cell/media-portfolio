import React, { useState, useEffect } from 'react';
import { MonitorPlay, Home, Lock } from 'lucide-react';
import { useShowcaseData } from './hooks/useShowcaseData';
import { supabase } from '../../lib/supabase';
import { AdminView } from './views/AdminView';
import { GalleryView } from './views/GalleryView';
import { HomeView } from './views/HomeView';
import { AppGalleryView } from './views/AppGalleryView';
import { AdminLockPanel } from './components/AdminLockPanel';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function ShowcaseSiteWrapper(props: any) {
  return (
    <LanguageProvider>
      <ShowcaseSite {...props} />
    </LanguageProvider>
  );
}

function ShowcaseSite({
  onOpenEditor,
  onOpenRigLab,
}: {
  onOpenEditor: () => void;
  onOpenRigLab: () => void;
}) {
  const {
    mediaItems, apps, addMediaItem, addLocalMediaItems, updateMediaAspectRatio, removeMediaItem, removeMultipleMediaItems,
    addAppItem, removeAppItem, publishedMedia
  } = useShowcaseData();

  const [selectedMediaId, setSelectedMediaId] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  
  const [siteMode, setSiteMode] = useState<'home' | 'video' | 'image' | 'app' | 'admin'>('home');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const { t } = useLanguage();

  // Check initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminUnlocked(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setIsAdminUnlocked(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Hash routing for admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setSiteMode('admin');
      } else if (siteMode === 'admin') {
        setSiteMode('home');
      }
    };
    
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [siteMode]);

  useEffect(() => {
    if (mediaItems.length > 0 && !selectedMediaId) setSelectedMediaId(mediaItems[0].id);
    if (apps.length > 0 && !selectedAppId) setSelectedAppId(apps[0].id);
  }, [mediaItems, apps, selectedMediaId, selectedAppId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminUnlocked(false);
  };

  const renderContent = () => {
    switch (siteMode) {
      case 'admin':
        return isAdminUnlocked ? (
          <div className="animate-in fade-in duration-500">
            <div className="mx-auto max-w-7xl px-5 py-4 flex justify-end">
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
            <AdminView
              mediaItems={mediaItems} apps={apps}
              addMedia={addMediaItem} addLocalMediaItems={addLocalMediaItems} 
              updateMediaAspectRatio={updateMediaAspectRatio}
              removeMedia={removeMediaItem} removeMultipleMedia={removeMultipleMediaItems}
              addApp={addAppItem} removeApp={removeAppItem}
              selectedMediaId={selectedMediaId} setSelectedMediaId={setSelectedMediaId}
              selectedAppId={selectedAppId} setSelectedAppId={setSelectedAppId}
              onOpenEditor={onOpenEditor} onOpenRigLab={onOpenRigLab}
            />
          </div>
        ) : (
          <AdminLockPanel onLoginSuccess={() => setIsAdminUnlocked(true)} />
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
          <button onClick={() => { window.location.hash = '#admin'; setSiteMode('admin'); }} className="flex items-center gap-4 text-left outline-none group" title="管理画面へ">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-900/50 transition-transform group-hover:scale-105 group-active:scale-95">
              <MonitorPlay size={24} />
            </div>
            <div>
              <p className="text-base font-black text-white tracking-wide transition-colors">Media App Showcase</p>
              <p className="text-xs font-semibold text-zinc-500 tracking-wider">PORTFOLIO / SHOWCASE</p>
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {siteMode === 'admin' && (
              <button
                onClick={() => { window.location.hash = ''; setSiteMode('home'); }}
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/10 hover:-translate-y-0.5"
              >
                <Home size={18} /> {t('gallery.backToHome')}
              </button>
            )}
          </div>
        </div>
      </header>

      {renderContent()}
    </div>
  );
}
