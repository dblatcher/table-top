function getInputErrors(input) {
    const errors = []
    return errors
}

function makeMiddleware(state) {
  return function(req, res, next) {

    console.log('IN CREATE MIDDLEWARE', req.body)

    //TO DO - check inputs
    const errors = getInputErrors (req.body)
    if (errors.length > 0) {
        res.json(JSON.stringify(errors))
        return
    }

    const {gameName, gmName, rpgName} = req.body;

    var newGm = state.addPlayer(gmName ,0,undefined)
    var newGame = state.addGame (gameName,{rpgName}, newGm)
    newGm.gameId = newGame.gameId

    res.location('/foo/bar')

    req.body.newGame = newGame
    next()
  };
}


module.exports = makeMiddleware;
