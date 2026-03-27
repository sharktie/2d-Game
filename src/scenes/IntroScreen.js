export default class IntroScreen extends Phaser.Scene {
  constructor() {
    super('IntroScreen');
  }

  create() {
    const { width, height } = this.scale;

    this.state = "asking";
    this.playerName = "";
    this.maxLength = 12;

   
    this.text = this.add.text(width / 2, height / 2, '', {
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    // =========================
    // CURSOR BLINK
    // =========================
    this.cursorVisible = true;

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.cursorVisible = !this.cursorVisible;
        this.updateDisplay();
      }
    });

   
    this.fullText = "Hello... what is your name?";             //intro text
    this.currentText = "";
    this.index = 0;

    this.time.addEvent({
      delay: 50,
      repeat: this.fullText.length - 1,
      callback: () => {
        this.currentText += this.fullText[this.index];              //letter by letter
        this.index++;
        this.updateDisplay();

        if (this.index === this.fullText.length) {
          this.state = "typingName";
        }
      }
    });

    
    this.input.keyboard.on('keydown', (event) => {                     //name input
      if (this.state !== "typingName") return;

      
      if (event.key === "Backspace") {
        this.playerName = this.playerName.slice(0, -1);           //backspace
      }

     
      else if (event.key === "Enter") {                            //enter
        this.startGreeting();
      }

      
      else if (event.key.length === 1) {
        const char = event.key;

        if (/^[a-zA-Z]$/.test(char) && this.playerName.length < this.maxLength) {         //letters only (made with calum in mind)
          this.playerName += char;

       
          if (this.sound.get('type')) {                              
            this.sound.play('type', { volume: 0.2 });                 //typing sound (add sound file at some point)
          }

          this.updateDisplay();
        }
      }
    });
  }


  updateDisplay() {
    if (this.state === "asking") {
      this.text.setText(this.currentText + (this.cursorVisible ? "_" : ""));
    }

    else if (this.state === "typingName") {
      this.text.setText(
        this.currentText +                                           //letters showing up as u type
        "\n\nType your name:\n" +
        this.playerName +
        (this.cursorVisible ? "_" : "")
      );
    }
  }

  
  startGreeting() {
    this.state = "greeting";

    const message = `Hello ${this.playerName || "Player"}, hope you enjoy this game :)`;     //say hi
                                                                       
    this.text.setText('');
    let i = 0;

    this.time.addEvent({
      delay: 50,
      repeat: message.length - 1,
      callback: () => {
        this.text.text += message[i];                                  //letter by letter again prob should make a function for this ngl
        i++;

        if (i === message.length) {
          this.time.delayedCall(1200, () => {
            this.scene.start('GameScreen', { playerName: this.playerName });
          });
        }
      }
    });
  }
}