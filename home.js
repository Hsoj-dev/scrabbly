import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import { commands, label } from "./commands.js";
import { tileYellow, tan, wood } from "./theme.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function showHome() {
  const banner = figlet.textSync("Scrabbly", { font: "Standard" });

  const animation = chalkAnimation.karaoke(banner);
  await sleep(4000);
  animation.stop();

  console.log(tan("\n  Train your Scrabble brain, one word at a time.\n"));
  console.log(tileYellow.bold("  Commands:\n"));

  for (const cmd of commands) {
    console.log(
      `  ${tileYellow("scrabbly " + label(cmd).padEnd(20))} ${wood(cmd.description)}`
    );
  }

  console.log(tan("\n  Tip: run `scrabbly help [command]` for details.\n"));
}