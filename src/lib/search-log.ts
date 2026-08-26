// Pure helpers for building a row for the `searches` table. No I/O, no Next
// imports — everything here is unit-testable in isolation.

export type SearchSource = "typed" | "chip";
export type SearchStatus = "ok" | "empty" | "error";

/**
 * Application-side cap on the two free-text columns of `searches`
 * (pipeline/sql/004_searches.sql). The SQL columns are unbounded `text`; this
 * limit exists only so a pathological payload cannot bloat the table.
 */
const MAX_TEXT = 500;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface SearchLogInput {
  query: string;
  sessionId?: unknown;
  source?: unknown;
  status: SearchStatus;
  resultCount?: number | null;
  durationMs: number;
  error?: string | null;
}

export interface SearchLogRow {
  query: string;
  session_id: string | null;
  source: SearchSource;
  status: SearchStatus;
  result_count: number | null;
  duration_ms: number;
  error: string | null;
}

function truncate(value: string): string {
  return value.length > MAX_TEXT ? value.slice(0, MAX_TEXT) : value;
}

/**
 * The session id arrives from the browser, so it is untrusted. Anything that
 * is not a UUID becomes null rather than throwing — a malformed value must
 * never cost us the row, and must never reach a `uuid` column as a string.
 */
function normalizeSessionId(value: unknown): string | null {
  return typeof value === "string" && UUID_RE.test(value) ? value : null;
}

/** Unknown values fall back to 'typed' — the CHECK constraint allows only two. */
function normalizeSource(value: unknown): SearchSource {
  return value === "chip" ? "chip" : "typed";
}

export function buildSearchLogRow(input: SearchLogInput): SearchLogRow {
  return {
    query: truncate(input.query),
    session_id: normalizeSessionId(input.sessionId),
    source: normalizeSource(input.source),
    status: input.status,
    result_count:
      typeof input.resultCount === "number" ? input.resultCount : null,
    duration_ms: Math.round(input.durationMs),
    // typeof, not truthiness: new Error("") must still record an `error` row
    // with an empty reason rather than silently becoming null.
    error: typeof input.error === "string" ? truncate(input.error) : null,
  };
}

export interface SearchOutcome {
  status: SearchStatus;
  resultCount: number | null;
  error: string | null;
}

/**
 * Classifies an n8n response body. Anything without a real `results` array is
 * an `error`, never an `empty`: `empty` rows are the questions the corpus
 * could not answer and are the highest-value rows in the table, so an
 * unusable response must never be filed among them.
 */
export function deriveOutcome(data: unknown): SearchOutcome {
  const results = (data as { results?: unknown } | null | undefined)?.results;

  if (!Array.isArray(results)) {
    return {
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    };
  }

  return {
    status: results.length > 0 ? "ok" : "empty",
    resultCount: results.length,
    error: null,
  };
}
