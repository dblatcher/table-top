import {onLoad} from './modules/util'
import {initCreateGameForm} from './modules/create-game-form'

import launchLiveList from "../vue/live-list-launcher";
var io = require('../../node_modules/socket.io-client/dist/socket.io')

var socket = io()

onLoad( function() {
    initCreateGameForm()
    launchLiveList('#app',socket)
    initTestPrint()
})
