/**
 * Level 1 – Grasslands
 * ─────────────────────
 * An easy introductory level. Wide platforms, small gaps, one enemy.
 * The path rises steadily from row 10 up to row 3.
 *
 * ── How to add platforms ───────────────────────────────────────────────────
 *   { col, row, width, height?, texture? }
 *   col/row  = top-left tile position (1 tile = 32px)
 *   width    = number of tiles wide  (default 1)
 *   height   = number of tiles tall  (default 1)
 *   texture  = 'brick' | 'platform'  (default 'brick')
 *
 * ── How to add coins ───────────────────────────────────────────────────────
 *   Single coin:   { col, row }
 *   Coin range:    { startCol, endCol, row }   (horizontal line)
 *
 * ── How to add enemies ─────────────────────────────────────────────────────
 *   { col, row }  — spawns an enemy at that tile
 *
 * ── How to add moving platforms ────────────────────────────────────────────
 *   { col, row, width?, distance?, duration? }
 *   distance = travel in pixels (default 128)
 *   duration = one-way ms       (default 2000)
 *
 * ── Checkpoints & Flag ─────────────────────────────────────────────────────
 *   Checkpoint: { col, row }  — row = surface row the pole stands on
 *   Flag:       { col, row }  — same rule; player walks into zone to finish
 */

export default {
  id:              1,
  name:            'Grasslands',

  // ── STAR THRESHOLDS ──────────────────────────────────────────────────────
  // Star 1 = reach the flag
  // Star 2 = collect every coin
  // Star 3 = finish under this many seconds  ← edit freely
  timeStarSeconds: 55,

  // ── SPAWN ─────────────────────────────────────────────────────────────────
  playerStart: { col: 0, row: 8 },

  // ── FLAG (finish line) ────────────────────────────────────────────────────
  flag: { col: 92, row: 3 },

  // ── CHECKPOINTS ───────────────────────────────────────────────────────────
  checkpoints: [
    { col: 52, row: 5 }
  ],

  // ── PLATFORMS ─────────────────────────────────────────────────────────────
  platforms: [
    // Wide starting pad (two rows deep)
    { col: -3, row: 10, width: 11, height: 2, texture: 'brick' },

    // First hop — small step up
    { col: 12, row: 9, width: 5, texture: 'platform' },

    // Continued ascent
    { col: 19, row: 8, width: 6, texture: 'platform' },

    // Long platform — enemy patrols here
    { col: 27, row: 8, width: 8, texture: 'brick' },

    // After first real gap
    { col: 37, row: 7, width: 6, texture: 'platform' },

    // Another step up
    { col: 45, row: 6, width: 5, texture: 'platform' },

    // Checkpoint area — wide and safe
    { col: 52, row: 5, width: 10, texture: 'brick' },

    // Second half opener
    { col: 64, row: 5, width: 7, texture: 'brick' },

    // Higher ground — gap + height change
    { col: 73, row: 4, width: 7, texture: 'platform' },

    // Final approach
    { col: 82, row: 3, width: 12, texture: 'brick' },
  ],

  // ── COINS (17 total) ──────────────────────────────────────────────────────
  coins: [
    // Guide the player rightward off the spawn pad
    { startCol: 2,  endCol: 6,  row: 8 },

    // Reward first jump
    { startCol: 13, endCol: 16, row: 7 },

    // Long platform coins (risky — enemy is nearby)
    { startCol: 28, endCol: 31, row: 6 },

    // Checkpoint approach
    { startCol: 53, endCol: 57, row: 3 },

    // Near the flag
    { startCol: 83, endCol: 87, row: 1 },
  ],

  // ── ENEMIES ───────────────────────────────────────────────────────────────
  enemies: [
    { col: 31, row: 7 }  // patrols the long brick platform
  ],

  // ── MOVING PLATFORMS ──────────────────────────────────────────────────────
  movingPlatforms: []   // none in level 1 — let players get used to jumping first
};


/* instructions add later 

    // "USE ARROW KEYS TO MOVE" — displayed above the starting platform area
    const t1 = this.add.text(3 * TS, 7 * TS, '← → ARROW KEYS
   TO MOVE', {
      ...instructStyle,
      lineSpacing: 6
    }).setOrigin(0.5, 1).setDepth(5).setAlpha(0.6);

    // Arrow indicators drawn on the ground
    const t2 = this.add.text(12 * TS, 7 * TS, '↑ PRESS UP
 TO JUMP', {
      ...instructStyle,
      lineSpacing: 6
    }).setOrigin(0.5, 1).setDepth(5).setAlpha(0.6);

    // Coin hint near first coins
    const t3 = this.add.text(4 * TS, 6 * TS, '★ COLLECT
  COINS!', {
      ...instructStyle,
      color: '#ffee00',
      lineSpacing: 6
    }).setOrigin(0.5, 1).setDepth(5).setAlpha(0.6);

    // Fade them all out after 12 seconds
    [t1, t2, t3].forEach((t, i) => {
      this.time.delayedCall(8000 + i * 500, () => {
        this.tweens.add({ targets: t, alpha: 0, duration: 2000, ease: 'Cubic.easeIn' });
      });
    });
  }

  */