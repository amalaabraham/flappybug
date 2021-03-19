class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LoadingScene",
    });

    this.tilesets = null;
    this.progress = 0

  }

  preload() {
    // this.load.image(
    //   "menu_background",
    //   "../game/Map/PNG/Background/Background_01.png"
    // );

    this.load.image("sky", "../game/assets/sky.png");
    this.load.image("mountain", "../game/assets/mountains.png");
    this.load.image("plateau", "../game/assets/plateau.png");
    this.load.image("ground", "../game/assets/ground.png");
    this.load.image("plants", "../game/assets/plant.png");


    this.load.image( "go_background", "../game/Map/PNG/Background/Background_02.png"); // gameover scene background
    this.load.image("bug", "../game/assets/fbug_01.png"); // bug
    this.load.image("play_button", "../game/assets/play_button.png");
    this.load.image("multiplay_button", "../game/assets/multiplay.png");
    this.load.image("on", "../game/assets/on.png");
    this.load.image("off", "../game/assets/off.png");


    // loads audio
    this.load.audio("menu_audio", "../game/assets/audio/menu_audio.mp3");
    this.load.audio("audio_coin", "../game/assets/audio/audio_coin.mp3");
    this.load.audio("gameover_audio", "../game/assets/audio/gameover.wav");
    this.load.audio("background_audio", "../game/assets/audio/background_audio.mp3");
    
    this.load.spritesheet(
      "animation_sprite",
      "../game/assets/spritesheet2.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.loadTilesets()

    this.load.tilemapTiledJSON("env", "../game/fp-env.json"); // load tilemap

    for (let i = 0; i < this.tilesets.length; i++) {
      let obj = this.tilesets[i];
      this.load.image(obj.name, obj.image);
    }

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();

    var loadingText = this.make.text({
      x: gameWidth / 2,
      y: gameHeight / 2 - 50,
      text: 'Loading...',
      style: {
          font: '30px monospace',
          fill: '#ffffff',
    }})

    loadingText.setOrigin(0.5, 0.5)

    var ratioText = this.make.text({
      x: gameWidth / 2,
      y: gameHeight / 2 + 30,
      text: '0%',
      style: {
          font: '20px monospace',
          fill: '#ffffff',
    }})

    ratioText.setOrigin(0.5, 0.5)

    var assetLoadingText = this.make.text({
      x: 10,
      y: gameHeight - 20,
      text: 'Loading Assest: bug.png',
      style: {
          font: '10px monospace',
          fill: '#ffffff',
    }})


    progressBox.fillStyle(0xffffff, 0.2);

    let pbSettings = {
      'x': gameWidth / 6,
      'y': gameHeight / 2,
      'width': 4 * gameWidth / 6,
      'height': 60
    }
    progressBox.fillRect(pbSettings['x'], pbSettings['y'], pbSettings['width'], pbSettings['height']);

    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0x23aaee, 1);
      let factor = (value == 0)?0: -20
      progressBar.fillRect(pbSettings['x'] + 10, pbSettings['y'] + 10, factor + pbSettings['width'] * value, pbSettings['height'] - 20);
      ratioText.setText(`${Math.round(value * 100)} %`)
    });
                
    this.load.on('fileprogress', function (file) {
      let filename = file.src.split('/').slice(-1).pop()
        assetLoadingText.setText(`Loading asset: ${filename}`)
    });

  }

  create() 
  {
   
    this.scene.start("MenuScene", {tilesets: this.tilesets} );
  }

   loadTilesets() {
    let json = $.ajax({
      url: "../game/fp-env.json",
      dataType: "json",
      async: false,
    }).responseJSON;
    let tilesets = json["tilesets"];
    this.tilesets = tilesets.map((item) => {
      return {
        image: "../game/" + item.image,
        gid: item.firstgid,
        name: item.name,
      };
    });
  }
}
