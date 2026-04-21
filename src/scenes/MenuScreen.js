// MenuScreen — main menu 

import { css } from '../system/css.js';



export default class MenuScreen extends Phaser.Scene {

  
  constructor() {
    super('MenuScreen');
  }

  create() {
    const { width, height } = this.scale;
    

    // ── Title ─────────────────────────────────────────────────────────────
    this.add.text(width / 2, height / 2 - 120, 'RUN FROM YOUR PROBLEMS', {
      fontFamily: '"Press Start 2P"',
      fontSize: '36px',
      color: '#ff2222',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 4, offsetY: 4, color: '#880000', blur: 0, fill: true }
    }).setOrigin(0.5);

    // Subtitle flicker effect
    const sub = this.add.text(width / 2, height / 2 - 68, '- DROP OUT EDITION -', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#ff8888',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => sub.setAlpha(sub.alpha > 0 ? 0 : 1)
    });

    //  buttons
    const btnDefs = [
      { label: 'PLAY',        action: () => this.scene.start('LevelSelector') },
      { label: 'LEADERBOARD', action: () => this.scene.start('Leaderboard') },
      { label: 'SETTINGS', action: () => this.scene.start('SettingsScreen') }
    ];

    const btnW   = 190;
    const btnH   = 58;
    const gap    = 28;
    const totalW = btnDefs.length * btnW + (btnDefs.length - 1) * gap;
    let bx       = width / 2 - totalW / 2;
    const btnY   = height / 2 + 10;

    btnDefs.forEach(({ label, action }) => {
      const capturedBx = bx;
      const gfx = this.add.graphics();
      this._drawBtn(gfx, capturedBx, btnY, btnW, btnH, false);

      const txt = this.add.text(capturedBx + btnW / 2, btnY + btnH / 2, label, {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);

      txt.setInteractive({ useHandCursor: true });
      txt.on('pointerover',  () => this._drawBtn(gfx, capturedBx, btnY, btnW, btnH, true));
      txt.on('pointerout',   () => this._drawBtn(gfx, capturedBx, btnY, btnW, btnH, false));
      txt.on('pointerdown',  action);

      bx += btnW + gap;
    });

    // ── Touch Controls 
    this._buildTouchToggle(width, height, btnY, btnH);
  }

 _drawBtn(gfx, x, y, w, h, hover) {
  gfx.clear();

  gfx.fillStyle(
    hover ? css("#330000") : css("#111111"),
    hover ? 0.95 : 0.8
  );

  gfx.fillRect(x, y, w, h);

  gfx.lineStyle(
    3,
    hover ? css("#ff4444") : css("#ffffff"),
    1
  );

  gfx.strokeRect(x, y, w, h);

  // Pixel-style inner highlight
  gfx.lineStyle(
    1,
    hover ? css("#ff8888") : css("#888888"),
    0.5
  );

  gfx.strokeRect(x + 2, y + 2, w - 4, h - 4);
}

  _buildTouchToggle(width, height, mainBtnY, mainBtnH) {
    const tW  = 280;
    const tH  = 46;
    const tX  = width / 2 - tW / 2;
    const tY  = mainBtnY + mainBtnH + 20;

    const gfx = this.add.graphics();
    const label = () => `TOUCH: ${localStorage.getItem('platformer_touch') === 'true' ? 'ON' : 'OFF'}`;

    const touchOn = localStorage.getItem('platformer_touch') === 'true';
    this._drawTouchBtn(gfx, tX, tY, tW, tH, touchOn, false);

    const txt = this.add.text(width / 2, tY + tH / 2, label(), {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    txt.setInteractive({ useHandCursor: true });

    txt.on('pointerover', () => {
      this._drawTouchBtn(gfx, tX, tY, tW, tH,
        localStorage.getItem('platformer_touch') === 'true', true);
    });
    txt.on('pointerout', () => {
      this._drawTouchBtn(gfx, tX, tY, tW, tH,
        localStorage.getItem('platformer_touch') === 'true', false);
    });
    txt.on('pointerdown', () => {
      const current = localStorage.getItem('platformer_touch') === 'true';
      localStorage.setItem('platformer_touch', String(!current));
      txt.setText(label());
      this._drawTouchBtn(gfx, tX, tY, tW, tH, !current, false);
    });
  }

  _drawTouchBtn(gfx, x, y, w, h, active, hover) {
  gfx.clear();

  const fill = active
    ? (hover ? css("#005522") : css("#003311"))
    : (hover ? css("#221100") : css("#111111"));

  gfx.fillStyle(fill, 0.9);
  gfx.fillRect(x, y, w, h);

  gfx.lineStyle(
    2,
    active ? css("#44ff88") : css("#666666"),
    1
  );
  gfx.strokeRect(x, y, w, h);
}
}
