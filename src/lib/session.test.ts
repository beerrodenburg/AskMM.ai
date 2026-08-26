import { afterEach, describe, expect, it, vi } from "vitest";
import { getSessionId } from "./session";

function stubSessionStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("sessionStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  });
  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getSessionId", () => {
  it("returns a uuid", () => {
    stubSessionStorage();
    expect(getSessionId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("returns the same id on repeated calls", () => {
    stubSessionStorage();
    expect(getSessionId()).toBe(getSessionId());
  });

  it("reuses an id already in sessionStorage", () => {
    const store = stubSessionStorage();
    store.set("askmm_session", "3f2504e0-4f89-11d3-9a0c-0305e82c3301");
    expect(getSessionId()).toBe("3f2504e0-4f89-11d3-9a0c-0305e82c3301");
  });

  it("returns null when sessionStorage throws", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {},
    });
    expect(getSessionId()).toBeNull();
  });

  it("returns null when sessionStorage is absent", () => {
    vi.stubGlobal("sessionStorage", undefined);
    expect(getSessionId()).toBeNull();
  });
});
