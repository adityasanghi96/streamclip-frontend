const EVENT = "streamclip-toast";

export const ALREADY_LINKED_TOAST =
  "This account is already linked. Contact admin to unlink the existing account and try again.";

export function showToast(message: string, kind: "error" | "ok" = "error") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { message, kind } }));
}

export function onToast(listener: (message: string, kind: "error" | "ok") => void) {
  function handle(event: Event) {
    const detail = (event as CustomEvent<{ message?: string; kind?: "error" | "ok" } | string>).detail;
    if (typeof detail === "string") listener(detail, "error");
    else if (detail?.message) listener(detail.message, detail.kind || "error");
  }
  window.addEventListener(EVENT, handle);
  return () => window.removeEventListener(EVENT, handle);
}

export function isAlreadyLinkedError(message: string) {
  return /already linked/i.test(message);
}

export function handleLinkConflict(err: unknown, fallback: (message: string) => void) {
  const message = err instanceof Error ? err.message : "Could not link account";
  if (isAlreadyLinkedError(message)) showToast(ALREADY_LINKED_TOAST);
  else fallback(message);
}
