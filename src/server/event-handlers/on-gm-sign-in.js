sendStateToClients = require ('../sendStateToClients')

function onGmSignIn(state, socket, io){
    return function (data, callback) {

        // TO DO - SANITISE INPUT!!
        console.log(`user requested sign in to game${data.gameId} AS GM with player ID name ${data.gameMasterId} `);

        const matchingPlayer = state.getPlayerById(data.gameMasterId)
        console.log('gm matches:', matchingPlayer )

        const matchingGame = state.getGameById(data.gameId)
        console.log('game matches:', matchingGame )

        if(!matchingPlayer || !matchingGame) {
            const refusal = state.makeRefusal ('FAILED_GM_SIGN_IN', 0)
            callback(refusal.clientSafeVersion)
            return false
        }

        const playerIsGameMaster = matchingGame.masterPlayer === matchingPlayer
        if (playerIsGameMaster) {
            console.log('They are the GM for that game')
        } else {
            console.log('They are *NOT* the GM for that game!')
            const refusal = state.makeRefusal ('FAILED_GM_SIGN_IN', 0)
            callback(refusal.clientSafeVersion)
            return false
        }

        matchingPlayer.socketId = socket.id
        socket.join(data.gameId)
        console.log(`logged in ${matchingPlayer.playerName} as GM of ${matchingGame.gameName}(${matchingGame.gameId})`)

        callback(matchingPlayer.clientSafeVersion)
        sendStateToClients(state, socket, io, data.gameId)
    }
}

module.exports = onGmSignIn