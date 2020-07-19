var express = require('express');
var getPlayer = require('./middleware/getPlayer')

function makeRouter(state) {
  var router = express.Router();

  router.use('/', getPlayer(state));

  router.all('/', function(req, res, next) {


    res.render('character', { 
      title: 'Table-top', 
      player: req.body.player,
      pageData: {
        path: req.baseUrl + req.path
      }
    });
  });

  return router
}


module.exports = makeRouter;
