function makeMiddleware(state) {
    return function(req, res, next) {

        const player = state.getPlayerByCookies(req.cookies)
        const gamesWherePlayerIsGm = state.games.filter(game => game.masterPlayer === player)
        const gamesPlayerWasInSessionFor = player.gameSessions.map(session => session.game)
        
        console.log( `${player.playerName} is signing out.`)
 
        gamesWherePlayerIsGm.forEach(game => {state.closeGame(game.gameId)})

        state.removePlayersWhere(user => user === player)
        gamesPlayerWasInSessionFor.forEach(game => state.sendUpdateGameStateToAllPlayers(game.gameId))
        // TO DO - cancel entry requests for the player in all games 

        req.body.player = null
        res.clearCookie('token')
        res.clearCookie('playerName')
        res.clearCookie('playerId')

      next()
    };
  }
  
  module.exports = makeMiddleware;