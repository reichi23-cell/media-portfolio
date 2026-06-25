export type ShowcaseMedia = {
  id: string;
  title: string;
  source: string;
  note: string;
  kind: 'url' | 'file';
  mediaType: 'video' | 'image';
  aspectRatio?: string;
  createdAt?: string;
};

export interface ShowcaseApp {
  id: string;
  name: string;
  description: string;
  url: string;
  stack?: string;
  thumbnailUrl?: string;
}

export interface ShowcaseMessage {
  id: string;
  created_at: string;
  content: string;
  contact_info?: string;
  is_read: boolean;
}
