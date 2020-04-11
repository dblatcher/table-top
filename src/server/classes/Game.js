class Game {
    constructor (gameName, gameDetails, masterPlayer, gameId) {
        this.gameName = gameName;
        this.gameId = gameId;
        this.gameDetails = gameDetails;
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
        }
    }
}

module.exports = Game