const Refusal = require ('./Refusal')

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

class EntryRequest {
    constructor (game, player, callback, socket) {
        this.game = game;
        this.applicant = player;
        this.callback = callback
        this.requestTime = new Date();
        this.status = 'PENDING'
        this.socket = socket
    }

    grant() {
        this.status = 'GRANTED'
        this.applicant.joinSession(this.game, this.socket)
        this.callback(this.applicant.clientSafeVersion)
    }

    refuse() {
        this.status = 'REFUSED'
        this.callback(new Refusal('GM_REFUSED').clientSafeVersion)
    }
}

module.exports = Game