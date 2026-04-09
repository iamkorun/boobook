import { describe, it, expect } from "vitest";
import { detectLevel, parseLevelFilter, levelRank } from "../src/levels.js";

describe("detectLevel", () => {
  it("detects lowercase string", () => {
    expect(detectLevel({ level: "error" })).toBe("error");
    expect(detectLevel({ level: "warn" })).toBe("warn");
    expect(detectLevel({ level: "info" })).toBe("info");
    expect(detectLevel({ level: "debug" })).toBe("debug");
    expect(detectLevel({ level: "trace" })).toBe("trace");
  });

  it("is case-insensitive", () => {
    expect(detectLevel({ level: "ERROR" })).toBe("error");
    expect(detectLevel({ level: "Warn" })).toBe("warn");
    expect(detectLevel({ level: "WARNING" })).toBe("warn");
  });

  it("maps fatal to error", () => {
    expect(detectLevel({ level: "fatal" })).toBe("error");
  });

  it("reads severity and lvl", () => {
    expect(detectLevel({ severity: "info" })).toBe("info");
    expect(detectLevel({ lvl: "debug" })).toBe("debug");
  });

  it("handles pino numeric levels", () => {
    expect(detectLevel({ level: 50 })).toBe("error");
    expect(detectLevel({ level: 40 })).toBe("warn");
    expect(detectLevel({ level: 30 })).toBe("info");
    expect(detectLevel({ level: 60 })).toBe("error");
    expect(detectLevel({ level: 10 })).toBe("trace");
  });

  it("returns null for unknown", () => {
    expect(detectLevel({ level: "weird" })).toBeNull();
    expect(detectLevel({})).toBeNull();
    expect(detectLevel({ level: 99 })).toBeNull();
  });
});

describe("levelRank", () => {
  it("orders correctly", () => {
    expect(levelRank("error")).toBeGreaterThan(levelRank("warn"));
    expect(levelRank("warn")).toBeGreaterThan(levelRank("info"));
    expect(levelRank("info")).toBeGreaterThan(levelRank("debug"));
    expect(levelRank("debug")).toBeGreaterThan(levelRank("trace"));
  });
});

describe("parseLevelFilter", () => {
  it("parses level strings", () => {
    expect(parseLevelFilter("error")).toBe("error");
    expect(parseLevelFilter("WARN")).toBe("warn");
    expect(parseLevelFilter("nope")).toBeNull();
  });
});
