// dictionary.js
import { readFileSync } from "node:fs";

let allWords = null;

export function getAllWords() {
  if (allWords === null) {
    const text = readFileSync(new URL("./words.txt", import.meta.url), "utf8");
    allWords = new Set(
      text
        .split(/\r?\n/)
        .map((line) => line.trim().toUpperCase())
        .filter((line) => line !== "")
    );
  }
  return allWords;
}

export function isValidWord(word) {
  return getAllWords().has(word.toUpperCase());
}