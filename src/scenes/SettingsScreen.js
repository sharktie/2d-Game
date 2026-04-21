import { css } from "../system/css.js";

export const DEFAULT_BINDINGS = {
  left:  'ArrowLeft',
  right: 'ArrowRight',
  jump:  'ArrowUp'
};

export function loadBindings() {
  try {
    const stored = localStorage.getItem('platformer_bindings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_BINDINGS, ...parsed };
    }
  } catch (_) { /* ignore */ }
  return { ...DEFAULT_BINDINGS };
}

export function saveBindings(bindings) {
  try {
    localStorage.setItem('platformer_bindings', JSON.stringify(bindings));
  } catch (_) { /* ignore */ }
}

// Human-readable label for a key
function keyLabel(key) {
  const map = {
    ArrowLeft:  '← LEFT',
    ArrowRight: '→ RIGHT',
    ArrowUp:    '↑ UP',
    ArrowDown:  '↓ DOWN',
    Space:      'SPACE',
    ShiftLeft:  'L.SHIFT',
    ShiftRight: 'R.SHIFT',
    KeyW: 'W', KeyA: 'A', KeyS: 'S', KeyD: 'D',
    KeyZ: 'Z', KeyX: 'X', KeyC: 'C'
  };
  return map[key] || key.replace(/^Key/, '').replace(/^Arrow/, '↑').slice(0, 8);
}

export default class SettingsScreen extends Phaser.Scene {
  constructor() {
    super('SettingsScreen');
  }

