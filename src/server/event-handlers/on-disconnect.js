sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');

function onDisconnect(state, socket, io){
    return function () {

        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)

        console.log("DISCONNECTION.", matchingPlayer)

        if (!matchingPlayer || !matchingPlayer.gameId) {return}

        const matchingGame = state.getGameById(matchingPlayer.gameId)

        console.log("FROM GAME", matchingGame)

        //player left an already closed game
        if (!matchingGame) { return }

        socket.leave(matchingGame.gameId)
        matchingPlayer.gameId = false


        // //disconnecting player was the gm of an active game
        // if (matchingGame.masterPlayer === removedPlayers[0]) {
        //     io.to(matchingGame.gameId).emit('game-closed', matchingGame.gameId);
        //     state.closeGame(matchingGame.gameId)
        //     return
        // }

        //non-gm player left an active game
        sendStateToClients(state, socket, io, matchingGame.gameId)

    }
}

module.exports = onDisconnect