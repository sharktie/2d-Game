/**
 * Level 3 – Sky Heights
 * ──────────────────────
 * Hard. Big gaps, three enemies, two moving platforms, two checkpoints.
 * Platforms are mostly narrow; landing accuracy matters.
 *
 * (See level1.js for the full format reference / how-to comments.)
 */

export default {
  id:              3,
  name:            'Sky Heights',

  // Tight time limit — you need to move quickly
  timeStarSeconds: 52,

  playerStart: { col: 0, row: 8 },

  flag: { col: 132, row: 3 },

  checkpoints: [
    { col: 52, row: 6 },
    { col: 95, row: 4 }
  ],

  platforms: [
    // Starting pad — shorter than earlier levels, forces an early jump decision
    { col: -3, row: 10, width: 9, height: 2, texture: 'brick' },

    // Quick hop over a decent gap
    { col: 9,  row: 9, width: 4, texture: 'platform' },

    // Tight platform — introduces precision
    { col: 15, row: 8, width: 3, texture: 'platform' },

    // Enemy island — wide enough to navigate around them
    { col: 21, row: 8, width: 8, texture: 'brick' },

    // Short stepping stone
    { col: 31, row: 7, width: 3, texture: 'platform' },

    // Moving platform fills the next gap (defined below)

    // Island after first moving platform
    { col: 40, row: 6, width: 5, texture: 'brick' },

    // Step up
    { col: 47, row: 6, width: 4, texture: 'platform' },

    // Checkpoint 1 — wide breathing room
    { col: 52, row: 6, width: 9, texture: 'brick' },

    // Big gap section — second moving platform helps
    { col: 64, row: 5, width: 4, texture: 'platform' },

    // Short island
    { col: 71, row: 5, width: 3, texture: 'platform' },

    // Second enemy island
    { col: 77, row: 5, width: 8, texture: 'brick' },

    // Step up
    { col: 87, row: 4, width: 4, texture: 'platform' },

    // Checkpoint 2
    { col: 93, row: 4, width: 8, texture: 'brick' },

    // Third enemy
    { col: 103, row: 3, width: 7, texture: 'brick' },

    // Final climb
    { col: 112, row: 3, width: 5, texture: 'platform' },
    { col: 119, row: 3, width: 5, texture: 'platform' },

    // Finish pad
    { col: 126, row: 3, width: 9, texture: 'brick' },
  ],

  // ── COINS (20 total) ──────────────────────────────────────────────────────
  coins: [
    // Opening temptation
    { startCol: 1,  endCol: 4,  row: 8 },

    // Enemy island risk-reward
    { startCol: 22, endCol: 25, row: 6 },

    // Post first moving platform
    { startCol: 41, endCol: 44, row: 4 },

    // Checkpoint 1 breather
    { startCol: 53, endCol: 57, row: 4 },

    // Risky narrow section
    { startCol: 65, endCol: 67, row: 3 },

    // Checkpoint 2 lead-in
    { startCol: 94, endCol: 97, row: 2 },

    // Final stretch — spread out to reward full completion
    { startCol: 127, endCol: 131, row: 1 },
  ],

  enemies: [
    { col: 25, row: 7 },   // patrols first enemy island
    { col: 80, row: 4 },   // patrols second enemy island
    { col: 106, row: 2 }   // guards the final approach
  ],

  movingPlatforms: [
    // First: bridges gap between col 34 and col 40
    { col: 35, row: 6, width: 3, distance: 100, duration: 1600 },

    // Second: bridges wide gap between col 60 and col 64 (faster, trickier)
    { col: 61, row: 5, width: 2, distance: 80, duration: 1200 }
  ]
};
