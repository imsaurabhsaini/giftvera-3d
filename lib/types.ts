export type ThemeType = 'museum' | 'sunset' | 'loft';

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
  date?: string;
  orderIndex: number;
}

export interface GiftData {
  id: string;
  title: string;
  recipientName: string;
  creatorName: string;
  message: string;
  theme: ThemeType;
  musicUrl?: string;
  photos: PhotoItem[];
  createdAt: string;
  expiresAt?: string;
}

export interface PlayerState {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number]; // Euler angles or [x, y, z]
  action?: 'idle' | 'walking' | 'jumping';
  lastUpdated: number;
}

export interface EmoteEvent {
  playerId: string;
  type: 'heart' | 'confetti' | 'clap' | 'wave' | 'sparkles';
  position: [number, number, number];
  timestamp: number;
}
