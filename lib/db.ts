import fs from 'fs';
import path from 'path';
import { GiftData } from './types';

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'gifts')
  : path.join(process.cwd(), 'data', 'gifts');

const MEMORY_CACHE = new Map<string, GiftData>();

function ensureDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore in read-only environment
  }
}

// Sample fallback gift for testing immediately
const DEMO_GIFT: GiftData = {
  id: 'demo',
  title: 'Our Journey Across The Stars',
  recipientName: 'Sophia',
  creatorName: 'Leo',
  message: `Dear Sophia,

Every photo in this gallery marks a moment where time stood completely still for me. From the midnight rooftops in Tokyo to the quiet morning coffee runs, every step has been an adventure with you.

Walk around, explore these memories we built together, and know that this is only the first chapter of our story.

With all my love,
Leo`,
  theme: 'museum',
  createdAt: new Date().toISOString(),
  photos: [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      title: 'Golden Hour In Venice',
      caption: 'The afternoon we got completely lost and found that hidden espresso bar.',
      date: 'June 2023',
      orderIndex: 0,
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      title: 'Under the Starlit Ridge',
      caption: 'Freezing cold mountain air, hot cocoa in thermoses, and infinite shooting stars.',
      date: 'September 2023',
      orderIndex: 1,
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      title: 'Midnight Carnival Lights',
      caption: 'You insisted we ride the ferris wheel three times just to see the city lights.',
      date: 'December 2023',
      orderIndex: 2,
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      title: 'First Dip In The Pacific',
      caption: 'Salty ocean air, sunscreen, and laughing until our stomachs hurt.',
      date: 'March 2024',
      orderIndex: 3,
    },
    {
      id: 'p5',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      title: 'The Rainstorm Rooftop',
      caption: 'Dancing in the torrential downpour while everyone else ran for shelter.',
      date: 'May 2024',
      orderIndex: 4,
    },
    {
      id: 'p6',
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      title: 'Roadtrip Highway 1',
      caption: 'Singing 80s rock songs with windows down and ocean cliffs on our right.',
      date: 'August 2024',
      orderIndex: 5,
    },
  ],
};

export async function saveGift(gift: GiftData): Promise<void> {
  MEMORY_CACHE.set(gift.id, gift);
  try {
    ensureDirectory();
    const filePath = path.join(DATA_DIR, `${gift.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(gift, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Could not persist gift ${gift.id} to disk, stored in memory cache:`, err);
  }
}

export async function getGift(id: string): Promise<GiftData | null> {
  if (id === 'demo') {
    return DEMO_GIFT;
  }
  if (MEMORY_CACHE.has(id)) {
    return MEMORY_CACHE.get(id) || null;
  }
  try {
    ensureDirectory();
    const filePath = path.join(DATA_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw) as GiftData;
    MEMORY_CACHE.set(id, data);
    return data;
  } catch (err) {
    console.error(`Error reading gift ${id}:`, err);
    return null;
  }
}
