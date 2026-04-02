export default class Enemy {
  static tilesize = 32;

  constructor(scene, x, y) {
    this.scene = scene;

   this.sprite = scene.enemies.create(x, y, 'enemy');

    if (!this.sprite) return;

    this.sprite.setScale(Enemy.tilesize / 256); //scale down size of png to match 32x32
  //  if (this.sprite.body) this.sprite.body.setSize(32, 32); // Adjust hitbox to match visual size
    this.sprite.setBounce(0, 0);
    this.sprite.setCollideWorldBounds(false); //false cause true meant they kept spawning inside the wall and getting stuck, which looked bad and caused performance issues

    this.speed = 40;
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.sprite.setVelocityX(this.speed * this.dir);

    // Prevents flip() firing every frame while condition persists
    this.flipCooldown = 0;

    this.sprite.enemyRef = this;
  }

  flip() {
    this.dir *= -1;
    this.sprite.setVelocityX(this.speed * this.dir);
    this.flipCooldown = 20; // ~20 frames before next flip is allowed
  }

  update() {
    if (!this.sprite || !this.sprite.body) return;

    const body = this.sprite.body;

    body.setVelocityX(this.speed * this.dir);

    const isOnGround = body.blocked.down || body.touching.down;
    if (!isOnGround) return;

    if (this.flipCooldown > 0) {
      this.flipCooldown--;
      return;
    }

    // Project from the front edge of the body, not the center
    const frontEdgeX = this.dir > 0 ? body.x + body.width : body.x;
    const lookAheadX = frontEdgeX + this.dir * 6;

    const footY = body.y + body.height;
    const bodyMidY = body.y + body.height * 0.5;

    let groundAhead = false;
    let wallAhead = false;

    for (const p of this.scene.platforms.getChildren()) {
      // Use displayWidth/Height to respect scale
      const halfW = p.displayWidth / 2;
      const halfH = p.displayHeight / 2;
      const left   = p.x - halfW;
      const right  = p.x + halfW;
      const top    = p.y - halfH;
      const bottom = p.y + halfH;

      const aheadX = lookAheadX >= left && lookAheadX <= right;

      // Ledge detection: tile must be directly underfoot
      if (aheadX && footY >= top && footY <= bottom + 4) {
        groundAhead = true;
      }

      // Wall detection: tile overlaps body mid-height (above feet), 
      // so ground tiles beneath the enemy are excluded
      if (aheadX && bodyMidY >= top && bodyMidY <= bottom) {
        wallAhead = true;
      }
    }

    if (!groundAhead || wallAhead) {
      this.flip();
    }
  }
}