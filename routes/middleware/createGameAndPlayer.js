function getInputErrors(input,state) {
  const errors = []
  if (state.players.filter(player=>player.playerName === input.gmName).length > 0 ) {
    errors.push ('NAME IS TAKEN')
  }
  if (state.games.filter(game=>game.gameName === input.gameName).length > 0 ) {
    errors.push ('GAME NAME IS TAKEN')
  }

  return errors
}

function makeMiddleware(state) {
  return function(req, res, next) {
    const {gameName, gmName, rpgName, player} = req.body;
    const matchingGame = state.games.filter(game=>game.gameName === gameName)[0]
    const errors = getInputErrors (req.body, state)

    if (matchingGame && matchingGame.masterPlayer === player) { // refreshed page after creating game
      console.log(`game ${matchingGame.gameName} already exists and ${player.playerName} is the GM`)
    } else if (errors.length > 0)  {
      req.body.formErrors = errors;
    } else if (player) { 
      var newGame = state.addGame (gameName,{rpgName}, player)
      console.log(`${player.playerName} is creating the game '${newGame.gameName}'`)
    } else {
      var newGm = state.addPlayer(gmName)
      var newGame = state.addGame (gameName,{rpgName}, newGm)
      req.body.player = newGm
      res.cookie('token', newGm.token)
      res.cookie('playerName', newGm.playerName)
      res.cookie('playerId',newGm.playerId)
      console.log(`${newGm.playerName} logged in and is creating the game '${newGame.gameName}'`)
    }

    next()
  };
}


module.exports = makeMiddleware;
