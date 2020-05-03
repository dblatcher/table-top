function onGmClosingGame(state, socket, io){
    return function (data) {
        const {gameId, playerId} = data;
        console.log (`Close Game Request for game ${gameId} from player ${playerId}, on socket ${socket.id}`)
        const matchingPlayer = state.getPlayerById(playerId);
        const matchingSession = matchingPlayer.getSessionBySocket(socket)
        const matchingGame = state.getGameById(gameId);

        if (!matchingGame) {
            console.warn('no game found!')
            return false
        }

        if (matchingPlayer !== matchingGame.masterPlayer || matchingSession.socketId !== socket.id) {
            console.warn('something doesn\'t match...')
            console.log(matchingSession, matchingPlayer, matchingGame)
            return false
        }

        console.log('closing game')
        state.closeGame(gameId)
    }
}

module.exports = onGmClosingGame