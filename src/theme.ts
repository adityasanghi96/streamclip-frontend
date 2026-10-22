export const THEME_KEY = "streamclip-theme";
export type ThemeName = "dark" | "light";

export function getTheme(): ThemeName {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(THEME_KEY);
  return saved === "light" ? "light" : "dark";
}

export function applyTheme(theme: ThemeName) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, theme);
  }
}

export function applyStoredTheme() {
  applyTheme(getTheme());
}

export function toggleTheme(): ThemeName {
  const next = getTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
