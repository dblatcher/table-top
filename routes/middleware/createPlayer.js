function getInputErrors(input,state) {
  const errors = []
  if (state.players.filter(player=>player.playerName === input.playerName).length > 0 ) {
    errors.push ('NAME IS TAKEN')
  }

  return errors
}

function makeMiddleware(state) {
  return function(req, res, next) {
    const {playerName, player} = req.body;

    //TO DO - check inputs properly
    const errors = getInputErrors (req.body, state)

    if (player) {
    }
    else if (errors.length > 0) {
      req.body.formErrors = errors
      req.body.nameOfFormWithErrors = 'createPlayer'
    }
    else {
      var newPlayer = state.addPlayer(playerName ,0,undefined)
      req.body.player = newPlayer
      res.cookie('token', newPlayer.token)
      res.cookie('playerName', newPlayer.playerName)
      res.cookie('playerId',newPlayer.playerId)
    }

    next()
  };
}


module.exports = makeMiddleware;
