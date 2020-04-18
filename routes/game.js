var express = require('express');
var createGameAndPlayer = require('./middleware/createGameAndPlayer')
var getPlayer = require('./middleware/getPlayer')

function makeRouter(state) {
  var router = express.Router();

  router.use('/:gameName', getPlayer(state) )
  router.post('/:gameName', createGameAndPlayer(state) )

  router.use('/:gameName', function(req, res, next) {



    const {gameName} = req.params
    const {newGame, player} = req.body
    let gmView

    console.log(`IN GAME ROUTER for ${gameName}, which is ${newGame ? 'new' : 'existing'}. Player is ${player ? player.playerName : 'NOT SIGNED IN'}`)

    const matchingGame = state.games.filter(game => game.gameName === gameName)[0]

    if (!matchingGame) {
      res.render('error',{
        message: `There is no game running called ${gameName}`,
        error: {status:404, stack:"invalid game name"}
      })
      return
    }

    gmView = matchingGame.masterPlayer === player

    console.log({gmView})

    res.render('game', { 
      title: 'Table-top', 
      game:matchingGame, 
      gmView, 
      player});
  });

  return router
}


module.exports = makeRouter;
