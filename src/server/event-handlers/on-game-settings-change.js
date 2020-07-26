function ongameSettingsChange (state, socket, io){
    return function (playerId, type, data) {

        const matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        const matchingSession = matchingPlayer.getSessionBySocket(socket)
        if (!matchingSession) {return false}
        const matchingGame = matchingSession.game
        if (!matchingGame) {return false}

       console.log(`${matchingPlayer.playerName} send a ${type} settings change.`);

       if (matchingPlayer !== matchingGame.masterPlayer) {
            console.log(`${matchingPlayer.playerName} is not the GM!`);
            return false
        }

       socket.to(matchingGame.gameId).emit('game-settings-change',{ 
            player: matchingPlayer.clientSafeVersion,
            type,
            data,
        });
    }
}

module.exports = ongameSettingsChange