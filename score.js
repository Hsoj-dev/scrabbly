// score.js
import { scoreWord } from "./letterScores.js";
import { tileYellow, tan, wood, error } from "./theme.js";

export function showScore(word) {
  console.log();

  // Nothing typed after "score"
  if (!word) {
    console.log(error("  Give me a word to score."));
    console.log(tan("  Example: scrabbly score quiz\n"));
    process.exitCode = 1;
    return;
  }

  const result = scoreWord(word);

  // Something other than a letter or ? was typed
  if (!result.valid) {
    console.log(error(`  Can't score "${word}".`));
    console.log(tan(`  Not allowed: ${result.invalid.join(" ")}`));
    console.log(tan("  Use letters A-Z, or ? for a blank tile.\n"));
    process.exitCode = 1;
    return;
  }

  const unit = result.total === 1 ? "point" : "points";
  console.log(
    `  ${tileYellow.bold(word.toUpperCase())} ${wood("=")} ` +
      `${tileYellow.bold(result.total)} ${tan(unit)}\n`
  );
}