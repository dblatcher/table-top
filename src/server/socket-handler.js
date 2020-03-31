var onRoll = require('./on-roll')
var onSignIn = require('./on-sign-in')

function socketHandler (io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('roll', onRoll);
        socket.on('sign-in', onSignIn );

    });
}

module.exports = socketHandler