import Input from '../system/input.js';
import Player from '../entities/Player.js';
import InfiniteLevel from '../world/Levels/InfiniteLevel.js';
import FiniteLevel from '../world/Levels/FiniteLevel.js';
import { getLevel } from '../world/Levels/LevelRegistry.js';
import { submitScore } from '../system/firebase.js';
import { setupCamera } from '../system/Camera.js';
import { awardStars } from '../system/StarTracker.js';
import { css } from '../system/css.js';

export default class GameScreen extends Phaser.Scene {

  static tilesize        = 32;
  static deathheight     = 1000;
  static cleanupdistance = 800;
  static scoreboard      = 10;

  constructor() {
    super('GameScreen');
  }

  create(data) {
    // ── Scene data 
    
    // the name set in IntroScreen survives through LevelSelector → GameScreen.
    this.playerName  = data?.playerName || this.registry.get('playerName') || 'Player';
    this.levelId     = data?.level      ?? null;
    this.levelData   = this.levelId ? getLevel(this.levelId) : null;
    this.isFinite    = !!this.levelData;

    // State 
    this.dead           = false;
    this.finished       = false;
    this.score          = 0;
    this.lastCheckpoint = data?.checkpoint ?? null; // { x, y } respawn position
    this.coinsCollected = 0;
    this.levelStartTime = Date.now();

    // Input & player
    this.inputSystem = new Input(this);
    this.player      = new Player(this, 100, 300, this.inputSystem);
    // If resuming from checkpoint, player position is corrected after level init

    //  Physics
    this.platforms       = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ immovable: true, allowGravity: false });
    this.enemies         = this.physics.add.group();
    this.coins           = this.physics.add.staticGroup();
    this.checkpoints     = [];

      // Colliders
    this.physics.add.collider(this.player.MC, this.platforms);
    this.physics.add.collider(this.player.MC, this.movingPlatforms);
    this.physics.add.overlap(this.player.MC, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player.MC, this.coins, this.collectCoin, null, this);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);


    // Level 
    if (this.isFinite) {
      this.level = new FiniteLevel(this, this.levelData);
    } else {
      this.level = new InfiniteLevel(this);
    }
    this.level.initialize();

    // Resume from checkpoint
    if (this.lastCheckpoint && this.player?.MC) {
      this.player.MC.setPosition(this.lastCheckpoint.x, this.lastCheckpoint.y);
    }

  
    // Finite-specific overlaps
    if (this.isFinite) {
      this.physics.add.overlap(
        this.player.MC,
        this.level.flagZone,
        this.reachFlag,
        null,
        this
      );

      for (const zone of this.level.checkpointZones) {
        this.checkpoints.push(zone);
        this.physics.add.overlap(
          this.player.MC,
          zone,
          () => this.touchCheckpoint(zone),
          null,
          this
        );
      }
    }

    //  Camera 
    setupCamera(this, this.player.MC, -20);

    //  HUD
    this._buildHUD();

    //  Level 1 instruction overlays 
    if (this.isFinite === false) {
      this._buildLevel1Instructions();
    }

    // ── Touch controls ────────────────────────────────────────────────────
    this._touchEnabled = localStorage.getItem('platformer_touch') === 'true';
    this._prevTouchJump = false;
    this._prevTouchDash = false;
    if (this._touchEnabled) {
      this._buildTouchControls();
    }
  }

  // HUD construction 

  _buildHUD() {
    const style = (size = '12px') => ({
      fontSize: size,
      color: '#ffffff',
      fontFamily: '"Press Start 2P"',
      stroke: '#000000',
      strokeThickness: 3
    });

    if (this.isFinite) {
      this.timerText = this.add.text(14, 12, 'TIME: 0.0s', style('12px')).setScrollFactor(0).setDepth(10);

      const total = this.level.totalCoins;
      this.coinText = this.add.text(14, 34, `COINS: 0/${total}`, style('10px')).setScrollFactor(0).setDepth(10);

      this.add.text(
        this.scale.width - 14, 12,
        `LV${this.levelData.id}: ${this.levelData.name.toUpperCase()}`,
        { ...style('10px'), align: 'right' }
      ).setOrigin(1, 0).setScrollFactor(0).setDepth(10);

      this.add.text(
        this.scale.width - 14, 32,
        `* <${this.levelData.timeStarSeconds}s`,
        { ...style('9px'), color: '#ffee44', align: 'right' }
      ).setOrigin(1, 0).setScrollFactor(0).setDepth(10);

    } else {
      this.scoreText = this.add.text(14, 12, 'SCORE: 0', style('13px')).setScrollFactor(0).setDepth(10);
    }
  }

  // Touch controls overlay 

  _buildTouchControls() {
    const { width, height } = this.scale;
    const size = 72;
    const pad  = 18;

    // Button rects in screen space (scroll-independent)
    this._btns = {
      left:  { x: pad,                  y: height - pad - size,     w: size, h: size },
      right: { x: pad + size + 12,      y: height - pad - size,     w: size, h: size },
      jump:  { x: width - pad - size,   y: height - pad - size,     w: size, h: size },
      dash:  { x: width - pad - size*2 - 12, y: height - pad - size, w: size, h: size },
    };

    const gfx = this.add.graphics().setScrollFactor(0).setDepth(60).setAlpha(0.55);

    const drawAll = () => {
      gfx.clear();
      Object.values(this._btns).forEach(b => {
        gfx.fillStyle(css('#000000'), 0.6);
        gfx.fillRoundedRect(b.x, b.y, b.w, b.h, 14);
        gfx.lineStyle(2, css('#ffffff'), 0.8);
        gfx.strokeRoundedRect(b.x, b.y, b.w, b.h, 14);
      });
    };
    drawAll();

    // Labels
    const lblStyle = { fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffffff', stroke: '#000', strokeThickness: 3 };
    const b = this._btns;
    [
      { rect: b.left,  text: '◀' },
      { rect: b.right, text: '▶' },
      { rect: b.jump,  text: '▲' },
      { rect: b.dash,  text: '⚡' },
    ].forEach(({ rect, text }) => {
      this.add.text(rect.x + rect.w / 2, rect.y + rect.h / 2, text, lblStyle)
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(61)
        .setAlpha(0.9);
    });

    // Enable multi-touch
    this.input.addPointer(3);
  }

  // background instructions
  _buildLevel1Instructions() {      //fix this later
    const TS = GameScreen.tilesize;
    const instructStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      alpha: 0.55
    };
  }


  _updateTouchInput() {
    if (!this._touchEnabled) return;

    const inp = this.inputSystem;

    // Clear one-shots from last frame before re-evaluating
    inp._touchJumpFired = false;
    inp._touchDashFired = false;

    const b = this._btns;
    let left = false, right = false, jumpNow = false, dashHeld = false;

    // Check all active pointers (up to 4 for multi-touch)
    const pointers = [
      this.input.pointer1,
      this.input.pointer2,
      this.input.pointer3,
      this.input.pointer4,
    ];

    pointers.forEach(ptr => {
      if (!ptr || !ptr.isDown) return;
      const { x, y } = ptr;
      if (this._inBtn(x, y, b.left))  left     = true;
      if (this._inBtn(x, y, b.right)) right    = true;
      if (this._inBtn(x, y, b.jump))  jumpNow  = true;
      if (this._inBtn(x, y, b.dash))  dashHeld = true;
    });

    inp.touchLeft     = left;
    inp.touchRight    = right;
    inp.touchDashHeld = dashHeld;

    // Rising-edge detection for one-shot inputs
    if (jumpNow  && !this._prevTouchJump) inp._touchJumpFired = true;
    if (dashHeld && !this._prevTouchDash) inp._touchDashFired = true;

    this._prevTouchJump = jumpNow;
    this._prevTouchDash = dashHeld;
  }

  _inBtn(px, py, btn) {
    return px >= btn.x && px <= btn.x + btn.w &&
           py >= btn.y && py <= btn.y + btn.h;
  }

  // Game loop

  update() {
    if (this.dead || this.finished) return;

    this._updateTouchInput();
    this.player.update(this.game.loop.delta);

    if (this.isFinite) {
      this._updateTimerHUD();
    } else {
      this._updateScore();
      this.level.generateChunksAhead();
      this._cleanupOffScreen();
    }

    this._checkDeathCondition();
    this._updateEnemies();
  }

  _updateTimerHUD() {
    const secs = (Date.now() - this.levelStartTime) / 1000;
    this.timerText.setText(`TIME: ${secs.toFixed(1)}s`);

    const total = this.level.totalCoins;
    this.coinText.setText(`COINS: ${this.coinsCollected}/${total}`);
  }

  _updateScore() {
    const newScore = Math.floor(this.player.MC.x / GameScreen.scoreboard);
    this.score = Math.max(this.score, newScore);
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  _cleanupOffScreen() {
    const threshold = this.player.MC.x - GameScreen.cleanupdistance;
    [this.platforms, this.movingPlatforms, this.enemies, this.coins].forEach(group => {
      group?.getChildren().forEach(obj => { if (obj.x < threshold) obj.destroy(); });
    });
  }

  _checkDeathCondition() {
    if (this.player.MC.y > GameScreen.deathheight) {
      this.dead = true;
      this._handleDeath();
    }
  }

  _updateEnemies() {
    this.enemies.children.iterate((sprite) => {
      if (!sprite?.active) return;
      if (sprite.enemyRef) sprite.enemyRef.update();

      if (!this.dead && Phaser.Math.Distance.Between(
        this.player.MC.x, this.player.MC.y, sprite.x, sprite.y
      ) < 28) {
        this.hitEnemy(this.player.MC, sprite);
      }
    });
  }

  //  Overlap handlers 

  collectCoin(player, coin) {
    coin.destroy();
    this.coinsCollected++;
    this.score += 5;
    if (!this.isFinite && this.scoreText) {
      this.scoreText.setText(`SCORE: ${this.score}`);
    }
  }

  hitEnemy(player, enemy) {
    if (this.dead || this.finished) return;
    this.dead = true;
    this._handleDeath();
  }

  reachFlag() {
    if (this.dead || this.finished) return;
    this.finished = true;
    this.level.raiseFlag();
    this._handleLevelComplete();
  }

  touchCheckpoint(zone) {
    const activated = this.level.activateCheckpoint(zone);
    if (activated) {
      // Store this checkpoint as the latest respawn position
      this.lastCheckpoint = { x: zone.respawnX, y: zone.respawnY };
      const { width } = this.scale;
      const msg = this.add.text(width / 2, 80, 'CHECKPOINT!', {
        fontSize: '14px',
        fontFamily: '"Press Start 2P"',
        color: '#00ff88',
        stroke: '#000',
        strokeThickness: 4
      }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

      this.tweens.add({
        targets: msg,
        alpha: 0,
        y: 50,
        duration: 1800,
        ease: 'Cubic.easeOut',
        onComplete: () => msg.destroy()
      });
    }
  }

  // Death handling

  async _handleDeath() {
    this.player.MC.setVelocity(0, 0);
    if (this.player.MC.body) this.player.MC.body.enable = false;

    if (!this.isFinite) {
      try {
        await submitScore(this.playerName, this.score);
      } catch (e) {
        console.error('Score submit failed:', e);
      }
      this.registry.set('playerScore', this.score);
    }

    this.scene.start('DeathScreen', {
      score:      this.score,
      levelId:    this.levelId,
      checkpoint: this.lastCheckpoint
    });
  }

  // Level complete 

  _handleLevelComplete() {
    const elapsed  = (Date.now() - this.levelStartTime) / 1000;
    const allCoins = this.coinsCollected >= this.level.totalCoins;

    const starResult = awardStars(
      this.levelId,
      true,
      allCoins,
      elapsed,
      this.levelData.timeStarSeconds
    );

    this.player.MC.setVelocity(0, 0);
    if (this.player.MC.body) this.player.MC.body.enable = false;

    this.time.delayedCall(600, () => {
      this.scene.start('LevelComplete', {
        levelId:         this.levelId,
        levelName:       this.levelData.name,
        elapsed,
        timeStarSeconds: this.levelData.timeStarSeconds,
        coinsCollected:  this.coinsCollected,
        totalCoins:      this.level.totalCoins,
        starResult
      });
    });
  }
}
