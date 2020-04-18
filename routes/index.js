var express = require('express');
var getPlayer = require('./middleware/getPlayer')

function makeRouter(state) {
  var router = express.Router();

  /* GET home page. */
  
  
  router.use('/', getPlayer(state));
  router.get('/', function(req, res, next) {
    res.render('index', { 
      title: 'Table-top', 
      games: state.games, 
      player: req.body.player 
    });
  });

  return router
}


module.exports = makeRouter;
