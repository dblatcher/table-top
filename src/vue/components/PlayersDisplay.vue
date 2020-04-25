<template>
  <section class="frame">
      <div v-if="gameMaster" class="blue card">
        <h2>GM:{{gameMaster.playerName}}</h2>
        <RollZone v-bind="{rollData: lastDiceRoll, size:50}" ref="rollZone"/>
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

import RollZone from "./RollZone.vue";

export default {
  components: {RollZone},
  props: ["players", "playerId","gameMasterId", "lastDiceRoll"],

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

<style scoped>

  .frame {
      display: flex;
      flex-wrap: wrap;
  }

</style>