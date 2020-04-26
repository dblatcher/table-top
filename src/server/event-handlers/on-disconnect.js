sendStateToClients = require ('../sendStateToClients')
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
            sendStateToClients(state, socket, io, gameSession.game.gameId)
            console.log('DISCONNECTION', matchingPlayer.playerName, gameSession.game.gameName)
        } )
    }
}

module.exports = onDisconnect