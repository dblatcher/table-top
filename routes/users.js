var express = require('express');

function makeRouter(state) {
  var router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    var output = 'USERS: ' + state.users.map(user => user.playerName).toString()
    res.send(output);
  });

  return router
}
  
module.exports = makeRouter;
