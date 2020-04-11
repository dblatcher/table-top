var express = require('express');

function makeRouter(state) {
  var router = express.Router();

  router.get('/:gameName', function(req, res, next) {

    if (state.games.map(game => game.gameName).indexOf(req.params.gameName) === -1) {
      res.render('error',{
        message: `There is no game running called ${req.params.gameName}`,
        error: {status:404, stack:"invalid game name"}
       })
      return
    }

    let game = state.games.filter(game => game.gameName === req.params.gameName)[0]

    console.log(game)

    res.render('game', { title: 'Table-top', game});
  });

  return router
}


module.exports = makeRouter;
