module.exports = class PlayersEnv {
    
    constructor()
    {
        this.availableId = 0
        this.currentPlayers = 0
        this.players = {}
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

    }

    dropPlayer(_id)
    {
        console.log(`Player with ID ${_id} disconnected`);
        delete(this.players[_id])
        this.currentPlayers--
    }
}