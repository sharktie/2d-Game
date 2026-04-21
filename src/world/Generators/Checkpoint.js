// CheckpointGenerator creates mid-level save points.
// Draws a short flagpole that turns green when the player passes through.
// Returns the Phaser Zone used for overlap detection.
// Checkpoints are currently placed for future respawn logic —
// the zone.activated flag and zone.respawnX / zone.respawnY are
// set so a respawn system can use them without any changes here.
export default class CheckpointGenerator {
  static POLE_HEIGHT   = 52;
  static HITBOX_WIDTH  = 40;
  static INACTIVE_FLAG = 0x888888;
  static ACTIVE_FLAG   = 0x00dd44;
  static POLE_COLOUR   = 0xbbbbbb;

  constructor(scene) {
    this.scene = scene;
  }

  /**
   * col / row – tile coordinates for the PLATFORM SURFACE where the checkpoint stands.
   * Returns the Phaser Zone.
   */
  create(col, row) {
    const TS = 32;
    const x  = col * TS;
    const y  = row * TS;
    const ph = CheckpointGenerator.POLE_HEIGHT;

    const graphics = this.scene.add.graphics();
    this._drawInactive(graphics, x, y);

    // "CHECK" label above pole
    this.scene.add.text(x, y - ph - 16, 'CHECK', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      color: '#cccccc',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Static zone for overlap detection
    const zone = this.scene.add.zone(x, y - ph / 2, CheckpointGenerator.HITBOX_WIDTH, ph);
    this.scene.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);

    // Store metadata on the zone for easy access
    zone.activated  = false;
    zone.respawnX   = x;
    zone.respawnY   = y - 64; // above the checkpoint
    zone._graphics  = graphics;
    zone._x         = x;
    zone._y         = y;

    return zone;
  }

  /**
   * Activate a checkpoint zone — turns it green.
   * Returns true if this is the first activation.
   */
  activate(zone) {
    if (zone.activated) return false;
    zone.activated = true;
    this._drawActive(zone._graphics, zone._x, zone._y);
    return true;
  }

  // ── Private drawing helpers ─────────────────────────────────────────────
  _drawInactive(g, x, y) {
    this._drawPole(g, x, y);
    g.fillStyle(CheckpointGenerator.INACTIVE_FLAG, 1);
    g.fillRect(x + 2, y - CheckpointGenerator.POLE_HEIGHT, 22, 14);
  }

  _drawActive(g, x, y) {
    g.clear();
    this._drawPole(g, x, y);
    g.fillStyle(CheckpointGenerator.ACTIVE_FLAG, 1);
    g.fillRect(x + 2, y - CheckpointGenerator.POLE_HEIGHT, 22, 14);
  }

  _drawPole(g, x, y) {
    g.fillStyle(CheckpointGenerator.POLE_COLOUR, 1);
    g.fillRect(x - 2, y - CheckpointGenerator.POLE_HEIGHT, 4, CheckpointGenerator.POLE_HEIGHT + 4);
  }
}
