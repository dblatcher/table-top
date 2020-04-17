import {onLoad} from './modules/util'
import launchGameApp from "../vue/game-launcher";
var io = require('../../node_modules/socket.io-client/dist/socket.io')

var socket = io()

onLoad( function() {

    const metaElement = document.querySelector('#gameMeta')
    const gameId = metaElement ? metaElement.getAttribute('gameId') : undefined
    const gameName = metaElement ? metaElement.getAttribute('gameName') : undefined
    const gameMasterId = metaElement ? metaElement.getAttribute('gameMasterId') : undefined
    const amGamemaster = metaElement ? metaElement.getAttribute('myStatus') === "GM" : undefined

    const config = {
        gameId, gameName, gameMasterId, amGamemaster
    }

    launchGameApp('#app',config,socket)
})
