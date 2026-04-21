// LevelComplete — shown when the player reaches the finish flag.
import { LEVEL_LIST } from '../world/Levels/LevelRegistry.js';
import { countStars } from '../system/StarTracker.js';
import { css } from '../system/css.js';

export default class LevelComplete extends Phaser.Scene {
  constructor() {
    super('LevelComplete');
  }

  create(data) {
    const {
      levelId,
      levelName,
      elapsed,
      timeStarSeconds,
      coinsCollected,
      totalCoins,
      starResult
    } = data;

    const { width, height } = this.scale;

    // ── Dark overlay ──────────────────────────────────────────────────────
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.75);
    overlay.fillRect(0, 0, width, height);

    // Scanlines
    const scanlines = this.add.graphics();
    for (let y = 0; y < height; y += 4) {
      scanlines.fillStyle(0x000000, 0.12);
      scanlines.fillRect(0, y, width, 2);
    }

    // ── Title ─────────────────────────────────────────────────────────────
    this.add.text(width / 2, 58, 'LEVEL CLEAR!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '26px',
      color: '#00ff11',
      stroke: '#000000',
      strokeThickness: 5,
      shadow: { offsetX: 3, offsetY: 3, color: '#003300', blur: 0, fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 100, levelName.toUpperCase(), {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#aaffcc',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // ── Stats ─────────────────────────────────────────────────────────────
    const secs = elapsed.toFixed(1);
    this.add.text(width / 2, 132, `TIME: ${secs}s   COINS: ${coinsCollected}/${totalCoins}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#aaffcc',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // ── Stars ─────────────────────────────────────────────────────────────
    const earned = starResult.earned;
    const starDefs = [
      { bit: 1, label: 'COMPLETE',                         hint: '' },
      { bit: 2, label: 'ALL COINS',                        hint: `${coinsCollected}/${totalCoins}` },
      { bit: 4, label: `<${timeStarSeconds}S`,             hint: `${secs}s` }
    ];

    const starY  = 220;
    const gapX   = 180;
    const startX = width / 2 - gapX;

    starDefs.forEach((def, i) => {
      const got = (earned & def.bit) !== 0;
      const cx  = startX + i * gapX;

      // Star box (pixel-style)
      const gfx = this.add.graphics();
      gfx.fillStyle(got ? css('#ffaa00') : css('#222222'), 1);
      gfx.fillRect(cx - 36, starY - 36, 72, 72);
      gfx.lineStyle(3, got ? css('#ffee44') : css('#444444'), 1);
      gfx.strokeRect(cx - 36, starY - 36, 72, 72);
      // Inner glow border
      if (got) {
        gfx.lineStyle(1, css('#ffffff'), 0.4);
        gfx.strokeRect(cx - 33, starY - 33, 66, 66);
      }

      // Star character
      this.add.text(cx, starY, got ? '*' : '-', {
        fontFamily: '"Press Start 2P"',
        fontSize: '28px',
        color: got ? css('#ffffff') : css('#555555'),
        stroke: css('#000'),
        strokeThickness: 2
      }).setOrigin(0.5, 0.5);

      // Star label
      this.add.text(cx, starY + 46, def.label, {
        fontFamily: '"Press Start 2P"',
        fontSize: '7px',
        color: got ? css('#ffee88') : css('#555555'),
        align: 'center',
        wordWrap: { width: 140 }
      }).setOrigin(0.5, 0);

      // Hint
      if (def.hint) {
        this.add.text(cx, starY + 60, def.hint, {
          fontFamily: '"Press Start 2P"',
          fontSize: '7px',
          color: got ? css('#aaffaa') : css('#444444')
        }).setOrigin(0.5, 0);
      }
    });

    // ── Best ever ─────────────────────────────────────────────────────────
    const totalEarned = countStars(starResult.total);
    const bestStr = `BEST: [${'*'.repeat(totalEarned)}${'-'.repeat(3 - totalEarned)}]`;
    this.add.text(width / 2, starY + 82, bestStr, {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#88ffcc',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    if (starResult.newBest) {
      const newBest = this.add.text(width / 2, starY + 104, '!! NEW BEST !!', {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        color: '#ffdd44',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);

      // Blink animation
      this.time.addEvent({
        delay: 400,
        loop: true,
        callback: () => newBest.setAlpha(newBest.alpha > 0 ? 0 : 1)
      });
    }

    // ── Buttons ───────────────────────────────────────────────────────────
    const btnY = height - 100;
    const btnDefs = this._buildButtonList(levelId);

    const btnW       = 140;
    const btnH       = 46;
    const btnSpacing = 16;
    const totalWidth = btnDefs.length * btnW + (btnDefs.length - 1) * btnSpacing;
    let bx = width / 2 - totalWidth / 2;

    btnDefs.forEach(({ label, action }) => {
      const localX = bx;
      const gfx = this.add.graphics();
      this._drawBtn(gfx, localX, btnY, btnW, btnH, false);

      const txt = this.add.text(localX + btnW / 2, btnY + btnH / 2, label, {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);

      txt.setInteractive({ useHandCursor: true });
      txt.on('pointerover',  () => this._drawBtn(gfx, localX, btnY, btnW, btnH, true));
      txt.on('pointerout',   () => this._drawBtn(gfx, localX, btnY, btnW, btnH, false));
      txt.on('pointerdown',  action);

      bx += btnW + btnSpacing;
    });
  }

  _drawBtn(gfx, x, y, w, h, hover) {
    gfx.clear();
    gfx.fillStyle(hover ? 0x333333 : 0x111111, hover ? 0.95 : 0.85);
    gfx.fillRect(x, y, w, h);
    gfx.lineStyle(2, hover ? 0xffee00 : 0xaaaaaa, 1);
    gfx.strokeRect(x, y, w, h);
    gfx.lineStyle(1, hover ? 0xffcc44 : 0x555555, 0.5);
    gfx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  }

  _buildButtonList(levelId) {
    const sortedIds = LEVEL_LIST.map(l => l.id);
    const currentIdx = sortedIds.indexOf(levelId);
    const nextId = sortedIds[currentIdx + 1] ?? null;

    const buttons = [
      {
        label: 'RETRY',
        action: () => this.scene.start('GameScreen', { level: levelId })
      },
      {
        label: 'LEVELS',
        action: () => this.scene.start('LevelSelector')
      },
      {
        label: 'MENU',
        action: () => this.scene.start('MenuScreen')
      }
    ];

    if (nextId !== null) {
      buttons.splice(1, 0, {
        label: 'NEXT >',
        action: () => this.scene.start('GameScreen', { level: nextId })
      });
    }

    return buttons;
  }
}
