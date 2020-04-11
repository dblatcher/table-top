class Player {
    constructor (playerName, socketId, playerId) {
        this.playerName = playerName;
        this.socketId = socketId;
        this.playerId = playerId;
    } 
    get type() {return 'PLAYER'}

    get clientSafeVersion () {
        return {
            type: this.type,
            playerName: this.playerName,
            playerId: this.playerId,
        }
    }
}

module.exports = Player