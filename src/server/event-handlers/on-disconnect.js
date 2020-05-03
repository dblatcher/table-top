const cookie = require('cookie');

function onDisconnect(state, socket, io){
    return function () {
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const matchingPlayer = state.getPlayerByCookies(cookies)

        console.log('DISCONNECTION', socket.id)

        if (!matchingPlayer ) {
            console.log('DISCONNECTION', 'NOT SIGNED IN')
            return
        }
        console.log('DISCONNECTION', matchingPlayer.playerName)

        const sessionsLeft = matchingPlayer.leaveSessionBySocket(socket)

        sessionsLeft.forEach (gameSession => {
            console.log('DISCONNECTION', matchingPlayer.playerName, gameSession.game.gameName)
            state.sendUpdateGameStateToAllPlayers(gameSession.game.gameId)
        } )
    }
}

module.exports = onDisconnect