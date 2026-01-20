import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL is not configured');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    if (!n8nResponse.ok) {
      console.error('n8n webhook error:', n8nResponse.status);
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 502 }
      );
    }

    const data = await n8nResponse.json();

    // n8n returns array: [{"output": "..."}]
    // Extract the response text
    const responseText = Array.isArray(data) && data[0]?.output
      ? data[0].output
      : data.output || data.response || data.message || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const maxDuration = 30;
