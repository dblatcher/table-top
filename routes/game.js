var express = require('express');
var createGameAndPlayer = require('./middleware/createGameAndPlayer')

function makeRouter(state) {
  var router = express.Router();

  router.post('/:gameName', createGameAndPlayer(state) )

  router.use('/:gameName', function(req, res, next) {
    const {gameName} = req.params
    const {player, formErrors} = req.body
    const matchingGame = state.games.filter(game => game.gameName === gameName)[0]

    if (formErrors) {
      res.render('error',{
        message: `Input errors: ${JSON.stringify(formErrors)}`,
        error: {status:403, stack:"create game input errors"},
        player,
        pageData: {
          path: req.baseUrl + req.path
        },
      })
      return
    }

    if (!matchingGame) {
      res.render('error',{
        message: `There is no game running called ${gameName}`,
        error: {status:404, stack:"invalid game name"},
        player,
        pageData: {
          path: req.baseUrl + req.path
        },
      })
      return
    }

    res.render('game', { 
      title: 'Table-top', 
      game: matchingGame, 
      gmView: matchingGame.masterPlayer === player, 
      player,
      pageData: {
        path: req.baseUrl + req.path
      },
    });
  });

  return router
}


module.exports = makeRouter;
