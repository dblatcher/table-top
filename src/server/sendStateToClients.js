function sendStateToClients(state, socket, io, gameId) {

    console.log (`sending state of game ${gameId} to all clients`)
    io.to(gameId).emit('state-update', state.getStateOfGame(gameId));
}

module.exports = sendStateToClients