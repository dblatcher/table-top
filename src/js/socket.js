import {onLoad} from './modules/util'
import {roll} from './modules/dice-roll'
import {initSignInForm} from './modules/sign-in'

var io = require('../../node_modules/socket.io-client/dist/socket.io')
console.log('socket script running')
var socket = io();

let localPlayer = {}

onLoad( function() {
    document.querySelector('#test-d6').addEventListener('click', ()=>{roll(6, socket)})
    document.querySelector('#test-d10').addEventListener('click', ()=>{roll(10, socket)})
    initSignInForm(socket, localPlayer)
})

window.localPlayer = localPlayer