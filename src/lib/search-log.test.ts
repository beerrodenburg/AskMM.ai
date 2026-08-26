import { describe, expect, it } from "vitest";
import { buildSearchLogRow, deriveOutcome } from "./search-log";

const VALID_UUID = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";

describe("buildSearchLogRow", () => {
  it("keeps a well-formed row intact", () => {
    const row = buildSearchLogRow({
      query: "how to heal eczema",
      sessionId: VALID_UUID,
      source: "typed",
      status: "ok",
      resultCount: 12,
      durationMs: 1840,
    });

    expect(row).toEqual({
      query: "how to heal eczema",
      session_id: VALID_UUID,
      source: "typed",
      status: "ok",
      result_count: 12,
      duration_ms: 1840,
      error: null,
    });
  });

  it("truncates a query longer than 500 characters", () => {
    const row = buildSearchLogRow({
      query: "a".repeat(600),
      status: "ok",
      resultCount: 1,
      durationMs: 10,
    });

    expect(row.query).toHaveLength(500);
  });

  it("keeps a query of exactly 500 characters", () => {
    const row = buildSearchLogRow({
      query: "a".repeat(500),
      status: "ok",
      resultCount: 1,
      durationMs: 10,
    });

    expect(row.query).toHaveLength(500);
  });

  it("stores a null session id when the value is not a uuid", () => {
    for (const bad of ["search", "", "not-a-uuid", 42, null, undefined, {}]) {
      const row = buildSearchLogRow({
        query: "q",
        sessionId: bad,
        status: "ok",
        resultCount: 1,
        durationMs: 10,
      });
      expect(row.session_id).toBeNull();
    }
  });

  it("accepts an uppercase uuid", () => {
    const row = buildSearchLogRow({
      query: "q",
      sessionId: VALID_UUID.toUpperCase(),
      status: "ok",
      resultCount: 1,
      durationMs: 10,
    });

    expect(row.session_id).toBe(VALID_UUID.toUpperCase());
  });

  it("falls back to 'typed' for an unrecognised source", () => {
    for (const bad of ["banner", "", 7, null, undefined]) {
      const row = buildSearchLogRow({
        query: "q",
        source: bad,
        status: "ok",
        resultCount: 1,
        durationMs: 10,
      });
      expect(row.source).toBe("typed");
    }
  });

  it("preserves an explicit chip source", () => {
    const row = buildSearchLogRow({
      query: "q",
      source: "chip",
      status: "ok",
      resultCount: 1,
      durationMs: 10,
    });

    expect(row.source).toBe("chip");
  });

  it("records an error row with a null result count", () => {
    const row = buildSearchLogRow({
      query: "q",
      status: "error",
      durationMs: 30000,
      error: "upstream timeout",
    });

    expect(row.status).toBe("error");
    expect(row.result_count).toBeNull();
    expect(row.error).toBe("upstream timeout");
  });

  it("truncates a long error message to 500 characters", () => {
    const row = buildSearchLogRow({
      query: "q",
      status: "error",
      durationMs: 1,
      error: "e".repeat(900),
    });

    expect(row.error).toHaveLength(500);
  });

  it("rounds a fractional duration to an integer", () => {
    const row = buildSearchLogRow({
      query: "q",
      status: "ok",
      resultCount: 1,
      durationMs: 1840.7,
    });

    expect(row.duration_ms).toBe(1841);
  });
  it("keeps an empty-string error as an error rather than null", () => {
    const row = buildSearchLogRow({
      query: "q",
      status: "error",
      durationMs: 1,
      error: "",
    });

    expect(row.error).toBe("");
  });
});

describe("deriveOutcome", () => {
  it("reports ok with the result count when n8n returns results", () => {
    expect(deriveOutcome({ results: [{ a: 1 }, { a: 2 }, { a: 3 }] })).toEqual({
      status: "ok",
      resultCount: 3,
      error: null,
    });
  });

  it("reports ok for exactly one result", () => {
    expect(deriveOutcome({ results: [{ a: 1 }] })).toEqual({
      status: "ok",
      resultCount: 1,
      error: null,
    });
  });

  it("reports empty for a successful response with zero results", () => {
    expect(deriveOutcome({ answerSummary: "", results: [] })).toEqual({
      status: "empty",
      resultCount: 0,
      error: null,
    });
  });

  it("reports error, not empty, when results is missing", () => {
    expect(deriveOutcome({ answerSummary: "something" })).toEqual({
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    });
  });

  it("reports error when results is a string", () => {
    expect(deriveOutcome({ results: "none" })).toEqual({
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    });
  });

  it("reports error when results is null", () => {
    expect(deriveOutcome({ results: null })).toEqual({
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    });
  });

  it("reports error when the body is null", () => {
    expect(deriveOutcome(null)).toEqual({
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    });
  });

  it("reports error when the body is undefined", () => {
    expect(deriveOutcome(undefined)).toEqual({
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    });
  });

  it("reports error when the body is a bare string", () => {
    expect(deriveOutcome("Workflow could not be started")).toEqual({
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    });
  });

  it("reports error when the body is a number", () => {
    expect(deriveOutcome(0)).toEqual({
      status: "error",
      resultCount: null,
      error: "n8n returned no results array",
    });
  });

  it("feeds straight into a row the builder accepts", () => {
    const outcome = deriveOutcome({ results: [] });
    const row = buildSearchLogRow({ query: "q", durationMs: 5, ...outcome });

    expect(row.status).toBe("empty");
    expect(row.result_count).toBe(0);
    expect(row.error).toBeNull();
  });
});
