class Player {
    constructor (playerName, socketId, gameId, playerId, token) {
        this.playerName = playerName;
        this.socketId = socketId;
        this.playerId = playerId;
        this.gameId = gameId;
        this.token = token;
    } 
    get type() {return 'PLAYER'}

    matches (cookies) {
        return (this.playerName === cookies.playerName && this.playerId === cookies.playerId && this.token === cookies.token)
    }

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