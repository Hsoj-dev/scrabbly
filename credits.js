// credits.js
import terminalLink from "terminal-link";
import pkg from "./packageInfo.js";
import { tileYellow, tan, wood } from "./theme.js";

const packageNotes = {
  "@inquirer/prompts": "Interactive prompts (menus, lists, text input) for training mode and info",
  chalk: "Colors and styles for terminal text",
  "chalk-animation": "Animated text (the pulsing title)",
  figlet: "Big ASCII art letters",
  "gradient-string": "Color gradients in text",
  commander: "Reads and routes the commands you type",
  "terminal-link": "Clickable links in the terminal (for credits and word definitions)",
};

const links = [
  { label: "GitHub", url: "https://github.com/Hsoj-dev/scrabbly" },
];

const canLink = terminalLink.isSupported;

function row(text, url, width) {
  const padding = " ".repeat(Math.max(0, width - text.length));
  const colored = tileYellow(text);
  const shown = canLink ? terminalLink(colored, url) : colored;
  return shown + padding;
}

export function showCredits() {
  console.log(tileYellow.bold(`\n  Scrabbly v${pkg.version}`));
  console.log(tan(`  Made by ${pkg.author}\n`));

  console.log(tileYellow.bold("  Built with:"));
  for (const name of Object.keys(pkg.dependencies)) {
    const note = packageNotes[name] ?? "";
    const npmUrl = `https://www.npmjs.com/package/${name}`;
    console.log(`    ${row(name, npmUrl, 20)} ${wood(note)}`);
  }

  console.log(tileYellow.bold("\n  Links:"));
  for (const { label, url } of links) {
    const extra = canLink ? "" : wood(url);
    console.log(`    ${row(label, url, 17)} ${extra}`);
  }

  console.log();
}