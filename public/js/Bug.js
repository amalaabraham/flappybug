var BugConfig = {
  jumpVelocity: -400,
  gravityVelocity: 200,
  gravityAngularVelocity: 80,
  jumpAngularVelocity: -160,
};

class Bug {
  constructor(scene, gameWidth, gameHeight, hasPriority, isOpponent) {
    this.scene = scene;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.player = null;
    this.hasGameStarted = false;
    this.hasPriority = hasPriority
    this.isOpponent = isOpponent
  }

  render() {

    let bugY = gameHeight / 2

    if(this.scene.isMultiplayer) // set up y-position based on who was there first
    {
      if(this.hasPriority)
        bugY /= 2
    }

    this.player = this.scene.physics.add.sprite(
      Math.floor(gameWidth / 2),
      bugY,
      "bug"
    );

    return this;
  }

  initPlayer() {
    this.player.body.velocity.y = BugConfig.gravityVelocity;
    this.player.body.angularVelocity = BugConfig.gravityAngularVelocity;
    this.player.body.allowRotation = true;
    this.player.body.velocity.x = 240;

  }

  startGame() {
    this.hasGameStarted = true;
    this.initPlayer();
    this.setListeners();
  }

  stopGame() {
    this.hasGameStarted = false;
    this.player.enableRotation = false;
    this.player.body.velocity.y = 0;
    this.player.body.angularVelocity = 0;
  }

  jump() {
    if (!this.hasGameStarted || this.scene.game_over) return;

    this.player.body.velocity.y = BugConfig.jumpVelocity;
    this.player.body.angularVelocity = BugConfig.jumpAngularVelocity;

    setTimeout(() => {
      if (!this.hasGameStarted) return;
      this.player.body.velocity.y = BugConfig.gravityVelocity;
      this.player.body.angularVelocity = BugConfig.gravityAngularVelocity;
    }, 260);
  }

  setListeners() {
    this.scene.input.keyboard.on("keydown-SPACE", (ev) => {
      if(!this.isOpponent)
      {
        this.alertOponentOfJump()
        this.jump();
      }
    });
  }

  update() {
    if (this.hasGameStarted == false) return;

    if (this.player.body.rotation < -50)
      this.player.body.angularVelocity = BugConfig.gravityAngularVelocity;

    if (this.player.body.rotation > 75) this.player.body.angularVelocity = 0;

    var pointer = this.scene.input.activePointer;

    if (pointer.leftButtonDown()) 
    {
      if(!this.isOpponent)
      {
        this.alertOponentOfJump()
        this.jump();
      }
    }

    let y = this.player.body.y


    let bottomLimit = 100

    if(y < 0)
        this.player.body.y = 0

    if(y > ( gameHeight - bottomLimit ))
        this.player.body.y = gameHeight - bottomLimit

  }

  alertOponentOfJump()
  {
      if(this.scene.isMultiplayer)
      {
          socket.emit('jump', true);
      }
  }

}
