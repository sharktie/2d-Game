export default class Player {
  // === CONSTANTS ===
  static SPEED = 260;
  static JUMP_POWER = 520;
  static DASH_POWER = 500;
  static GRAVITY = 1000;
  static MAX_VELOCITY_X = 350;
  static MAX_VELOCITY_Y = 600;
  static DASH_COOLDOWN = 400; // ms

  constructor(gamestate, x, y, input) {
    this.state = gamestate;
    this.input = input;

    // Create physics sprite
    this.MC = gamestate.physics.add.sprite(x, y, 'player');
    this.MC.setCollideWorldBounds(false);
    this.MC.setBounce(0, 0);
    this.MC.setDrag(0.95);

    // Movement stats
    this.speed = Player.SPEED;
    this.jumpPower = Player.JUMP_POWER;
    this.dashPower = Player.DASH_POWER;

    // State tracking
    this.lastGroundedTime = 0;
    this.lastJumpPressTime = -Infinity;
    this.lastDashTime = -Player.DASH_COOLDOWN;
    this.currentDirection = 1;
    this.dashDirection = 0;

    // Timing
    this.currentTime = 0;
  }

  update(deltaTime = 16) {
    this.currentTime += deltaTime;

    const onGround = this.isGrounded();

    // Update ground timer
    if (onGround) {
      this.lastGroundedTime = this.currentTime;
    }

    // Track direction
    if (this.input.LeftDown()) {
      this.currentDirection = -1;
    } else if (this.input.RightDown()) {
      this.currentDirection = 1;
    }

    // Handle jumping
    if (this.input.JumpPressed() && onGround) {
      this.MC.setVelocityY(-this.jumpPower);
    }

    // Handle dash - SIMPLE VERSION
    const canDash = this.currentTime - this.lastDashTime > Player.DASH_COOLDOWN;
    const isMovingHorizontally = this.input.LeftDown() || this.input.RightDown();

    if (this.input.DashHeld() && isMovingHorizontally && canDash) {
      const dashDir = this.input.LeftDown() ? -1 : 1;
      this.MC.setVelocityX(dashDir * this.dashPower);
      this.lastDashTime = this.currentTime;
    } else {
      // Normal movement (only if not dashing)
      if (this.currentTime - this.lastDashTime > 150) {
        if (this.input.LeftDown()) {
          this.MC.setVelocityX(-this.speed);
          this.MC.flipX = true;
        } else if (this.input.RightDown()) {
          this.MC.setVelocityX(this.speed);
          this.MC.flipX = false;
        } else {
          this.MC.setVelocityX(0);
        }
      }
    }

    // Apply limits
    this.applyVelocityLimits();
  }

  /**
   * Check if player is on ground
   */
  isGrounded() {
    if (!this.MC.body) return false;
    return this.MC.body.blocked.down;
  }

  /**
   * Apply velocity limits
   */
  applyVelocityLimits() {
    if (!this.MC.body) return;

    // Clamp X
    if (Math.abs(this.MC.body.velocity.x) > Player.MAX_VELOCITY_X) {
      this.MC.body.velocity.x = Phaser.Math.Clamp(
        this.MC.body.velocity.x,
        -Player.MAX_VELOCITY_X,
        Player.MAX_VELOCITY_X
      );
    }

    // Clamp Y
    if (Math.abs(this.MC.body.velocity.y) > Player.MAX_VELOCITY_Y) {
      this.MC.body.velocity.y = Phaser.Math.Clamp(
        this.MC.body.velocity.y,
        -Player.MAX_VELOCITY_Y,
        Player.MAX_VELOCITY_Y
      );
    }
  }

  /**
   * Reset player state
   */
  reset() {
    this.lastGroundedTime = 0;
    this.lastJumpPressTime = -Infinity;
    this.lastDashTime = -Player.DASH_COOLDOWN;
    this.MC.setVelocity(0, 0);
  }
}