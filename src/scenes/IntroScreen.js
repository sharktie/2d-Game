export default class IntroScreen extends Phaser.Scene {
  constructor() {
    super('IntroScreen');
  }

  create() {
    const { width, height } = this.scale;

    this.state = "asking";
    this.playerName = "";
    this.maxLength = 12;

    // ── Pixel font 
    const baseStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      color: '#00ff88',
      align: 'center',
      wordWrap: { width: 700 },
      stroke: '#000000',
      strokeThickness: 3,
      lineSpacing: 10
    };

    this.text = this.add.text(width / 2, height / 2 - 40, '', baseStyle).setOrigin(0.5);

    // ── Cursor blink 
    this.cursorVisible = true;
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.cursorVisible = !this.cursorVisible;
        this.updateDisplay();
      }
    });

    // ── Typewriter animation
    this.fullText = "Hello... what is your name?";
    this.currentText = "";
    this.index = 0;

    this.time.addEvent({
      delay: 50,
      repeat: this.fullText.length - 1,
      callback: () => {
        this.currentText += this.fullText[this.index];
        this.index++;
        this.updateDisplay();

        if (this.index === this.fullText.length) {
          this.state = "typingName";
          this._setupMobileInput();
        }
      }
    });

    // ── Desktop keyboard listener 
    this.input.keyboard.on('keydown', (event) => {
      if (this.state !== "typingName") return;

      if (event.key === "Backspace") {
        this.playerName = this.playerName.slice(0, -1);
        this._syncHtmlInput();
      } else if (event.key === "Enter") {
        this._doSubmit();
      } else if (event.key.length === 1) {
        const char = event.key;
        if (/^[a-zA-Z0-9]$/.test(char) && this.playerName.length < this.maxLength) {
          this.playerName += char;
          this._syncHtmlInput();
        }
      }
      this.updateDisplay();
    });

    // ── "Tap here" hint for mobile (hidden until typingName)
    this.tapHint = this.add.text(
      width / 2, height / 2 + 70,
      '[ TAP HERE TO TYPE ]',
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        color: '#00ccff',
        stroke: '#000',
        strokeThickness: 2
      }
    ).setOrigin(0.5).setAlpha(0);

    // Blink the tap hint
    this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => {
        if (this.state === 'typingName') {
          this.tapHint.setAlpha(this.tapHint.alpha > 0 ? 0 : 1);
        }
      }
    });

    this.tapHint.setInteractive({ useHandCursor: true });
    this.tapHint.on('pointerdown', () => this._focusMobileInput());
    
    // Also make the main text area tappable for mobile
    this.text.setInteractive({ useHandCursor: true });
    this.text.on('pointerdown', () => {
      if (this.state === 'typingName') this._focusMobileInput();
    });
  }

  // ── Mobile keyboard helpers 

  _setupMobileInput() {
    this.tapHint.setAlpha(1);

    const htmlInput = document.getElementById('name-input');
    if (!htmlInput) return;

    // Sync HTML input changes → game
    htmlInput.addEventListener('input', () => {
      const filtered = htmlInput.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, this.maxLength);
      htmlInput.value = filtered;
      this.playerName = filtered;
      this.updateDisplay();
    });

    htmlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Go') {
        e.preventDefault();
        this._doSubmit();
      }
    });
  }

  _focusMobileInput() {
    const htmlInput = document.getElementById('name-input');
    if (!htmlInput) return;
    htmlInput.style.pointerEvents = 'all';
    htmlInput.value = this.playerName;
    htmlInput.focus();
    // Force caret to end
    const len = htmlInput.value.length;
    htmlInput.setSelectionRange(len, len);
  }

  _syncHtmlInput() {
    const htmlInput = document.getElementById('name-input');
    if (htmlInput) htmlInput.value = this.playerName;
  }

  _hideMobileInput() {
    const htmlInput = document.getElementById('name-input');
    if (htmlInput) {
      htmlInput.blur();
      htmlInput.style.pointerEvents = 'none';
    }
  }

  // ── Display update
  
  updateDisplay() {
    const cursor = this.cursorVisible ? "_" : " ";
    if (this.state === "asking") {
      this.text.setText(this.currentText + cursor);
    } else if (this.state === "typingName") {
      this.text.setText(
        this.currentText +
        "\n\n> " +
        this.playerName +
        cursor
      );
    }
  }

  _doSubmit() {
    if (this.state !== "typingName") return;
    this._hideMobileInput();
    this.tapHint.setAlpha(0);
    this.startGreeting();
  }

  startGreeting() {
    this.state = "greeting";

    const name = this.playerName || "Player";
    const message = `Hello ${name}, hope you enjoy this game :)`;

    this.text.setText('');
    let i = 0;

    this.time.addEvent({
      delay: 50,
      repeat: message.length - 1,
      callback: () => {
        this.text.text += message[i];
        i++;

        if (i === message.length) {
          this.time.delayedCall(1200, () => {
            this.registry.set('playerName', name);
            this.scene.start('MenuScreen');
          });
        }
      }
    });
  }
}
