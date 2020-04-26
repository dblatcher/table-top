function onRequestGameList(state, socket,io){
    return function (callback) {

        const gameList = state.games.map(game => game.clientSafeVersion)
        const playerList = state.players.map(player => player.clientSafeVersion)

        gameList.forEach(game => {
            game.players = playerList.filter ( player => 
                player.gameSessions.map(session => session.gameId).includes(game.gameId) 
            )
        })

        callback(gameList)
    }
}

module.exports = onRequestGameList