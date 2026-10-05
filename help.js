// help.js
import { commands, getCommand, label } from "./commands.js";
import { tileYellow, tan, wood, error } from "./theme.js";

function printCommand(cmd) {
  console.log(tileYellow.bold(`  ${label(cmd)}`));
  console.log(tan(`    ${cmd.description}`));

  console.log(wood("    Usage:"));
  for (const usage of cmd.usages) console.log(tan(`      ${usage}`));

  console.log(wood("    Example:"));
  for (const example of cmd.examples) console.log(tan(`      ${example}`));

  console.log();
}

export function showHelp() {
  console.log(tileYellow.bold("\n  Scrabbly Commands\n"));
  commands.forEach(printCommand);
  console.log(tan("  Tip: run `scrabbly help [command]` to see just one.\n"));
}

export function showCommandHelp(name) {
  console.log();
  const cmd = getCommand(name);

  if (!cmd) {
    console.log(error(`  Unknown command: ${name}`));
    console.log(tan("  Run `scrabbly help` to see all commands.\n"));
    process.exitCode = 1; // tells the terminal "this failed"
    return;
  }

  printCommand(cmd);
}