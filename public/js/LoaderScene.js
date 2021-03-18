class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LoadingScene",
    });
  }

  preload() {
    // this.load.image(
    //   "menu_background",
    //   "../game/Map/PNG/Background/Background_01.png"
    // );

    this.load.image("sky", "../game/assets/sky.png");
    this.load.image("mountain", "../game/assets/mountains.png");
    this.load.image("plateau", "../game/assets/plateau.png");
    this.load.image("ground", "../game/assets/ground.png");
    this.load.image("plants", "../game/assets/plant.png");

    this.load.image("play_button", "../game/assets/play_button.png");
    this.load.image("options_button", "../game/assets/options_button.png");

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
