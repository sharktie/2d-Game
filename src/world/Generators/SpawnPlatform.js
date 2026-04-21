import ChunkGenerator from '../ChunkGen.js';

export default class SpawnPlatformGenerator {
  constructor(chunkGen) {
    this.chunkGen = chunkGen;
  }

  createStartingPlatform() {
    const startHeight = 10;
    const width = 8;

    for (let i = -3; i < width - 3; i++) {
      this.chunkGen.createBlock(i, startHeight);
    }
    for (let i = -3; i < width - 3; i++) {
      this.chunkGen.createBlock(i, startHeight + 1);
    }

    if (this.chunkGen.scene.player && this.chunkGen.scene.player.MC) {
      this.chunkGen.scene.player.MC.setPosition(
        0 * ChunkGenerator.tilesize,
        (startHeight - 2) * ChunkGenerator.tilesize
      );
    }
  }
}
