class Bug {

    constructor(scene, gameWidth, gameHeight)
    {   
        this.scene = scene
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.player = null;

        this.jumpVelocity = -500
        this.gravityVelocity = 300
        this.gravityAngularVelocity = 80
        this.isJumping = false
    }

    render()
    {
        this.player = this.scene.physics.add.sprite(Math.floor(gameHeight / 2), Math.floor(gameWidth / 4), 'bug');
        console.log(this.player)
        this.initPlayer()
        this.setListeners()
        return this;
    }

    initPlayer()
    {
        this.player.body.velocity.y = this.gravityVelocity
        this.player.body.angularVelocity = this.gravityAngularVelocity
        this.player.body.allowRotation = true
    }

    jump()
    {
        this.player.body.velocity.y = this.jumpVelocity
        this.player.body.angularVelocity = -160

        setTimeout(() => {
            this.player.body.velocity.y = this.gravityVelocity
            this.player.body.angularVelocity = this.gravityAngularVelocity

        }, 260);
    }
    setListeners()
    {
        this.scene.input.keyboard.on('keydown', ev => { 
            this.jump()
        });
    }

    update()
    {
        if(this.player.body.rotation < -50)
            this.player.body.angularVelocity = this.gravityAngularVelocity

        if(this.player.body.rotation > 50)
            this.player.body.angularVelocity = 0

    

    }

    keyDown(player)
    {
    }
}