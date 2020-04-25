sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');

function onDisconnect(state, socket, io){
    return function () {
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)

        if (!matchingPlayer || !matchingPlayer.gameId) {return} // not signed in or not in a game

        const matchingGame = state.getGameById(matchingPlayer.gameId)
        if (!matchingGame) { return } //player left an already closed game

        socket.leave(matchingGame.gameId)
        matchingPlayer.gameId = false
        sendStateToClients(state, socket, io, matchingGame.gameId)

        console.log (`Player ${matchingPlayer.playerName} left ${matchingGame.gameName}.${matchingPlayer === matchingGame.masterPlayer ? 'THEY ARE THE GM' : ''}`)
    }
}

module.exports = onDisconnect