
const Game = require ('./classes/Game')
const Player = require ('./classes/Player')
const Refusal = require ('./classes/Refusal')

class AppState {

    constructor () {
        this.players = []
        this.games = []

        let nextPlayerIdKey = 1000
        this.getNextPlayerId = function() {return `${Math.floor(Math.random()*10000000)}-${nextPlayerIdKey++}` }

        let nextTokenKey = 100
        this.getNextToken = function() {
            nextTokenKey += Math.floor(Math.random()*100)
            return `${Math.floor(Math.random()*10000) * new Date().valueOf() }-${nextTokenKey}` 
        }

        let nextGameIdKey = 1000
        this.getNextGameId = function() {return `${Math.floor(Math.random()*10000000)}-${nextGameIdKey++}` }
    }

    addPlayer (playerName, socketId, gameId) { 
        const player = new Player(playerName, socketId, gameId, this.getNextPlayerId(), this.getNextToken())
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

    getPlayerByCookies(cookies) {
        const matchingPlayers = this.players.filter(player => player.matches(cookies))
        if (matchingPlayers.length === 0) {return null}
        if (matchingPlayers.length > 1) {
            console.warn(`multiple players(${matchingPlayers.length}) with matching cookies`, matchingPlayers)
            return null
        }
        return matchingPlayers[0]
    }

    addGame (gameName, gameDetails, masterPlayer) {
        const game = new Game(gameName, gameDetails, masterPlayer, this.getNextGameId())
        this.games.push(game)
        return game
    }

    getGameById(gameId) {
        const matchingGames = this.games.filter(game => game.gameId === gameId)
        if (matchingGames.length === 0) {return null}
        if (matchingGames.length > 1) {
            console.warn(`multiple games(${matchingGames.length}) with ID ${gameId}`, matchingGames)
            return null
        }
        return matchingGames[0]
    }

    getStateOfGame(gameId) {
        const matchingGame = this.getGameById(gameId)
        if (!matchingGame) {
            return new Refusal('NO MATCHING GAME',{gameId}).clientSafeVersion
        }

        const safePlayers = this.players
        .filter (player => player.gameId === gameId)
        .map(player => player.clientSafeVersion)

        return {
            game: matchingGame.clientSafeVersion,
            players: safePlayers
        }
    }

    closeGame(gameId) {
        this.games = this.games.filter(game => game.gameId !== gameId)
    }

    get clientSafeVersion () {
        const safePlayers = this.players.map(player => player.clientSafeVersion)
        const safeGames = this.games.map(game => game.clientSafeVersion)

        return {
            players: safePlayers,
            games: safeGames,
        }
    }

}

module.exports = AppState