<template>
<div>

  <table>
      <tr>
          <th>Game Name</th>
          <th>Game Master</th>
          <th>System</th>
      </tr>
      <tr v-for="game in info.games" v-bind:key="game.gameId">
          <td>{{game.gameName}}</td>
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
        info : {games: [] }
    }
},

methods : {

    handleData(response) {
        console.log('data', response)
        this.$set(this.info, 'games', response)
    },

    requestData() {
        this.socket.emit('request-game-list', this.handleData)
    }
},

mounted() {
    this.requestData()
},

}
</script>

