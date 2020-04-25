sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');

function onRequestEntry(state, socket, io){
    return function (data, callback) {

        const {gameId} = data
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)

        if (!matchingPlayer) {
            console.log('refusing: NOT_SIGNED_IN')
            const refusal = state.makeRefusal ('NOT_SIGNED_IN')
            callback( refusal.clientSafeVersion )
            return false
        }

        console.log(`${matchingPlayer.playerName} requested entry to game ${gameId}`);
        console.log({matchingPlayer})

        if (matchingPlayer.gameId) {
            console.log('refusing: ALREADY_PLAYING_ANOTHER_GAME')
            const refusal = state.makeRefusal ('ALREADY_PLAYING_ANOTHER_GAME', state.getGameById(matchingPlayer.gameId))
            callback( refusal.clientSafeVersion )
            return false
        }

        matchingPlayer.gameId = gameId
        socket.join(gameId)
        console.log(`added ${matchingPlayer.playerName} to game ${gameId}`)

        callback(matchingPlayer.clientSafeVersion)
        sendStateToClients(state, socket, io, gameId)
    }
}

module.exports = onRequestEntry