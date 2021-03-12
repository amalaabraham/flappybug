class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    this.add.text(25, 25, "Game Menu Here", { fill: "yellow" });
  }
}
