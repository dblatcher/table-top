sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');

function onRequestEntry(state, socket, io){
    return function (data, callback) {

        const {gameId} = data
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)
        const matchingGame = state.getGameById(gameId)

        if (!matchingPlayer) {
            console.log('refusing game entry: NOT_SIGNED_IN')
            const refusal = state.makeRefusal ('NOT_SIGNED_IN')
            callback( refusal.clientSafeVersion )
            return false
        }

        console.log(`${matchingPlayer.playerName} requested entry to game ${matchingGame.gameName}`);
        // TO DO - GM to accept or decline requests


        console.log(`added ${matchingPlayer.playerName} to game ${gameId}, on socket ${socket.id}`)
        matchingPlayer.joinSession(matchingGame, socket)
        callback(matchingPlayer.clientSafeVersion)
        sendStateToClients(state, socket, io, gameId)
    }
}

module.exports = onRequestEntry