// scripts\build-words.js
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SOURCE = new URL("../words.txt", import.meta.url);
const OUTPUT_DIR = new URL("../data/", import.meta.url);
const OUTPUT = new URL("../data/words-7.json", import.meta.url);
const MIN_LENGTH = 2;
const MAX_LENGTH = 7;

// 1. Read the file and split it into lines
const lines = readFileSync(SOURCE, "utf8").split(/\r?\n/);

// 2. Clean each line. A Set automatically throws away duplicates.
const words = new Set();
const rejected = [];

for (const line of lines) {
  const word = line.trim().toUpperCase();
  if (word === "") continue; // skip blank lines

  if (!/^[A-Z]+$/.test(word)) {
    rejected.push(line); // contains something other than letters
    continue;
  }
  words.add(word);
}

// 3. Make an empty bucket for each length, then drop each word into its bucket
const buckets = {};
for (let n = MIN_LENGTH; n <= MAX_LENGTH; n++) buckets[n] = [];

for (const word of words) {
  if (word.length >= MIN_LENGTH && word.length <= MAX_LENGTH) {
    buckets[word.length].push(word);
  }
}

// 4. Sort each bucket A to Z, then save
for (const n in buckets) buckets[n].sort();

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(buckets));

// 5. Print a report
console.log(`Lines read:        ${lines.length}`);
console.log(`Unique words:      ${words.size}`);
console.log(`Rejected lines:    ${rejected.length}`);
if (rejected.length > 0) {
  console.log(`  First few: ${rejected.slice(0, 5).join(" | ")}`);
}
console.log("\nSaved to data/words-7.json:");
for (const n in buckets) {
  console.log(`  ${n}-letter words: ${buckets[n].length}`);
}