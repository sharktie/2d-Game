export default class PreloadStuff extends Phaser.Scene {

  constructor() {
    super('PreloadStuff');
  }

  preload() {
     this.load.image('player', 'Assets/player.png');   //player image
     this.load.image('platform', 'Assets/platform.png');    //platform image
     this.load.image('bg', 'Assets/bg.png');   //background image
     this.load.image('coin', 'Assets/coin.png'); //coin image
     this.load.image('brick', 'Assets/brick.png'); //brick image
     this.load.image('enemy', 'Assets/enemy.png'); //enemy image

     this.load.audio('menu', 'Assets/menu.mp3');   //menu music
     this.load.audio('type', 'Assets/type.mp3');   //typewriter sound
     this.load.audio('bgm', 'Assets/bgm.mp3');     //background music
     this.load.audio('jump', 'Assets/jump.mp3');   //jump sound
     this.load.audio('dash', 'Assets/dash.mp3');   //dash sound
     this.load.audio('death', 'Assets/death.mp3'); //death sound
     }

  create() {
   // this.scene.start('GameScreen');  //testing
    this.scene.start('MenuScreen');   
  }

}