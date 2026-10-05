// commands.js

export const commands = [
  {
    name: "help",
    args: "[command]",
    description: "Show all commands, or details for one command",
    usages: ["scrabbly help", "scrabbly help [command]"],
    examples: ["scrabbly help find"],
  },
  {
    name: "score",
    args: "[word]",
    description: "Get the point value of a word (? = blank tile, 0 points)",
    usages: ["scrabbly score [word]"],
    examples: ["scrabbly score quiz", 'scrabbly score "q?iz"'],
  },
  {
    name: "validate",
    args: "[word]",
    description: "Check if a word is valid, and see its points",
    usages: ["scrabbly validate [word]"],
    examples: ["scrabbly validate qi", "scrabbly validate quiz"],
  },
  {
    name: "train",
    args: "",
    description: "Training mode: memorize 2- and 3-letter words by letter",
    usages: ["scrabbly train"],
    examples: ["scrabbly train"],
  },
  {
    name: "find",
    args: "[letters]",
    description: "Find valid words from your letters (? = blank tile)",
    usages: [
      "scrabbly find [letters]",
      "scrabbly find --start [prefix]",
      "scrabbly find --end [suffix]",
      "scrabbly find [letters] --min [number]",
    ],
    examples: [
      "scrabbly find eidlf",
      'scrabbly find "ret?ins"',
      "scrabbly find --start qu",
      "scrabbly find --end ing --min 5",
      "scrabbly find retains --start re",
      "scrabbly find eidlf -m 3",
    ],
  },
  {
    name: "master-word",
    args: "",
    description: "Game: find the highest-scoring word from random tiles",
    usages: ["scrabbly master-word"],
    examples: ["scrabbly master-word"],
  },  
  {
    name: "info",
    args: "",
    description: "Rules, history, tips & tricks, letter points, word lists",
    usages: ["scrabbly info"],
    examples: ["scrabbly info"],
  },
  {
    name: "define",
    args: "[word]",
    description: "Look up a word's definition",
    usages: ["scrabbly define [word]"],
    examples: ["scrabbly define zax"],
  },
  {
    name: "favorite",
    args: "[word]",
    description: "Save a word to your favorites",
    usages: ["scrabbly favorite [word]"],
    examples: ["scrabbly favorite jazz"],
  },
  {
    name: "credits",
    args: "",
    description: "See who made Scrabbly",
    usages: ["scrabbly credits"],
    examples: ["scrabbly credits"],
  },
];

// "score" + "[word]" -> "score [word]"
export const label = (cmd) => `${cmd.name} ${cmd.args}`.trim();

export const getCommand = (name) => commands.find((c) => c.name === name);