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

export type ShowcaseApp = {
  id: string;
  name: string;
  url: string;
  description: string;
  stack: string;
};
