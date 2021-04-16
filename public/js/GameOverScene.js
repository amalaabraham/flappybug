class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameOverScene",
    });
  }

  init(score) {
    this.score = score;
  }
  create(data) {
    let label = this.add.text(gameWidth / 2, gameHeight / 2, "Game Over!", {
      fontSize: "50px",
      fontFamily: "PS2P",
      align: "center",
      fill: "blue",
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
    console.log(typeof this.score);
    if (typeof this.score === "number") {
      const scoreLabel = this.add
        .text(
          gameWidth / 3.5,
          gameHeight / 1.5,
          `Your Score: ${this.score}  High Score: ${localStorage.getItem(
            "flappyhighscore"
          )}`,
          {
            fontSize: "15px",
            fontFamily: "PS2P",
            align: "center",
            fill: "#fff",
          }
        )
        .setDepth(1);
    }

    backLabel.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
  }
}
