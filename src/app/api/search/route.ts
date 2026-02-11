import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL_V2;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Service configuration error" },
      { status: 500 }
    );
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim(), sessionId: "search" }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
