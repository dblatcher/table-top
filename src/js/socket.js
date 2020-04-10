import {onLoad} from './modules/util'
import {initSignInForm} from './modules/sign-in'

var io = require('../../node_modules/socket.io-client/dist/socket.io')
console.log('socket script running')
var socket = io();


let localPlayer = {}

onLoad( function() {
    initSignInForm(socket, localPlayer)
})

window.localPlayer = localPlayer