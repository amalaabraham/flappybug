class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');

        this.tilesets = null;

        this.tileLayer = null; // Tile Layer includes ground and Background Image
        this.objLayer = null; // Json array includes all objects except player
        this.objLayerObjects = [] // include all physical objects
        this.envSpeed = 3 // Background moving speed

    }

    getObjPropertyFromGid(gid, prop) {
        if (this.tilesets == null || this.tilesets == undefined) {
            DEBUG("Object JSON Tilesets")
            return null;
        }

        for (let i = 0; i < this.tilesets.length; i++) {
            let obj = this.tilesets[i]
            if (obj.gid == gid)
                return obj[prop]
        }
    }

    loadTilesets() {
        let json = $.ajax({
            url: "..\/game\/fp-env.json",
            dataType: 'json',
            async: false,
        }).responseJSON;
        let tilesets = json['tilesets']
        this.tilesets = tilesets.map(item => {
            return {
                "image": '..\/game\/' + item.image,
                "gid": item.firstgid,
                "name": item.name,
            }
        });
    }

    preload() {

        this.loadTilesets();


        this.load.tilemapTiledJSON('env', '..\/game\/fp-env.json');

        for (let i = 0; i < this.tilesets.length; i++) {
            let obj = this.tilesets[i]
            this.load.image(obj.name, obj.image)
        }

        this.load.image('bug', '..\/game\/assets\/fbug_01.png')

    }

    create() {

        const map = this.make.tilemap({ key: 'env' });

        const groundLayer = map.addTilesetImage('Ground_02')
        const bgLayer = map.addTilesetImage('background')

        this.tileLayer = map.createLayer('Tile Layer 1', [groundLayer, bgLayer], 0, 0).setScale(0.83);
        this.objLayer = map.getObjectLayer('Object Layer 1')['objects'];

        const objs = this.physics.add.staticGroup()
        this.objLayer.forEach(object => {
            let obj = objs.create(object.x, object.y, this.getObjPropertyFromGid(object.gid, 'name'));
            obj.setScale(0.79)
            obj.setX( Math.round(object.x * 0.79))
            obj.setY( Math.round(object.y * 0.79))

            this.objLayerObjects.push(obj)
        });

        console.log(this.objLayerObjects)
        var player = this.physics.add.sprite(20, 20, 'bug');

        player.setBounce(0.2)
        player.setScale(1.2)

        // player.body.velocity.y = 150
        // player.body.velocity.x = 150


    }

    update()
    {
        this.tileLayer.x -= this.envSpeed;

        this.objLayerObjects.forEach( obj => {
            obj.x -= this.envSpeed;
        })

    }


}