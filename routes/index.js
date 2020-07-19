var express = require('express');

function makeRouter(state) {
  var router = express.Router();

  router.all('/', function(req, res, next) {
    res.render('index', { 
      title: 'Table-top', 
      games: state.games, 
      player: req.body.player,
      pageData: {
        formErrors : req.body.formErrors, 
        nameOfFormWithErrors: req.body.nameOfFormWithErrors,
        path: req.baseUrl + req.path
      },
    });
  });

  return router
}


module.exports = makeRouter;
