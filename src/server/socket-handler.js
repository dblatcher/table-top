var onRoll = require('./on-roll')
var onSignIn = require('./on-sign-in')
var onDisconnect = require('./on-disconnect')
var onRequestState = require('./on-request-state')

function socketHandler (io, state) {
    io.on('connection', function(socket){
        console.log('a user connected');

        socket.on('disconnect', onDisconnect(state, socket));
        socket.on('roll', onRoll(state, socket));
        socket.on('sign-in', onSignIn(state, socket) );
        socket.on('request-state', onRequestState(state, socket) );

    });
}

module.exports = socketHandler