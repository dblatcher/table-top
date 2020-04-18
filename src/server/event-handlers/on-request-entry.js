sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');

function onRequestEntry(state, socket, io){
    return function (data, callback) {

        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)

        if (!matchingPlayer) {
            console.log('refusing: NOT_SIGNED_IN')
            const refusal = state.makeRefusal ('NOT_SIGNED_IN')
            callback( refusal.clientSafeVersion )
            return false
        }

        // TO DO - SANITISE INPUT!!
        console.log(`${matchingPlayer.playerName} requested entry to game ${data.gameId}`);

        matchingPlayer.gameId = data.gameId
        socket.join(data.gameId)
        console.log(`added ${matchingPlayer.playerName} to game ${data.gameId}`)

        callback(matchingPlayer.clientSafeVersion)
        sendStateToClients(state, socket, io, data.gameId)
    }
}

module.exports = onRequestEntry