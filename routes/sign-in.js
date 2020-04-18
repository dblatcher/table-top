var express = require('express');
var createPlayer = require('./middleware/createPlayer')

function makeRouter(state) {
  var router = express.Router();

  router.post('/', createPlayer(state));

  router.use('/', function(req, res, next) {

    console.log('SIGNIN ROUTER', req.body)

    if (req.body.formErrors) {
        res.render('index', { 
            title: 'Table-top', 
            games: state.games, 
            player: req.body.player,
            data: {
                formErrors : req.body.formErrors, 
                nameOfFormWithErrors: req.body.nameOfFormWithErrors, 
            }
        });
        return
    }
    console.log('NO ERRORS, going home')
    res.redirect('/')
  });

  return router
}


module.exports = makeRouter;
