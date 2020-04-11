<template>
  <section class="frame">
      <div v-if="gameMaster" class="blue card">
        <h2>GM:{{gameMaster.playerName}}</h2>
      </div>
      <div v-if="localPlayer" class="green card">
        <h2>{{localPlayer.playerName}}</h2>
        <input type="text"/>
      </div>
      <div class="red card" v-for="player in otherPlayers" v-bind:key="player.playerId">
        <h2>{{player.playerName}}</h2>
      </div>
  </section>
</template>

<script>
export default {
  props: ["players", "playerId","gameMasterId"],

  computed: {
    gameMaster: function() {
      return this.players.filter(player => player.playerId === this.gameMasterId)[0]
    },

    localPlayer: function() {
      if (this.playerId === this.gameMasterId) return null
      return this.players.filter(player => player.playerId === this.playerId)[0]
    },

    otherPlayers: function() {
      return this.players.filter(
        player => player.playerId !== this.playerId && player.playerId !== this.gameMasterId
      )
    }

  }
}
</script>

<style>

</style>