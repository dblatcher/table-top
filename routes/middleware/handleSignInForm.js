function getInputErrors(input,state) {
  const errors = []

  if (input.playerName.length < 2) {
    errors.push ('NAME IS TOO SHORT')
  }

  if (state.players.filter(player=>player.playerName === input.playerName).length > 0 ) {
    errors.push ('NAME IS TAKEN')
  }

  return errors
}

function makeMiddleware(state) {
  return function(req, res, next) {
    console.log (`HANDLE SIGN IN FORM : ${req.originalUrl}`, req.body)
    const {playerName, player, formRole} = req.body;

    if (formRole === 'sign-in-form') {

      //TO DO - check inputs properly
      const errors = getInputErrors (req.body, state)

      if (player) {
      }
      else if (errors.length > 0) {
        req.body.formErrors = errors
        req.body.nameOfFormWithErrors = 'sign-in-form'
      }
      else {
        var newPlayer = state.addPlayer(playerName)
        req.body.player = newPlayer
        res.cookie('token', newPlayer.token)
        res.cookie('playerName', newPlayer.playerName)
        res.cookie('playerId',newPlayer.playerId)
        console.log (`signed in ${newPlayer.playerName}`)
      }
    }

    next()
  };
}


module.exports = makeMiddleware;
