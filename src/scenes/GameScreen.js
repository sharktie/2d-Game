import Input from '../system/input.js';
import Player from '../entities/Player.js';
import ChunkGenerator from '../world/ChunkGen.js';
import { submitScore } from '../system/firebase.js';
import { setupCamera } from '../system/Camera.js';

export default class GameScreen extends Phaser.Scene {
  
  // Constants
  static chunkwidth = 20;
  static tilesize = 32;
  static deathheight = 1000;
  static cleanupdistance = 800;
  static scoreboard = 10;

  constructor() {
    super('GameScreen');
  }

  create(data) {
    // Player setup
    this.playerName = data.playerName || "Player";
    this.dead = false;
    this.score = 0;
    this.lastGeneratedChunk = 1;

    // Input and player
    this.inputSystem = new Input(this);
    this.player = new Player(this, 100, 300, this.inputSystem);

    // Physics groups
    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ 
      immovable: true, 
      allowGravity: false 
    });
    this.enemies = this.physics.add.group();
    this.coins = this.physics.add.staticGroup();

    // World generation
    this.generator = new ChunkGenerator(this);
    this.generator.createStartingPlatform();
    this.generator.generateChunk(0);

    // Colliders
    this.physics.add.collider(this.player.MC, this.platforms);
    this.physics.add.collider(this.player.MC, this.movingPlatforms);
    this.physics.add.overlap(this.player.MC, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player.MC, this.coins, this.collectCoin, null, this);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);

    // Camera
    setupCamera(this, this.player.MC, -20);

    // UI
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    this.scoreText.setScrollFactor(0); // Fixed to screen
  }

  update() {

    const deltaTime = this.game.loop.delta;
    
    if (this.dead) return; // Stop processing if dead

    this.player.update(deltaTime);

    // Update score
    this.updateScore();

    // Generate chunks ahead of player
    this.generateChunksAhead();

    // Clean up off-screen objects
    this.cleanupOffScreenObjects();

    // Check death condition
    this.checkDeathCondition();

  this.enemies.children.iterate((enemySprite) => {
  if (!enemySprite || !enemySprite.active) return;
  if (enemySprite.enemyRef) enemySprite.enemyRef.update();

  // Manual kill check — backup for physics overlap
  if (!this.dead && Phaser.Math.Distance.Between(
    this.player.MC.x, this.player.MC.y,
    enemySprite.x, enemySprite.y
  ) < 28) {
    this.hitEnemy(this.player.MC, enemySprite);
  }
});

 
  
  }

 

  updateScore() {
    const newScore = Math.floor(this.player.MC.x / GameScreen.scoreboard);
    this.score = Math.max(this.score, newScore);
    this.scoreText.setText(`Score: ${this.score}`);
  }

  generateChunksAhead() {
    const playerTileX = Math.floor(this.player.MC.x / GameScreen.tilesize);
    const currentChunk = Math.floor(playerTileX / GameScreen.chunkwidth);

    while (this.lastGeneratedChunk <= currentChunk + 2) {
      const nextChunkStart = this.lastGeneratedChunk * GameScreen.chunkwidth;
      this.generator.generateChunk(nextChunkStart);
      this.lastGeneratedChunk++;
    }
  }

  cleanupOffScreenObjects() {
    const playerX = this.player.MC.x;
    const cleanupThreshold = playerX - GameScreen.cleanupdistance;

    // Clean platforms
    this.platforms.getChildren().forEach(block => {
      if (block.x < cleanupThreshold) {
        block.destroy();
      }
    });

    // Clean moving platforms
    this.movingPlatforms.getChildren().forEach(block => {
      if (block.x < cleanupThreshold) {
        block.destroy();
      }
    });

    // Clean enemies
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.x < cleanupThreshold) {
        enemy.destroy();
      }
    });

    // Clean coins
    this.coins.getChildren().forEach(coin => {
      if (coin.x < cleanupThreshold) {
        coin.destroy();
      }
    });
  }

  checkDeathCondition() {
    if (this.player.MC.y > GameScreen.deathheight) {
      this.dead = true;
      this.handleDeath();
    }
  }

  hitEnemy(player, enemy) { 
    if (this.dead) return; // Prevent multiple hits
    this.dead = true;
    this.handleDeath();
  }

  collectCoin(player, coin) {
    // Make sure this method exists and handles coin collection
    coin.destroy();
    this.score += 5; // Bonus points for coins
    this.scoreText.setText(`Score: ${this.score}`);
  }

  async handleDeath() {
    const name = this.playerName || "Player";

    console.log("Submitting score:", name, this.score);

    // Freeze player
    this.player.MC.setVelocity(0, 0);
    this.player.MC.body.enable = false;

    try {
      await submitScore(name, this.score);
      console.log("Score submitted successfully!");
    } catch (error) {
      console.error("Score submit failed:", error);
    }

    this.registry.set('playerScore', this.score);
    this.scene.start('DeathScreen', {
      score: this.score
    });
  }
}