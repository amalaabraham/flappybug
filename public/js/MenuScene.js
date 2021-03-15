export class MenuScene2 extends Phaser.Scene {
  constructor() {
    super({
      key: "Menu Scene",
    });
  }

  create() {
    this.add.image(0, 0, "menu_background").setOrigin(0).setDepth(0);
    this.add
      .image(
        this.game.renderer.width / 2,
        this.renderer.height * 0.2,
        "game_logo"
      )
      .setDepth(1);

    const animSprite = this.add.sprite(100, 100, "animationSprite").setDepth(1);
    animSprite.setScale(2);

    this.anims.create({
      key: "walk",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("test", { frames: [0, 1, 2] }),
    });

    const playButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        "play_button"
      )
      .setDepth(1);

    playButton.setScale(0.1);

    playButton.setInteractive();

    playButton.on("pointerover", () => {
      console.log("hover");
      hoverSprite.setVisible(true);
      //   hoverSprite.x = playButton.x - playButton.width;
      hoverSprite.y = playButton.y;

      hoverSprite.play("walk");
    });

    playButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
      console.log("out");
    });

    playButton.on("pointerup", () => {
      console.log("click");
    });
  }
}
