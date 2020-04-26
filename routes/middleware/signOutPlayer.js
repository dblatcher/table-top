function makeMiddleware(state) {
    return function(req, res, next) {

        const player = state.getPlayerByCookies(req.cookies)

        console.log('NEED TO SIGN OUT:', player)

        const gamesWherePlayerIsGm = state.games.filter(game => game.masterPlayer === player)
        gamesWherePlayerIsGm.forEach(game => {
          console.log('closing', game.gameName)
          state.closeGame(game.gameId)
          // TO DO - add io as propery of state so that the 'game closed' message can be triggered to any players in a game when the gm logs out.
        })

        req.body.player = null
        res.clearCookie('token')
        res.clearCookie('playerName')
        res.clearCookie('playerId')

        state.removePlayersWhere(user => user === player)

      next()
    };
  }
  
  module.exports = makeMiddleware;