// EnemySpawner handles enemy placement logic.
// Extracted from ChunkGen so terrain generators stay lean.
import Enemy from '../../entities/Enemy.js';

export default class EnemySpawner {
  static tilesize = 32;

  constructor(scene) {
    this.scene = scene;
  }

  spawn(tileX, tileY) {
    if (!this.scene.enemies) {
      console.error('Enemies group not initialized');
      return;
    }
    new Enemy(
      this.scene,
      tileX * EnemySpawner.tilesize,
      tileY * EnemySpawner.tilesize
    );
  }
}
