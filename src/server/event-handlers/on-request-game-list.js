function onRequestGameList(state, socket,io){
    return function (callback) {
        callback(state.games.map(game => game.clientSafeVersion))
    }
}

module.exports = onRequestGameList