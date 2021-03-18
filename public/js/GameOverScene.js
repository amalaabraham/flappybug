class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameOverScene",
    });
  }

  create() {
    this.add.image(0, 0, "go_background").setOrigin(0).setDepth(0);
    let label = this.add.text(gameWidth / 2, gameHeight / 2, "Game Over!", { fontSize: '50px', fontFamily: 'PS2P', align: 'center', fill: '#fff' })
    label.setOrigin(0.5, 0.5)
    setTimeout( () => {
        this.scene.start("MenuScene");
    }, 4000) 
  }
}
