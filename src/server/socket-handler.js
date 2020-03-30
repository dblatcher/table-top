function socketHandler (io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });


        socket.on('d6-roll', function(msg){
            console.log('user rolled a d6: ' + msg);
        });


    });
}

module.exports = socketHandler