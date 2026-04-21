import PreloadStuff    from './src/scenes/PreloadStuff.js';
import MenuScreen      from './src/scenes/MenuScreen.js';
import LevelSelector   from './src/scenes/LevelSelector.js';
import GameScreen      from './src/scenes/GameScreen.js';
import DeathScreen     from './src/scenes/DeathScreen.js';
import LevelComplete   from './src/scenes/LevelComplete.js';
import IntroScreen     from './src/scenes/IntroScreen.js';
import Leaderboard     from './src/scenes/Leaderboard.js';
import SettingsScreen  from './src/scenes/SettingsScreen.js';

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 550,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false   // set true to see hitboxes during development
    }
  },
  scene: [
    PreloadStuff,
    IntroScreen,
    MenuScreen,
    LevelSelector,
    Leaderboard,
    GameScreen,
    DeathScreen,
    LevelComplete,
    SettingsScreen
  ]
};

new Phaser.Game(config);
