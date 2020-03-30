var io = require('../../node_modules/socket.io-client/dist/socket.io')
console.log('socket script running')

var socket = io();

console.log ('connecting...')
setTimeout(()=> {
    console.log ('connnected:', socket.connected)
},2000)

window.socket = socket