class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LoadingScene",
    });
  }

  preload() {
    this.load.image("menu_background", "./assets/images/bg.png");

    this.load.image("play_button", "./assets/images/asdfhasd.png");

    this.load.spritesheet("test", "./assets/images/pipe.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("menu_logo", "./assets/images/bird.png");
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff,
      },
    });

    this.load.on("progress", (precent) => {
      loadingBar.fillRect(
        0,
        this.game.renderer.height / 2,
        this.game.renderer.width * precent,
        50
      );
      console.log(precent);
    });

    this.load.on("complete", () => {
      console.log("done");
    });
  }

  create() {
    this.scene.start("MenuScene");
  }
}
