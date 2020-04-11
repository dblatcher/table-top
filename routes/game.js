var express = require('express');

function makeRouter(state) {
  var router = express.Router();

  router.get('/:gameName', function(req, res, next) {
    console.log('game router')
    console.log(req.params)
    res.render('game', { title: 'Table-top', game: req.params.gameName});
  });

  return router
}


module.exports = makeRouter;
