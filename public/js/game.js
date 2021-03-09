
$( () => {

    let gameHeight = Math.floor( $(document).height() * .8 );
    let gameWidth = Math.floor( $(document).width() * .8 );

    console.log(`game width = ${gameWidth}`);
    console.log(`game height = ${gameHeight}`);


    var config = {
        width: gameWidth,
        height: gameHeight,
        backgroundColor: 0x000, 
        scene: [Menu, ],
    }
    
    var game = new Phaser.Game(config);

});