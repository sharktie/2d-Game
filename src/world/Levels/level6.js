/**
 * Level 6 – Floating Ruins
 * ─────────────────────────
 * A level built almost entirely around moving platforms.
 * Players must time their jumps carefully as platforms bob
 * horizontally across wide chasms. Three checkpoints, four enemies.
 * Difficulty: Hard-Expert.
 */

export default {
  id:              6,
  name:            'Floating Ruins',

  timeStarSeconds: 70,

  playerStart: { col: 0, row: 8 },

  flag: { col: 155, row: 2 },

  checkpoints: [
    { col: 38,  row: 7 },
    { col: 88,  row: 5 },
    { col: 130, row: 3 }
  ],

  platforms: [
    // Starting pad
    { col: -3, row: 10, width: 10, height: 2, texture: 'brick' },

    // Small ledge — forces first moving platform use immediately
    { col: 12, row: 9, width: 3, texture: 'platform' },

    // Small island after first gap
    { col: 22, row: 8, width: 3, texture: 'platform' },

    // Checkpoint 1 area — solid ground rest
    { col: 36, row: 7, width: 8, texture: 'brick' },

    // Begin the gauntlet — only small solid islands between moving platforms
    { col: 50, row: 6, width: 3, texture: 'platform' },

    { col: 62, row: 6, width: 3, texture: 'platform' },

    // Enemy island
    { col: 72, row: 6, width: 6, texture: 'brick' },

    // Second checkpoint approach
    { col: 84, row: 5, width: 9, texture: 'brick' },

    // Escalating height
    { col: 98,  row: 5, width: 3, texture: 'platform' },
    { col: 108, row: 4, width: 3, texture: 'platform' },

    // Second enemy territory
    { col: 116, row: 4, width: 7, texture: 'brick' },

    // Checkpoint 3 area
    { col: 127, row: 3, width: 10, texture: 'brick' },

    // Final gauntlet — short hops, moving platforms fill the gaps
    { col: 140, row: 2, width: 3, texture: 'platform' },
    { col: 148, row: 2, width: 10, texture: 'brick' },
  ],

  coins: [
    // Opening
    { startCol: 1, endCol: 4, row: 8 },

    // Reward brave moving-platform riders
    { col: 18, row: 6 },
    { col: 19, row: 6 },
    { col: 20, row: 6 },

    // Checkpoint 1 area
    { startCol: 37, endCol: 41, row: 5 },

    // Enemy island risk
    { startCol: 73, endCol: 76, row: 4 },

    // Checkpoint 2 area
    { startCol: 85, endCol: 89, row: 3 },

    // High altitude coins
    { startCol: 128, endCol: 132, row: 1 },

    // Final stretch
    { startCol: 149, endCol: 154, row: 0 },
  ],

  enemies: [
    { col: 74,  row: 5  },
    { col: 119, row: 3  },
    { col: 121, row: 3  },
    { col: 150, row: 1  },
  ],

  movingPlatforms: [
    // Cross the first big chasm (col 15→22)
    { col: 15, row: 8, width: 3, distance: 130, duration: 1800 },

    // Bridge into checkpoint 1 zone (col 27→36)
    { col: 27, row: 7, width: 3, distance: 140, duration: 2000 },

    // Gauntlet section — three rapid platforms
    { col: 44, row: 6, width: 2, distance: 100, duration: 1400 },
    { col: 55, row: 6, width: 2, distance: 90,  duration: 1200 },
    { col: 66, row: 6, width: 2, distance: 80,  duration: 1100 },

    // Wide gap before checkpoint 2 (col 79→84)
    { col: 79, row: 5, width: 3, distance: 110, duration: 1600 },

    // After checkpoint 2 — rising platforms
    { col: 94,  row: 5, width: 2, distance: 95,  duration: 1300 },
    { col: 103, row: 4, width: 2, distance: 85,  duration: 1100 },

    // Before checkpoint 3 (col 124→127)
    { col: 124, row: 3, width: 3, distance: 100, duration: 1500 },

    // Final approach — fast and narrow
    { col: 138, row: 2, width: 2, distance: 75,  duration: 950 },
  ]
};
