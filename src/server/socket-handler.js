const cookie = require('cookie');

const eventNames = [
    "request-entry",
    "game-event",
    "disconnect",
    "request-state",
    "message", 
    "gm-enter-game", 
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
        console.log('CONNECTION. token:', cookies.token, 'SOCKET', socket.id);

        eventNames.forEach( eventName => {
            socket.on(eventName, on[eventName](state,socket,io))
        })

    });
}

module.exports = socketHandler