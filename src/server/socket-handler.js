const eventNames = ["sign-in", "roll","disconnect","request-state","message", "gm-sign-in", "gm-closing-game"]

var on = {}
eventNames.forEach( eventName => {
    on[eventName] = require(`./event-handlers/on-${eventName}`)
})


function socketHandler (io, state) {
    io.on('connection', function(socket){
        console.log('a user connected');

        eventNames.forEach( eventName => {
            socket.on(eventName, on[eventName](state,socket,io))
        })

    });
}

module.exports = socketHandler