var express = require('express');
var gameRouter = require('./game');


function getInputErrors(input) {
    const errors = []
    return errors
}


function makeRouter(state) {
  var router = express.Router();

  router.post('/', function(req, res, next) {

    console.log('IN CREATE ROUTER')
    console.log(req.body)

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

    res.render('game', { title: 'Table-top', game:newGame, gmView:true});
  });

  return router
}


module.exports = makeRouter;
