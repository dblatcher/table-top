<template>
<div>

  <table>
      <tr>
          <th>Game Name</th>
          <th>Game Master</th>
          <th>System</th>
      </tr>
      <tr v-for="game in info.games" v-bind:key="game.gameId">
          <td><a v-bind:href="getLink(game)">{{game.gameName}}</a></td>
          <td>{{game.masterName}}</td>
          <td>{{game.details.rpgName}}</td>
      </tr>
  </table>
  <p>{{info.games.length}}</p>
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

