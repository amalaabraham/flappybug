module.exports = class Player {

    constructor(_scoket, _id)
    {
        this.socket = _scoket
        this.id = _id
        this.isWaiting = false
        this.isPlaying = false
    }

    setWaiting(w)
    {
        this.isWaiting = w
    }

    setPlaying(p)
    {
        this.waiting = false
        this.isPlaying = p
    }
}