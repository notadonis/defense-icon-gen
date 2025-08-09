import { NextResponse } from 'next/server';
import { sanitizeSvg } from '../../../lib/sanitizeSvg';


export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const systemPrompt = `You generate 24\u00d724 SVG icons with stroke-width=2, stroke=currentColor, fill=none, stroke-linecap=square, stroke-linejoin=miter, stroke-miterlimit=10. Use straight edges, 90/45/30-degree angles, chamfers over curves, and sparse details. Output only a single <svg> element with viewBox=\"0 0 24 24\". No comments.`;

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const svg: string = data?.choices?.[0]?.message?.content?.trim() || '';
    const sanitized = await sanitizeSvg(svg);
    return NextResponse.json({ svg: sanitized });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate icon' }, { status: 500 });
  }
}
