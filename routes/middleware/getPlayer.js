function makeMiddleware(state) {
    return function(req, res, next) {
      console.log('IN CHECK SIGN IN MIDDLEWARE')
      let matchingPlayers = state.players.filter( player => player.matches(req.cookies) )
      if (matchingPlayers.length > 1 ) {console.warn('MULTIPLE PLAYER MATCHES', matchingPlayers)}
      req.body.player = matchingPlayers.length === 1 ? matchingPlayers[0] : null;

      next()
    };
  }
  
  
  module.exports = makeMiddleware;