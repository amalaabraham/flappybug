var sceneConfig = {
  envSpeed: 3,
  BigStarIDs: [308],
};

class GameScene extends Phaser.Scene {
  constructor() {
        super("GameScene");
        this.tileLayer = null; // Tile Layer includes ground and Background Image
        this.objLayer = null; // Json array includes all objects except player
        this.objLayerObjects = [] // include all physical objects
        this.envSpeed = 0 // Background moving speed
        this.hasGameStarted = false // Game Started?
        this.game_over = false
        this.bug = null // Bug Player
        this.objsGroup = null
        this.tilesets = null

        // scoring
        this.scoreLabel = null
        this.score = 0
    }

    for (let i = 0; i < this.tilesets.length; i++) {
      let obj = this.tilesets[i];
      if (obj.gid == gid) return obj[prop];
    }
  }
  
  init(data)
  {
      this.tilesets = data.tilesets
  }

  create() {
    let audio_coin = this.sound.add("audio_coin", { loop: false });
    let gameover = this.sound.add("gameover_audio", { loop: false });
    let bg = this.sound.add("background_audio", { loop: true });
    bg.play();
    this.hasGameStarted = false // Game Started?
    this.game_over = false
    
    const map = this.make.tilemap({ key: "env" });

    const groundLayer = map.addTilesetImage("Ground_02");

    const bgLayer = map.addTilesetImage("background");

    this.tileLayer = map
      .createLayer("Tile Layer 1", [groundLayer, bgLayer], 0, 0)
      .setScale(0.83);

    this.objLayer = map.getObjectLayer("Object Layer 1")["objects"];

    const skyBg = this.add
      .image(width * 0.5, height * 0.5, "sky")
      .setScrollFactor(0);
    skyBg.scale = 0.6;

    createAligned(this, totalWidth, "mountain", 0.25);
    createAligned(this, totalWidth, "plateau", 0.5);
    createAligned(this, totalWidth, "ground", 1);
    createAligned(this, totalWidth, "plants", 1.25);

    this.cameras.main.setBounds(0, 0, width * 3000, height);

    this.bug = new Bug(this, gameWidth, gameHeight);
    this.bug.render();
    this.bug.player.setScale(0.7);

    this.input.keyboard.on("keydown-SPACE", (ev) => {
      this.startGame();
    });

    this.objsGroup = this.physics.add.group();

    this.objLayer.forEach((object) => {
      let name = this.getObjPropertyFromGid(object.gid, "name");

      let obj = this.objsGroup.create(object.x, object.y, name);

      obj.name = name;
      obj.setScale(0.79);
      obj.enableBody = true;
      obj.body.immovable = true;

      if (name == "Star") {
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
        if (_obj.texture.key == "Star") {
          _obj.destroy();
          this.score += 5;
          this.scoreLabel.setText(`Score: ${this.score}`);
        } else if (_obj.texture.key == "Sign_01") {
          // not collidable
        }
        else{
          this.game_over = true
          this.stopGame() 
          bg.pause();
          gameover.play();
          this.scene.start("GameOverScene"); 
        }
    });


    this.scoreLabel = this.add
      .text(10, 10, "Score: 0", {
        fontSize: "20px",
        fontFamily: "PS2P",
        fill: "yellow",
      })
      .setScrollFactor(0);

  }

  update() {
    // this.tileLayer.x -= this.envSpeed;
    // this.objLayerObjects.forEach((obj) => {
    //   obj.x -= this.envSpeed;
    // });
    if (this.input.activePointer.leftButtonDown() && !this.hasGameStarted)
      this.startGame();


    this.bug.update();

    if(this.hasGameStarted)
    {
      const cam = this.cameras.main;
      const speed = 4;
      cam.scrollX += speed;
    }

    
  }
  startGame() {
        if(this.game_over)
            return
        this.hasGameStarted = true
        this.bug.startGame()
        this.envSpeed = sceneConfig.envSpeed
    }


    stopGame()
    {
        this.sound.stopByKey('bg');
        this.hasGameStarted = false
        this.bug.stopGame()
    }
}
