
// master.js
import { select, input } from "@inquirer/prompts";
import { drawRack } from "./tileBag.js";
import { findWords, MAX_LENGTH } from "./finder.js";
import { getWordsByLength } from "./wordLists.js";
import { letterScores } from "./letterScores.js";
import { tile, tileYellow, tan, wood, error, success } from "./theme.js";

const RACK_SIZE = MAX_LENGTH;
const MAX_GUESSES = 3;

const SUBSCRIPT = "₀₁₂₃₄₅₆₇₈₉";
const subscript = (n) =>
  String(n).split("").map((digit) => SUBSCRIPT[digit]).join("");

function showRack(rack) {
  return [...rack]
    .map((letter) => tile(` ${letter}${subscript(letterScores[letter])} `))
    .join(" ");
}

// Builds one puzzle: a rack, every word it can make, and the best word(s)
function newPuzzle() {
  while (true) {
    const rack = drawRack(RACK_SIZE).join("");
    const groups = findWords({ rack, min: 2 });
    if (groups.length === 0) continue; // an unplayable rack (very rare): draw again

    // word -> points, for every word this rack can make
    const playable = new Map(
      groups.flatMap((group) => group.words).map((w) => [w.word, w.points])
    );

    let best = 0;
    for (const points of playable.values()) {
      if (points > best) best = points;
    }
    const masters = [...playable]
      .filter(([, points]) => points === best)
      .map(([word]) => word);

    return { rack, playable, best, masters };
  }
}

// Returns a reason the guess can't be used, or null if it's fine
function problemWith(guess, puzzle, tried) {
  if (!/^[A-Z]+$/.test(guess)) return "Letters A-Z only (no spaces or ?).";
  if (guess.length < 2 || guess.length > RACK_SIZE) {
    return `Words here are 2 to ${RACK_SIZE} letters long.`;
  }
  if (tried.has(guess)) return "You already tried that one.";
  if (!puzzle.playable.has(guess)) {
    return getWordsByLength(guess.length).includes(guess)
      ? "That's a real word, but you don't have the tiles for it."
      : "That's not a valid word.";
  }
  return null;
}

// One round. Returns true if you found the master word.
async function playRound(roundNumber) {
  const puzzle = newPuzzle();
  const tried = new Set();
  let used = 0;

  console.log(tan(`\n  Round ${roundNumber}`));
  console.log(tileYellow.bold("  Find the highest-scoring word you can make:\n"));
  console.log(`  ${showRack(puzzle.rack)}\n`);

  while (used < MAX_GUESSES) {
    const raw = await input({
      message: `Guess ${used + 1}/${MAX_GUESSES}`,
      validate: (value) => value.trim() !== "" || "Type a word.",
    });
    const guess = raw.trim().toUpperCase();

    // Bad guesses don't cost one of 3 tries
    const problem = problemWith(guess, puzzle, tried);
    if (problem) {
      console.log(error(`  ${problem}\n`));
      continue;
    }

    const points = puzzle.playable.get(guess);
    const unit = points === 1 ? "point" : "points";

    // Found it (any word tied for the top score counts)
    if (points === puzzle.best) {
      const others = puzzle.masters.filter((word) => word !== guess);
      console.log(
        success.bold(`\n  ✔ ${guess} is a master word! `) +
          tileYellow.bold(`${points} ${unit}`)
      );
      if (others.length > 0) {
        console.log(wood(`  Also tied for the top: ${others.join(", ")}`));
      }
      console.log();
      return true;
    }

    // Valid, but there's a better one
    used++;
    tried.add(guess);
    const left = MAX_GUESSES - used;
    console.log(
      `${error("  ✘")} ${tileYellow.bold(guess)} ${tan(`is valid (${points} ${unit}), but it's not the master word.`)}` +
        (left > 0 ? wood(` ${left} ${left === 1 ? "guess" : "guesses"} left.\n`) : "\n")
    );
  }

  // Out of guesses: reveal the answer
  const unit = puzzle.best === 1 ? "point" : "points";
  console.log(error("  Out of guesses!"));
  console.log(
    `  ${tan("The master word:")} ${tileYellow.bold(puzzle.masters.join(", "))} ` +
      wood(`(${puzzle.best} ${unit})\n`)
  );
  return false;
}

export async function showMasterWord() {
  try {
    console.log(tileYellow.bold("\n  Master Word\n"));
    console.log(tan(`  You get ${RACK_SIZE} tiles. Find the highest-scoring word you can make.`));
    console.log(tan(`  ${MAX_GUESSES} guesses per round. The game ends at your first miss.`));
    console.log(wood("  ? is a blank tile worth 0 points.\n"));

    await select({
      message: "Ready?",
      choices: [{ name: "Let's play", value: "go" }],
    });

    let round = 1;
    while (await playRound(round)) round++;

    const won = round - 1;
    const unit = won === 1 ? "round" : "rounds";
    console.log(tileYellow.bold(`  Game over! ${won} ${unit} in a row.\n`));
  } catch (err) {
    // Ctrl+C inside a prompt: exit politely instead of showing an error
    if (err?.name === "ExitPromptError") {
      console.log(tan("\n  Game stopped. See you next time!\n"));
      return;
    }
    throw err;
  }
}