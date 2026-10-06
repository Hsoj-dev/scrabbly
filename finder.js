// finder.js
import { getWordsByLength } from "./wordLists.js";
import { letterScores, scoreWord } from "./letterScores.js";

export const MAX_LENGTH = 7;

// "FEED" -> { F: 1, E: 2, D: 1 }
function countLetters(text) {
  const counts = {};
  for (const letter of text) counts[letter] = (counts[letter] ?? 0) + 1;
  return counts;
}

// Can this word be built from the rack?
// Returns its points if yes, or null if no.
function pointsFromRack(word, rackCounts, blanks) {
  let points = 0;
  let blanksNeeded = 0;

  for (const [letter, needed] of Object.entries(countLetters(word))) {
    const have = rackCounts[letter] ?? 0;
    const fromTiles = Math.min(needed, have); // use real tiles first
    points += fromTiles * letterScores[letter];
    blanksNeeded += needed - fromTiles; // the shortfall must come from blanks
  }

  return blanksNeeded <= blanks ? points : null;
}

// Returns groups like: [{ length: 2, words: [{ word: "DE", points: 3 }, ...] }, ...]
export function findWords({ rack = "", start = "", end = "", min = 2 }) {
  const blanks = [...rack].filter((char) => char === "?").length;
  const rackCounts = countLetters(rack.replace(/\?/g, ""));

  // A word can't be longer than the tiles you hold
  const maxLength = rack ? rack.length : MAX_LENGTH;

  const groups = [];

  for (let length = min; length <= maxLength; length++) {
    const words = [];

    // The buckets are already sorted A-Z, and filtering keeps that order
    for (const word of getWordsByLength(length)) {
      if (start && !word.startsWith(start)) continue;
      if (end && !word.endsWith(end)) continue;

      const points = rack
        ? pointsFromRack(word, rackCounts, blanks)
        : scoreWord(word).total;

      if (points === null) continue; // can't be spelled with this rack
      words.push({ word, points });
    }

    if (words.length > 0) groups.push({ length, words });
  }

  return groups;
}