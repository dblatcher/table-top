class Player {
    constructor (playerName, socketId, gameId, playerId) {
        this.playerName = playerName;
        this.socketId = socketId;
        this.playerId = playerId;
        this.gameId = gameId;
    } 
    get type() {return 'PLAYER'}

    get clientSafeVersion () {
        return {
            type: this.type,
            playerName: this.playerName,
            playerId: this.playerId,
            gameId: this.gameId,
        }
    }
}

module.exports = Player