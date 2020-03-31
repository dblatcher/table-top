function socketHandler (io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });


        socket.on('roll', function(data){
            console.log(`user rolled a d${data.number} and got a ${data.result} `);
        });

        socket.on('sign-in', function(data){
            console.log(`user signed in with user name ${data.userName} `);
        });


    });
}

module.exports = socketHandler