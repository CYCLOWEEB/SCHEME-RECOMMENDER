import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, text, language_code = 'hi-IN' } = await req.json();

    const sarvamApiKey = process.env.SARVAM_API_KEY;

    if (!sarvamApiKey) {
      // Graceful fallback response when API key is not yet configured
      return NextResponse.json({
        configured: false,
        message: 'Sarvam AI key not detected. Using client-side Web Speech API & Gemini voice processing.',
        language: language_code,
        text
      });
    }

    if (action === 'tts') {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': sarvamApiKey
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: language_code,
          speaker: 'meera',
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: 'bulbul:v1'
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json({ error: 'Sarvam API error', details: errText, configured: true }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ configured: true, ...data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Sarvam route error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
