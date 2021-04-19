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
    this.scoreLabel = null; // top-left corner score label
    this.highScoreLabel = null; // high score label
    this.score = 0; // player's score
    this.highScore = this.score; // player's highest score
    // multiplayer part
    this.isMultiplayer = false; // is the game on multiplay ?
    this.hasPriority = false; // was the player the first in the waiting room ? -> used for start position initialization
    this.opponentBug = null; // Bug instance of opponent's when on multiplay
    this.opponentScore = 0; 
    this.counter = 3; // count 3 -> 2 -> 1 then start game when on multiplayer
    this.timer = null; // timer used to sync game start on multiplay
    this.oponentScoreLabel = null; // top-left opponent's score label
    this.opponentHasLost = false; // did the opponent lose the game ?
  }

  getObjPropertyFromGid(gid, prop) {
    // get the property {prop} from the Object which gid's == gid (Object Layer from Tilemap)
    for (let i = 0; i < this.tilesets.length; i++) {
      let obj = this.tilesets[i];
      if (obj.gid == gid) return obj[prop];
    }
  }

  init(data) {
    // assign some vars 
    this.tilesets = data.tilesets; // !important
    this.isMultiplayer = data.isMultiplayer;
    this.hasPriority = data.hasPriority;
  }

  create() {
    let audio_coin = this.sound.add("audio_coin", { loop: false }); // sound to play upon coin collection
    let gameover = this.sound.add("gameover_audio", { loop: false }); // sound to play when gameover
    let bg = this.sound.add("background_audio", { loop: true }); // bground music

    this.score = 0; // init player's score - should be kept in create() !important

    if (playMusic) { // if not muted
      bg.play();
    }

    this.hasGameStarted = false; // Game Started?
    this.game_over = false; // still not yet

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
      // if on single player -> start game upon SPACE click or left mouse click
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
        if (sceneConfig.BigStarIDs.includes(object.id)) // game contian BIG STARS to not be scaled down
          DEBUG("BIG STAR FOUND");
        else obj.setScale(obj.scale * 0.3);
      }

      obj.setX(Math.round(object.x * 0.79));
      obj.setY(Math.round(object.y * 0.79));

      this.objLayerObjects.push(obj); // add object to layer
    });

    // implement Bug's collision against objects
    this.physics.add.overlap(
      this.bug.player,
      this.objsGroup,
      (_player, _obj) => {
        if (_obj.texture.key == "Star" || _obj.texture.key == "Diamond") {
          if (playMusic) {
            audio_coin.play();
          }
          _obj.destroy(); // kill collectible
          this.score += 5; // add +5 points to score when a star

          if (_obj.texture.key == "Diamond") // add +50 points when a diamond is collected
            // 50 points for a diamond
            this.score += 45;

          socket.emit("score", this.score); // alert oponnent of new score
          this.scoreLabel.setText(`Score: ${this.score}`); // set score

          if (this.score > localStorage.getItem("flappyhighscore")) {
            this.highScoreLabel.setText(`High Score: ${this.score}`);
          }
        } else if (_obj.texture.key == "Sign_01") {
          // not collidable
        } else {
          // when hitting a non collectible => Game Over
          this.game_over = true;
          this.stopGame();
          bg.pause(); // stop background music

          if (playMusic) {
            gameover.play(); // Play GameOver Booooo
          }

          // setting high score in localstorage
          this.highScore = this.score;
          if (this.score > localStorage.getItem("flappyhighscore")) {
            localStorage.setItem("flappyhighscore", this.score);
          }

          socket.emit("collision", false); // notify opponent of collision
          this.scene.start("GameOverScene", this.score); // show GameOver Scene

        }
      }
    );

    this.scoreLabel = this.add
      .text(10, 10, "Score: 0", Label0Css("20px", "blue", "left"))
      .setScrollFactor(0);

    this.highScoreLabel = this.add
      .text(
        10,
        40,
        `High Score: ${localStorage.getItem("flappyhighscore") || 0}`,
        Label0Css("20px", "blue", "left")
      )
      .setScrollFactor(0);

    const cam = this.cameras.main; // main camera
    cam.startFollow(this.bug.player); // follow the damn player

    if (this.isMultiplayer) {

      // if multiplayer then start game after 3->2->1 counting down for both players
      this.countingLabel = this.add.text(gameWidth / 2, gameHeight / 2, `3`, Label0Css("20px", "#fff"));

      // instanciate a timer
      this.timer = setInterval(() => {
        this.counter--;
        if (this.counter <= 0) {
          this.countingLabel.destroy();
          clearInterval(this.timer);
          this.startGame();
        } else this.countingLabel.setText(this.counter);
      }, 1000);

      // when opponent jumps, make their bug jump locally
      socket.on("jump", (data) => {
        this.opponentBug.jump();
      });

      // when opponent gets a new score (collected), update their score locally
      socket.on("score", (score) => {
        this.opponentScore = score;
        this.opponentScoreLabel.setText(`Opp Score: ${score}`);
      });

      // when opponent dies => kill their bug
      socket.on("collision", (_) => {
        this.opponentHasLost = true;
        this.opponentBug.player.destroy(); // kill'em
        this.opponentScoreLabel.setText(`Lost: ${this.opponentScore}`);
      });

      this.opponentScoreLabel = this.add
        .text(10, 40, "Opp Score: 0", Label0Css("20px", "red", "left"))
        .setScrollFactor(0);
    }
  }

  update() {
    if (
      this.input.activePointer.leftButtonDown() &&
      !this.hasGameStarted &&
      !this.isMultiplayer
    )
      this.startGame(); // start game upon left mouse click on single player

    this.bug.update(); // update bug

    if (this.isMultiplayer && !this.opponentHasLost) this.opponentBug.update(); // update opponent's bug is multiplayer
  }

  startGame() {
    if (this.game_over) return; // don't if game over

    this.hasGameStarted = true;
    this.bug.startGame(); // start player's bug
    if (this.isMultiplayer) this.opponentBug.startGame(); // start opponent Bug
  }

  stopGame() {
    this.sound.stopByKey("bg"); // stop bg music
    this.hasGameStarted = false; // gotta solve that

    this.bug.stopGame(); // stop bug
    if (this.isMultiplayer && !this.opponentHasLost)
      this.opponentBug.stopGame(); // stop opponent's Bug
  }
}
