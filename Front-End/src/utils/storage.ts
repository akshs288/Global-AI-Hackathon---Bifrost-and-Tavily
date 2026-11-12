export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}
export const fmtDate = (d: string | number): string => {
  const t = new Date(d);
  return isNaN(t.getTime()) ? String(d) : t.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
