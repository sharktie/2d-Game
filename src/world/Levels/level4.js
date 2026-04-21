/**
 * Level 4 – Lava Pits
 * ─────────────────────
 * Hard-to-very-hard. Long gaps over "lava" (bottomless pits), four enemies,
 * two moving platforms (one fast, one very short), and two checkpoints.
 * The terrain dips low in the middle to force the player down before
 * a steep final climb to the flag.
 */

export default {
  id:              4,
  name:            'Lava Pits',

  timeStarSeconds: 58,

  playerStart: { col: 0, row: 8 },

  flag: { col: 150, row: 2 },

  checkpoints: [
    { col: 60, row: 7 },
    { col: 108, row: 4 }
  ],

  platforms: [
    // Starting pad
    { col: -3, row: 10, width: 10, height: 2, texture: 'brick' },

    // First leap of faith — narrow landing
    { col: 13, row: 9, width: 3, texture: 'platform' },

    // Step down — danger pit below
    { col: 19, row: 10, width: 4, texture: 'platform' },

    // Enemy patrols this stretch
    { col: 26, row: 10, width: 7, texture: 'brick' },

    // Rising step after the enemy
    { col: 35, row: 9, width: 4, texture: 'platform' },

    // Moving platform catches the next big gap (defined below)

    // Mid island
    { col: 46, row: 8, width: 5, texture: 'brick' },

    // Narrow hop
    { col: 53, row: 8, width: 3, texture: 'platform' },

    // Checkpoint 1 — wider breather
    { col: 58, row: 7, width: 10, texture: 'brick' },

    // Descent into pit zone
    { col: 71, row: 9, width: 4, texture: 'platform' },

    // Very small — precision landing
    { col: 77, row: 10, width: 2, texture: 'platform' },

    // Enemy island deep in the pit
    { col: 82, row: 11, width: 8, texture: 'brick' },

    // Start climbing back up
    { col: 93, row: 9, width: 4, texture: 'platform' },

    // Moving platform bridging the next gap (defined below)

    // Climbing ledge
    { col: 105, row: 6, width: 5, texture: 'platform' },

    // Checkpoint 2
    { col: 106, row: 4, width: 9, texture: 'brick' },

    // Enemy guards final stretch
    { col: 118, row: 3, width: 7, texture: 'brick' },

    // Two final stepping stones
    { col: 128, row: 3, width: 4, texture: 'platform' },
    { col: 135, row: 2, width: 4, texture: 'platform' },

    // Finish pad
    { col: 142, row: 2, width: 12, texture: 'brick' },
  ],

  coins: [
    // Opening bait
    { startCol: 1, endCol: 5, row: 8 },

    // Daring coins over the first pit
    { col: 20, row: 7 },
    { col: 21, row: 7 },
    { col: 22, row: 7 },

    // Enemy zone reward
    { startCol: 27, endCol: 30, row: 8 },

    // Checkpoint approach
    { startCol: 59, endCol: 63, row: 5 },

    // Deep pit coins — risky
    { startCol: 83, endCol: 87, row: 9 },

    // Final stretch
    { startCol: 143, endCol: 148, row: 0 },
  ],

  enemies: [
    { col: 30, row: 9  },   // first enemy stretch
    { col: 85, row: 10 },   // deep pit island
    { col: 87, row: 10 },   // pair of enemies — tight
    { col: 120, row: 2 },   // flag guardian
  ],

  movingPlatforms: [
    // Bridges gap between col 40 and col 46 — moderate speed
    { col: 41, row: 8, width: 3, distance: 120, duration: 1600 },

    // Bridges gap between col 98 and col 105 — fast and short
    { col: 99, row: 7, width: 2, distance: 90, duration: 1000 },
  ]
};
