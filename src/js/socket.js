var io = require('../../node_modules/socket.io-client/dist/socket.io')
console.log('socket script running')

var socket = io();

window.socket = socket