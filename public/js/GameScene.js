var sceneConfig = {
  BigStarIDs: [308],
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.objLayer = null; // Json array includes all objects except player
    this.objLayerObjects = []; // include all physical objects
    this.hasGameStarted = false; // Game Started?
    this.game_over = false;
    this.bug = null; // Bug Player
    this.objsGroup = null;
    this.tilesets = null;

    // scoring
    this.scoreLabel = null;
    this.score = 0;

    // multiplayer part
    this.isMultiplayer = false;
    this.hasPriority = false;
    this.opponentBug = null;
    this.opponentScore = 0;
    this.counter = 3; // count 3 -> 2 -> 1 then start game when on multiplayer
    this.timer = null;
    this.opponentScore = 0;
    this.oponentScoreLabel = null;
    this.opponentHasLost = false;
  }

  getObjPropertyFromGid(gid, prop) {
    for (let i = 0; i < this.tilesets.length; i++) {
      let obj = this.tilesets[i];
      if (obj.gid == gid) return obj[prop];
    }
  }

  init(data) {
    this.tilesets = data.tilesets;
    this.isMultiplayer = data.isMultiplayer;
    this.hasPriority = data.hasPriority;
  }

  create() {
    let audio_coin = this.sound.add("audio_coin", { loop: false });
    let gameover = this.sound.add("gameover_audio", { loop: false });
    let bg = this.sound.add("background_audio", { loop: true });

    this.score = 0;

    if (playMusic) {
      bg.play();
    }
    this.hasGameStarted = false; // Game Started?
    this.game_over = false;

    const width = this.scale.width;
    const height = this.scale.height;
    const totalWidth = width * 3000;

    const map = this.make.tilemap({ key: "env" });

    this.objLayer = map.getObjectLayer("Object Layer 1")["objects"];

    const skyBg = this.add
      .image(width * 0.5, height * 0.5, "sky")
      .setScrollFactor(0);
    skyBg.scale = 0.69;

    createAligned(this, totalWidth, "mountain", 0.25);
    createAligned(this, totalWidth, "plateau", 0.5);
    createAligned(this, totalWidth, "ground", 1);
    createAligned(this, totalWidth, "plants", 1.25);

    this.cameras.main.setBounds(0, 0, width * 3000, height);

    this.bug = new Bug(this, gameWidth, gameHeight, this.hasPriority, false);
    this.bug.render();
    this.bug.player.setScale(0.7);

    if (this.isMultiplayer) {
      this.opponentBug = new Bug(
        this,
        gameWidth,
        gameHeight,
        !this.hasPriority,
        true
      );
      this.opponentBug.render();
      this.opponentBug.player.setScale(0.7);
    }

    this.input.keyboard.on("keydown-SPACE", (ev) => {
      if (!this.isMultiplayer) this.startGame();
    });

    this.objsGroup = this.physics.add.group();

    this.objLayer.forEach((object) => {
      let name = this.getObjPropertyFromGid(object.gid, "name");

      let obj = this.objsGroup.create(object.x, object.y, name);

      obj.name = name;
      obj.setScale(0.79);
      obj.enableBody = true;
      obj.body.immovable = true;

      if (name == "Star" || name == "Diamond") {
        if (sceneConfig.BigStarIDs.includes(object.id)) DEBUG("BIG STAR FOUND");
        else obj.setScale(obj.scale * 0.3);
      }

      obj.setX(Math.round(object.x * 0.79));
      obj.setY(Math.round(object.y * 0.79));

      this.objLayerObjects.push(obj);
    });

    this.physics.add.overlap(
      this.bug.player,
      this.objsGroup,
      (_player, _obj) => {
        if (_obj.texture.key == "Star" || _obj.texture.key == "Diamond") {
          if (playMusic) {
            audio_coin.play();
          }
          _obj.destroy();
          this.score += 5;

          if (_obj.texture.key == "Diamond")
            // 50 points for a diamond
            this.score += 45;

          socket.emit("score", this.score);

          this.scoreLabel.setText(`Score: ${this.score}`);
        } else if (_obj.texture.key == "Sign_01") {
          // not collidable
        } else {
          this.game_over = true;
          this.stopGame();
          bg.pause();
          if (playMusic) {
            gameover.play();
          }
          this.scene.start("GameOverScene");
          socket.emit("collision", false);
        }
      }
    );

    this.scoreLabel = this.add
      .text(10, 10, "Score: 0", {
        fontSize: "20px",
        fontFamily: "PS2P",
        fill: "yellow",
      })
      .setScrollFactor(0);

    const cam = this.cameras.main;
    cam.startFollow(this.bug.player);

    if (this.isMultiplayer) {
      this.countingLabel = this.add.text(gameWidth / 2, gameHeight / 2, `3`, {
        fontSize: "20px",
        fontFamily: "PS2P",
        align: "center",
        fill: "#fff",
      });

      this.timer = setInterval(() => {
        this.counter--;
        if (this.counter <= 0) {
          this.countingLabel.destroy();
          clearInterval(this.timer);
          this.startGame();
        } else this.countingLabel.setText(this.counter);
      }, 1000);

      socket.on("jump", (data) => {
        this.opponentBug.jump();
      });

      socket.on("score", (score) => {
        this.opponentScore = score;
        this.opponentScoreLabel.setText(`Opp Score: ${score}`);
      });

      socket.on("collision", (_) => {
        this.opponentHasLost = true;
        this.opponentBug.player.destroy();
        this.opponentScoreLabel.setText(`Lost: ${this.opponentScore}`);
      });

      this.opponentScoreLabel = this.add
        .text(10, 40, "Opp Score: 0", {
          fontSize: "20px",
          fontFamily: "PS2P",
          fill: "red",
        })
        .setScrollFactor(0);
    }
  }

  update() {
    if (
      this.input.activePointer.leftButtonDown() &&
      !this.hasGameStarted &&
      !this.isMultiplayer
    )
      this.startGame();

    this.bug.update();

    if (this.isMultiplayer && !this.opponentHasLost) this.opponentBug.update();
  }
  startGame() {
    if (this.game_over) return;
    this.hasGameStarted = true;
    this.bug.startGame();

    if (this.isMultiplayer) this.opponentBug.startGame();
  }

  stopGame() {
    this.sound.stopByKey("bg");
    this.hasGameStarted = false;
    this.bug.stopGame();

    if (this.isMultiplayer && !this.opponentHasLost)
      this.opponentBug.stopGame();
  }
}
