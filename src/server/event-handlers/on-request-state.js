function onRequestState (state, socket){
    return function (gameId) {
        console.log(`received request for state for game ${gameId}`)
        socket.emit('state-update', state.getStateOfGame(gameId))
    }
}

module.exports = onRequestState