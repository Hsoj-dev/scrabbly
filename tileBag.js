// tileBag.js
const tileCounts = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9,
  J: 1, K: 1, L: 4, M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6,
  S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1,
  "?": 2,
};

export function drawRack(size) {
  // 1. Put every tile in the bag
  const bag = [];
  for (const [letter, count] of Object.entries(tileCounts)) {
    for (let i = 0; i < count; i++) bag.push(letter);
  }

  // 2. Shuffle the bag (Fisher-Yates: swap each tile with a random earlier one)
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  // 3. Take the first few tiles
  return bag.slice(0, size);
}