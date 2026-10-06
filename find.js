// find.js
import { InvalidArgumentError } from "commander";
import { findWords, MAX_LENGTH } from "./finder.js";
import { tileYellow, tan, wood, error } from "./theme.js";

// Checks the value of --min. Commander calls this for us.
export function parseMin(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 2 || number > MAX_LENGTH) {
    throw new InvalidArgumentError(`Must be a whole number from 2 to ${MAX_LENGTH}.`);
  }
  return number;
}

// Prints an error (first line in red, the rest in tan) and marks the command as failed
function fail(lines) {
  console.log();
  console.log(error(`  ${lines[0]}`));
  for (const line of lines.slice(1)) console.log(tan(`  ${line}`));
  console.log();
  process.exitCode = 1;
}

const maxPoints = (words) => words.reduce((max, w) => Math.max(max, w.points), 0);

// Prints one length group in neat columns, starring the highest scorer(s)
function printGroup(group) {
  const plainOf = (w) => `${w.word} (${w.points})`;
  const best = maxPoints(group.words);
  const cellWidth =
    group.words.reduce((max, w) => Math.max(max, plainOf(w).length), 0) + 4;
  const perRow = Math.max(1, Math.floor(((process.stdout.columns || 80) - 4) / cellWidth));
  const count = group.words.length;

  console.log(
    tileYellow.bold(`\n  ${group.length}-letter words`) +
      wood(` (${count})`)
  );

  for (let i = 0; i < count; i += perRow) {
    const row = group.words.slice(i, i + perRow).map((w) => {
      const isBest = w.points === best;
      const pad = " ".repeat(cellWidth - plainOf(w).length - 2);
      return (
        (isBest ? tileYellow.bold(w.word) : tan(w.word)) +
        wood(` (${w.points})`) +
        (isBest ? tileYellow(" ★") : "  ") +
        pad
      );
    });
    console.log("    " + row.join(""));
  }
}

export function showFind(letters, options) {
  const rack = (letters ?? "").toUpperCase();
  const start = (options.start ?? "").toUpperCase();
  const end = (options.end ?? "").toUpperCase();
  const min = options.min;

  // --- Check what the user typed ---
  if (!rack && !start && !end) {
    return fail([
      "Give me some letters, or use --start / --end.",
      "Example: scrabbly find eidlf",
      "Example: scrabbly find --start qu",
    ]);
  }

  if (rack && !/^[A-Z?]+$/.test(rack)) {
    return fail([
      `Can't use "${letters}".`,
      "Use letters A-Z, or ? for a blank tile.",
      'Tip: put quotes around ?, like "ret?ins".',
    ]);
  }

  if (rack && rack.length < 2) {
    return fail(["You need at least 2 tiles to make a word."]);
  }

  if (rack.length > MAX_LENGTH) {
    return fail([`Too many tiles (${rack.length}).`, `Scrabbly works with up to ${MAX_LENGTH} letters.`]);
  }

  for (const [flag, value] of [["--start", start], ["--end", end]]) {
    if (value && !/^[A-Z]+$/.test(value)) {
      return fail([`${flag} only takes letters A-Z.`]);
    }
    if (value.length > MAX_LENGTH) {
      return fail([`${flag} is longer than ${MAX_LENGTH} letters.`, `Scrabbly words are limited to ${MAX_LENGTH} letters.`]);
    }
  }

  if (rack && min > rack.length) {
    return fail([`--min ${min} is longer than your ${rack.length} tiles.`]);
  }

  // --- Search ---
  const groups = findWords({ rack, start, end, min });

  // --- Print ---
  const parts = [];
  if (rack) parts.push(`from ${rack}`);
  if (start) parts.push(`starting with ${start}`);
  if (end) parts.push(`ending with ${end}`);

  console.log(
    tileYellow.bold(`\n  Words ${parts.join(", ")}`) + wood(`  (${min}+ letters)`)
  );

  if (groups.length === 0) {
    console.log(tan("\n  No words found.\n"));
    return;
  }

  groups.forEach(printGroup);

  const all = groups.flatMap((g) => g.words);
  const topScore = maxPoints(all);
  const masters = all.filter((w) => w.points === topScore).map((w) => w.word);

  console.log(tileYellow.bold(`\n  Total: ${all.length} ${all.length === 1 ? "word" : "words"}`));
  console.log(
    `  ${tileYellow.bold("★ Master word:")} ${tileYellow.bold(masters.join(", "))} ` +
      wood(`(${topScore} ${topScore === 1 ? "point" : "points"})\n`)
  );
}