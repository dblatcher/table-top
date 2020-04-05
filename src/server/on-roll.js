function onRoll (state, socket){
    return function (report) {
        let name = report.localPlayer ? report.localPlayer.userName || 'ANON' : 'UNKNOWN PLAYER';
        console.log(name + ' ' + report.rollData.message);
        socket.broadcast.emit('roll',report);
    }
}

module.exports = onRoll