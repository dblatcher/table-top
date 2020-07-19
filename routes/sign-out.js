var express = require('express');
var signOutPlayer = require('./middleware/signOutPlayer')


function makeRouter(state) {
  var router = express.Router();

  router.use('/', signOutPlayer(state));

  router.all('/', function(req, res, next) {
    res.render('sign-out', { 
      title: 'Table-top', 
      games: state.games, 
      player: req.body.player,
      pageData: {
        path: req.baseUrl + req.path
      }
    });
  });

  return router
}


module.exports = makeRouter;
