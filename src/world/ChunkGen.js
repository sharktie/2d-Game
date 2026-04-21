// ChunkGenerator is the shared utility layer.
// It owns: createBlock, gap/platform/high-risk terrain primitives, and cleanup.
// Coin and enemy spawning are delegated to CoinSpawner and EnemySpawner.
// The chunk loop lives in Levels/InfiniteLevel.js (or any future level file).
// Stairs live in Generators/Stairs.js.
// The starting platform lives in Generators/SpawnPlatform.js.
import MovablePlatformGenerator from './Generators/MovablePlatform.js';
import CoinSpawner from './Generators/CoinSpawner.js';
import EnemySpawner from './Generators/EnemySpawner.js';

export default class ChunkGenerator {
  // === CONSTANTS ===
  static tilesize = 32;
  static chunksize = 20;
  static minheight = 4;
  static maxheight = 12;
  static longplatformmin = 5;
  static longplatformmax = 10;
  static stairsmin = 2;
  static stairsmax = 5;
  static movingplatformdistance = 128;
  static movingplatformwidth = 4;

  // Max gap sizes — kept sane so jumps are always possible
  static gapMinNormal = 1;
  static gapMaxNormal = 5;
  static gapMinHigh = 2;
  static gapMaxHigh = 6;

  constructor(scene) {
    this.scene = scene;
    this.chunkSize = ChunkGenerator.chunksize;
    this.difficulty = 1;
    this.biome = 'grass';
    this.totalColsGenerated = 0;
    this.gameStartTime = Date.now();

    // Specialised generators (coin/enemy logic extracted out of this file)
    this.movablePlatformGen = new MovablePlatformGenerator(scene);
    this.coinSpawner = new CoinSpawner(scene);
    this.enemySpawner = new EnemySpawner(scene);
  }

  createBlock(x, y, texture = 'brick') {
    if (!this.scene.platforms) {
      console.error('Platforms group not initialized');
      return;
    }

    const block = this.scene.platforms.create(
      x * ChunkGenerator.tilesize,
      y * ChunkGenerator.tilesize,
      texture
    );

    if (block) {
      block.setScale(ChunkGenerator.tilesize / 256);
      if (block.body) {
        block.refreshBody();
      }
    }

    return block;
  }

  createLongPlatform(col, height) {
    const length = Phaser.Math.Between(
      ChunkGenerator.longplatformmin,
      ChunkGenerator.longplatformmax
    );

    for (let i = 0; i < length; i++) {
      this.createBlock(col + i, height, 'platform');
    }

    // Enemy spawn chance scales: 30% at diff 1 → 75% at diff 4
    const enemyChance = Math.min(0.75, 0.30 + (this.difficulty - 1) * 0.15);
    const timeSinceStart = Date.now() - this.gameStartTime;

    if (timeSinceStart > 2000 && Math.random() < enemyChance) {
      const spawnTileX = col + Phaser.Math.Between(0, length - 1);
      const playerTileX = Math.floor(this.scene.player.MC.x / ChunkGenerator.tilesize);

      if (spawnTileX > playerTileX + 5) {
        this.spawnEnemy(spawnTileX, height - 1);
      }

      // At high difficulty, chance to spawn a second enemy on longer platforms
      if (this.difficulty >= 3 && length >= 7 && Math.random() < 0.4) {
        const spawnTileX2 = col + Phaser.Math.Between(0, length - 1);
        if (spawnTileX2 > playerTileX + 5 && Math.abs(spawnTileX2 - spawnTileX) > 2) {
          this.spawnEnemy(spawnTileX2, height - 1);
        }
      }
    }

    return length;
  }

  createGap(startCol, currentHeight) {
    const maxGap = Math.min(
      ChunkGenerator.gapMaxNormal,
      ChunkGenerator.gapMinNormal + Math.floor(this.difficulty)
    );
    const gapSize = Phaser.Math.Between(ChunkGenerator.gapMinNormal, maxGap);
    const landingCol = startCol + gapSize;

    const maxHeightDelta = Math.min(3, 1 + Math.floor((this.difficulty - 1) * 0.8));
    currentHeight += Phaser.Math.Between(-maxHeightDelta, maxHeightDelta);
    currentHeight = Phaser.Math.Clamp(
      currentHeight,
      ChunkGenerator.minheight,
      ChunkGenerator.maxheight
    );

    const landingLength = Math.max(2, 3 - Math.floor((this.difficulty - 1) * 0.5));
    for (let i = 0; i < landingLength; i++) {
      this.createBlock(landingCol + i, currentHeight);
    }

    this.spawnCoinArc(startCol, landingCol, currentHeight);

    return {
      endCol: landingCol + landingLength,
      height: currentHeight
    };
  }

  createHighRiskSegment(startCol, currentHeight) {
    const maxGap = Math.min(
      ChunkGenerator.gapMaxHigh,
      ChunkGenerator.gapMinHigh + Math.floor(this.difficulty)
    );
    const gapSize = Phaser.Math.Between(ChunkGenerator.gapMinHigh, maxGap);
    const landingCol = startCol + gapSize;

    const maxDrop = Math.min(3, 1 + Math.floor((this.difficulty - 1) * 0.7));
    currentHeight -= Phaser.Math.Between(1, maxDrop);
    currentHeight = Phaser.Math.Clamp(
      currentHeight,
      ChunkGenerator.minheight,
      ChunkGenerator.maxheight
    );

    const landingLength = Math.max(2, 3 - Math.floor((this.difficulty - 1) * 0.5));
    for (let i = 0; i < landingLength; i++) {
      this.createBlock(landingCol + i, currentHeight);
    }

    this.spawnCoinLine(landingCol, currentHeight - 2, 5);
    this.spawnCoinArc(startCol, landingCol, currentHeight);

    const movingPlatformChance = Math.max(0.1, 0.75 - (this.difficulty - 1) * 0.2);
    if (Math.random() < movingPlatformChance) {
      this.movablePlatformGen.spawnMovingPlatform(startCol + 1, currentHeight + 2);
    }

    return {
      endCol: landingCol + landingLength,
      height: currentHeight
    };
  }

  getHeightAtCol(col) {
    const platforms = this.scene.platforms.getChildren();
    const platformsAtCol = platforms.filter(
      p => Math.abs(p.x - col * ChunkGenerator.tilesize) < 16
    );

    if (platformsAtCol.length === 0) return 8;

    return Math.min(...platformsAtCol.map(p => p.y / ChunkGenerator.tilesize)) - 1;
  }

  // ==============================
  // THIN WRAPPERS — delegate to extracted spawners
  // These exist so callers (Stairs, etc.) don't need to change.
  // ==============================

  spawnEnemy(tileX, tileY) {
    this.enemySpawner.spawn(tileX, tileY);
  }

  spawnCoinArc(startX, endX, baseHeight) {
    this.coinSpawner.spawnArc(startX, endX, baseHeight);
  }

  spawnCoinLine(x, y, length) {
    this.coinSpawner.spawnLine(x, y, length);
  }

  // ==============================
  // CLEANUP
  // ==============================
  clearChunks(beforeCol) {
    const threshold = beforeCol * ChunkGenerator.tilesize;

    const groups = [
      this.scene.platforms,
      this.scene.movingPlatforms,
      this.scene.enemies,
      this.scene.coins
    ];

    groups.forEach(group => {
      if (group) {
        group.getChildren().forEach(obj => {
          if (obj.x < threshold) {
            obj.destroy();
          }
        });
      }
    });
  }
}
