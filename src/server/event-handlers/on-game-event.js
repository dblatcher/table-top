function onGameEvent (state, socket, io){
    return function (playerId, type, data) {

        matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer || !matchingPlayer.gameId) {return false}

       console.log(`${matchingPlayer.playerName} send a ${type} event.`);

        socket.to(matchingPlayer.gameId).emit('game-event',{ 
            player: matchingPlayer.clientSafeVersion,
            type,
            data,
        });
    }
}

module.exports = onGameEvent