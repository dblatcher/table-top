var onRoll = require('./on-roll')
var onSignIn = require('./on-sign-in')
var onDisconnect = require('./on-disconnect')

function socketHandler (io, state) {
    io.on('connection', function(socket){
        console.log('a user connected');

        socket.on('disconnect', onDisconnect(state, socket.id));
        socket.on('roll', onRoll(state));
        socket.on('sign-in', onSignIn(state, socket.id) );

    });
}

module.exports = socketHandler