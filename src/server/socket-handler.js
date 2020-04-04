var onRoll = require('./on-roll')
var onSignIn = require('./on-sign-in')

function socketHandler (io, state) {
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('roll', onRoll(state));
        socket.on('sign-in', onSignIn(state) );

    });
}

module.exports = socketHandler