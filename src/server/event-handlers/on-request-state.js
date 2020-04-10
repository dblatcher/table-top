function onRequestState (state, socket){
    return function () {
        console.log('received request for state')
        socket.emit('state-update', state.clientSafeVersion)
    }
}

module.exports = onRequestState