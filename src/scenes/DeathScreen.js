import {css} from '../system/css.js';

export default class DeathScreen extends Phaser.Scene {
  constructor() {
    super('DeathScreen');
  }

  create(data) {
    const { width, height } = this.scale;
    const score      = data?.score        ?? 0;
    const levelId    = data?.levelId      ?? null;
    const checkpoint = data?.checkpoint   ?? null; // { x, y } respawn position

    //  Dark overlay 
    const overlay = this.add.graphics();
    overlay.fillStyle(css('#000000'), 0.78);
    overlay.fillRect(0, 0, width, height);

    // Scanlines for retro effect 
    const scanlines = this.add.graphics();
    for (let y = 0; y < height; y += 4) {
      scanlines.fillStyle(css('#56a936'), 0.15);
      scanlines.fillRect(0, y, width, 2);
    }

    // Title 
    this.add.text(width / 2, height / 2 - 130, 'GAME OVER', {
      fontFamily: '"Press Start 2P"',
      fontSize: '32px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 5,
      shadow: { offsetX: 4, offsetY: 4, color: '#550000', blur: 0, fill: true }
    }).setOrigin(0.5);

    //  Score / Level info 
    if (!levelId) {
      this.add.text(width / 2, height / 2 - 65, `SCORE: ${score}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '16px',
        color: '#ffaaaa',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);
    } else {
      this.add.text(width / 2, height / 2 - 65, `LEVEL ${levelId} FAILED`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '13px',
        color: '#ffaaaa',
        stroke: '#000',
        strokeThickness: 3
      }).setOrigin(0.5);
    }

    // Buttons 
    //only show checkpoint button if checkpoint exists
    const hasCheckpoint = !!checkpoint && !!levelId;

    const btnDefs = [];

    if (hasCheckpoint) {
      btnDefs.push({
        label: 'CHECKPOINT',
        color: '#00ff88',
        hoverFill: css('#004422'),
        baseFill:  css('#002211'),
        borderHover: css('#00ff88'),
        borderBase:  css('#00aa55'),
        action: () => this.scene.start('GameScreen', {
          level:      levelId,
          checkpoint: checkpoint
        })
      });
    }

    btnDefs.push(
      {
        label: 'RETRY',
        color: '#ffffff',
        hoverFill: css('#550000'),
        baseFill:  css('#111111'),
        borderHover: css('#ff4444'),
        borderBase:  css('#aaaaaa'),
        action: () => this.scene.start('GameScreen', { level: levelId })
      },
      {
        label: 'LEVELS',
        color: '#ffffff',
        hoverFill: css('#550000'),
        baseFill:  css('#111111'),
        borderHover: css('#ff4444'),
        borderBase:  css('#aaaaaa'),
        action: () => this.scene.start('LevelSelector')
      },
      {
        label: 'SCORES',
        color: '#ffffff',
        hoverFill: css('#550000'),
        baseFill:  css('#111111'),
        borderHover: css('#ff4444'),
        borderBase:  css('#aaaaaa'),
        action: () => this.scene.start('Leaderboard')
      }
    );

    const btnW   = 148;
    const btnH   = 52;
    const gap    = 16;
    const totalW = btnDefs.length * btnW + (btnDefs.length - 1) * gap;
    let bx       = width / 2 - totalW / 2;
    const btnY   = height / 2 + 10;

    btnDefs.forEach(({ label, color, hoverFill, baseFill, borderHover, borderBase, action }) => {
      const localX = bx;
      const gfx = this.add.graphics();
      this._drawBtn(gfx, localX, btnY, btnW, btnH, false, baseFill, borderBase);

      const txt = this.add.text(localX + btnW / 2, btnY + btnH / 2, label, {
        fontFamily: '"Press Start 2P"',
        fontSize: '11px',
        color: color,
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);

      txt.setInteractive({ useHandCursor: true });
      txt.on('pointerover', () => this._drawBtn(gfx, localX, btnY, btnW, btnH, true, hoverFill, borderHover));
      txt.on('pointerout',  () => this._drawBtn(gfx, localX, btnY, btnW, btnH, false, baseFill, borderBase));
      txt.on('pointerdown', action);

      bx += btnW + gap;
    });

    // ── Checkpoint hint text ──────────────────────────────────────────────
    if (hasCheckpoint) {
      this.add.text(width / 2, btnY + btnH + 20, '★ RESTART FROM LAST CHECKPOINT', {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        color: '#00cc66',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);
    }
  }

  _drawBtn(gfx, x, y, w, h, hover, hoverFill, borderHover) {
    // Called with hoverFill as fill color and borderHover as border
    // For non-hover, these are the base values passed in
    gfx.clear();
    gfx.fillStyle(hoverFill, hover ? 0.95 : 0.8);
    gfx.fillRect(x, y, w, h);
    gfx.lineStyle(3, borderHover, 1);
    gfx.strokeRect(x, y, w, h);
    gfx.lineStyle(1, hover ? css('#ffffff') : css('#555555'), 0.4);
    gfx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  }
}
