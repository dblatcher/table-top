<template>
    <section>
        <h3>Admin</h3>
        <!-- <pre>Test setting: {{gameSettings.random}}</pre> -->
        <div class="frame">
            <CloseGameButton  @close-game="requestGameClose"/>

            <transition-group name="list" tag="span">
                <entry-request-prompt v-for="request in pendingEntryRequests" v-bind:key="request.player.playerId"
                @answer="handleEntryRequestAnswer"
                v-bind="{request: request}"/>
            </transition-group>

            <!-- <button @click="testGameSettingsChange">test config change</button> -->
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
            gameSettings: {random: 6},
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
            if (!update.game) {
                console.warn ('NO GAME PROPERTY OF UPDATE', update)
                return false
            }
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

        testGameSettingsChange() {
            const {playerId, gameSettings} = this
            gameSettings.random = Math.random()*10
            this.$emit('game-settings-change', {playerId, type:'ALL', data: gameSettings})
            this.socket.emit('game-settings-change', playerId, 'ALL', gameSettings)
        },

        handleGameSettingsRequest(settingsRequest) {
            const {playerId, gameSettings} = this
            if (!settingsRequest.player) {
                console.warn ('handleGameSettingsRequest: no requesting player on settingsRequest')
                return false
            }
            console.log(`handleGameSettingsRequest: reporting settings to ${settingsRequest.player.playerName}`)
            this.socket.emit('game-settings-report', playerId, settingsRequest.player.playerId, gameSettings)
        },
    },

    mounted() {
        this.socket.on('state-update', this.handleStateUpDate);
        this.socket.on('game-settings-request', this.handleGameSettingsRequest);

        // update local play-area
        this.$emit('game-settings-change', {playerId: this.playerId, type:'ALL', data: this.gameSettings})
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