// FlagGenerator creates a finish flag at the end of a finite level.
// Draws a pole + flag using Phaser graphics (no external asset required).
// Returns a static physics zone used for overlap detection.
export default class FlagGenerator {
  static POLE_HEIGHT   = 80;  // pixels
  static HITBOX_WIDTH  = 52;
  static FLAG_COLOUR   = 0xff2200;
  static POLE_COLOUR   = 0xdddddd;
  static BASE_COLOUR   = 0x999999;

  constructor(scene) {
    this.scene    = scene;
    this.graphics = null;
    this._baseX   = 0;
    this._baseY   = 0;
  }

  /**
   * col / row – tile coordinates for the PLATFORM SURFACE where the flag stands.
   * Returns the Phaser Zone used for overlap detection.
   */
  create(col, row) {
    const TS = 32;
    const x  = col * TS;
    const y  = row * TS; // top of the platform block (block centre + half-height)

    this._baseX = x;
    this._baseY = y;

    this.graphics = this.scene.add.graphics();
    this._draw(false);

    // "FINISH" label above the pole
    this.scene.add.text(x, y - FlagGenerator.POLE_HEIGHT - 20, 'FINISH', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Static zone for overlap detection — spans the full pole height
    const zoneY = y - FlagGenerator.POLE_HEIGHT / 2;
    const zone  = this.scene.add.zone(x, zoneY, FlagGenerator.HITBOX_WIDTH, FlagGenerator.POLE_HEIGHT);
    this.scene.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);

    return zone;
  }

  /** Redraw in raised (completed) state. */
  raise() {
    this._draw(true);
  }

  _draw(raised) {
    if (!this.graphics) return;
    const { _baseX: x, _baseY: y } = this;
    const ph = FlagGenerator.POLE_HEIGHT;

    this.graphics.clear();

    // Pole
    this.graphics.fillStyle(FlagGenerator.POLE_COLOUR, 1);
    this.graphics.fillRect(x - 2, y - ph, 4, ph + 6);

    // Base plate
    this.graphics.fillStyle(FlagGenerator.BASE_COLOUR, 1);
    this.graphics.fillRect(x - 10, y + 2, 20, 6);

    // Flag cloth (triangle shape)
    this.graphics.fillStyle(FlagGenerator.FLAG_COLOUR, 1);
    if (raised) {
      // Flag near top of pole
      this.graphics.fillTriangle(
        x + 2, y - ph,
        x + 38, y - ph + 16,
        x + 2, y - ph + 32
      );
    } else {
      // Flag halfway down pole
      this.graphics.fillTriangle(
        x + 2, y - ph + 24,
        x + 38, y - ph + 40,
        x + 2, y - ph + 56
      );
    }
  }
}
