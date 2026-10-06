// wordLists.js
import { readFileSync } from "node:fs";

let lists = null; // loaded the first time it's needed

function load() {
  if (lists === null) {
    const text = readFileSync(
      new URL("./data/words-7.json", import.meta.url),
      "utf8"
    );
    lists = JSON.parse(text);
  }
  return lists;
}

export function getWordsByLength(length) {
  return load()[length] ?? [];
}

export function wordsStartingWith(length, letter) {
  return getWordsByLength(length).filter((word) => word.startsWith(letter));
}

// Which first letters actually have words of this length
export function startingLetters(length) {
  const first = getWordsByLength(length).map((word) => word[0]);
  return [...new Set(first)].sort();
}