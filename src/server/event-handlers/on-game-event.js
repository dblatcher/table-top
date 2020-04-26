function onGameEvent (state, socket, io){
    return function (playerId, type, data) {

        const matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        const matchingSession = matchingPlayer.getSessionBySocket(socket)
        if (!matchingSession) {return false}
        const matchingGame = matchingSession.game
        if (!matchingGame) {return false}

       console.log(`${matchingPlayer.playerName} send a ${type} event.`);

        socket.to(matchingGame.gameId).emit('game-event',{ 
            player: matchingPlayer.clientSafeVersion,
            type,
            data,
        });
    }
}

module.exports = onGameEvent