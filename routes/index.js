var express = require('express');
var getPlayer = require('./middleware/getPlayer')
var handleSignInForm = require('./middleware/handleSignInForm')

function makeRouter(state) {
  var router = express.Router();

  /* GET home page. */

  router.use('/', getPlayer(state));
  router.post('/', handleSignInForm(state));

  router.all('/', function(req, res, next) {
    res.render('index', { 
      title: 'Table-top', 
      games: state.games, 
      player: req.body.player,
      data: {
        formErrors : req.body.formErrors, 
        nameOfFormWithErrors: req.body.nameOfFormWithErrors, 
      },
    });
  });

  return router
}


module.exports = makeRouter;
