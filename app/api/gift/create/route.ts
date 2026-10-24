import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { saveGift } from '@/lib/db';
import { GiftData, PhotoItem } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, recipientName, creatorName, message, theme, photos, expiresInDays } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Gift title and dedication message are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: 'Please upload at least one photo for your 3D gallery.' },
        { status: 400 }
      );
    }

    const giftId = nanoid(10);
    const now = new Date();
    
    let expiresAt: string | undefined = undefined;
    if (expiresInDays && Number(expiresInDays) > 0) {
      const expDate = new Date(now.getTime() + Number(expiresInDays) * 24 * 60 * 60 * 1000);
      expiresAt = expDate.toISOString();
    }

    const sanitizedPhotos: PhotoItem[] = photos.map((p: Partial<PhotoItem>, idx: number) => ({
      id: p.id || nanoid(6),
      url: p.url || '',
      title: p.title || `Memory #${idx + 1}`,
      caption: p.caption || '',
      date: p.date || '',
      orderIndex: typeof p.orderIndex === 'number' ? p.orderIndex : idx,
    }));

    const gift: GiftData = {
      id: giftId,
      title: title.trim(),
      recipientName: recipientName?.trim() || 'My Friend',
      creatorName: creatorName?.trim() || 'Someone special',
      message: message.trim(),
      theme: theme || 'museum',
      photos: sanitizedPhotos,
      createdAt: now.toISOString(),
      expiresAt,
    };

    await saveGift(gift);

    return NextResponse.json({
      success: true,
      id: gift.id,
      url: `/gift/${gift.id}`,
    });
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 });
  }
}
