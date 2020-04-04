function onRoll (state, socket){
    return function (data) {
        let name = data.localPlayer ? data.localPlayer.userName || 'ANON' : 'UNKNOWN PLAYER';
        let report = `${name} rolled a d${data.number} and got a ${data.result} `
        console.log(report);
        socket.broadcast.emit('roll',report);
    }
}

module.exports = onRoll