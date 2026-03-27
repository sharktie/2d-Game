export default class DeathScreen extends Phaser.Scene {
  constructor() {
    super('DeathScreen');
  }

  create(data) {
    const { width, height } = this.scale;

    const score = data.score || 0;

    
    this.add.text(width / 2, height / 2 - 100, 'YOU DIED', {
      fontFamily: 'Arial',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: {                                                      //gta5 death screen
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        fill: true
      }
    }).setOrigin(0.5);

  
    this.add.text(width / 2, height / 2 -50, 'Your Score: ' + score, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#2f2828',                                //your score thingy
      strokeThickness: 4
    }).setOrigin(0.5);

    const boxWidth = 200;
    const boxHeight = 60;                     //button box retry
    const boxX = width / 2 - boxWidth / 2;
    const boxY = height / 2 + 20;
    const box = this.add.graphics();

    box.fillStyle(0x000000, 0.6);
    box.fillRoundedRect(boxX - 150, boxY, boxWidth, boxHeight, 10);
    box.lineStyle(2, 0xffffff, 1);
    box.strokeRoundedRect(boxX - 150, boxY, boxWidth, boxHeight, 10);

    const retry = this.add.text(width / 2 - 150 , boxY + boxHeight / 2, 'RETRY', {
      fontSize: '24px',
      color: '#ffffff'                                                               //retry
    }).setOrigin(0.5);

    retry.setInteractive();
    retry.on('pointerdown', () => {
      this.scene.start('GameScreen');                                //retry input
    });

    box.fillStyle(0x000000, 0.6);
    box.fillRoundedRect(boxX + 150, boxY, boxWidth, boxHeight, 10);
    box.lineStyle(2, 0xffffff, 1);
    box.strokeRoundedRect(boxX + 150, boxY, boxWidth, boxHeight, 10);
    const menu = this.add.text(width / 2 + 150, boxY + boxHeight / 2, 'LEADERBOARD', {
      fontSize: '24px',
      color: '#ffffff'                                                        //menu
    }).setOrigin(0.5);          

    menu.setInteractive();

    menu.on('pointerdown', () => {
      this.scene.start('Leaderboard');
    });
  }
}