function onMessage (state, socket,io){
    return function (playerId, messageText) {

        const matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        const matchingSession = matchingPlayer.getSessionBySocket(socket)
        if (!matchingSession) {return false}
        const matchingGame = matchingSession.game
        if (!matchingGame) {return false}

        console.log(`${matchingPlayer.playerName}(${playerId}) sent a message`)

        socket.to(matchingGame.gameId).emit('player-message',{ 
            playerId, 
            playerName:matchingPlayer.playerName, 
            messageText
        });
    }
}

module.exports = onMessage