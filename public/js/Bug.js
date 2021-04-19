var BugConfig = {
  jumpVelocity: -400, // when jumping add up-acceleration
  gravityVelocity: 200, // bug is always falling down
  gravityAngularVelocity: 80, // bug when falling down rolls clock-wise for better effect
  jumpAngularVelocity: -160, // when bug jumps -> bug rotate left for effect
};

class Bug {
  constructor(scene, gameWidth, gameHeight, hasPriority, isOpponent) {
    this.scene = scene; // init scene
    this.gameWidth = gameWidth; // init game Width
    this.gameHeight = gameHeight; // init game Height
    this.player = null; // phaser sprite
    this.hasGameStarted = false; // did the game start
    this.hasPriority = hasPriority; // true if first to waiting room (on multiplay)
    this.isOpponent = isOpponent; // got an opponent ? multiplay mode ?
  }

  render() {
    let bugY = gameHeight / 2;

    if (this.scene.isMultiplayer) {
      // set up y-position based on who was there first
      if (this.hasPriority) bugY /= 2;
    }
    if (this.isOpponent) {
      this.player = this.scene.physics.add.sprite(
        Math.floor(gameWidth / 2),
        bugY,
        "bug_opponent"
      );
      return this;
    }

    // create player's Bug
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
    this.player.body.velocity.x = 240; // always moving forward
  }

  startGame() {
    this.hasGameStarted = true;
    this.initPlayer();
    this.setListeners();
  }

  stopGame() {
    this.hasGameStarted = false;
    this.player.enableRotation = false;
    // reset accelerations
    this.player.body.velocity.y = 0;
    this.player.body.angularVelocity = 0;
  }

  jump() {
    if (!this.hasGameStarted || this.scene.game_over) return;

    this.player.body.velocity.y = BugConfig.jumpVelocity;
    this.player.body.angularVelocity = BugConfig.jumpAngularVelocity;

    setTimeout(() => { // reset jump velocities after some time
      if (!this.hasGameStarted) return;
      this.player.body.velocity.y = BugConfig.gravityVelocity;
      this.player.body.angularVelocity = BugConfig.gravityAngularVelocity;
    }, 260);
  }

  setListeners() {
    this.scene.input.keyboard.on("keydown-SPACE", (ev) => {
      if (!this.isOpponent) {
        this.alertOponentOfJump();
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

    if (pointer.leftButtonDown()) {
      if (!this.isOpponent) {
        this.alertOponentOfJump();
        this.jump();
      }
    }

    let y = this.player.body.y;

    let bottomLimit = 100; // bottom limit to implement game edge collisions

    if (y < 0) this.player.body.y = 0; // top-collisions

    if (y > gameHeight - bottomLimit)
      this.player.body.y = gameHeight - bottomLimit; // can't sink below game edges
  }

  alertOponentOfJump() {
    if (this.scene.isMultiplayer) {
      socket.emit("jump", true);
    }
  }
}
