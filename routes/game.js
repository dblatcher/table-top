
var express = require('express');
var createGame = require('./middleware/create')

function makeRouter(state) {
  var router = express.Router();

  router.post('/:gameName', createGame(state) )
  router.use('/:gameName', function(req, res, next) {

    console.log('IN GAME ROUTER', req.body, req.cookies)

    let game, gmView;

    if (!req.body.newGame) { 
      if (state.games.map(game => game.gameName).indexOf(req.params.gameName) === -1) {
        res.render('error',{
          message: `There is no game running called ${req.params.gameName}`,
          error: {status:404, stack:"invalid game name"}
        })
        return
      }
      game = state.games.filter(game => game.gameName === req.params.gameName)[0]
      gmView = false
    } else {
      game = req.body.newGame
      gmView = true
    }


    res.render('game', { title: 'Table-top', game, gmView});
  });

  return router
}


module.exports = makeRouter;
