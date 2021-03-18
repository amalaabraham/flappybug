module.exports = class Player {

    constructor(_scoket, _id)
    {
        this.socket = _scoket
        this.id = _id
        this.isWaiting = false
        this.isPlaying = false
    }

    setWaiting()
    {
        this.isWaiting = true
    }

    setPlaying()
    {
        this.isPlaying = true
    }
}