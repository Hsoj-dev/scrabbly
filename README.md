# Scrabbly

A colorful command-line Scrabble trainer that helps you memorize words, score plays, and find the best word for your tiles.

<!-- Replace YOUR_CAST_ID in both places with the ID from your asciinema.org upload URL (https://asciinema.org/a/<ID>). -->
[![asciicast](https://asciinema.org/a/YOUR_CAST_ID.svg)](https://asciinema.org/a/YOUR_CAST_ID)

## Try it

```bash
npm install -g scrabbly
scrabbly
```

Then try a few commands:

```bash
scrabbly score quiz
scrabbly find eidlf
scrabbly train
scrabbly master-word
```

## Features

- **`scrabbly`** shows an animated title and a menu of every command.
- **`scrabbly help [command]`** shows usage and examples for every command, or details for just one (`scrabbly help find`).
- **`scrabbly score [word]`** adds up the tile values of a word using the standard Scrabble letter points. A blank tile (`?`) counts as 0.
- **`scrabbly validate [word]`** checks a word against Collins Scrabble Words 2019 (about 279,000 words) and shows its points if it's valid.
- **`scrabbly train`** drills 2-letter and 3-letter words by starting letter.
  - You type every word you can remember for a letter, and Scrabbly tells you which ones you forgot and which ones don't belong.
  - Pick your own letter, or let it pick random letters until you make your first mistake.
  - Each question shows how many words to recall.
- **`scrabbly find [letters]`** lists every valid word you can make from up to 7 tiles.
  - Blank tiles are supported with `?` (put quotes around it in most terminals: `scrabbly find "eidl?"`).
  - Results are grouped by word length, show points for each word, and end with the total word count.
  - The highest-scoring word is marked with a ★ and shown as the master word.
  - `--min` sets the shortest word length, and `--start` / `--end` filter by prefix or suffix (short forms: `-m`, `-s`, `-e`).
- **`scrabbly master-word`** is a game: you get 7 tiles drawn from a real 100-tile Scrabble bag and 3 guesses to find the highest-scoring word. Rounds keep coming until you miss.
- **`scrabbly credits`** shows the version, author, and the packages Scrabbly is built with.

**Coming soon:** 
- `scrabbly info` (rules, history, tips)
- `scrabbly define [word]`
- `scrabbly favorite [word]`.

## How to run it locally

**Requirements**

- Node.js 20 or newer (check with `node -v`).

**Setup**

```bash
git clone https://github.com/Hsoj-dev/scrabbly.git
cd scrabbly
npm install
npm run build-words
```

`npm run build-words` reads `words.txt` and generates `data/words-7.json`, the small by-length word list used by `train`, `find`, and `master-word`. Run it again any time you change `words.txt`.

**Start it**

```bash
npm start
```

To run a specific command while developing, put `--` before the arguments:

```bash
npm start -- score quiz
```

Or run `npm link` once to get the real `scrabbly` command, which points at your local copy.

## How it works

**Two word lists, built from one.** 

The command `validate` needs every word, so it loads all of `words.txt` into a JavaScript `Set`, which answers "is this word in here?" in constant time no matter how big the list is. The file is only read when `validate` runs, so the other commands never pay that cost. `find`, `train`, and `master-word` never need words longer than 7 letters, so a build script (`scripts/build-words.js`) generates `data/words-7.json`, with the words sorted A to Z and bucketed by length. Generating the small list from the big one, instead of maintaining both by hand, means the two can't drift apart. It also means `find eidlf` only scans the 2- to 5-letter buckets, and the largest search (a full 7-tile rack) checks about 77,000 words.

**Searching by counting letters, not by arranging them.** 

To find the words a rack can make, Scrabbly doesn't generate arrangements of your tiles (a 7-tile rack has 5,040 orderings before you even consider shorter words). Instead it goes through the dictionary and, for each word, compares how many of each letter the word needs against how many you hold. Any shortfall has to be covered by blank tiles. Real tiles are scored first, so a blank always counts as 0 points, as in the real game. The same function powers `find`, and `master-word` uses it to work out the best answer for each random rack, so the game never needs a separate answer key.

**Logic and display are kept apart.** 

Functions like `scoreWord`, `findWords`, and `isValidWord` return data and never print anything. The command files (`score.js`, `find.js`, `validate.js`, ...) only handle input checks and output. Every command's description, usage, and examples live in one list (`commands.js`) that feeds both the home menu and the help screens, so each description is written once. [Commander](https://github.com/tj/commander.js) handles argument parsing, and its error output is replaced with a styled version so every mistake, from a missing word to an unknown flag, looks consistent.

## Credits

- **Word list:** [Collins Scrabble Words 2019](https://www.collinsdictionary.com/) (CSW19). Collins Scrabble Words is the property of HarperCollins Publishers.
- **Libraries**
  - [Commander](https://github.com/tj/commander.js) for reading and routing commands
  - [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js) for menus and typed answers
  - [chalk](https://github.com/chalk/chalk) for terminal colors
  - [chalk-animation](https://github.com/bokub/chalk-animation) for the animated title
  - [figlet](https://github.com/patorjk/figlet.js) for the ASCII art banner
  - [gradient-string](https://github.com/bokub/gradient-string) for the color gradients
- **Disclaimer:** Scrabble is a registered trademark of its respective owners (Hasbro in the US and Canada, Mattel elsewhere). Scrabbly is an unofficial fan project and is not affiliated with or endorsed by them.

Made with 💖 by [Hsoj-dev](https://github.com/YOUR-USERNAME).
