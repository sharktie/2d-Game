// LevelRegistry — the single place that maps level IDs to their data files.
// To add a new level:
//   1. Create src/world/Levels/levelN.js using the format in level1.js
//   2. Import it here and add it to the LEVELS map.
//   3. It will automatically appear in the LevelSelector.
import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';
import level4 from './level4.js';
import level5 from './level5.js';
import level6 from './level6.js';
import level7 from './level7.js';

const LEVELS = {
  [level1.id]: level1,
  [level2.id]: level2,
  [level3.id]: level3,
  [level4.id]: level4,
  [level5.id]: level5,
  [level6.id]: level6,
  [level7.id]: level7,
};

// Sorted array of level data (useful for LevelSelector grid)
export const LEVEL_LIST = Object.values(LEVELS).sort((a, b) => a.id - b.id);

// Look up a single level by ID — returns undefined if not found
export function getLevel(id) {
  return LEVELS[id];
}

export default LEVELS;
