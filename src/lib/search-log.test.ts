import { describe, expect, it } from "vitest";
import { buildSearchLogRow } from "./search-log";

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
});
