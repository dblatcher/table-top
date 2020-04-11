
const Game = require ('./classes/Game')
const Player = require ('./classes/Player')
const Refusal = require ('./classes/Refusal')

class AppState {

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

module.exports = AppState