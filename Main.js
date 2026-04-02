import PreloadStuff from './src/scenes/PreloadStuff.js';
import MenuScreen from './src/scenes/MenuScreen.js';
import GameScreen from './src/scenes/GameScreen.js';
import DeathScreen from './src/scenes/DeathScreen.js';
import IntroScreen from './src/scenes/IntroScreen.js';
import Leaderboard from './src/scenes/Leaderboard.js';

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 550,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true
    }
  },
  scene: [PreloadStuff, GameScreen, DeathScreen]
};

new Phaser.Game(config);