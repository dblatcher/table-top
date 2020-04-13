function onRequestState (state, socket,io){
    return function (callback) {
        console.log(`received request for state for game list.`)
        callback(state.games.map(game => game.clientSafeVersion))
        //socket.emit('state-update', state.getStateOfGame(gameId))
    }
}

module.exports = onRequestState