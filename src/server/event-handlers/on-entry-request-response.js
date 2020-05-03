const cookie = require('cookie');


function onEntryRequestResponse(state, socket,io){
    return function (answer, data, gmId, gameId) {

        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const sendingPlayer = state.getPlayerByCookies(cookies)
        const game = state.getGameById(gameId)

        if (!game) { return false }
        if (sendingPlayer !== game.masterPlayer ) {return false }

        const matchingEntryRequest = game.entryRequests
        .filter(request => request.player.playerId === data.player.playerId)[0]

        if (!matchingEntryRequest) { return false }

        if (answer !== true) {
            console.log(`GM REFUSED ${matchingEntryRequest.player.playerName} ENTRY to game ${game.gameName}`)
            matchingEntryRequest.refuse()
            return
        }

        console.log(`added ${matchingEntryRequest.player.playerName} to game ${game.gameName}`)
        matchingEntryRequest.grant()
        state.sendUpdateGameStateToAllPlayers(gameId)
    }
}

module.exports = onEntryRequestResponse