export default class PreloadStuff extends Phaser.Scene {
  constructor() {
    super('PreloadStuff');
  }

  preload() {
    this.load.image('player',   'Assets/player.png');
    this.load.image('platform', 'Assets/platform.png');
    this.load.image('bg',       'Assets/bg.png');
    this.load.image('coin',     'Assets/coin.png');
    this.load.image('brick',    'Assets/brick.png');
    this.load.image('enemy',    'Assets/enemy.png');

    this.load.audio('menu',  'Assets/menu.mp3');
    this.load.audio('type',  'Assets/type.mp3');
    this.load.audio('bgm',   'Assets/bgm.mp3');
    this.load.audio('jump',  'Assets/jump.mp3');
    this.load.audio('dash',  'Assets/dash.mp3');
    this.load.audio('death', 'Assets/death.mp3');
  }

  create() {
  
    this.scene.start('IntroScreen');  // NEW — start the new scene to test it out
  }
}
