function onMessage (state, socket,io){
    return function (playerId, messageText) {

        matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        console.log(`${matchingPlayer.playerName}(${playerId}): messageText`)


        socket.to(matchingPlayer.gameId).emit('player-message',{ playerId, playerName:matchingPlayer.playerName, messageText});

    }
}

module.exports = onMessage