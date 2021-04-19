class WaitingScene extends Phaser.Scene {
  init(data) {
    this.tilesets = data.tilesets;
  }

  constructor() {
    super({
      key: "WaitingScene",
    });

    this.tilesets = null;
  }

  create() {
    let label = this.add.text( // show "Waiting for an opponent..." text on game screen center
      gameWidth / 2,
      gameHeight / 2,
      "Waiting for an opponent...",
      Label0Css("20px", "#fff")
    );

    label.setOrigin(0.5, 0.5);
    socket.emit("waiting", true); // tell server we're waiting

    let backLabel = this.add // add quit waiting button on bottom-left
      .text(10, gameHeight - 30, "<- Back", Label0Css("15px", "#fff"))
      .setDepth(1);
    backLabel.setInteractive({ useHandCursor: true });

    backLabel.on("pointerup", () => {
      this.scene.start("MenuScene", { tilesets: this.tilesets });
      socket.emit("quit_waiting", true);
    });

    socket.on("found_player", (data) => { // when server tells us it found a match
      this.scene.start("GameScene", {
        hasPriority: data.priority,
        isMultiplayer: true,
        tilesets: this.tilesets,
      });
    });
  }
}
