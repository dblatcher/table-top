
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


class Refusal {
    constructor (reason, details) {
        this.reason = reason
        this.details = details
    }
    get type() {return 'REFUSAL'}

    get message () {
        if (this.reason === 'NAME_ALREADY_TAKEN') {
            return `The name '${this.details}' is already in use.`
        }
        return this.reason
    }

    get clientSafeVersion () {
        return {
            type: this.type,
            message: this.message,
        }
    }
}


class GameState {

    constructor () {
        this.players = []
        this.foo = 'bar'

        let nextPlayerIdKey = 1000
        this.getNextPlayerId = function() {return `${Math.floor(Math.random()*10000000)}-${nextPlayerIdKey++}` }
    }

    addPlayer (playerName, socketId) { 
        const player = new Player(playerName, socketId, this.getNextPlayerId())
        this.players.push(player)
        return player
    }
    makeRefusal (reason, details)    { return new Refusal(reason, details) }

    removePlayersWhere(filterFunction) {
        const matchingPlayers = this.players.filter(filterFunction)
        this.players = this.players.filter(player => matchingPlayers.indexOf(player) == -1)
        return matchingPlayers
    }

    getPlayerById(playerId) {
        const matchingPlayers = this.players.filter(player => player.playerId === playerId)
        if (matchingPlayers.length === 0) {return null}
        if (matchingPlayers.length > 1) {
            console.warn(`multiple players(${matchingPlayers.length}) with ID ${playerId}`, matchingPlayers)
            return null
        }
        return matchingPlayers[0]
    }

    get clientSafeVersion () {
        let safePlayers = this.players.map(player => player.clientSafeVersion)

        return {
            players: safePlayers,
        }
    }

}

module.exports = GameState