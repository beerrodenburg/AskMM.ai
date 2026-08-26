import { after, NextRequest, NextResponse } from "next/server";
import { logSearch } from "@/lib/search-log-writer";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Service configuration error" },
      { status: 500 }
    );
  }

  // Declared out here so the catch block can log what was attempted.
  let query = "";
  let sessionId: unknown;
  let source: unknown;
  const startedAt = Date.now();

  try {
    const body = await request.json();
    query = body.message;
    sessionId = body.sessionId;
    source = body.source;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    query = query.trim();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // sessionId is the literal "search" by contract with the n8n workflow.
      // The real per-visit id is used for logging only.
      body: JSON.stringify({ message: query, sessionId: "search" }),
    });

    if (!response.ok) {
      after(() =>
        logSearch({
          query,
          sessionId,
          source,
          status: "error",
          durationMs: Date.now() - startedAt,
          error: `n8n responded ${response.status}`,
        })
      );

      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const resultCount = Array.isArray(data?.results) ? data.results.length : 0;

    after(() =>
      logSearch({
        query,
        sessionId,
        source,
        status: resultCount > 0 ? "ok" : "empty",
        resultCount,
        durationMs: Date.now() - startedAt,
      })
    );

    return NextResponse.json(data);
  } catch (err) {
    // Covers a malformed request body, an unreachable webhook, and a timeout.
    // A search that never reached n8n is exactly the kind worth recording, so
    // this path logs too — but only once we know there was a query to log.
    if (query) {
      after(() =>
        logSearch({
          query,
          sessionId,
          source,
          status: "error",
          durationMs: Date.now() - startedAt,
          error: err instanceof Error ? err.message : "unknown error",
        })
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
