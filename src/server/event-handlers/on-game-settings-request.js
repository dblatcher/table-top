function ongameSettingsRequest (state, socket, io){
    return function (playerId) {

        const matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}
        const matchingSession = matchingPlayer.getSessionBySocket(socket)
        if (!matchingSession) {return false}
        const matchingGame = matchingSession.game
        if (!matchingGame) {return false}

       console.log(`${matchingPlayer.playerName} requested game settings for ${matchingGame.gameName}.`);
       if (matchingPlayer === matchingGame.masterPlayer) {
            console.log(`${matchingPlayer.playerName} is the GM!`);
            return false
        }

        const sessionOfGmInGame = matchingGame.masterPlayer.gameSessions.filter (session => session.game === matchingGame)[0]
        if (!sessionOfGmInGame) {
            console.log('GM_NOT_PRESENT')
            let refusal = state.makeRefusal('GM_NOT_PRESENT')
            // TO DO send refusal.clientSafeVersion back to requesting player
            return
        }

        console.log(`sending request to ${matchingGame.masterPlayer.playerName}`)
        io.to(sessionOfGmInGame.socketId).emit('game-settings-request',{ 
            player: matchingPlayer.clientSafeVersion,
        });
    }
}

module.exports = ongameSettingsRequest