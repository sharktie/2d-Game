/**
 * Level 7 – Sky Factory
 * ──────────────────────
 * Expert difficulty. An industrial sky-high gauntlet where moving platforms
 * move both faster and farther than any previous level. Many platforms travel
 * vertically as well as horizontally (simulated with wide-distance tweens).
 * Five enemies, three checkpoints, brutal timing requirements.
 */

export default {
  id:              7,
  name:            'Sky Factory',

  timeStarSeconds: 85,

  playerStart: { col: 0, row: 9 },

  flag: { col: 172, row: 1 },

  checkpoints: [
    { col: 50,  row: 6 },
    { col: 100, row: 4 },
    { col: 148, row: 2 }
  ],

  platforms: [
    // Starting pad — very short, immediately forces movement
    { col: -3, row: 10, width: 7, height: 2, texture: 'brick' },

    // Quick hop — small footing
    { col: 8,  row: 9, width: 2, texture: 'platform' },

    // Step up
    { col: 14, row: 8, width: 2, texture: 'platform' },

    // First enemy island
    { col: 22, row: 8, width: 6, texture: 'brick' },

    // Narrow escape
    { col: 31, row: 7, width: 2, texture: 'platform' },

    // Brief solid ground before checkpoint 1
    { col: 44, row: 6, width: 10, texture: 'brick' },

    // After checkpoint 1 — island hopping
    { col: 58, row: 5, width: 3, texture: 'platform' },
    { col: 66, row: 5, width: 3, texture: 'platform' },

    // Second enemy territory
    { col: 75, row: 5, width: 7, texture: 'brick' },

    // Tight stepping stones
    { col: 85, row: 4, width: 2, texture: 'platform' },
    { col: 92, row: 4, width: 2, texture: 'platform' },

    // Checkpoint 2 rest zone
    { col: 97, row: 4, width: 10, texture: 'brick' },

    // Rising platforms lead to enemy pair
    { col: 112, row: 3, width: 3, texture: 'platform' },
    { col: 120, row: 3, width: 7, texture: 'brick' },

    // Hairpin turn downward then up
    { col: 130, row: 4, width: 2, texture: 'platform' },
    { col: 136, row: 3, width: 2, texture: 'platform' },

    // Checkpoint 3
    { col: 143, row: 2, width: 10, texture: 'brick' },

    // Final sprint — only moving platforms and tiny ledges
    { col: 156, row: 1, width: 2, texture: 'platform' },
    { col: 163, row: 1, width: 3, texture: 'platform' },

    // Finish pad
    { col: 165, row: 1, width: 10, texture: 'brick' },
  ],

  coins: [
    // Opening bait
    { startCol: 1, endCol: 4, row: 8 },

    // Enemy island gamble
    { startCol: 23, endCol: 26, row: 6 },

    // Checkpoint 1 cushion coins
    { startCol: 45, endCol: 49, row: 4 },

    // Tight hop coins — tense section
    { col: 59, row: 3 },
    { col: 60, row: 3 },

    // Second enemy island coins
    { startCol: 76, endCol: 80, row: 3 },

    // Checkpoint 2 area
    { startCol: 98, endCol: 102, row: 2 },

    // High altitude coins
    { startCol: 121, endCol: 125, row: 1 },

    // Checkpoint 3 area
    { startCol: 144, endCol: 148, row: 0 },

    // Victory lap
    { startCol: 166, endCol: 171, row: -1 },
  ],

  enemies: [
    { col: 25,  row: 7  },
    { col: 77,  row: 4  },
    { col: 79,  row: 4  },
    { col: 122, row: 2  },
    { col: 124, row: 2  },
  ],

  movingPlatforms: [
    // Gap from start pad to island (col 10→14)
    { col: 10, row: 8, width: 2, distance: 90,  duration: 1300 },

    // Gap after first island (col 17→22)
    { col: 17, row: 7, width: 2, distance: 100, duration: 1400 },

    // Cross to checkpoint 1 (col 35→44)
    { col: 35, row: 6, width: 3, distance: 140, duration: 1700 },

    // Island hop section after cp1 (col 54→58)
    { col: 54, row: 5, width: 2, distance: 80,  duration: 1100 },

    // (col 62→66)
    { col: 62, row: 5, width: 2, distance: 80,  duration: 1000 },

    // Approach cp2 (col 88→92)
    { col: 88, row: 4, width: 2, distance: 90,  duration: 1200 },

    // After cp2 (col 110→112) — fast
    { col: 108, row: 3, width: 2, distance: 85,  duration: 1000 },

    // Hairpin platforms (col 128→130 and col 133→136)
    { col: 127, row: 4, width: 2, distance: 80,  duration: 950  },
    { col: 133, row: 3, width: 2, distance: 75,  duration: 900  },

    // Final sprint moving platforms (fastest in the game)
    { col: 153, row: 1, width: 2, distance: 70,  duration: 850  },
    { col: 160, row: 1, width: 2, distance: 65,  duration: 800  },
  ]
};
