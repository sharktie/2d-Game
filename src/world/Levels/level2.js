/**
 * Level 2 – Caverns
 * ──────────────────
 * Medium difficulty. Tighter gaps, two enemies, one moving platform.
 * The path zigzags up and down before a big push to the top.
 *
 * (See level1.js for the full format reference / how-to comments.)
 */

export default {
  id:              2,
  name:            'Caverns',

  // Star 3 time limit — tighter than level 1
  timeStarSeconds: 60,

  playerStart: { col: 0, row: 8 },

  flag: { col: 112, row: 3 },

  checkpoints: [
    { col: 56, row: 6 }
  ],

  platforms: [
    // Starting pad
    { col: -3, row: 10, width: 11, height: 2, texture: 'brick' },

    // Across the first gap
    { col: 12, row: 10, width: 4, texture: 'platform' },

    // Drop down a little — cavern feel
    { col: 18, row: 11, width: 5, texture: 'brick' },

    // Back up — trickier hop
    { col: 25, row: 9, width: 5, texture: 'platform' },

    // Enemy patrols
    { col: 32, row: 9, width: 8, texture: 'brick' },

    // Gap + step
    { col: 42, row: 8, width: 4, texture: 'platform' },

    // Wider safe zone before moving platform section
    { col: 48, row: 7, width: 7, texture: 'brick' },

    // Checkpoint area (slightly higher)
    { col: 56, row: 6, width: 9, texture: 'brick' },

    // Moving platform lands between here and the next island
    // (moving platform defined below)

    // Island after moving platform
    { col: 72, row: 5, width: 6, texture: 'platform' },

    // Second enemy territory
    { col: 80, row: 5, width: 8, texture: 'brick' },

    // Climbing section
    { col: 90, row: 4, width: 5, texture: 'platform' },
    { col: 97, row: 3, width: 6, texture: 'platform' },

    // Final stretch
    { col: 105, row: 3, width: 10, texture: 'brick' },
  ],

  // ── COINS (15 total) ──────────────────────────────────────────────────────
  coins: [
    // Opening rush
    { startCol: 1,  endCol: 4,  row: 8 },

    // Low cavern section
    { startCol: 19, endCol: 22, row: 9 },

    // Risky coins on enemy platform
    { startCol: 33, endCol: 36, row: 7 },

    // Checkpoint lead-in
    { startCol: 57, endCol: 60, row: 4 },

    // Final stretch
    { startCol: 106, endCol: 111, row: 1 },
  ],

  enemies: [
    { col: 36, row: 8 },  // patrols brick platform at row 9
    { col: 83, row: 4 }   // patrols second enemy platform
  ],

  movingPlatforms: [
    // Bridges the gap between col 64 and col 72
    { col: 65, row: 5, width: 3, distance: 100, duration: 1800 }
  ]
};
