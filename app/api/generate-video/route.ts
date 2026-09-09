import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, config } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Valid prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const systemPrompt = `You are the autonomous hyper-director AI for a cutting-edge video generation agent interface called Hyper Agent.
Analyze the user's video prompt and production config:
Config: Length=${config?.length || '15s'}, Resolution=${config?.resolution || '1080p FHD'}, FPS=${config?.fps || '24 fps'}, Bitrate=${config?.bitrate || '16 Mbps'}, Category=${config?.category || 'Cinematic'}, Voice=${config?.voice || 'Echo Deep Male'}, Tone=${config?.tone || 'Dark Dramatic'}, Dimensions=${config?.dimensions || '16:9'}.

Generate a structured video production plan in JSON format.
Return ONLY valid JSON without markdown formatting or code fences:
{
  "title": "Short punchy title (max 5 words)",
  "cameraMovement": "Detailed cinematic camera movement (e.g., Ultra-wide slow forward tracking dolly at 24mm)",
  "lightingSetup": "High-contrast monochrome chiaroscuro lighting description",
  "voiceoverScript": "Narrative voiceover or script lines matching the tone and length",
  "soundDesign": "Detailed acoustic sound design (ambient drones, sub drops, foley)",
  "styleMode": "noir" | "scifi" | "commercial" | "minimal" | "cyber",
  "beats": [
    {
      "timestamp": "00:00",
      "visual": "Opening visual composition description",
      "camera": "Camera shot type",
      "audio": "Audio cue"
    },
    {
      "timestamp": "00:05",
      "visual": "Mid-shot development and motion",
      "camera": "Camera motion",
      "audio": "Audio transition"
    },
    {
      "timestamp": "00:10",
      "visual": "Climactic resolution visual",
      "camera": "Dynamic framing",
      "audio": "Resolving audio cadence"
    }
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Video Prompt: "${prompt}"\n\nGenerate the autonomous director production brief now.`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);

        return NextResponse.json({
          success: true,
          data: {
            ...parsed,
            prompt,
            config,
          },
        });
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to autonomous agent engine:', geminiErr);
        // Fallback to local autonomous generator below
      }
    }

    // Fallback generator for instant response
    const words = prompt.trim().split(/\s+/);
    const titleCandidate = words.slice(0, 4).join(' ').replace(/[^a-zA-Z0-9\s]/g, '') || 'Autonomous Scene';
    const capitalizedTitle = titleCandidate.charAt(0).toUpperCase() + titleCandidate.slice(1);

    const lengthStr = config?.length || '15s';
    const durationNum = parseInt(lengthStr) || 15;

    let styleMode: 'noir' | 'scifi' | 'commercial' | 'minimal' | 'cyber' = 'noir';
    const lower = prompt.toLowerCase();
    if (lower.includes('cyber') || lower.includes('neon') || lower.includes('tech')) styleMode = 'cyber';
    else if (lower.includes('space') || lower.includes('sci-fi') || lower.includes('future') || lower.includes('drone')) styleMode = 'scifi';
    else if (lower.includes('product') || lower.includes('commercial') || lower.includes('brand') || lower.includes('luxury')) styleMode = 'commercial';
    else if (lower.includes('clean') || lower.includes('simple') || lower.includes('white') || lower.includes('minimal')) styleMode = 'minimal';

    return NextResponse.json({
      success: true,
      data: {
        title: capitalizedTitle,
        cameraMovement: 'Dynamic 35mm orbital dolly with subtle optical breathing',
        lightingSetup: 'Monochromatic high-contrast rim lighting with volumetric shadows',
        voiceoverScript: `In the silence of synthetic space, precision precedes reality. Prompt initiated: "${prompt.slice(0, 80)}..."`,
        soundDesign: 'Deep sub-bass harmonic resonance, tactile metallic clicks, low ambient drone',
        styleMode,
        beats: [
          {
            timestamp: '00:00',
            visual: `Initial geometric reveal framing ${prompt.slice(0, 50)} in stark monochrome`,
            camera: 'Slow pushing tracking shot',
            audio: 'Low-frequency sub rumble and atmospheric pulse',
          },
          {
            timestamp: `00:0${Math.floor(durationNum / 2)}`,
            visual: 'Autonomous particle acceleration and depth-of-field focal pull',
            camera: 'Orbiting Dutch angle transition',
            audio: 'High-frequency resonance surge and synth sweep',
          },
          {
            timestamp: `00:${durationNum < 10 ? '0' + (durationNum - 2) : (durationNum - 2)}`,
            visual: 'Climactic high-contrast convergence with clean graphic finish',
            camera: 'Slow zoom out to centered perspective',
            audio: 'Echoing metallic decay and pure white noise finish',
          },
        ],
        tags: [styleMode.toUpperCase(), config?.category || 'Cinematic', config?.resolution || '1080p', 'AUTONOMOUS'],
        prompt,
        config,
      },
    });
  } catch (error) {
    console.error('Error generating video metadata:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
