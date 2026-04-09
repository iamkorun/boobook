import { describe, it, expect } from "vitest";
import { parseLine } from "../src/parser.js";

describe("parseLine", () => {
  it("parses valid JSON object", () => {
    const r = parseLine('{"a":1}');
    expect(r.kind).toBe("json");
    if (r.kind === "json") expect(r.value).toEqual({ a: 1 });
  });

  it("passes through invalid JSON", () => {
    const r = parseLine("not json");
    expect(r.kind).toBe("raw");
  });

  it("passes through broken JSON", () => {
    const r = parseLine('{"a":');
    expect(r.kind).toBe("raw");
  });

  it("passes through empty line", () => {
    const r = parseLine("");
    expect(r.kind).toBe("raw");
  });

  it("passes through whitespace only", () => {
    const r = parseLine("   ");
    expect(r.kind).toBe("raw");
  });

  it("passes through JSON arrays (not objects)", () => {
    const r = parseLine("[1,2,3]");
    expect(r.kind).toBe("raw");
  });
});
