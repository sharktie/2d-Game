import { getLeaderboard } from '../system/firebase.js';

export default class Leaderboard extends Phaser.Scene {
    constructor() {
        super('Leaderboard');
    }

   create() {
       const { width, height } = this.scale;
       this.cameras.main.setBackgroundColor('#000000');
       
       this.add.text(width / 2, height / 2 - 100, 'LEADERBOARD', {
           fontSize: '32px',
           color: '#00FF00',
           fontFamily: 'Courier New'
       }).setOrigin(0.5);
       
       getLeaderboard().then(scores => {
           let y = 250;

           const top5 = scores.slice(0, 5);
           top5.forEach((s, i) => {
               this.add.text(width / 2, y, `${i+1}. ${s.name} - ${s.score}`, {
                   fontSize: '24px',
                   color: '#00FF00',
                   fontFamily: 'Courier New'
               }).setOrigin(0.5);
               y += 40;
           });

           const yourScore = this.registry.get('playerScore') || 0;
           this.add.text(width / 2, y + 40, `YOUR SCORE: ${yourScore}`, {
               fontSize: '28px',
               color: '#FF00FF',
               fontFamily: 'Courier New',
               fontStyle: 'bold'
           }).setOrigin(0.5);
       }).catch(err => {
           console.error("Error fetching leaderboard:", err);
       });


    const boxWidth = 200;
    const boxHeight = 60;                     //button box menu
    const boxX = width / 2 - boxWidth / 2;
    const boxY = height / 2 + 20;
    const box = this.add.graphics();

    box.fillStyle(0x000000, 0.6);
    box.fillRoundedRect(boxX + 300, boxY + 150, boxWidth, boxHeight, 10);
    box.lineStyle(2, 0xffffff, 1);
    box.strokeRoundedRect(boxX + 300, boxY + 150, boxWidth, boxHeight, 10);

    const menu = this.add.text(width / 2 + 300 , boxY + boxHeight / 2 + 150, 'MENU', {
      fontSize: '24px',
      color: '#ffffff'                                                               //menu
    }).setOrigin(0.5);

    menu.setInteractive();
    menu.on('pointerdown', () => {
      this.scene.start('MenuScreen');                                // input
    });

   }
      }