import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Service configuration error" },
      { status: 500 }
    );
  }

  // Usage gate
  const deviceId = request.headers.get("X-Device-ID");
  if (!deviceId) {
    return NextResponse.json(
      { error: "Missing device ID" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const usage = await checkAndIncrementUsage(deviceId, userId);
  if (!usage.allowed) {
    return NextResponse.json(
      {
        limitReached: true,
        searchesUsed: usage.searchesUsed,
        searchesLimit: usage.searchesLimit,
      },
      { status: 429 }
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
    return NextResponse.json({
      ...data,
      _usage: { remaining: usage.remaining === Infinity ? null : usage.remaining },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