  create() {
    const { width, height } = this.scale;
    this.bindings = loadBindings();
    this._listening = null; // which action is being remapped ('left'|'right'|'jump'|null)

    // ── Background ────────────────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a0a, 1);
    bg.fillRect(0, 0, width, height);

    // Scanlines
    const scanlines = this.add.graphics();
    for (let y = 0; y < height; y += 4) {
      scanlines.fillStyle(0x000000, 0.12);
      scanlines.fillRect(0, y, width, 2);
    }

    // ── Title ─────────────────────────────────────────────────────────────
    this.add.text(width / 2, 60, 'SETTINGS', {
      fontFamily: '"Press Start 2P"',
      fontSize: '26px',
      color: '#ff2222',
      stroke: '#000',
      strokeThickness: 5,
      shadow: { offsetX: 3, offsetY: 3, color: '#880000', blur: 0, fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 100, '— KEY BINDINGS —', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#888888',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // ── Key binding rows ──────────────────────────────────────────────────
    const actions = [
      { key: 'left',  label: 'MOVE LEFT' },
      { key: 'right', label: 'MOVE RIGHT' },
      { key: 'jump',  label: 'JUMP' }
    ];

    this._rows = {};
    const startY = 170;
    const rowH   = 80;

    actions.forEach(({ key, label }, i) => {
      const y = startY + i * rowH;

      // Action label
      this.add.text(width / 2 - 160, y, label, {
        fontFamily: '"Press Start 2P"',
        fontSize: '11px',
        color: '#cccccc',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0, 0.5);

      // Key button
      const btnX = width / 2 + 20;
      const btnW = 170;
      const btnH = 42;
      const gfx  = this.add.graphics();
      const txt  = this.add.text(btnX + btnW / 2, y, keyLabel(this.bindings[key]), {
        fontFamily: '"Press Start 2P"',
        fontSize: '11px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5);

      this._rows[key] = { gfx, txt, btnX, y, btnW, btnH };
      this._drawKeyBtn(key, false);

      txt.setInteractive({ useHandCursor: true, hitArea: new Phaser.Geom.Rectangle(btnX - txt.width / 2, y - btnH / 2, btnW, btnH), hitAreaCallback: Phaser.Geom.Rectangle.Contains });

      // Make graphic also clickable
      gfx.setInteractive(new Phaser.Geom.Rectangle(btnX, y - btnH / 2, btnW, btnH), Phaser.Geom.Rectangle.Contains);

      const startListen = () => {
        if (this._listening === key) {
          // Cancel
          this._listening = null;
          this._drawKeyBtn(key, false);
          this._updateHint('');
        } else {
          this._listening = key;
          actions.forEach(a => {
            if (a.key !== key) this._drawKeyBtn(a.key, false);
          });
          this._drawKeyBtn(key, true, true);
          this._updateHint(`PRESS A KEY TO BIND "${label}"... (ESC to cancel)`);
        }
      };

      txt.on('pointerdown', startListen);
      gfx.on('pointerdown', startListen);
      txt.on('pointerover', () => { if (this._listening !== key) this._drawKeyBtn(key, true, false); });
      txt.on('pointerout',  () => { if (this._listening !== key) this._drawKeyBtn(key, false); });
      gfx.on('pointerover', () => { if (this._listening !== key) this._drawKeyBtn(key, true, false); });
      gfx.on('pointerout',  () => { if (this._listening !== key) this._drawKeyBtn(key, false); });
    });

    // ── Hint text ─────────────────────────────────────────────────────────
    this._hintTxt = this.add.text(width / 2, startY + actions.length * rowH + 10, '', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#ffee44',
      stroke: '#000',
      strokeThickness: 2,
      wordWrap: { width: 500 },
      align: 'center'
    }).setOrigin(0.5);

    // ── Reset to defaults button ──────────────────────────────────────────
    const resetY = height - 120;
    const resetGfx = this.add.graphics();
    const resetW = 240, resetH = 42;
    const resetX = width / 2 - resetW / 2;
    this._drawSimpleBtn(resetGfx, resetX, resetY, resetW, resetH, false, 0x221100, 0x884400);

    const resetTxt = this.add.text(width / 2, resetY + resetH / 2, 'RESET DEFAULTS', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#ffaa44',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);
    resetTxt.setInteractive({ useHandCursor: true });
    resetTxt.on('pointerover', () => this._drawSimpleBtn(resetGfx, resetX, resetY, resetW, resetH, true, 0x442200, 0xffaa44));
    resetTxt.on('pointerout',  () => this._drawSimpleBtn(resetGfx, resetX, resetY, resetW, resetH, false, 0x221100, 0x884400));
    resetTxt.on('pointerdown', () => {
      this.bindings = { ...DEFAULT_BINDINGS };
      saveBindings(this.bindings);
      actions.forEach(({ key }) => {
        this._rows[key].txt.setText(keyLabel(this.bindings[key]));
        this._drawKeyBtn(key, false);
      });
      this._listening = null;
      this._updateHint('RESET TO DEFAULTS!');
    });

    // ── Back button ───────────────────────────────────────────────────────
    const backY = height - 64;
    const backGfx = this.add.graphics();
    const backW = 180, backH = 42;
    const backX = width / 2 - backW / 2;
    this._drawSimpleBtn(backGfx, backX, backY, backW, backH, false, 0x111111, 0x888888);

    const backTxt = this.add.text(width / 2, backY + backH / 2, '← BACK', {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);
    backTxt.setInteractive({ useHandCursor: true });
    backTxt.on('pointerover', () => this._drawSimpleBtn(backGfx, backX, backY, backW, backH, true, 0x330000, 0xff4444));
    backTxt.on('pointerout',  () => this._drawSimpleBtn(backGfx, backX, backY, backW, backH, false, 0x111111, 0x888888));
    backTxt.on('pointerdown', () => this.scene.start('MenuScreen'));

    // ── Global keyboard listener for rebinding ────────────────────────────
    this.input.keyboard.on('keydown', (event) => {
      if (!this._listening) return;

      event.preventDefault();

      if (event.code === 'Escape') {
        this._drawKeyBtn(this._listening, false);
        this._listening = null;
        this._updateHint('');
        return;
      }

      const action = this._listening;

      // Prevent binding the same key to two actions
      const duplicate = Object.entries(this.bindings).find(
        ([k, v]) => k !== action && v === event.code
      );
      if (duplicate) {
        this._updateHint(`"${event.code}" is already used! Choose another key.`);
        return;
      }

      this.bindings[action] = event.code;
      saveBindings(this.bindings);
      this._rows[action].txt.setText(keyLabel(event.code));
      this._drawKeyBtn(action, false);
      this._listening = null;
      this._updateHint('KEY BOUND!');
    });
  }

  _updateHint(msg) {
    this._hintTxt.setText(msg);
  }

  _drawKeyBtn(action, hover, listening = false) {
    const { gfx, btnX, y, btnW, btnH } = this._rows[action];
    gfx.clear();
    let fill, border;
    if (listening) {
      fill   = 0x002244;
      border = 0x44aaff;
    } else if (hover) {
      fill   = 0x330000;
      border = 0xff4444;
    } else {
      fill   = 0x111111;
      border = 0x666666;
    }
    gfx.fillStyle(fill, 0.9);
    gfx.fillRect(btnX, y - btnH / 2, btnW, btnH);
    gfx.lineStyle(2, border, 1);
    gfx.strokeRect(btnX, y - btnH / 2, btnW, btnH);
    if (listening) {
      gfx.lineStyle(1, 0x88ccff, 0.5);
      gfx.strokeRect(btnX + 2, y - btnH / 2 + 2, btnW - 4, btnH - 4);
    }

    // Update text color
    const col = listening ? '#44aaff' : (hover ? '#ff8888' : '#ffffff');
    this._rows[action].txt.setColor(col);
  }

  _drawSimpleBtn(gfx, x, y, w, h, hover, fill, border) {
    gfx.clear();
    gfx.fillStyle(fill, 0.9);
    gfx.fillRect(x, y, w, h);
    gfx.lineStyle(2, border, 1);
    gfx.strokeRect(x, y, w, h);
  }
}
