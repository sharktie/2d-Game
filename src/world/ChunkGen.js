import Enemy from '../entities/Enemy.js';

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
  static gapMaxNormal = 5;   // scales up to this with difficulty
  static gapMinHigh = 2;
  static gapMaxHigh = 6;     // scales up to this with difficulty

  constructor(scene) {
    this.scene = scene;
    this.chunkSize = ChunkGenerator.chunksize;
    this.difficulty = 1;
    this.biome = 'grass';
    this.totalColsGenerated = 0;
    this.gameStartTime = Date.now();
  }

  // difficulty: 1 (easy) → 4 (hardest), ramps over ~320 cols (~16 chunks)
  getDifficulty(startCol) {
    return Math.min(4, 1 + (startCol / 320) * 3);
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

  createStartingPlatform() {
    const startHeight = 10;
    const width = 8;

    for (let i = -3; i < width - 3; i++) {
      this.createBlock(i, startHeight);
    }
    for (let i = -3; i < width - 3; i++) {
      this.createBlock(i, startHeight + 1);
    }

    if (this.scene.player && this.scene.player.MC) {
      this.scene.player.MC.setPosition(
        0 * ChunkGenerator.tilesize,
        (startHeight - 2) * ChunkGenerator.tilesize
      );
    }
  }

  generateChunk(startCol) {
    let currentHeight = (startCol === 0) ? 10 : 8;
    let col = startCol;

    // Update difficulty based on how far we've generated
    this.difficulty = this.getDifficulty(startCol);

    while (col < startCol + this.chunkSize) {
      const roll = Math.random();

      // 1. LONG PLATFORM (35%)
      if (roll < 0.35) {
        const platformLength = this.createLongPlatform(col, currentHeight);
        col += platformLength + Phaser.Math.Between(1, 2);
      }

      // 2. STAIRS (25%)
      else if (roll < 0.60) {
        col = this.createStairs(col, currentHeight);
        currentHeight = this.getHeightAtCol(col);
      }

      // 3. GAP WITH COINS (25%)
      else if (roll < 0.85) {
        const result = this.createGap(col, currentHeight);
        col = result.endCol;
        currentHeight = result.height;
      }

      // 4. HIGH RISK PLATFORM (15%)
      else {
        const result = this.createHighRiskSegment(col, currentHeight);
        col = result.endCol;
        currentHeight = result.height;
      }
    }

    this.totalColsGenerated = col;
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

  createStairs(startCol, startHeight) {
    const steps = Phaser.Math.Between(
      ChunkGenerator.stairsmin,
      ChunkGenerator.stairsmax
    );
    const direction = Math.random() > 0.5 ? -1 : 1;

    let currentHeight = startHeight;
    let col = startCol;

    for (let i = 0; i < steps; i++) {
      currentHeight += direction;
      currentHeight = Phaser.Math.Clamp(
        currentHeight,
        ChunkGenerator.minheight,
        ChunkGenerator.maxheight
      );

      this.createBlock(col, currentHeight);
      col++;
    }

    // At difficulty 2+, occasionally spawn an enemy on the staircase
    const timeSinceStart = Date.now() - this.gameStartTime;
    const stairEnemyChance = Math.max(0, (this.difficulty - 1.5) * 0.2); // 0 → ~0.5
    if (timeSinceStart > 2000 && steps >= 3 && Math.random() < stairEnemyChance) {
      const midStep = startCol + Math.floor(steps / 2);
      const playerTileX = Math.floor(this.scene.player.MC.x / ChunkGenerator.tilesize);
      if (midStep > playerTileX + 5) {
        const stepHeight = this.getHeightAtCol(midStep);
        this.spawnEnemy(midStep, stepHeight - 1);
      }
    }

    return col;
  }

  createGap(startCol, currentHeight) {
    // Gap size scales with difficulty: 1–2 early → 1–5 late
    const maxGap = Math.min(
      ChunkGenerator.gapMaxNormal,
      ChunkGenerator.gapMinNormal + Math.floor(this.difficulty)
    );
    let gapSize = Phaser.Math.Between(ChunkGenerator.gapMinNormal, maxGap);

    const landingCol = startCol + gapSize;

    // Height change grows with difficulty
    const maxHeightDelta = Math.min(3, 1 + Math.floor((this.difficulty - 1) * 0.8));
    currentHeight += Phaser.Math.Between(-maxHeightDelta, maxHeightDelta);
    currentHeight = Phaser.Math.Clamp(
      currentHeight,
      ChunkGenerator.minheight,
      ChunkGenerator.maxheight
    );

    // Shorter landing at higher difficulty (min 2 tiles)
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
    // Gap scales: 2–3 early → 2–6 late
    const maxGap = Math.min(
      ChunkGenerator.gapMaxHigh,
      ChunkGenerator.gapMinHigh + Math.floor(this.difficulty)
    );
    let gapSize = Phaser.Math.Between(ChunkGenerator.gapMinHigh, maxGap);

    const landingCol = startCol + gapSize;

    // More drastic height drops at higher difficulty
    const maxDrop = Math.min(3, 1 + Math.floor((this.difficulty - 1) * 0.7));
    currentHeight -= Phaser.Math.Between(1, maxDrop);
    currentHeight = Phaser.Math.Clamp(
      currentHeight,
      ChunkGenerator.minheight,
      ChunkGenerator.maxheight
    );

    // Shorter landing at high difficulty (min 2 tiles)
    const landingLength = Math.max(2, 3 - Math.floor((this.difficulty - 1) * 0.5));
    for (let i = 0; i < landingLength; i++) {
      this.createBlock(landingCol + i, currentHeight);
    }

    this.spawnCoinLine(landingCol, currentHeight - 2, 5);
    this.spawnCoinArc(startCol, landingCol, currentHeight);

    // Moving platform helper — less likely as difficulty increases
    const movingPlatformChance = Math.max(0.1, 0.75 - (this.difficulty - 1) * 0.2);
    if (Math.random() < movingPlatformChance) {
      this.spawnMovingPlatform(startCol + 1, currentHeight + 2);
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

    if (platformsAtCol.length === 0) {
      return 8;
    }

    return Math.min(...platformsAtCol.map(p => p.y / ChunkGenerator.tilesize)) - 1;
  }

  // ==============================
  // ENEMIES
  // ==============================
  spawnEnemy(tileX, tileY) {
    if (!this.scene.enemies) {
      console.error('Enemies group not initialized');
      return;
    }

    // Prevent spawning too close to the player
    new Enemy(this.scene, tileX * ChunkGenerator.tilesize, tileY * ChunkGenerator.tilesize);
  }

  // ==============================
  // MOVING PLATFORMS
  // ==============================
  spawnMovingPlatform(x, y) {
    if (!this.scene.movingPlatforms) {
      console.error('Moving platforms group not initialized');
      return;
    }

    const width = ChunkGenerator.movingplatformwidth;
    const platformGroup = x;

    for (let i = 0; i < width; i++) {
      const platform = this.scene.movingPlatforms.create(
        (x + i) * ChunkGenerator.tilesize,
        y * ChunkGenerator.tilesize,
        'ground'
      );

      if (!platform) continue;

      platform.setScale(ChunkGenerator.tilesize / 256);
      platform.setImmovable(true);
      if (platform.body) {
        platform.body.allowGravity = false;
        platform.body.setCollideWorldBounds(false);
        platform.refreshBody();
      }
      platform.platformGroup = platformGroup;
    }

    const startX = x * ChunkGenerator.tilesize;
    const platformsInGroup = this.scene.movingPlatforms.getChildren().filter(p => p.platformGroup === platformGroup);

    this.scene.tweens.add({
      targets: platformsInGroup,
      x: (platform) => startX + platform.offsetX + Phaser.Math.Between(
        ChunkGenerator.movingplatformdistance,
        ChunkGenerator.movingplatformdistance * 2
      ),
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // ==============================
  // COINS (GUIDE PLAYER)
  // ==============================

  spawnCoinArc(startX, endX, baseHeight) {
    if (!this.scene.coins) {
      console.error('Coins group not initialized');
      return;
    }

    const distance = endX - startX;

    for (let x = startX; x <= endX; x++) {
      const t = (x - startX) / distance;
      const heightOffset = Math.sin(t * Math.PI) * 3;

      this.scene.coins.create(
        x * ChunkGenerator.tilesize,
        (baseHeight - heightOffset - 2) * ChunkGenerator.tilesize, 'coin'
      );
    }
  }

  spawnCoinLine(x, y, length) {
    if (!this.scene.coins) {
      console.error('Coins group not initialized');
      return;
    }

    for (let i = 0; i < length; i++) {
      this.scene.coins.create(
        (x + i) * ChunkGenerator.tilesize, y * ChunkGenerator.tilesize, 'coin'
      );
    }
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
