
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
        this.games = []

        let nextPlayerIdKey = 1000
        this.getNextPlayerId = function() {return `${Math.floor(Math.random()*10000000)}-${nextPlayerIdKey++}` }

        let nextGameIdKey = 1000
        this.getNextGameId = function() {return `${Math.floor(Math.random()*10000000)}-${nextGameIdKey++}` }
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

    addGame (gameName, gameDetails, masterPlayer) {
        const game = new Game(gameName, gameDetails, masterPlayer, this.getNextGameId())
        this.games.push(game)
        return game
    }

    get clientSafeVersion () {
        let safePlayers = this.players.map(player => player.clientSafeVersion)
        let safeGames = this.games.map(game => game.clientSafeVersion)

        return {
            players: safePlayers,
            games: safeGames,
        }
    }

}

module.exports = GameState