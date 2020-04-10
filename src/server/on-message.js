function onMessage (state, socket){
    return function (playerId, messageText) {

        matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        console.log(`${matchingPlayer.playerName}(${playerId}): messageText`)
        socket.broadcast.emit('player-message',{ playerId, playerName:matchingPlayer.playerName, messageText});
    }
}

module.exports = onMessage