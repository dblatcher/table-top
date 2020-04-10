function onMessage (state, socket){
    return function (playerId, messageText) {

        matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        console.log(`${matchingPlayer.userName}(${playerId}): messageText`)
        socket.broadcast.emit('player-message',{ playerId, userName:matchingPlayer.userName, messageText});
    }
}

module.exports = onMessage