var express = require('express');

function makeRouter(state) {
  var router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    var output = 'USERS: ' + state.players.map(user => user.playerName).toString()
    
    let report = {}
    state.players.forEach(player => {
      report[player.playerName] = player.gameSessions.map(gameSession => gameSession.game.gameName)
    })

    res.send(JSON.stringify(report));
  });

  return router
}
  
module.exports = makeRouter;
