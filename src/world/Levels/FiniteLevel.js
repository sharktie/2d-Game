// FiniteLevel reads a level data object and builds the world from it.
// It handles: platforms, coins, enemies, moving platforms, checkpoints, and the finish flag.
// Star tracking (completion, all-coins, time) is done externally in GameScreen.
import ChunkGenerator from '../ChunkGen.js';
import SpawnPlatformGenerator from '../Generators/SpawnPlatform.js';
import FlagGenerator from '../Generators/Flag.js';
import CheckpointGenerator from '../Generators/Checkpoint.js';
import MovablePlatformGenerator from '../Generators/MovablePlatform.js';
import Enemy from '../../entities/Enemy.js';

export default class FiniteLevel {
  constructor(scene, levelData) {
    this.scene          = scene;
    this.data           = levelData;
    this.chunkGen       = new ChunkGenerator(scene);
    this.flagGen        = new FlagGenerator(scene);
    this.checkpointGen  = new CheckpointGenerator(scene);
    this.movingGen      = new MovablePlatformGenerator(scene);

    this.flagZone        = null;
    this.checkpointZones = [];

    // Total coins defined in the level data (set during initialize)
    this.totalCoins = 0;
  }

  // Call once after physics groups exist in GameScreen.create()
  initialize() {
    const d  = this.data;
    const TS = ChunkGenerator.tilesize;

    // ── Player spawn ──────────────────────────────────────────────────────
    if (this.scene.player?.MC) {
      this.scene.player.MC.setPosition(
        d.playerStart.col * TS,
        d.playerStart.row * TS
      );
    }

    // ── Platforms ─────────────────────────────────────────────────────────
    for (const p of d.platforms) {
      const w   = p.width  ?? 1;
      const h   = p.height ?? 1;
      const tex = p.texture ?? 'brick';

      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          this.chunkGen.createBlock(p.col + dx, p.row + dy, tex);
        }
      }
    }

    // ── Coins ─────────────────────────────────────────────────────────────
    let coinCount = 0;
    for (const c of d.coins) {
      if (c.startCol !== undefined) {
        // Range: { startCol, endCol, row }
        for (let col = c.startCol; col <= c.endCol; col++) {
          this.scene.coins.create(col * TS, c.row * TS, 'coin');
          coinCount++;
        }
      } else {
        // Single: { col, row }
        this.scene.coins.create(c.col * TS, c.row * TS, 'coin');
        coinCount++;
      }
    }
    this.totalCoins = coinCount;

    // ── Enemies ───────────────────────────────────────────────────────────
    for (const e of d.enemies) {
      new Enemy(this.scene, e.col * TS, e.row * TS);
    }

    // ── Moving platforms ──────────────────────────────────────────────────
    for (const mp of d.movingPlatforms) {
      this.movingGen.spawnMovingPlatform(
        mp.col,
        mp.row,
        mp.width    ?? ChunkGenerator.movingplatformwidth,
        mp.distance ?? ChunkGenerator.movingplatformdistance,
        mp.duration ?? 2000
      );
    }

    // ── Checkpoints ───────────────────────────────────────────────────────
    for (const cp of d.checkpoints) {
      const zone = this.checkpointGen.create(cp.col, cp.row);
      this.checkpointZones.push(zone);
    }

    // ── Finish flag ───────────────────────────────────────────────────────
    this.flagZone = this.flagGen.create(d.flag.col, d.flag.row);

    // Finite levels don't generate chunks on the fly
  }

  // No-op — finite levels are fully built at start
  generateChunksAhead() {}

  activateCheckpoint(zone) {
    return this.checkpointGen.activate(zone);
  }

  raiseFlag() {
    this.flagGen.raise();
  }
}
