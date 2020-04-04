function onDisconnect(state, socketId){
    return function () {
        var matchingLoggedInUsers = state.users.filter(user=>user.socketId === socketId)
        if (matchingLoggedInUsers.length === 0) { 
            console.log('a non logged in user disconnected');
            return
        }

        if (matchingLoggedInUsers.length > 1) {
            console.warn ('multiple log in for same client!', matchingLoggedInUsers)
        }

        console.log(`user with '${matchingLoggedInUsers[0].userName}' disconnected `)
        state.users = state.users.filter(user=>user.socketId !== socketId)
    }
}

module.exports = onDisconnect