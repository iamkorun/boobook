import chalk from "chalk";

export type Level = "error" | "warn" | "info" | "debug" | "trace";

const ORDER: Record<Level, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
};

const STRING_MAP: Record<string, Level> = {
  trace: "trace",
  debug: "debug",
  info: "info",
  warn: "warn",
  warning: "warn",
  error: "error",
  err: "error",
  fatal: "error",
  crit: "error",
  critical: "error",
};

// pino numeric levels
const NUMERIC_MAP: Record<number, Level> = {
  10: "trace",
  20: "debug",
  30: "info",
  40: "warn",
  50: "error",
  60: "error",
};

const LEVEL_KEYS = ["level", "severity", "lvl"];

export function detectLevel(obj: Record<string, unknown>): Level | null {
  for (const k of LEVEL_KEYS) {
    if (k in obj) {
      const v = obj[k];
      if (typeof v === "string") {
        const norm = v.trim().toLowerCase();
        if (norm in STRING_MAP) return STRING_MAP[norm];
        return null;
      }
      if (typeof v === "number") {
        if (v in NUMERIC_MAP) return NUMERIC_MAP[v];
        return null;
      }
    }
  }
  return null;
}

export function levelRank(level: Level): number {
  return ORDER[level];
}

export function parseLevelFilter(s: string): Level | null {
  const norm = s.trim().toLowerCase();
  return (STRING_MAP[norm] as Level | undefined) ?? null;
}

export function colorizeLevel(level: Level, useColor: boolean): string {
  const label = level.toUpperCase().padEnd(5);
  if (!useColor) return label;
  switch (level) {
    case "error":
      return chalk.bold.red(label);
    case "warn":
      return chalk.yellow(label);
    case "info":
      return chalk.green(label);
    case "debug":
      return chalk.cyan(label);
    case "trace":
      return chalk.dim(label);
  }
}

export const LEVEL_DETECT_KEYS = LEVEL_KEYS;
