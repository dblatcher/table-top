sendStateToClients = require ('../sendStateToClients')

function onSignIn(state, socket, io){
    return function (data, callback) {

        // TO DO - SANITISE INPUT!!
        console.log(`user requested sign in to game${data.gameId} with user name ${data.playerName} `);
        
        if (state.players.map(item=>item.playerName).indexOf (data.playerName) > -1 ) {
            console.log('refusing: NAME_ALREADY_TAKEN')
            const refusal = state.makeRefusal ('NAME_ALREADY_TAKEN', data.playerName)
            callback( refusal.clientSafeVersion )
            return false
        }

        const newPlayer = state.addPlayer(data.playerName, socket.id, data.gameId)
        socket.join(data.gameId)
        console.log(`added player to game ${data.gameId}`, newPlayer)

        callback(newPlayer.clientSafeVersion)
        sendStateToClients(state, socket, io, data.gameId)
    }
}

module.exports = onSignIn