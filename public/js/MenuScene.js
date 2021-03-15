class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MenuScene",
    });
  }

  create() {
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

    playButton.setInteractive();

    playButton.on("pointerover", () => {
      animSprite.setVisible(true);
      animSprite.x = playButton.x - playButton.width;
      animSprite.y = playButton.y;

      animSprite.play("flap");
    });

    playButton.on("pointerout", () => {
      animSprite.setVisible(false);
    });

    playButton.on("pointerup", () => {
      this.scene.start("GameScene");
    });
  }
}
