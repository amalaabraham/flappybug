class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameOverScene",
    });
  }

  create() {
    this.add.image(0, 0, "go_background").setOrigin(0).setDepth(0);
    let label = this.add.text(gameWidth/3.5, gameHeight/2.5, "Game Over!", { fontSize: '50px', fontFamily: 'PS2P', align: 'center', fill: '#fff' })
    setTimeout( () => {
        this.scene.start("MenuScene");
    }, 4000) 
  }
}
