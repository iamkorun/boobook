import { describe, it, expect, beforeAll } from "vitest";
import chalk from "chalk";
import { formatEntry } from "../src/formatter.js";

beforeAll(() => {
  chalk.level = 3;
});

const noColor = { color: false };

describe("formatEntry", () => {
  it("promotes message and shows level", () => {
    const r = formatEntry({ level: "info", msg: "hello" }, noColor);
    expect(r.line).toContain("INFO");
    expect(r.line).toContain("hello");
  });

  it("colorizes level when color on", () => {
    const r = formatEntry({ level: "error", msg: "boom" }, { color: true });
    // chalk color codes present
    expect(r.line).toMatch(/\u001b\[/);
    expect(r.line).toContain("ERROR");
  });

  it("plain output without color", () => {
    const r = formatEntry({ level: "info", msg: "hi" }, noColor);
    expect(r.line).not.toMatch(/\u001b\[/);
  });

  it("excludes fields", () => {
    const r = formatEntry(
      { level: "info", msg: "x", secret: "hide", keep: "yes" },
      { color: false, exclude: new Set(["secret"]) },
    );
    expect(r.line).not.toContain("secret");
    expect(r.line).toContain("keep=yes");
  });

  it("include filter keeps only specified extras", () => {
    const r = formatEntry(
      { level: "info", msg: "x", a: 1, b: 2, c: 3 },
      { color: false, include: new Set(["a"]) },
    );
    expect(r.line).toContain("a=1");
    expect(r.line).not.toContain("b=2");
    expect(r.line).not.toContain("c=3");
  });

  it("suppresses lines below minLevel", () => {
    const r = formatEntry(
      { level: "debug", msg: "noise" },
      { color: false, minLevel: "warn" },
    );
    expect(r.line).toBeNull();
  });

  it("does not suppress lines at or above minLevel", () => {
    const r = formatEntry(
      { level: "error", msg: "oops" },
      { color: false, minLevel: "warn" },
    );
    expect(r.line).not.toBeNull();
  });

  it("compact mode single line with no stack newline", () => {
    const r = formatEntry(
      { level: "error", msg: "boom", err: { stack: "Error: boom\n  at x" } },
      { color: false, compact: true },
    );
    expect(r.line).not.toContain("\n");
  });

  it("renders error stack on new lines in non-compact mode", () => {
    const r = formatEntry(
      { level: "error", msg: "boom", err: { stack: "Error: boom\n    at foo" } },
      { color: false },
    );
    expect(r.line).toContain("\n");
    expect(r.line).toContain("at foo");
  });

  it("renders timestamp", () => {
    const r = formatEntry(
      { level: "info", msg: "hi", time: 1712640000000 },
      noColor,
    );
    expect(r.line).toMatch(/\d\d:\d\d:\d\d\.\d\d\d/);
  });
});
