function roll(number, socket) {
    let result = Math.floor((Math.random() * number)+1)
    console.log(result)
    socket.emit('roll', {number, result})
}

export {roll}