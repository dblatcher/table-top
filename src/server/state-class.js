
class Player {
    constructor (userName, socketId, playerId) {
        this.userName = userName;
        this.socketId = socketId;
        this.playerId = playerId;
    } 
    get type() {return 'PLAYER'}

    get clientSafeVersion () {
        return {
            type: this.type,
            userName: this.userName,
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

    addPlayer (userName, socketId) { 
        const player = new Player(userName, socketId, this.getNextPlayerId())
        this.players.push(player)
        return player
    }
    makeRefusal (reason, details)    { return new Refusal(reason, details) }

    removePlayersWhere(filterFunction) {
        const matchingPlayers = this.players.filter(filterFunction)
        this.players = this.players.filter(player => matchingPlayers.indexOf(player) == -1)
        return matchingPlayers
    }

    get clientSafeVersion () {
        let safePlayers = this.players.map(player => player.clientSafeVersion)

        return {
            players: safePlayers,
        }
    }

}

module.exports = GameState