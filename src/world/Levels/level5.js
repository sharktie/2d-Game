/**
 * Level 5 – Storm Summit
 * ───────────────────────
 * Expert difficulty. The hardest level in the game.
 * Very narrow platforms, five enemies (including pairs), three moving
 * platforms (two fast, one tiny), three checkpoints, and a brutal
 * final gauntlet before the flag at extreme height.
 *
 * Layout concept: constant upward climb through wind-battered ruins.
 * Gaps are wide, platforms are small, enemies are tightly placed.
 */

export default {
  id:              5,
  name:            'Storm Summit',

  timeStarSeconds: 75,

  playerStart: { col: 0, row: 9 },

  flag: { col: 165, row: 1 },

  checkpoints: [
    { col: 45, row: 7 },
    { col: 92, row: 4 },
    { col: 133, row: 2 }
  ],

  platforms: [
    // Starting pad — short, forces an early decision
    { col: -3, row: 10, width: 8, height: 2, texture: 'brick' },

    // Narrow first hop
    { col: 9,  row: 9,  width: 2, texture: 'platform' },

    // Step down slightly
    { col: 14, row: 10, width: 3, texture: 'platform' },

    // Enemy guards this small island
    { col: 20, row: 10, width: 6, texture: 'brick' },

    // Tight step up
    { col: 28, row: 9,  width: 2, texture: 'platform' },

    // Moving platform fills next gap (defined below)

    // Small landing after first moving platform
    { col: 37, row: 8,  width: 3, texture: 'platform' },

    // Another precision platform
    { col: 42, row: 8,  width: 2, texture: 'platform' },

    // Checkpoint 1 — wider rest
    { col: 44, row: 7,  width: 8, texture: 'brick' },

    // Big gap — second moving platform needed
    { col: 57, row: 6,  width: 3, texture: 'platform' },

    // Enemy pair island
    { col: 63, row: 6,  width: 7, texture: 'brick' },

    // Step up
    { col: 72, row: 5,  width: 3, texture: 'platform' },

    // Tiny hop
    { col: 77, row: 5,  width: 2, texture: 'platform' },

    // Third moving platform (tiny, fast)

    // Land here
    { col: 85, row: 4,  width: 3, texture: 'platform' },

    // Checkpoint 2
    { col: 90, row: 4,  width: 9, texture: 'brick' },

    // Enemy guards descent
    { col: 102, row: 5, width: 5, texture: 'brick' },

    // Rise again
    { col: 110, row: 4, width: 3, texture: 'platform' },
    { col: 116, row: 3, width: 3, texture: 'platform' },

    // Enemy pair at high altitude
    { col: 122, row: 3, width: 6, texture: 'brick' },

    // Final stepping stones
    { col: 131, row: 2, width: 4, texture: 'platform' },

    // Checkpoint 3
    { col: 131, row: 2, width: 10, texture: 'brick' },

    // Gauntlet — very narrow with enemy
    { col: 144, row: 2, width: 3, texture: 'platform' },
    { col: 150, row: 1, width: 3, texture: 'platform' },
    { col: 156, row: 1, width: 4, texture: 'platform' },

    // Finish pad
    { col: 158, row: 1, width: 10, texture: 'brick' },
  ],

  coins: [
    // Opening
    { startCol: 1, endCol: 4, row: 8 },

    // Risky coins on enemy island
    { startCol: 21, endCol: 24, row: 8 },

    // After first moving platform
    { col: 38, row: 6 },
    { col: 39, row: 6 },

    // Checkpoint 1 area
    { startCol: 45, endCol: 49, row: 5 },

    // Enemy pair island reward
    { startCol: 64, endCol: 67, row: 4 },

    // Checkpoint 2 area
    { startCol: 91, endCol: 95, row: 2 },

    // Near summit
    { startCol: 123, endCol: 126, row: 1 },

    // Flag approach
    { startCol: 159, endCol: 164, row: -1 },
  ],

  enemies: [
    { col: 23,  row: 9  },   // first island guard
    { col: 65,  row: 5  },   // enemy pair — left
    { col: 67,  row: 5  },   // enemy pair — right
    { col: 104, row: 4  },   // high-altitude solo
    { col: 124, row: 2  },   // final gauntlet guard
  ],

  movingPlatforms: [
    // Gap between col 31 and col 37 — moderate
    { col: 32, row: 8, width: 3, distance: 110, duration: 1500 },

    // Gap between col 52 and col 57 — fast
    { col: 53, row: 6, width: 2, distance: 80,  duration: 1100 },

    // Tiny bridge between col 80 and col 85 — very fast, hardest in game
    { col: 81, row: 4, width: 2, distance: 70,  duration: 900  },
  ]
};
