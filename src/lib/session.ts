// A random id identifying one browser tab's visit, used only to group that
// visit's searches in the log. It is never joined to a person, an account or
// an IP address, and it disappears when the tab closes.

const KEY = "askmm_session";

export function getSessionId(): string | null {
  try {
    const existing = sessionStorage.getItem(KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
    return id;
  } catch {
    // Private browsing, disabled storage, or server-side rendering. Logging
    // without a session id is fine; failing a search over it is not.
    return null;
  }
}
