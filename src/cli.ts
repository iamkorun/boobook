import { Command } from "commander";
import { parseLevelFilter, type Level } from "./levels.js";

export interface CliOptions {
  exclude?: Set<string>;
  include?: Set<string>;
  minLevel?: Level | null;
  compact: boolean;
  color: boolean;
}

function splitCsv(s: string): Set<string> {
  return new Set(
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  );
}

export function parseArgs(argv: string[]): CliOptions {
  const program = new Command();
  program
    .name("boobook")
    .description("Pipe your logs through boobook and actually read them.")
    .version("0.1.0")
    .option("--exclude <fields>", "comma-separated fields to strip")
    .option("--include <fields>", "comma-separated fields to only show")
    .option("--level <lvl>", "suppress lines below this level")
    .option("--compact", "single-line dense mode", false)
    .option("--no-color", "disable color output")
    .allowExcessArguments(true)
    .exitOverride();

  program.parse(argv, { from: "user" });
  const opts = program.opts<{
    exclude?: string;
    include?: string;
    level?: string;
    compact?: boolean;
    color?: boolean;
  }>();

  const forceColor = !!process.env.FORCE_COLOR;
  const ttyColor = process.stdout.isTTY === true;
  const color = opts.color !== false && (ttyColor || forceColor);

  return {
    exclude: opts.exclude ? splitCsv(opts.exclude) : undefined,
    include: opts.include ? splitCsv(opts.include) : undefined,
    minLevel: opts.level ? parseLevelFilter(opts.level) : null,
    compact: !!opts.compact,
    color,
  };
}
