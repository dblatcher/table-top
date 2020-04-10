sendStateToClients = require ('../sendStateToClients')

function onDisconnect(state, socket){
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
        console.log(`user with '${removedPlayers[0].playerName}' disconnected `)
 
        sendStateToClients(state, socket)

    }
}

module.exports = onDisconnect