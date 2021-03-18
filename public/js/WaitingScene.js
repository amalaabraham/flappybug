class WaitingScene extends Phaser.Scene{

    init(data)
    {
        this.tilesets = data.tilesets
    }

    constructor()
    {
        super({
            key: "WaitingScene",
        });

        this.tilesets = null
    }

    create()
    {
        let label = this.add.text(gameWidth / 2, gameHeight / 2, "Waiting for an opponent...", { fontSize: '20px', fontFamily: 'PS2P', align: 'center', fill: '#fff' })
        label.setOrigin(0.5, 0.5)
        socket.emit('waiting', true);

        socket.on('found_player', data => {
            this.scene.start("GameScene", {hasPriority: data.priority, isMultiplayer: true, tilesets: this.tilesets} );
        })
    }
}