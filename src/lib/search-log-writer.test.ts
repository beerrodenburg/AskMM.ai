import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logSearch } from "./search-log-writer";

const OK_INPUT = {
  query: "how to heal eczema",
  status: "ok" as const,
  resultCount: 3,
  durationMs: 1200,
};

describe("logSearch", () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "test-service-key";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
  });

  it("posts the built row to the searches endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await logSearch(OK_INPUT);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.supabase.co/rest/v1/searches");
    expect(init.method).toBe("POST");
    expect(init.headers.apikey).toBe("test-service-key");
    expect(init.headers.Authorization).toBe("Bearer test-service-key");
    expect(JSON.parse(init.body)).toEqual({
      query: "how to heal eczema",
      session_id: null,
      source: "typed",
      status: "ok",
      result_count: 3,
      duration_ms: 1200,
      error: null,
    });
  });

  it("does nothing when the environment is not configured", async () => {
    delete process.env.SUPABASE_SECRET_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await logSearch(OK_INPUT);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("swallows a rejected fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(logSearch(OK_INPUT)).resolves.toBeUndefined();
  });

  it("swallows a non-2xx response but warns about it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("forbidden", { status: 403 }))
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(logSearch(OK_INPUT)).resolves.toBeUndefined();

    expect(warn).toHaveBeenCalledTimes(1);
    const message = warn.mock.calls[0].join(" ");
    expect(message).toContain("403");
    expect(message).toContain("forbidden");
    // Never the credential, the headers, or the row itself.
    expect(message).not.toContain("test-service-key");

    warn.mockRestore();
  });

  it("warns even when the error body cannot be read", async () => {
    const unreadable = new Response("", { status: 500 });
    Object.defineProperty(unreadable, "text", {
      value: () => Promise.reject(new Error("stream broken")),
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(unreadable));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(logSearch(OK_INPUT)).resolves.toBeUndefined();

    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("stays silent on a 2xx response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 201 })));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await logSearch(OK_INPUT);

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
