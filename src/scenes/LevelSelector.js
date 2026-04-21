// LevelSelector 
import { LEVEL_LIST } from '../world/Levels/LevelRegistry.js';
import { getStars, countStars } from '../system/StarTracker.js';
import { css } from '../system/css.js';


export default class LevelSelector extends Phaser.Scene {
  constructor() {
    super('LevelSelector');
  }

 

  create() {
    const { width, height } = this.scale;

    // Background 
    const scanlines = this.add.graphics();
    for (let y = 0; y < height; y += 4) {
      scanlines.fillStyle(0x000000, 0.12);
      scanlines.fillRect(0, y, width, 2);
    }

    //  Title
    this.add.text(width / 2, 48, 'SELECT LEVEL', {
      fontFamily: '"Press Start 2P"',
      fontSize: '22px',
      color: '#ff2222',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    // Level grid 
    const btnW     = 160;
    const btnH     = 90;
    const cols     = 3;
    const padX     = 60;
    const padY     = 105;
    const spacingX = (width - padX * 2 - cols * btnW) / Math.max(cols - 1, 1) + btnW;
    const spacingY = btnH + 24;

    LEVEL_LIST.forEach((levelData, idx) => {
      const col  = idx % cols;
      const row  = Math.floor(idx / cols);
      const x    = padX + col * spacingX;
      const y    = padY + row * spacingY;
      const stars = getStars(levelData.id);
      const starCount = countStars(stars);

      const gfx = this.add.graphics();
      this._drawLevelBtn(gfx, x, y, btnW, btnH, false);

      // Level number
      this.add.text(x + btnW / 2, y + 16, `LEVEL ${levelData.id}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);

      // Sub-name
      this.add.text(x + btnW / 2, y + 36, levelData.name.toUpperCase(), {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        color: '#d707aa'
      }).setOrigin(0.5);

      // Stars as pixel text
      const filledStar = '*';
      const emptyStar  = '-';
      const starStr = filledStar.repeat(starCount) + emptyStar.repeat(3 - starCount);
      this.add.text(x + btnW / 2, y + 60, `[${starStr}]`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '11px',
        color: starCount > 0 ? '#ffcc00' : '#444444',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);

      // Hover zone
      const zone = this.add.zone(x + btnW / 2, y + btnH / 2, btnW, btnH)
        .setInteractive({ useHandCursor: true });

      zone.on('pointerover', () => this._drawLevelBtn(gfx, x, y, btnW, btnH, true));
      zone.on('pointerout',  () => this._drawLevelBtn(gfx, x, y, btnW, btnH, false));
      zone.on('pointerdown', () => {
        this.scene.start('GameScreen', { level: levelData.id });
      });
    });

    //Infinite Mode
    const infY = padY + Math.ceil(LEVEL_LIST.length / cols) * spacingY + 10;
    const infW = 260;
    const infX = width / 2 - infW / 2;

    const infGfx = this.add.graphics();
    this._drawInfBtn(infGfx, infX, infY, infW, 48, false);

    const infTxt = this.add.text(width / 2, infY + 24, 'INFINITE MODE', {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      color: '#ffcc44',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    infTxt.setInteractive({ useHandCursor: true });
    infTxt.on('pointerover', () => this._drawInfBtn(infGfx, infX, infY, infW, 48, true));
    infTxt.on('pointerout',  () => this._drawInfBtn(infGfx, infX, infY, infW, 48, false));
    infTxt.on('pointerdown', () => this.scene.start('GameScreen', { level: null }));

    // ── Back button ───────────────────────────────────────────────────────
    const back = this.add.text(width / 2, height - 36, '< BACK', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    back.on('pointerover',  () => back.setColor('#ffee44'));
    back.on('pointerout',   () => back.setColor('#ffffff'));
    back.on('pointerdown',  () => this.scene.start('MenuScreen'));
  }

_drawLevelBtn(gfx, x, y, w, h, hover) {
  gfx.clear();
  gfx.fillStyle(
    hover ? css("#282968") : css("#1d3134"),
    hover ? 0.95 : 0.9
  );
  gfx.fillRect(x, y, w, h);
  gfx.lineStyle(2, hover ? ("#fffefe") : css("#f5f6f7"), 1);
  gfx.strokeRect(x, y, w, h);
  gfx.lineStyle(1, hover ? ("#fafafc") : css("#f6f7f7"), 0.5);
  gfx.strokeRect(x + 2, y + 2, w - 4, h - 4);
}

_drawInfBtn(gfx, x, y, w, h, hover) {
  gfx.clear();
  gfx.fillStyle(
    hover ? css("#332200") : css("#1a1a00"),
    hover ? 0.95 : 0.9
  );
  gfx.fillRect(x, y, w, h);
  gfx.lineStyle(2, hover ? css("#ffcc44") : css("#aa8800"), 1);
  gfx.strokeRect(x, y, w, h);
}
}
