class Game {
    constructor (gameName, gameDetails, masterPlayer, gameId) {
        this.gameName = gameName;
        this.gameId = gameId;
        this.details = gameDetails;
        this.masterPlayer = masterPlayer;
    }
    get type() {return 'GAME'}

    get clientSafeVersion () {
        return {
            type: this.type,
            gameName: this.gameName,
            gameId: this.gameId,
            masterId: this.masterPlayer.playerId,
            masterName: this.masterPlayer.playerName,
            details: this.details
        }
    }
}

module.exports = Game