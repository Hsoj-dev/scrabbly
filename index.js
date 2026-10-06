#!/usr/bin/env node

import { Command } from "commander";
import pkg from "./packageInfo.js";
import { showHome } from "./home.js";
import { showHelp, showCommandHelp } from "./help.js";
import { showScore } from "./score.js";
import { showCredits } from "./credits.js";
import { showValidate } from "./validate.js";
import { showTrain } from "./train.js";
import { showFind, parseMin } from "./find.js";
import { showMasterWord } from "./master.js";
import { tan, error } from "./theme.js";

const program = new Command();

program
  .allowExcessArguments(false)
  .configureOutput({
    outputError: (message) => {
      const clean = message.replace(/^error:\s*/i, "").trim();
      const sentence = clean.charAt(0).toUpperCase() + clean.slice(1);
      console.log(error(`\n  ${sentence}\n`));
    },
  });

program
  .name("scrabbly")
  .version(pkg.version)
  .argument("[args...]")
  .action(async (args) => {
    if (args.length > 0) {
      console.log(error(`\n  Unknown command: ${args[0]}`));
      console.log(tan("  Run `scrabbly help` to see what's available.\n"));
      process.exitCode = 1;
      return;
    }
    await showHome();
  });

program
  .command("help [command]")
  .description("Show help")
  .action((name) => (name ? showCommandHelp(name) : showHelp()));

program
  .command("score [word]")
  .description("Get the point value of a word")
  .action(showScore);

program
  .command("validate [word]")
  .description("Check if a word is valid")
  .action(showValidate);

program
  .command("train")
  .description("Training mode")
  .action(showTrain);

program
  .command("find [letters]")
  .description("Find valid words from your letters")
  .option("-s, --start <prefix>", "only words that start with this")
  .option("-e, --end <suffix>", "only words that end with this")
  .option("-m, --min <number>", "shortest word length to show (2-7)", parseMin, 2)
  .action(showFind);

program
  .command("master-word")
  .description("Play the Master Word game")
  .action(showMasterWord);

program
  .command("credits")
  .description("See who made Scrabbly")
  .action(showCredits);

program.outputHelp = () => showHelp();

await program.parseAsync();