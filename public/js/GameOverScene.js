class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameOverScene",
    });
  }

  init(score) {
    this.score = score;
  }
  create() {
    let label = this.add.text(gameWidth / 2, gameHeight / 2, "Game Over!", {
      fontSize: "50px",
      fontFamily: "PS2P",
      align: "center",
      fill: "#fff",
    });
    label.setOrigin(0.5, 0.5);
    this.showRetryAndScore();
  }

  showRetryAndScore() {
    let backLabel = this.add
      .text(10, gameHeight - 30, "<- Retry", {
        fontSize: "15px",
        fontFamily: "PS2P",
        align: "center",
        fill: "#fff",
      })
      .setDepth(1);
    backLabel.setInteractive({ useHandCursor: true });

    const scoreLabel = this.add
      .text(gameWidth / 2, gameHeight / 1.5, `Score: ${this.score}`, {
        fontSize: "15px",
        fontFamily: "PS2P",
        align: "center",
        fill: "#fff",
      })
      .setDepth(1);

    backLabel.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
  }
}
