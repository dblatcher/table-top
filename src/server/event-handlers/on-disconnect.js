sendStateToClients = require ('../sendStateToClients')
const cookie = require('cookie');

function onDisconnect(state, socket, io){
    return function () {

        const cookies = cookie.parse(socket.request.headers.cookie || '');
        console.log("DISCONNECTION. token:", cookies.token)

        const removedPlayers = state.removePlayersWhere(player=>player.socketId === socket.id)
        if (removedPlayers.length === 0) { 
            console.log('a non logged in user disconnected');
            return
        }
        if (removedPlayers.length > 1) { // should not occur - indicates failure to control logins
            console.warn ('a user with multiple players disconnected!', removedPlayers)
            return
        }
        console.log(`user with '${removedPlayers[0].playerName}' disconnected from game${removedPlayers[0].gameId}`)

        const matchingGame = state.getGameById(removedPlayers[0].gameId)

        //player left an already closed game
        if (!matchingGame) {
            return
        }

        //disconnecting player was the gm of an active game
        if (matchingGame.masterPlayer === removedPlayers[0]) {
            io.to(matchingGame.gameId).emit('game-closed', matchingGame.gameId);
            state.closeGame(matchingGame.gameId)
            return
        }

        //non-gm player left an active game
        sendStateToClients(state, socket, io, matchingGame.gameId)

    }
}

module.exports = onDisconnect