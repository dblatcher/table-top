class Player {
    constructor (playerName, playerId, token) {
        this.playerName = playerName;
        this.playerId = playerId;
        this.token = token;
        this.gameSessions = [];
    } 
    get type() {return 'PLAYER'}

    matches (cookies) {
        return (this.playerName === cookies.playerName && this.playerId === cookies.playerId && this.token === cookies.token)
    }

    // might be a bad idea to have Player/State methods calling socket functions - application layer
    joinSession (game, socket) {
        if (this.gameSessions.filter(gameSession => gameSession.game === game).length > 0 ) {
            return false
        }
        this.gameSessions.push (new GameSession(game, socket))
        socket.join(game.gameId)
        return true
    }

    getSessionBySocket (socket) {
        const matchingSessions = this.gameSessions.filter(gameSession => gameSession.socketId === socket.id)
        return matchingSessions[0]
    }

    // might be a bad idea to have Player/State methods calling socket functions - application layer
    leaveSessionBySocket (socket) {
        const matchingSessions = this.gameSessions.filter(gameSession => gameSession.socketId === socket.id)
        matchingSessions.forEach(gameSession => {socket.leave(gameSession.game.gameId)})
        this.gameSessions = this.gameSessions.filter(gameSession => !matchingSessions.includes(gameSession))
        return matchingSessions
    }

    leaveAnySessionsForClosedGame (gameId) {
        this.gameSessions = this.gameSessions.filter(gameSession => gameSession.game.gameId !== gameId)
    }

    isInSessionFor (gameOrGameId) {
        const gameId = typeof gameOrGameId === 'object' ? gameOrGameId.gameId : gameOrGameId;
        const matchingSessions = this.gameSessions.filter(gameSession => gameSession.game.gameId === gameId)
        return matchingSessions.length > 0
    }

    get clientSafeVersion () {
        return {
            type: this.type,
            playerName: this.playerName,
            playerId: this.playerId,
            gameSessions: this.gameSessions.map(session => {return {gameId: session.gameId}})
        }
    }
}

class GameSession {

    constructor (game, socket) {
        this.gameId = game.gameId
        this.game = game
        this.socketId = socket.id
    }

}

module.exports = Player