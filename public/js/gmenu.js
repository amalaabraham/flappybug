class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

    constructor() {
        super('Menu');

        this.tilesets = null;
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

    }

    create() {

        const map = this.make.tilemap({ key: 'env' });

        const groundLayer = map.addTilesetImage('Ground_02')
        const bgLayer = map.addTilesetImage('background')

        let tileLayer = map.createLayer('Tile Layer 1', [groundLayer, bgLayer], 0, 0).setScale(0.83);

        let objLayer = map.getObjectLayer('Object Layer 1')['objects'];
        console.log(objLayer)

        const objs = this.physics.add.staticGroup()
        objLayer.forEach(object => {
            let obj = objs.create(object.x, object.y, this.getObjPropertyFromGid(object.gid, 'name'));
            obj.setScale(0.79)
            obj.setX( Math.round(object.x * 0.79))
            obj.setY( Math.round(object.y * 0.79))

        });
    }


}