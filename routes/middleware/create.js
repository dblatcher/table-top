function getInputErrors(input) {
    const errors = []
    return errors
}

function makeMiddleware(state) {
  return function(req, res, next) {

    console.log('IN CREATE MIDDLEWARE', req.body, req.cookies)
    const {gameName, gmName, rpgName} = req.body;

    //TO DO - check inputs
    const errors = getInputErrors (req.body)
    if (errors.length > 0) {
        res.json(JSON.stringify(errors))
        return
    }


    var newGm = state.addPlayer(gmName ,0,undefined)
    var newGame = state.addGame (gameName,{rpgName}, newGm)
    newGm.gameId = newGame.gameId
    req.body.newGame = newGame
    res.cookie('token', newGm.token)

    next()
  };
}


module.exports = makeMiddleware;
