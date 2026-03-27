import Input from '../system/input.js';
import Player from '../entities/Player.js';
import ChunkGenerator from '../world/ChunkGen.js';
import { submitScore } from '../system/firebase.js';

export default class GameScreen extends Phaser.Scene {

  constructor() {
    super('GameScreen');
  }

 

  create(data) {

    this.playerName = data.playerName || "Player";                   //receiving name
    this.dead = false
    this.score = 0;                                                          //score var
    this.platforms = this.physics.add.staticGroup();

    this.inputSystem = new Input(this);
    this.player = new Player(this, 100, 300, this.inputSystem);                   //Graphics basically

    this.chunk = new ChunkGenerator(this, this.platforms);
    this.physics.add.collider(this.player.MC, this.platforms);

    this.cameras.main.startFollow(this.player.MC, true, 0.08, 0.08);

    this.scoreText = this.add.text(20, 20, 'Score: 0', {
     fontSize: '24px',
     color: '#ffffff'
    });

  }

  update() {
    this.player.update();
    this.score = Math.max(this.score, Math.floor(this.player.MC.x / 10));
    this.scoreText.setText('Score: ' + this.score);
    this.chunk.update(this.player.MC.x);                       //the game loop


    if (!this.dead && this.player.MC.y > 1000) {
     this.dead = true;
     this.handleDeath();
    }
  }

async handleDeath() {
  const name = this.playerName || "Player";

  console.log("Submitting score:", name, this.score);

  // freeze player
  this.player.MC.setVelocity(0, 0);
  this.player.MC.body.enable = false;

  try {
    await submitScore(name, this.score);
    console.log("Score submitted successfully!");  // great success
  } catch (e) {
    console.error("Score submit failed:", e);     // oh no
  }

  this.registry.set('playerScore', this.score);
  this.scene.start('DeathScreen', {
    score: this.score
  });
 }
}           

