
function onSignIn(state, socket){
    return function (data, callback) {

        // TO DO - SANITISE INPUT!!
        console.log(`user requested sign in with user name ${data.userName} `);
        
        if (state.users.map(item=>item.userName).indexOf (data.userName) > -1 ) {
            console.log('refusing: NAME_ALREADY_TAKEN')
            const refusal = state.makeRefusal ('NAME_ALREADY_TAKEN', data.userName)
            callback( refusal.clientSafeVersion )
            return false
        }

        const newPlayer = state.addPlayer(data.userName, socket.id)
        console.log('added player to state', newPlayer)
        callback(newPlayer.clientSafeVersion)
    }
}

module.exports = onSignIn