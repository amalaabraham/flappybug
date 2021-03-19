var doDebug = false;
var gameHeight, gameWidth;

var playMusic = true;

var DEBUG = (err) => {
  if (doDebug) console.log(err);
};

$(() => {
  gameHeight = Math.floor($(document).height() * 0.8);
  gameWidth = Math.floor($(document).width() * 0.8);

  DEBUG(`game width = ${gameWidth}`);
  DEBUG(`game height = ${gameHeight}`);

  var config = {
    width: gameWidth,
    height: gameHeight,
    backgroundColor: 0x40eef2,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
      },
    },
    scene: [LoadingScene, MenuScene, WaitingScene, GameScene, GameOverScene],
  };

  game = new Phaser.Game(config);
});
