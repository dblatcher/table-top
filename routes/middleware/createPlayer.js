function getInputErrors(input,state) {
    const errors = []
      const playersWithSameName = state.players.filter(player => player.playerName === input.playerName)
      if (state.players.filter(player=>player.playerName === input.playerName).length > 0 ) {
        errors.push ('NAME IS TAKEN')
      }

    return errors
}

function makeMiddleware(state) {
  return function(req, res, next) {

    console.log('IN CREATE PLAYER MIDDLEWARE', req.body, req.cookies)
    const {playerName} = req.body;

    //TO DO - check inputs
    const errors = getInputErrors (req.body, state)
    if (errors.length > 0) {
      req.body.formErrors = errors
      req.body.nameOfFormWithErrors = 'createPlayer'
      console.log('ADDED ERRRORS TO REQ')
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
