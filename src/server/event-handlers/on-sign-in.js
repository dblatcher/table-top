sendStateToClients = require ('../sendStateToClients')

function onSignIn(state, socket){
    return function (data, callback) {

        // TO DO - SANITISE INPUT!!
        console.log(`user requested sign in with user name ${data.playerName} `);
        
        if (state.players.map(item=>item.playerName).indexOf (data.playerName) > -1 ) {
            console.log('refusing: NAME_ALREADY_TAKEN')
            const refusal = state.makeRefusal ('NAME_ALREADY_TAKEN', data.playerName)
            callback( refusal.clientSafeVersion )
            return false
        }

        const newPlayer = state.addPlayer(data.playerName, socket.id)
        console.log('added player to state', newPlayer)
        callback(newPlayer.clientSafeVersion)
        sendStateToClients(state, socket)
    }
}

module.exports = onSignIn