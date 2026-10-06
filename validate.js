// validate.js
import { isValidWord } from "./dictionary.js";
import { scoreWord } from "./letterScores.js";
import { tileYellow, tan, wood, error } from "./theme.js";

export function showValidate(word) {
  console.log();

  // Nothing typed after "validate"
  if (!word) {
    console.log(error("  Give me a word to check."));
    console.log(tan("  Example: scrabbly validate quiz\n"));
    process.exitCode = 1;
    return;
  }

  // Handle blank tiles
  if (word.includes("?")) {
    console.log(error("  Validate only checks real letters, so ? isn't allowed."));
    console.log(tan("  Try again with letters A-Z only.\n"));
    process.exitCode = 1;
    return;
  }

  // Anything else that isn't a letter (numbers, symbols, spaces)
  if (!/^[A-Za-z]+$/.test(word)) {
    console.log(error(`  Can't check "${word}".`));
    console.log(tan("  Use letters A-Z only.\n"));
    process.exitCode = 1;
    return;
  }

  const upper = word.toUpperCase();

  if (isValidWord(upper)) {
    const { total } = scoreWord(upper);
    const unit = total === 1 ? "point" : "points";
    console.log(
      `  ${tileYellow.bold(upper)} ${tan("is a valid word")} ` +
        `${wood("·")} ${tileYellow.bold(total)} ${tan(unit)}\n`
    );
  } else {
    console.log(`  ${tileYellow.bold(upper)} ${error("is not a valid word")}\n`);
  }
}