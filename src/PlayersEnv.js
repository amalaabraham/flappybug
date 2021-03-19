module.exports = class PlayersEnv {
    
    constructor()
    {
        this.availableId = 0
        this.currentPlayers = 0
        this.players = {}
        this.IDs = []
    }

    whosAnyoneWaiting()
    {
        if(this.currentPlayers <= 1) // one player only
            return undefined

        for(let i = 0; i < this.IDs.length; i++)
        {
            let id = this.IDs[i]
            let player = this.players[id]
            if(player.isWaiting)
            {
                player.setPlaying(true)
                return player
            }
        }
        return undefined
    }

    getAvailableId()
    {
        return this.availableId;
    }

    addPlayer(_player)
    {
        this.currentPlayers++
        this.availableId++
        this.players[_player.id] = _player
        this.IDs.push(_player.id)
    }

    dropPlayer(_id)
    {
        delete(this.players[_id])
        this.currentPlayers--
        this.IDs.splice(this.IDs.indexOf(_id), 1)
    }
}