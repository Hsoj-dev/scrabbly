// train.js
import { select, input } from "@inquirer/prompts";
import gradient from "gradient-string";
import { startingLetters, wordsStartingWith } from "./wordLists.js";
import { tileYellow, tan, wood, error, success } from "./theme.js";

const celebrate = gradient(["#F4C95D", "#A0724A"]); // tile-yellow to wood
const cheers = [
  "Flawless! Your memory is on fire.",
  "Every single one. Nicely done!",
  "Perfect score! The dictionary would be proud.",
];

// Asks for words until you press Enter on an empty line.
// Each line can hold one word or many (spaces or commas).
async function askAnswers() {
  console.log(wood("  Type your words (spaces, commas, or one per line)."));
  console.log(wood("  Press Enter on an empty line when you're done.\n"));

  const answers = [];
  while (true) {
    const line = await input({ message: tileYellow(">") });
    if (line.trim() === "") break;
    answers.push(...line.split(/[\s,]+/).filter(Boolean));
  }
  return answers;
}

// Compares what you typed with the real list
function gradeAnswers(target, answers) {
  const targetSet = new Set(target);
  const given = new Set(answers.map((word) => word.toUpperCase()));

  return {
    correct: target.filter((word) => given.has(word)),
    forgotten: target.filter((word) => !given.has(word)),
    wrong: [...given].filter((word) => !targetSet.has(word)),
  };
}

// Why a typed word doesn't belong
function whyWrong(word, length, letter) {
  if (!/^[A-Z]+$/.test(word)) return "letters only";
  if (word.length !== length) return `not a ${length}-letter word`;
  if (!word.startsWith(letter)) return `doesn't start with ${letter}`;
  return "not a valid word";
}

// One round: ask, grade, show the result. Returns true if perfect.
async function runRound(length, letter) {
  const target = wordsStartingWith(length, letter);
  const count = target.length;

  console.log(
    tileYellow.bold(`\n  List all ${length}-letter words that start with ${letter}`) +
      wood(`  (${count} ${count === 1 ? "word" : "words"})\n`)
  );

  const answers = await askAnswers();
  const { correct, forgotten, wrong } = gradeAnswers(target, answers);
  const perfect = forgotten.length === 0 && wrong.length === 0;

  console.log();

  if (perfect) {
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
    console.log(success.bold(`  ✔ Perfect! All ${target.length} words.`));
    console.log(`  ${celebrate(cheer)}\n`);
    return true;
  }

  if (correct.length > 0) {
    console.log(success(`  ✔ Got ${correct.length}/${target.length}: `) + tan(correct.join(" ")));
  }
  if (forgotten.length > 0) {
    console.log(error(`  ✘ You forgot (${forgotten.length}): `) + tileYellow.bold(forgotten.join(" ")));
  }
  if (wrong.length > 0) {
    console.log(error(`  ✘ Doesn't belong (${wrong.length}):`));
    for (const word of wrong) {
      console.log(`      ${error(word)} ${wood("(" + whyWrong(word, length, letter) + ")")}`);
    }
  }
  console.log();
  return false;
}

async function askLetter(letters) {
  console.log(wood(`\n  Letters you can practice: ${letters.join(" ")}`));
  const answer = await input({
    message: "Which letter?",
    validate: (value) =>
      letters.includes(value.trim().toUpperCase()) ||
      "Pick one of the letters listed above.",
  });
  return answer.trim().toUpperCase();
}

// You choose the letter. Never ends until you quit.
async function trainPick(length) {
  const letters = startingLetters(length);

  while (true) {
    const letter = await askLetter(letters);
    await runRound(length, letter);

    const next = await select({
      message: "What next?",
      choices: [
        { name: "Pick another letter", value: "again" },
        { name: "Quit", value: "quit" },
      ],
    });
    if (next === "quit") return;
  }
}

// Random letters. Ends at your first mistake.
async function trainRandom(length) {
  const letters = startingLetters(length);
  let streak = 0;
  let last = null;

  while (true) {
    // Pick a random letter, but not the same one twice in a row
    let letter;
    do {
      letter = letters[Math.floor(Math.random() * letters.length)];
    } while (letter === last && letters.length > 1);
    last = letter;

    console.log(tan(`\n  Round ${streak + 1}`));
    const perfect = await runRound(length, letter);
    if (!perfect) break;
    streak++;
  }

  const unit = streak === 1 ? "letter" : "letters";
  console.log(tileYellow.bold(`  Game over! ${streak} ${unit} in a row.\n`));
}

export async function showTrain() {
  try {
    console.log(tileYellow.bold("\n  Training Mode\n"));

    const length = await select({
      message: "Which word length?",
      choices: [
        { name: "2-letter words", value: 2 },
        { name: "3-letter words", value: 3 },
      ],
    });

    const mode = await select({
      message: "How do you want to train?",
      choices: [
        { name: "Pick a letter myself", value: "pick" },
        { name: "Random letters (keeps going until you make a mistake)", value: "random" },
      ],
    });

    if (mode === "pick") await trainPick(length);
    else await trainRandom(length);
  } catch (err) {
    // Ctrl+C inside a prompt: exit politely instead of showing an error
    if (err?.name === "ExitPromptError") {
      console.log(tan("\n  Training stopped. See you next time!\n"));
      return;
    }
    throw err;
  }
}