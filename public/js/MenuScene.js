class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MenuScene",
    });
  }

  preload() {
    this.load.audio("menu_audio", "../game/assets/audio/menu_audio.mp3");
  }

  create() {
    let menumusic = this.sound.add("menu_audio", { loop: true });
    menumusic.play();
    this.add.image(0, 0, "menu_background").setOrigin(0).setDepth(0);

    const animSprite = this.add
      .sprite(-100, -100, "animation_sprite")
      .setDepth(1);
    animSprite.setScale(2);

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

    // playButton.setScale(0.8);
    const menuButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 100,
        "options_button"
      )
      .setDepth(1);

    menuButton.setScale(1.1);
    playButton.setInteractive();
    menuButton.setInteractive();

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
      this.scene.start("GameScene");
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
}
