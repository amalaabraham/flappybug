class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LoadingScene",
    });
  }

  preload() {
    this.load.image(
      "menu_background",
      "../game/Map/PNG/Background/Background_01.png"
    );

    this.load.image("play_button", "../game/assets/play_button.png");

    this.load.spritesheet(
      "animation_sprite",
      "../game/assets/spritesheet2.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }

  create() {
    this.scene.start("MenuScene");
  }
}
