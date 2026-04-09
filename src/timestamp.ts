const TS_KEYS = ["time", "timestamp", "ts", "@timestamp"];

export const TIMESTAMP_DETECT_KEYS = TS_KEYS;

export function detectTimestamp(obj: Record<string, unknown>): Date | null {
  for (const k of TS_KEYS) {
    if (k in obj) {
      const v = obj[k];
      return parseTimestamp(v);
    }
  }
  return null;
}

export function parseTimestamp(v: unknown): Date | null {
  if (typeof v === "number") {
    if (!Number.isFinite(v)) return null;
    // Heuristic: values > 1e12 are ms; otherwise seconds
    const ms = v > 1e12 ? v : v * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof v === "string") {
    if (!v) return null;
    // numeric-ish string?
    if (/^\d+(\.\d+)?$/.test(v)) {
      const n = Number(v);
      return parseTimestamp(n);
    }
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${h}:${m}:${s}.${ms}`;
}
