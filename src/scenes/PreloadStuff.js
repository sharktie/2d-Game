export default class PreloadStuff extends Phaser.Scene {

  constructor() {
    super('PreloadStuff');
  }

  preload() {
     this.load.image('player', 'assets/player.png');   //player image
     this.load.image('platform', 'assets/platform.png');    //platform image
     this.load.image('bg', 'assets/bg.png');   //background image

     this.load.audio('menu', 'assets/menu.mp3');   //menu music
     this.load.audio('type', 'assets/type.mp3');   //typewriter sound
     this.load.audio('bgm', 'assets/bgm.mp3');     //background music
     this.load.audio('jump', 'assets/jump.mp3');   //jump sound
     this.load.audio('dash', 'assets/dash.mp3');   //dash sound
     this.load.audio('death', 'assets/death.mp3'); //death sound
     }

  create() {
    this.scene.start('MenuScreen');
  }

}