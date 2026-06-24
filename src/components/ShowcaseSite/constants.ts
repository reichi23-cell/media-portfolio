import { ShowcaseMedia, ShowcaseApp } from './types';

export const STORAGE_KEY = 'veo-showcase-site-v1';
export const ADMIN_LOCK_KEY = 'veo-showcase-admin-lock-v1';

export const initialMedia: ShowcaseMedia[] = [
  {
    id: 'sample-media',
    title: 'Cinematic reel / stills',
    source: '',
    note: '完成動画、生成画像、アプリのスクリーンショットを追加してください。',
    kind: 'url',
    mediaType: 'video',
  },
];

export const initialApps: ShowcaseApp[] = [];
