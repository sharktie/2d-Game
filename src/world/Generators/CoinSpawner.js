// CoinSpawner handles all coin placement logic.
// Extracted from ChunkGen so terrain generators stay lean.
export default class CoinSpawner {
  static tilesize = 32;

  constructor(scene) {
    this.scene = scene;
  }

  // Single coin at a specific tile coordinate
  spawnAt(col, row) {
    if (!this.scene.coins) return null;
    return this.scene.coins.create(
      col * CoinSpawner.tilesize,
      row * CoinSpawner.tilesize,
      'coin'
    );
  }

  // Arc of coins bridging a gap (entices players to jump)
  spawnArc(startX, endX, baseHeight) {
    if (!this.scene.coins) return;
    const distance = endX - startX;
    if (distance <= 0) return;

    for (let x = startX; x <= endX; x++) {
      const t = (x - startX) / distance;
      const heightOffset = Math.sin(t * Math.PI) * 3;
      this.scene.coins.create(
        x * CoinSpawner.tilesize,
        (baseHeight - heightOffset - 2) * CoinSpawner.tilesize,
        'coin'
      );
    }
  }

  // Horizontal line of coins
  spawnLine(x, y, length) {
    if (!this.scene.coins) return;
    for (let i = 0; i < length; i++) {
      this.scene.coins.create(
        (x + i) * CoinSpawner.tilesize,
        y * CoinSpawner.tilesize,
        'coin'
      );
    }
  }
}
