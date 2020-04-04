function roll(number, localPlayer, socket) {
    let result = Math.floor((Math.random() * number)+1)
    console.log('I ROLLED:', result, localPlayer)
    socket.emit('roll', {number,localPlayer, result})
}

export {roll}