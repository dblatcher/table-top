EntryRequest = require('./EntryRequest')

class Game {
    constructor (gameName, gameDetails, masterPlayer, gameId) {
        this.gameName = gameName;
        this.gameId = gameId;
        this.details = gameDetails;
        this.masterPlayer = masterPlayer;
        this.entryRequests = []
    }
    get type() {return 'GAME'}

    addEntryRequest(player, callback, socket) {
        const entryRequest = new EntryRequest(this, player, callback, socket)
        this.entryRequests.push (entryRequest)
        return entryRequest
    }

    cancelEntryRequestFor(player) {
        this.entryRequests = this.entryRequests.filter( request => request.player !== player)
    }

    get clientSafeVersion () {
        return {
            type: this.type,
            gameName: this.gameName,
            gameId: this.gameId,
            masterId: this.masterPlayer.playerId,
            masterName: this.masterPlayer.playerName,
            details: this.details,
            entryRequests: this.entryRequests.map(entryRequest => entryRequest.clientSafeVersion )
        }
    }
}

module.exports = Game