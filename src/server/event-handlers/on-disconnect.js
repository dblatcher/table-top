sendStateToClients = require ('../sendStateToClients')

function onDisconnect(state, socket, io){
    return function () {

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
 
        sendStateToClients(state, socket, io, removedPlayers[0].gameId)

    }
}

module.exports = onDisconnect