var express = require('express');

function makeRouter(state) {
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Table-top', games: state.games });
  });

  return router
}


module.exports = makeRouter;
