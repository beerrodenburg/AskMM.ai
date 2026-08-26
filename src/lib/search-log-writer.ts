import { buildSearchLogRow, type SearchLogInput } from "./search-log";

// Server-only. SUPABASE_SECRET_KEY bypasses row level security, so it must
// never be imported into a "use client" module or prefixed NEXT_PUBLIC_.

/**
 * Writes one row to the `searches` table. Never throws: a logging failure must
 * degrade to a missing row, never to a failed search. Callers invoke this
 * inside `after()`, so nothing here is on the response path.
 */
export async function logSearch(input: SearchLogInput): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  // Unconfigured environments (a preview deploy, a fresh clone) silently skip
  // logging rather than filling the logs with noise on every search.
  if (!url || !key) return;

  try {
    const res = await fetch(`${url}/rest/v1/searches`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        // Ask PostgREST not to return the inserted row — we do not read it.
        Prefer: "return=minimal",
      },
      body: JSON.stringify(buildSearchLogRow(input)),
    });

    // A missing grant, a revoked key or a CHECK violation all come back as a
    // perfectly ordinary response, so without this the only symptom would be
    // an empty table. Warn on the failure path only, and never include the
    // key, the headers or the row.
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn(`[search-log] insert failed: ${res.status} ${detail}`);
    }
  } catch {
    // Deliberately empty. See the doc comment.
  }
}
