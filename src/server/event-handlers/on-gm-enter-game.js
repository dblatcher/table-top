sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');


function onGmEnterGame(state, socket, io){
    return function (data, callback) {

        // TO DO - SANITISE INPUT!!

        const {gameId} = data
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)
        const matchingGame = state.getGameById(gameId)

        console.log('onGmEnterGame', {matchingPlayer, matchingGame} )

        if(!matchingPlayer || !matchingGame) {
            const refusal = state.makeRefusal ('FAILED_GM_SIGN_IN', 0)
            callback(refusal.clientSafeVersion)
            return false
        }

        const playerIsGameMaster = matchingGame.masterPlayer === matchingPlayer
        if (playerIsGameMaster) {
            console.log('OK: They are the GM for that game')
        } else {
            console.log('They are *NOT* the GM for that game!')
            const refusal = state.makeRefusal ('FAILED_GM_SIGN_IN', 0)
            callback(refusal.clientSafeVersion)
            return false
        }

        matchingPlayer.socketId = socket.id
        matchingPlayer.gameId = gameId
        socket.join(gameId)
        console.log(`${matchingPlayer.playerName} JOINED as GM of ${matchingGame.gameName}(${matchingGame.gameId})`)

        callback(matchingPlayer.clientSafeVersion)
        sendStateToClients(state, socket, io, gameId)
    }
}

module.exports = onGmEnterGame