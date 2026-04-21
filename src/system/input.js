import { loadBindings } from '../scenes/SettingsScreen.js';

export default class Input {
  constructor(wasd) {
    this.wasd = wasd;

    // Load user-defined bindings (falls back to defaults)
    const bindings = loadBindings();

    // Map action names to Phaser key objects
    this._leftKey  = this._addKey(wasd, bindings.left,  'ArrowLeft');
    this._rightKey = this._addKey(wasd, bindings.right, 'ArrowRight');
    this._jumpKey  = this._addKey(wasd, bindings.jump,  'ArrowUp');

    // Always keep Space as a secondary jump key
    this.space = wasd.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.shift = wasd.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Touch state — written each frame by GameScreen._updateTouchInput()
    this.touchLeft       = false;
    this.touchRight      = false;
    this.touchDashHeld   = false;
    // One-shot flags: set true for exactly one frame on press, then cleared
    this._touchJumpFired = false;
    this._touchDashFired = false;
  }

  // Helper: safely create a key from a code string, falling back to default
  _addKey(scene, code, fallbackCode) {
    try {
      const keyCode = Phaser.Input.Keyboard.KeyCodes[this._codeToName(code)];
      if (keyCode !== undefined) {
        return scene.input.keyboard.addKey(keyCode);
      }
    } catch (_) {}
    // Fallback
    const fallbackKC = Phaser.Input.Keyboard.KeyCodes[this._codeToName(fallbackCode)];
    return scene.input.keyboard.addKey(fallbackKC);
  }

  // Convert a KeyboardEvent.code string to Phaser KeyCodes name
  _codeToName(code) {
    const map = {
      ArrowLeft:  'LEFT',
      ArrowRight: 'RIGHT',
      ArrowUp:    'UP',
      ArrowDown:  'DOWN',
      Space:      'SPACE',
      ShiftLeft:  'SHIFT',
      ShiftRight: 'SHIFT',
      KeyW: 'W', KeyA: 'A', KeyS: 'S', KeyD: 'D',
      KeyZ: 'Z', KeyX: 'X', KeyC: 'C',
      KeyQ: 'Q', KeyE: 'E', KeyR: 'R', KeyF: 'F',
      KeyG: 'G', KeyH: 'H', KeyI: 'I', KeyJ: 'J',
      KeyK: 'K', KeyL: 'L', KeyM: 'M', KeyN: 'N',
      KeyO: 'O', KeyP: 'P', KeyT: 'T', KeyU: 'U',
      KeyV: 'V', KeyB: 'B', KeyY: 'Y',
    };
    return map[code] || 'LEFT';
  }

  LeftDown() {
    return this._leftKey.isDown || this.touchLeft;
  }

  RightDown() {
    return this._rightKey.isDown || this.touchRight;
  }

  JumpPressed() {
    return Phaser.Input.Keyboard.JustDown(this.space) ||
           Phaser.Input.Keyboard.JustDown(this._jumpKey) ||
           this._touchJumpFired;
  }

  jumpReleased() {
    return Phaser.Input.Keyboard.JustUp(this._jumpKey) ||
           Phaser.Input.Keyboard.JustUp(this.space);
  }

  DashPressed() {
    return Phaser.Input.Keyboard.JustDown(this.shift) || this._touchDashFired;
  }

  DashHeld() {
    return this.shift.isDown || this.touchDashHeld;
  }
}
