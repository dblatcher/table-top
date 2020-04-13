function onGmClosingGame(state, socket, io){
    return function (data) {
        const {gameId, playerId} = data;
        console.log (`Close Game Request for game ${gameId} from player ${playerId}, on socket ${socket.id}`)
        const matchingPlayer = state.getPlayerById(playerId);
        const matchingGame = state.getGameById(gameId);

        if (matchingPlayer !== matchingGame.masterPlayer || matchingPlayer.socketId !== socket.id) {
            console.warn('something doesn\'t match...')
            console.log(socket.id, matchingPlayer, matchingGame)
            return false
        }

        console.log('closing game')
        io.to(gameId).emit('game-closed', gameId);
        state.closeGame(gameId)
    }
}

module.exports = onGmClosingGame