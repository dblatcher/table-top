var express = require('express');
const bodyParser = require("body-parser");

function makeRouter(state) {
  var router = express.Router();
  router.use(bodyParser.json());

  router.all('/',  function(req, res, next) {

    console.log('print router', req.body)

    if (!req.body.postedData) {
      next( new Error('no posted data') )
      return
    }


    res.send(JSON.stringify({
      postedData: req.body.postedData,
      response: 'server accepted',
    }));

  });

  router.use(function(err, req, res, next) {
    res.send(JSON.stringify({
      error: err.message
    }));
  });

  return router
}


module.exports = makeRouter;
