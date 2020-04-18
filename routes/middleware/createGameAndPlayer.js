function getInputErrors(input) {
    const errors = []
    return errors
}

function makeMiddleware(state) {
  return function(req, res, next) {
    const {gameName, gmName, rpgName, player} = req.body;

    //TO DO - check inputs
    const errors = getInputErrors (req.body)
    if (errors.length > 0) {
      res.json(JSON.stringify(errors))
      return
    }

    if (player) {
      var newGame = state.addGame (gameName,{rpgName}, player)
      player.gameId = newGame.gameId
      req.body.newGame = newGame
    }

    else {
      var newGm = state.addPlayer(gmName ,0,undefined)
      var newGame = state.addGame (gameName,{rpgName}, newGm)
      newGm.gameId = newGame.gameId
      req.body.newGame = newGame
      req.body.player = newGm
      res.cookie('token', newGm.token)
      res.cookie('playerName', newGm.playerName)
      res.cookie('playerId',newGm.playerId)
    }

    next()
  };
}


module.exports = makeMiddleware;
