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
    let label = this.add.text(gameWidth / 2, gameHeight / 2, "Game Over!", Label0Css("50px", "blue"));
    label.setOrigin(0.5, 0.5);
    this.showRetryAndScore();
  }

  showRetryAndScore() {
    let backLabel = this.add
      .text(10, gameHeight - 30, "<- Retry", Label0Css("15px", "#fff"))
      .setDepth(1);
    backLabel.setInteractive({ useHandCursor: true });
    DEBUG(typeof this.score);
    if (typeof this.score === "number") {
      const scoreLabel = this.add
        .text(
          gameWidth / 3.5,
          gameHeight / 1.5,
          `Your Score: ${this.score}  High Score: ${localStorage.getItem(
            "flappyhighscore"
          )}`,
          Label0Css("15px", "#fff")
        )
        .setDepth(1);
    }

    backLabel.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
  }
}
