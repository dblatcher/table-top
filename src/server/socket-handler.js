const cookie = require('cookie');

const eventNames = [
    "sign-in",
    "roll",
    "disconnect",
    "request-state",
    "message", 
    "gm-sign-in", 
    "gm-closing-game",
    "request-game-list"
]

var on = {}
eventNames.forEach( eventName => {
    on[eventName] = require(`./event-handlers/on-${eventName}`)
})


function socketHandler (io, state) {
    io.on('connection', function(socket){
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        console.log('CONNECTION. token:', cookies.token);

        eventNames.forEach( eventName => {
            socket.on(eventName, on[eventName](state,socket,io))
        })

    });
}

module.exports = socketHandler