class MenuScene extends Phaser.Scene {

  

  constructor() {
    super({
      key: "MenuScene",
    });

    this.tilesets = null
  }
  
  init(data)
  {
    this.tilesets = data.tilesets;
  }
  
  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const totalWidth = width * 3000;
    console.log(totalWidth);

    const skyBg = this.add
      .image(width * 0.5, height * 0.5, "sky")
      .setScrollFactor(0);
    skyBg.scale = 0.6;

    createAligned(this, totalWidth, "mountain", 0.25);
    createAligned(this, totalWidth, "plateau", 0.5);
    createAligned(this, totalWidth, "ground", 1);
    createAligned(this, totalWidth, "plants", 1.25);

    this.cameras.main.setBounds(0, 0, width * 3000, height);

    let menumusic = this.sound.add("menu_audio", { loop: true });
    menumusic.play();


    const animSprite = this.add
      .sprite(-100, -100, "animation_sprite")
      .setDepth(1);
    animSprite.setScale(2);
    animSprite.setScrollFactor(0);

    this.anims.create({
      key: "flap",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("animation_sprite", {
        frames: [0, 1],
      }),
    });

    const playButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        "play_button"
      )
      .setDepth(1);
    playButton.setScrollFactor(0);

    // playButton.setScale(0.8);
    const menuButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 100,
        "options_button"
      )
      .setDepth(1);
    menuButton.setScrollFactor(0);

    menuButton.setScale(1.1);
    playButton.setInteractive();
    menuButton.setInteractive();


    const multiplayButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 100,
        "multiplay_button"
      )
      .setDepth(1);

    multiplayButton.setInteractive();

    
    multiplayButton.setScale(0.7)
    multiplayButton.setScrollFactor(0);

    multiplayButton.on("pointerover", () => {
      animSprite.setVisible(true);
      animSprite.x = multiplayButton.x - multiplayButton.width / 2 - 10;
      animSprite.y = multiplayButton.y;
      animSprite.play("flap");
    });

    multiplayButton.on("pointerout", () => {
        animSprite.setVisible(false);
    });

    multiplayButton.on("pointerup", () => {
        console.log('PLAY MULTI')
    });

    playButton.on("pointerover", () => {
      animSprite.setVisible(true);
      animSprite.x = playButton.x - playButton.width;
      animSprite.y = playButton.y;
      animSprite.play("flap");
    });

    menuButton.on("pointerout", () => {
      animSprite.setVisible(false);
    });

    playButton.on("pointerup", () => {
      this.sound.stopByKey('menu_audio');
      this.scene.start("GameScene", {tilesets: this.tilesets} );
    });

    menuButton.on("pointerover", () => {
      animSprite.setVisible(true);
      animSprite.x = menuButton.x - menuButton.width;
      animSprite.y = menuButton.y;

      animSprite.play("flap");
    });

    playButton.on("pointerout", () => {
      animSprite.setVisible(false);
    });

    menuButton.on("pointerup", () => {
      //   todo
    });
  }

  update() {
    const cam = this.cameras.main;
    const speed = 3;
    cam.scrollX += speed;
  }
}
