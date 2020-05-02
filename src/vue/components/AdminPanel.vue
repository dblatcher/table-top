<template>
    <section>
        <h3>Admin</h3>

        <div class="frame">
            <CloseGameButton  @close-game="requestGameClose"/>

            <transition-group name="list" tag="span">
                <join-request-prompt v-for="(request,index) in joinRequests" v-bind:key="index"
                @answer="handleJoinRequestAnswer"
                v-bind="{request: request}"/>
            </transition-group>
        </div>
    </section>
</template>

<script>

import CloseGameButton from './admin-panel/CloseGameButton.vue'
import JoinRequestPrompt from './admin-panel/JoinRequestPrompt.vue'

export default {
    components: {CloseGameButton, JoinRequestPrompt},
    props : ['config', 'socket', 'playerId'],

    data() {
        return {
            joinRequests: [],
        }
    },

    methods : {

        handleJoinRequestAnswer (answer, request) {
            const {joinRequests, socket, playerId, config} = this

            if (joinRequests.indexOf(request) !== -1) {
                joinRequests.splice( joinRequests.indexOf(request), 1)
            }

            socket.emit('entry-request-response',answer,request, playerId, config.gameId)
        },

        requestGameClose() {
            const {playerId} = this
            const {gameId} = this.config

            console.log('requesting game close...')
            this.socket.emit('gm-closing-game',{gameId, playerId})
        },

        handleJoinRequest(request) {
            console.log(request)
            this.joinRequests.push(request)
        },
    },

    mounted() {
        this.socket.on('join-request', this.handleJoinRequest);
    },
}
</script>

<style scoped>

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-30px);
}

</style>