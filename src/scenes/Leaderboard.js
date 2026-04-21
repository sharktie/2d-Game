import { getLeaderboard } from '../system/firebase.js';
import { css } from '../system/css.js';

export default class Leaderboard extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#000000');

    // Scanlines
    const scanlines = this.add.graphics();
    for (let y = 0; y < height; y += 4) {
      scanlines.fillStyle(css('#001100'), 0.4);
      scanlines.fillRect(0, y, width, 2);
    }

    this.add.text(width / 2, 60, 'HIGH SCORES', {
      fontFamily: '"Press Start 2P"',
      fontSize: '22px',
      color: '#00FF00',
      stroke: '#003300',
      strokeThickness: 3,
      shadow: { offsetX: 3, offsetY: 3, color: '#003300', blur: 0, fill: true }
    }).setOrigin(0.5);

    // divider
    this.add.text(width / 2, 100, '========================', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#005500'
    }).setOrigin(0.5);

    getLeaderboard().then(scores => {
      const top5 = scores.slice(0, 5);
      const medals = ['01', '02', '03', '04', '05'];
      const colors = ['#ffdd00', '#aaaaaa', '#cc8844', '#00ff88', '#00ff88'];

      top5.forEach((s, i) => {
        const y = 130 + i * 44;
        this.add.text(width / 2, y,
          `${medals[i]}. ${s.name.toUpperCase().padEnd(10)} ${String(s.score).padStart(6)}`,
          {
            fontFamily: '"Press Start 2P"',
            fontSize: '13px',
            color: colors[i],
            stroke: '#000',
            strokeThickness: 2
          }
        ).setOrigin(0.5);
      });

      if (top5.length === 0) {
        this.add.text(width / 2, 160, 'NO SCORES YET', {
          fontFamily: '"Press Start 2P"',
          fontSize: '12px',
          color: '#445544'
        }).setOrigin(0.5);
      }

      // Divider
      this.add.text(width / 2, 360, '========================', {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        color: '#005500'
      }).setOrigin(0.5);

      const yourScore = this.registry.get('playerScore') || 0;
      this.add.text(width / 2, 385, `YOUR SCORE: ${yourScore}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#FF00FF',
        stroke: '#330033',
        strokeThickness: 3
      }).setOrigin(0.5);

    }).catch(err => {
      console.error("Error fetching leaderboard:", err);
      this.add.text(width / 2, 200, 'COULD NOT\nLOAD SCORES', {
        fontFamily: '"Press Start 2P"',
        fontSize: '13px',
        color: '#ff4444',
        align: 'center',
        lineSpacing: 10
      }).setOrigin(0.5);
    });

    // ── Back button ───────────────────────────────────────────────────────
    const boxW = 200;
    const boxH = 52;
    const boxX = width / 2 - boxW / 2;
    const boxY = height - 80;

    const box = this.add.graphics();
    this._drawBtn(box, boxX, boxY, boxW, boxH, false);

    const menu = this.add.text(width / 2, boxY + boxH / 2, 'MENU', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    menu.setInteractive({ useHandCursor: true });
    menu.on('pointerover', () => this._drawBtn(box, boxX, boxY, boxW, boxH, true));
    menu.on('pointerout',  () => this._drawBtn(box, boxX, boxY, boxW, boxH, false));
    menu.on('pointerdown', () => this.scene.start('MenuScreen'));
  }

  _drawBtn(gfx, x, y, w, h, hover) {
  gfx.clear();
  gfx.fillStyle(
    hover ? css("#003300") : css("#001100"),
    hover ? 0.95 : 0.8
  );

  gfx.fillRect(x, y, w, h);
  gfx.lineStyle(
    2,
    hover ? css("#00ff44") : css("#00aa22"),
    1
  );
  gfx.strokeRect(x, y, w, h);
}
}
