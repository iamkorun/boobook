import chalk from "chalk";
import {
  detectLevel,
  colorizeLevel,
  levelRank,
  LEVEL_DETECT_KEYS,
  type Level,
} from "./levels.js";
import { detectTimestamp, formatTime, TIMESTAMP_DETECT_KEYS } from "./timestamp.js";

const MSG_KEYS = ["message", "msg", "body"];
const ERR_KEYS = ["err", "error"];

export interface FormatOptions {
  exclude?: Set<string>;
  include?: Set<string>;
  minLevel?: Level | null;
  compact?: boolean;
  color?: boolean;
}

export interface FormatResult {
  line: string | null; // null => suppressed
}

export function formatEntry(
  obj: Record<string, unknown>,
  opts: FormatOptions = {},
): FormatResult {
  const useColor = opts.color !== false;
  const level = detectLevel(obj);

  // Level filter
  if (opts.minLevel && level && levelRank(level) < levelRank(opts.minLevel)) {
    return { line: null };
  }
  if (opts.minLevel && !level) {
    // no level detected — pass through
  }

  const ts = detectTimestamp(obj);

  // Collect message
  let message: string | null = null;
  let messageKeyUsed: string | null = null;
  for (const k of MSG_KEYS) {
    if (k in obj) {
      const v = obj[k];
      if (typeof v === "string") {
        message = v;
        messageKeyUsed = k;
        break;
      }
    }
  }

  // Collect error/stack
  let stack: string | null = null;
  let errKeyUsed: string | null = null;
  for (const k of ERR_KEYS) {
    if (k in obj) {
      const v = obj[k];
      if (v && typeof v === "object" && "stack" in (v as object)) {
        const s = (v as { stack: unknown }).stack;
        if (typeof s === "string") {
          stack = s;
          errKeyUsed = k;
        }
      } else if (typeof v === "string") {
        stack = v;
        errKeyUsed = k;
      }
      break;
    }
  }

  // Build "rest" fields
  const reserved = new Set<string>([
    ...LEVEL_DETECT_KEYS,
    ...TIMESTAMP_DETECT_KEYS,
  ]);
  if (messageKeyUsed) reserved.add(messageKeyUsed);
  if (errKeyUsed) reserved.add(errKeyUsed);

  const keys = Object.keys(obj).filter((k) => {
    if (reserved.has(k)) return false;
    if (opts.exclude && opts.exclude.has(k)) return false;
    if (opts.include && !opts.include.has(k)) return false;
    return true;
  });

  const parts: string[] = [];

  if (ts) {
    const t = formatTime(ts);
    parts.push(useColor ? chalk.dim(t) : t);
  }
  if (level) {
    parts.push(colorizeLevel(level, useColor));
  }
  if (message) {
    parts.push(message);
  }

  const kvPairs = keys.map((k) => {
    const raw = `${k}=${stringify(obj[k])}`;
    return useColor ? chalk.dim(raw) : raw;
  });

  let out: string;
  if (opts.compact) {
    out = [...parts, ...kvPairs].join(" ");
  } else {
    out = [...parts, ...kvPairs].join(" ");
    if (stack) {
      const indented = stack
        .split("\n")
        .map((l) => "  " + l)
        .join("\n");
      out += "\n" + (useColor ? chalk.red(indented) : indented);
    }
  }

  return { line: out };
}

function stringify(v: unknown): string {
  if (v === null) return "null";
  if (typeof v === "string") {
    if (/\s/.test(v) || v.includes("=")) return JSON.stringify(v);
    return v;
  }
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
