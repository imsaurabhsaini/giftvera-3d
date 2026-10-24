import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { draft, tone = 'heartfelt', recipientName = 'my friend' } = await request.json();

    if (!draft || draft.trim().length === 0) {
      return NextResponse.json({ error: 'Please enter some initial thoughts or words.' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `You are an expert poetic and sentimental speechwriter for digital gift experiences.
Rewrite and polish the following draft letter for ${recipientName} in a "${tone}" tone.
Make it deeply touching, evocative of shared memories, and formatted cleanly in 2 to 3 paragraphs.
Do not add meta commentary or markdown headers, just return the polished letter text.

Draft:
${draft}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        const data = await response.json();
        const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generated) {
          return NextResponse.json({ polished: generated.trim() });
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local writer engine:', err);
      }
    }

    // Local Generative Polish Engine (100% Free, zero external dependency fallback)
    const polished = generateLocalPolish(draft, tone, recipientName);
    return NextResponse.json({ polished });
  } catch (error) {
    console.error('AI Writer error:', error);
    return NextResponse.json({ error: 'Failed to polish message' }, { status: 500 });
  }
}

function generateLocalPolish(draft: string, tone: string, recipientName: string): string {
  const cleanDraft = draft.trim();

  switch (tone.toLowerCase()) {
    case 'poetic':
      return `Dearest ${recipientName},

Every memory preserved within this quiet gallery is like a constellations charted across our shared sky. In the spaces between ordinary days, you have painted moments of quiet beauty and enduring joy.

"${cleanDraft}"

May these frames always remind you of the light you bring into every room you enter, and the profound gratitude I hold for every chapter we write together.`;

    case 'romantic':
      return `My darling ${recipientName},

Looking through these photos, my heart is overflowing with all the gentle, unspoken ways you make life magical. Each picture holds a moment where I felt completely home in your smile.

"${cleanDraft}"

Thank you for choosing to walk beside me, for laughter that cures every hard day, and for a love that continues to grow deeper with every sunrise.`;

    case 'playful':
      return `Hey ${recipientName}!

Welcome to your very own personal 3D hall of fame! I gathered some of our absolute greatest hits, chaotic adventures, and unhinged laughter into this virtual gallery.

"${cleanDraft}"

Grab a seat, look around, and don't roast me too hard for the angles. Here's to making a million more ridiculous memories together!`;

    case 'nostalgic':
      return `Dear ${recipientName},

Time moves so quickly, but standing among these captured memories makes everything feel as warm and vivid as yesterday. 

"${cleanDraft}"

Each of these steps led us to where we are today, and I am so profoundly thankful that you've been there through every high, every low, and all the quiet moments in between.`;

    case 'heartfelt':
    default:
      return `Dear ${recipientName},

I built this 3D exhibition for you so we could pause and celebrate just how meaningful our journey together has been. 

"${cleanDraft}"

As you walk through these halls and look at each photograph, I hope you feel just how cherished and appreciated you truly are. Thank you for being such an irreplaceable part of my life.`;
  }
}
