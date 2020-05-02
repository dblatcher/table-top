<template>
  <section class="frame">
      <h3>Admin</h3>

      <CloseGameButton  @close-game="requestGameClose"/>

  </section>
</template>

<script>

import CloseGameButton from './admin-panel/CloseGameButton.vue'

export default {
    props : ['config', 'socket', 'playerId'],

    components: {CloseGameButton},

    methods : {

        requestGameClose() {
            const {playerId} = this
            const {gameId} = this.config

            console.log('requesting game close...')
            this.socket.emit('gm-closing-game',{gameId, playerId})
        },

        handleJoinRequest(data) {
            console.log(data)
            let answer = confirm(`Let ${data.player.playerName} into the game?`)
            console.log(answer)
            this.socket.emit('entry-request-response',answer,data, this.playerId, this.config.gameId)
        },
    },

    mounted() {
        this.socket.on('join-request', this.handleJoinRequest);
    },
}
</script>

<style scoped>

</style>