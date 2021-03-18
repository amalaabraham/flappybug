class WaitingScene extends Phaser.Scene{

    constructor()
    {
        super({
            key: "WaitingScene",
        });
    }

    create()
    {
        let label = this.add.text(gameWidth / 2, gameHeight / 2, "Waiting for an oponent...", { fontSize: '20px', fontFamily: 'PS2P', align: 'center', fill: '#fff' })
        label.setOrigin(0.5, 0.5)
    }
}