import { NextRequest, NextResponse } from 'next/server';
import { getGift } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Missing gift ID' }, { status: 400 });
    }

    const gift = await getGift(id);
    if (!gift) {
      return NextResponse.json({ error: 'Gift not found or has expired' }, { status: 404 });
    }

    // Check expiration if set
    if (gift.expiresAt) {
      const exp = new Date(gift.expiresAt).getTime();
      if (Date.now() > exp) {
        return NextResponse.json({ error: 'This gift has expired' }, { status: 410 });
      }
    }

    return NextResponse.json(gift);
  } catch (error) {
    console.error('Error fetching gift:', error);
    return NextResponse.json({ error: 'Failed to fetch gift' }, { status: 500 });
  }
}
