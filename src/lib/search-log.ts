// Pure helpers for building a row for the `searches` table. No I/O, no Next
// imports — everything here is unit-testable in isolation.

export type SearchSource = "typed" | "chip";
export type SearchStatus = "ok" | "empty" | "error";

/** Matches the `text` columns in pipeline/sql/003_searches.sql. */
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
    error: input.error ? truncate(input.error) : null,
  };
}
