var doDebug = false;

$( () => {
    
    let DEBUG = (err) => {
        if(doDebug)
            console.log(err);
    };

    let gameHeight = Math.floor( $(document).height() * .8 );
    let gameWidth = Math.floor( $(document).width() * .8 );

    DEBUG(`game width = ${gameWidth}`);
    DEBUG(`game height = ${gameHeight}`);


    var config = {
        width: gameWidth,
        height: gameHeight,
        backgroundColor: 0x000, 
        scene: [Menu, ],
    }
    
    var game = new Phaser.Game(config);

});