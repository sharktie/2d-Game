import ChunkGenerator from '../ChunkGen.js';

export default class StairsGenerator {
  constructor(chunkGen) {
    this.chunkGen = chunkGen;
  }

  // Returns the column after the last stair step
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
      this.chunkGen.createBlock(col, currentHeight);
      col++;
    }

    // At difficulty 2+, occasionally spawn an enemy on the staircase
    const timeSinceStart = Date.now() - this.chunkGen.gameStartTime;
    const stairEnemyChance = Math.max(0, (this.chunkGen.difficulty - 1.5) * 0.2);

    if (timeSinceStart > 2000 && steps >= 3 && Math.random() < stairEnemyChance) {
      const midStep = startCol + Math.floor(steps / 2);
      const playerTileX = Math.floor(
        this.chunkGen.scene.player.MC.x / ChunkGenerator.tilesize
      );
      if (midStep > playerTileX + 5) {
        const stepHeight = this.chunkGen.getHeightAtCol(midStep);
        this.chunkGen.spawnEnemy(midStep, stepHeight - 1);
      }
    }

    return col;
  }
}
