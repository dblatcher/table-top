const cookie = require('cookie');

function onRequestEntry(state, socket, io) {


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

        const sessionOfGmInGame = matchingGame.masterPlayer.gameSessions.filter (session => session.game === matchingGame)[0]
        const existingRequestForPlayer = matchingGame.entryRequests.filter(request => request.player === matchingPlayer)[0]

        if (!sessionOfGmInGame) {
            console.log('GM_NOT_PRESENT')
            callback (state.makeRefusal('GM_NOT_PRESENT').clientSafeVersion )
            return
        }

        if (existingRequestForPlayer && existingRequestForPlayer.status === 'REFUSED') {
            console.log('ALREADY_REFUSED')
            callback (state.makeRefusal('ALREADY_REFUSED').clientSafeVersion )
            return
        }

        if (existingRequestForPlayer && existingRequestForPlayer.status === 'PENDING') {
            console.log('IGNORE - a request is already pending')
            return
        }

        if (existingRequestForPlayer && existingRequestForPlayer.status === 'GRANTED') {
            console.log(`added ${matchingPlayer.playerName} to game ${gameId}, on socket ${socket.id} - previously granted`)
            matchingPlayer.joinSession(matchingGame, socket)
            callback(matchingPlayer.clientSafeVersion)
            state.sendUpdateGameStateToAllPlayers(gameId)
            return
        }

        console.log(`asking ${matchingGame.masterPlayer.playerName} if ${matchingPlayer.playerName} can join ${matchingGame.gameName}...`)

        const entryRequest = matchingGame.addEntryRequest(matchingPlayer, callback, socket)
        io.to(sessionOfGmInGame.socketId).emit('state-update', state.getStateOfGame(gameId))

    }
}



module.exports = onRequestEntry