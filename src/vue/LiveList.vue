<template>
<div>

  <table class="game-list">
      <caption>{{captionText}}</caption>
      <tr v-if="info.games.length > 0">
          <th>Game Name</th>
          <th>Game Master</th>
          <th>System</th>
          <th>players</th>

      </tr>
      <tr v-for="game in info.games" v-bind:key="game.gameId">
          <td><a v-bind:href="getLink(game)">{{game.gameName}}</a></td>
          <td>{{game.masterName}} {{isGmInGame(game) ? '' : '(absent)' }}</td>
          <td>{{game.details.rpgName}}</td>
          <td>{{game.players.length}}</td>
      </tr>
  </table>

</div>
</template>

<script>
export default {
components:{},
props: ['socket'],

data : function () {
    return {
        info : {games: [] },
        timer: undefined,
    }
},

computed : {
    captionText() {
        if (this.info.games.length === 0) { return 'no games running'}
        if (this.info.games.length === 1) { return '1 game running'}
        return `${this.info.games.length} games running`
    },
},

methods : {

    handleData(response) {
        console.log('data', response)
        this.$set(this.info, 'games', response)
    },

    requestData() {
        //console.log('requesting game list...')
        this.socket.emit('request-game-list', this.handleData)
    },

    getLink(game) {
        return `/game/${game.gameName}`
    },

    isGmInGame(game) {
        return game.players.map(player=>player.playerId).indexOf(game.masterId.toString()) !== -1;
    }
},

mounted() {
    this.requestData()
    this.timer = setInterval(this.requestData, 5000)
},

destroyed() {
    clearInterval(this.timer)
}

}
</script>

