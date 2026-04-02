export default class Input {
  constructor(wasd) {
    this.wasd = wasd;

    this.keys = wasd.input.keyboard.createCursorKeys();        //arrow keys

    // extra keys
    this.space = wasd.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE                //space bar
    );

    this.shift = wasd.input.keyboard.addKey(               //shift key 
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
  }

  LeftDown() {
    return this.keys.left.isDown;
  }

  RightDown() {
    return this.keys.right.isDown;
  }

  JumpPressed() {
    return Phaser.Input.Keyboard.JustDown(this.space) || Phaser.Input.Keyboard.JustDown(this.keys.up);
  }

  jumpReleased() {
    return Phaser.Input.Keyboard.JustUp(this.keys.up) || Phaser.Input.Keyboard.JustUp(this.space);
  }

  DashPressed() {
    return Phaser.Input.Keyboard.JustDown(this.shift);
  }

  DashHeld() {
    return this.shift.isDown;
  }
}