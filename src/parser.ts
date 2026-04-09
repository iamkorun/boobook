export type ParsedLine =
  | { kind: "json"; value: Record<string, unknown>; raw: string }
  | { kind: "raw"; line: string };

export function parseLine(line: string): ParsedLine {
  const trimmed = line.trim();
  if (!trimmed) return { kind: "raw", line };
  if (trimmed[0] !== "{" && trimmed[0] !== "[") {
    return { kind: "raw", line };
  }
  try {
    const v = JSON.parse(trimmed);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return { kind: "json", value: v as Record<string, unknown>, raw: line };
    }
    return { kind: "raw", line };
  } catch {
    return { kind: "raw", line };
  }
}
