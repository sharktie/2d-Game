import ChunkGenerator from '../ChunkGen.js';
import SpawnPlatformGenerator from '../Generators/SpawnPlatform.js';
import StairsGenerator from '../Generators/Stairs.js';

// InfiniteLevel drives the endless procedural world.
// It owns the chunk loop + difficulty ramp, delegating terrain
// creation to ChunkGenerator and the specialist generators.
// To make a finite level, see FiniteLevel.js in this folder.
export default class InfiniteLevel {
  constructor(scene) {
    this.scene = scene;
    this.chunkGen = new ChunkGenerator(scene);
    this.spawnPlatformGen = new SpawnPlatformGenerator(this.chunkGen);
    this.stairsGen = new StairsGenerator(this.chunkGen);
    this.lastGeneratedChunk = 1;
  }

  // Ramps difficulty 1 → 4 over ~320 cols (~16 chunks)
  getDifficulty(startCol) {
    return Math.min(4, 1 + (startCol / 320) * 3);
  }

  // Call once after physics groups are ready
  initialize() {
    this.spawnPlatformGen.createStartingPlatform();
    this.generateChunk(0);
  }

  // Generates one chunk worth of terrain starting at startCol
  generateChunk(startCol) {
    let currentHeight = (startCol === 0) ? 10 : 8;
    let col = startCol;

    this.chunkGen.difficulty = this.getDifficulty(startCol);

    while (col < startCol + ChunkGenerator.chunksize) {
      const roll = Math.random();

      // 1. LONG PLATFORM (35%)
      if (roll < 0.35) {
        const platformLength = this.chunkGen.createLongPlatform(col, currentHeight);
        col += platformLength + Phaser.Math.Between(1, 2);
      }

      // 2. STAIRS (25%)
      else if (roll < 0.60) {
        col = this.stairsGen.createStairs(col, currentHeight);
        currentHeight = this.chunkGen.getHeightAtCol(col);
      }

      // 3. GAP WITH COINS (25%)
      else if (roll < 0.85) {
        const result = this.chunkGen.createGap(col, currentHeight);
        col = result.endCol;
        currentHeight = result.height;
      }

      // 4. HIGH RISK PLATFORM (15%)
      else {
        const result = this.chunkGen.createHighRiskSegment(col, currentHeight);
        col = result.endCol;
        currentHeight = result.height;
      }
    }

    this.chunkGen.totalColsGenerated = col;
  }

  // Called every update frame — generates new chunks 2 ahead of the player
  generateChunksAhead() {
    const tilesize = ChunkGenerator.tilesize;
    const chunkSize = ChunkGenerator.chunksize;
    const playerTileX = Math.floor(this.scene.player.MC.x / tilesize);
    const currentChunk = Math.floor(playerTileX / chunkSize);

    while (this.lastGeneratedChunk <= currentChunk + 2) {
      const nextChunkStart = this.lastGeneratedChunk * chunkSize;
      this.generateChunk(nextChunkStart);
      this.lastGeneratedChunk++;
    }
  }
}
