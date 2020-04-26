sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');


function onGmEnterGame(state, socket, io){
    return function (data, callback) {

        // TO DO - SANITISE INPUT!!

        const {gameId} = data
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)
        const matchingGame = state.getGameById(gameId)

        if(!matchingPlayer || !matchingGame) {
            const refusal = state.makeRefusal ('FAILED_GM_SIGN_IN', 0)
            callback(refusal.clientSafeVersion)
            return false
        }

        if (!matchingGame.masterPlayer === matchingPlayer) {
            console.log('They are *NOT* the GM for that game!')
            const refusal = state.makeRefusal ('FAILED_GM_SIGN_IN', 0)
            callback(refusal.clientSafeVersion)
            return false
        }

        console.log(`${matchingPlayer.playerName} JOINED as GM of ${matchingGame.gameName}(${matchingGame.gameId}), on socket ${socket.id}`)

        matchingPlayer.joinSession(matchingGame, socket)
        callback(matchingPlayer.clientSafeVersion)
        sendStateToClients(state, socket, io, gameId)
    }
}

module.exports = onGmEnterGame