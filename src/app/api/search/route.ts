import { after, NextRequest, NextResponse } from "next/server";
import { deriveOutcome } from "@/lib/search-log";
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
      // 25s, comfortably under maxDuration = 30: the route has to outlive its
      // own abort to log it. A platform timeout runs neither the catch nor
      // after(), so a hung n8n would lose exactly the rows worth having.
      // Visible side effect: the client sees our 500, not a Vercel 504.
      signal: AbortSignal.timeout(25_000),
    });

    if (!response.ok) {
      // Elapsed time is read here, not inside after(): after() runs once the
      // response has finished streaming, so measuring in the closure would
      // fold the client's download speed into duration_ms.
      const durationMs = Date.now() - startedAt;

      after(() =>
        logSearch({
          query,
          sessionId,
          source,
          status: "error",
          durationMs,
          error: `n8n responded ${response.status}`,
        })
      );

      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const durationMs = Date.now() - startedAt;
    const outcome = deriveOutcome(data);

    after(() =>
      logSearch({
        query,
        sessionId,
        source,
        durationMs,
        status: outcome.status,
        resultCount: outcome.resultCount,
        error: outcome.error,
      })
    );

    // Unchanged: a malformed body still reaches the browser exactly as before.
    // Only the logged classification distinguishes it from a genuine `empty`.
    return NextResponse.json(data);
  } catch (err) {
    // Covers a malformed request body, an unreachable webhook, and a timeout.
    // A search that never reached n8n is exactly the kind worth recording, so
    // this path logs too — but only once we know there was a query to log.
    if (query) {
      const durationMs = Date.now() - startedAt;

      after(() =>
        logSearch({
          query,
          sessionId,
          source,
          status: "error",
          durationMs,
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
