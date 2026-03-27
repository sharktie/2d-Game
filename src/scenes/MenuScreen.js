

export default class MenuScreen extends Phaser.Scene {
  constructor() {
    super('MenuScreen');
  }

  create() {
   const { width, height } = this.scale;
   

    this.add.text(width / 2, height / 2 - 100, 'GAME', {
      fontFamily: 'Arial',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: {                                                      //game name pls improve
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        fill: true
      }
    }).setOrigin(0.5);

    const boxWidth = 200;
    const boxHeight = 60;                     //button box
    const boxX = width / 2 - boxWidth / 2;
    const boxY = height / 2 + 20;
    const box = this.add.graphics();

    box.fillStyle(0x000000, 0.6);
    box.fillRoundedRect(boxX - 150, boxY, boxWidth, boxHeight, 10);
    box.lineStyle(2, 0xffffff, 1);
    box.strokeRoundedRect(boxX - 150, boxY, boxWidth, boxHeight, 10);

    const retry = this.add.text(width / 2 - 150 , boxY + boxHeight / 2, 'START', {
      fontSize: '24px',
      color: '#ffffff'                                                               //start
    }).setOrigin(0.5);

    retry.setInteractive();
    retry.on('pointerdown', () => {
      this.scene.start('IntroScreen');                                //start
    });

    box.fillStyle(0x000000, 0.6);
    box.fillRoundedRect(boxX + 150, boxY, boxWidth, boxHeight, 10);
    box.lineStyle(2, 0xffffff, 1);
    box.strokeRoundedRect(boxX + 150, boxY, boxWidth, boxHeight, 10);

    const menu = this.add.text(width / 2 + 150, boxY + boxHeight / 2, 'LEADERBOARD', {
      fontSize: '24px',
      color: '#ffffff'                                                        //Leaderboard
    }).setOrigin(0.5);          

    menu.setInteractive();

     menu.on('pointerdown', () => {
     this.scene.start('Leaderboard');                 //leaderboard
     });

  }
}





























