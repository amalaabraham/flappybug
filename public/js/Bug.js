class Bug {

    constructor(scene, gameWidth, gameHeight)
    {   
        this.scene = scene
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.player = null;
    }

    render()
    {
        this.player = this.scene.physics.add.sprite(Math.floor(gameHeight / 2), Math.floor(gameWidth / 4), 'bug');
        this.setListeners()
        return this.player
    }

    setListeners()
    {
        this.scene.input.keyboard.on('keydown-SPACE', this.keyDown);
    }

    keyDown(ev)
    {
        console.log('Key pRessed')
    }
}