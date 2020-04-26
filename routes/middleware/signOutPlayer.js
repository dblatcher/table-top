function makeMiddleware(state) {
    return function(req, res, next) {

        const player = state.getPlayerByCookies(req.cookies)

        console.log('NEED TO SIGN OUT:', player)

        req.body.player = null
        res.clearCookie('token')
        res.clearCookie('playerName')
        res.clearCookie('playerId')

        state.removePlayersWhere(user => user === player)

      next()
    };
  }
  
  module.exports = makeMiddleware;