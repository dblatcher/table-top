var io = require('../../node_modules/socket.io-client/dist/socket.io')
console.log('socket script running')

var socket = io();

console.log ('connecting...')
setTimeout(()=> {
    console.log ('connnected:', socket.connected)
},2000)

const testButton = document.querySelector('#test-button')

function rollD6() {
    let result = Math.floor((Math.random() * 6)+1)
    console.log(result)
    socket.emit('d6-roll', result)
}

testButton.addEventListener('click',rollD6)

window.socket = socket