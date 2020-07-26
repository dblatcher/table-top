function ongameSettingsReport (state, socket, io){
    return function (playerId, requesterPlayerId, data) {

        const matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        const matchingSession = matchingPlayer.getSessionBySocket(socket)
        if (!matchingSession) {return false}
        const matchingGame = matchingSession.game
        if (!matchingGame) {return false}
        if (matchingPlayer !== matchingGame.masterPlayer) { return false}

        const requesterPlayer = state.getPlayerById(requesterPlayerId)
        if (!requesterPlayer) {return false}
        const requesterSession = requesterPlayer.getSessionByGame(matchingGame)
        if (!requesterSession) {return false}

        console.log(`Passing game-settings-report from ${matchingPlayer.playerName} to ${requesterPlayer.playerName}.`);
        io.to(requesterSession.socketId).emit('game-settings-change',{ 
            player: matchingPlayer.clientSafeVersion,
            data,
        });


    }
}

module.exports = ongameSettingsReport