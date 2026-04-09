import { describe, it, expect } from "vitest";
import { detectTimestamp, parseTimestamp, formatTime } from "../src/timestamp.js";

describe("parseTimestamp", () => {
  it("parses epoch ms", () => {
    const d = parseTimestamp(1712640000000);
    expect(d).toBeInstanceOf(Date);
    expect(d!.getTime()).toBe(1712640000000);
  });

  it("parses epoch seconds", () => {
    const d = parseTimestamp(1712640000);
    expect(d).toBeInstanceOf(Date);
    expect(d!.getTime()).toBe(1712640000000);
  });

  it("parses ISO string", () => {
    const d = parseTimestamp("2024-04-09T12:00:00.000Z");
    expect(d).toBeInstanceOf(Date);
    expect(d!.toISOString()).toBe("2024-04-09T12:00:00.000Z");
  });

  it("parses numeric string", () => {
    const d = parseTimestamp("1712640000000");
    expect(d!.getTime()).toBe(1712640000000);
  });

  it("returns null for invalid", () => {
    expect(parseTimestamp("not a date")).toBeNull();
    expect(parseTimestamp(null)).toBeNull();
    expect(parseTimestamp(undefined)).toBeNull();
    expect(parseTimestamp(NaN)).toBeNull();
  });
});

describe("detectTimestamp", () => {
  it("detects time/timestamp/ts/@timestamp", () => {
    expect(detectTimestamp({ time: 1712640000000 })).toBeInstanceOf(Date);
    expect(detectTimestamp({ timestamp: 1712640000000 })).toBeInstanceOf(Date);
    expect(detectTimestamp({ ts: 1712640000000 })).toBeInstanceOf(Date);
    expect(detectTimestamp({ "@timestamp": "2024-04-09T00:00:00Z" })).toBeInstanceOf(Date);
  });

  it("returns null when missing", () => {
    expect(detectTimestamp({})).toBeNull();
  });
});

describe("formatTime", () => {
  it("formats HH:MM:SS.mmm", () => {
    const d = new Date(2024, 0, 1, 9, 5, 7, 42);
    expect(formatTime(d)).toBe("09:05:07.042");
  });
});
