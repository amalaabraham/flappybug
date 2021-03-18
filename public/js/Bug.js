var BugConfig = {
  jumpVelocity: -400,
  gravityVelocity: 200,
  gravityAngularVelocity: 80,
  jumpAngularVelocity: -160,
};

class Bug {
  constructor(scene, gameWidth, gameHeight) {
    this.scene = scene;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.player = null;
    this.hasGameStarted = false;
  }

  render() {
    this.player = this.scene.physics.add.sprite(
      Math.floor(gameWidth / 5),
      Math.floor(gameHeight / 2),
      "bug"
    );
    this.player.body.setCollideWorldBounds(true);
    this.player.body.onWorldBounds = true;

    return this;
  }

  initPlayer() {
    this.player.body.velocity.y = BugConfig.gravityVelocity;
    this.player.body.angularVelocity = BugConfig.gravityAngularVelocity;
    this.player.body.allowRotation = true;
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
      this.jump();
    });
  }

  update() {
    if (this.hasGameStarted == false) return;

    if (this.player.body.rotation < -50)
      this.player.body.angularVelocity = BugConfig.gravityAngularVelocity;

    if (this.player.body.rotation > 75) this.player.body.angularVelocity = 0;

    var pointer = this.scene.input.activePointer;

    if (pointer.leftButtonDown()) this.jump();
  }
}
