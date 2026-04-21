// MovablePlatformGenerator creates horizontally moving platform groups.
// BUG FIXES vs original:
//   - Was using texture 'ground' (not loaded) → now uses 'platform'
//   - Was referencing platform.offsetX (undefined) → each tile stores its own startX
//   - Physics body wasn't synced to tween position → body.reset() called each frame
import ChunkGenerator from '../ChunkGen.js';

export default class MovablePlatformGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Spawn a horizontally moving platform.
   * @param {number} col       – leftmost tile column
   * @param {number} row       – tile row
   * @param {number} [width]   – override tile width (defaults to ChunkGenerator constant)
   * @param {number} [distance]– travel distance in pixels (defaults to ChunkGenerator constant)
   * @param {number} [duration]– one-way travel time in ms (defaults to 2000)
   */
  spawnMovingPlatform(
    col,
    row,
    width    = ChunkGenerator.movingplatformwidth,
    distance = ChunkGenerator.movingplatformdistance,
    duration = 2000
  ) {
    if (!this.scene.movingPlatforms) {
      console.error('Moving platforms group not initialized');
      return;
    }

    const TS = ChunkGenerator.tilesize;
    const tiles = [];

    for (let i = 0; i < width; i++) {
      const platform = this.scene.movingPlatforms.create(
        (col + i) * TS,
        row * TS,
        'platform'      // FIX: original used 'ground' which is not a loaded texture
      );

      if (!platform) continue;

      platform.setScale(TS / 256);
      platform.setImmovable(true);

      if (platform.body) {
        platform.body.allowGravity = false;
        platform.body.setCollideWorldBounds(false);
        platform.refreshBody();
      }

      // Store the starting x so the tween target can compute relative motion
      platform.startX = (col + i) * TS;  // FIX: original used undefined offsetX
      tiles.push(platform);
    }

    if (tiles.length === 0) return;

    const travelDist = Phaser.Math.Between(distance, distance * 2);

    this.scene.tweens.add({
      targets:  tiles,
      // Move each tile by the same travelDist from its own start position
      x:        (target) => target.startX + travelDist,  // FIX: was startX + undefined
      duration: duration + Math.random() * 1000,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.easeInOut',
      // FIX: sync the physics body to the visual each frame so the player
      //      actually lands on the moving surface
      onUpdate: () => {
        tiles.forEach(p => {
          if (p && p.active && p.body) {
            p.body.reset(p.x, p.y);
          }
        });
      }
    });
  }
}
