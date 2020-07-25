var express = require('express');
var handleSignInForm = require('./middleware/handleSignInForm')


function makeRouter(state) {
  var router = express.Router();

  router.post('/', handleSignInForm(state));

  router.all('/', function(req, res, next) {

    console.log('sign-in-router')

    if (req.body.player && req.body.redirectPath) {
      console.log('redirecting')
      res.redirect(req.body.redirectPath)
      return
    } 

    res.render('sign-in', { 
      title: 'Table-top', 
      games: state.games, 
      player: req.body.player,
      pageData: {
        path: req.baseUrl + req.path,
        signInTo: '/',

        formErrors: req.body.formErrors,
        nameOfFormWithErrors: 'sign-in-form'


      }
    });
  });

  return router
}


module.exports = makeRouter;
