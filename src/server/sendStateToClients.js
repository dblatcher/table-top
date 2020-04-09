function sendStateToClients(state, socket) {

    console.log ('sending state to all clients')
    console.log (state.clientSafeVersion)

    socket.emit('state-update', state.clientSafeVersion)
    socket.broadcast.emit('state-update',state.clientSafeVersion)

}

module.exports = sendStateToClients