<template>
    <section>
        <h3>Admin</h3>

        <div class="frame">
            <CloseGameButton  @close-game="requestGameClose"/>

            <transition-group name="list" tag="span">
                <entry-request-prompt v-for="request in pendingEntryRequests" v-bind:key="request.player.playerId"
                @answer="handleEntryRequestAnswer"
                v-bind="{request: request}"/>
            </transition-group>
        </div>
    </section>
</template>

<script>

import CloseGameButton from './admin-panel/CloseGameButton.vue'
import EntryRequestPrompt from './admin-panel/EntryRequestPrompt.vue'

export default {
    components: {CloseGameButton, EntryRequestPrompt},
    props : ['config', 'socket', 'playerId'],

    data() {
        return {
            entryRequests: [],
        }
    },

    computed : {
        pendingEntryRequests() {
            return this.entryRequests.filter(request => request.status === 'PENDING')
        }
    },

    methods : {

        handleEntryRequestAnswer (answer, request) {
            const {entryRequests, socket, playerId, config} = this

            if (entryRequests.indexOf(request) !== -1) {
                entryRequests.splice( entryRequests.indexOf(request), 1)
            }

            socket.emit('entry-request-response',answer,request, playerId, config.gameId)
        },

        requestGameClose() {
            const {playerId} = this
            const {gameId} = this.config

            console.log('requesting game close...')
            this.socket.emit('gm-closing-game',{gameId, playerId})
        },


        handleStateUpDate(update) {
            console.log('ALL NEW REQUESTS', update.game.entryRequests)
            const {entryRequests} = this
            const newEntryRequestList = update.game.entryRequests
            const playerIdsOfExistingRequests = entryRequests.map(request => request.player.playerId)
            const playerIdsOfNewRequests = newEntryRequestList.map(request => request.player.playerId)

            const newEntryRequestsToAdd = newEntryRequestList.filter(request => {
                return playerIdsOfExistingRequests.indexOf(request.player.playerId) === -1
            })

            const existingEntryRequestToCancel = entryRequests.filter(request =>{
                return playerIdsOfNewRequests.indexOf (request.player.playerId) === -1
            })

            existingEntryRequestToCancel.forEach(request => {
                entryRequests.splice(entryRequests.indexOf(request),1)
            })
            entryRequests.push(...newEntryRequestsToAdd)

        },
    },

    mounted() {
        this.socket.on('state-update', this.handleStateUpDate);
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