import readline from "node:readline";
import { parseArgs } from "./cli.js";
import { parseLine } from "./parser.js";
import { formatEntry } from "./formatter.js";

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
    terminal: false,
  });

  rl.on("line", (line) => {
    const parsed = parseLine(line);
    if (parsed.kind === "raw") {
      process.stdout.write(parsed.line + "\n");
      return;
    }
    const result = formatEntry(parsed.value, {
      exclude: opts.exclude,
      include: opts.include,
      minLevel: opts.minLevel ?? null,
      compact: opts.compact,
      color: opts.color,
    });
    if (result.line !== null) {
      process.stdout.write(result.line + "\n");
    }
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
