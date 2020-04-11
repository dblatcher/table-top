<template>
  <section class="frame">
      <div v-if="gameMaster" class="blue card">
        <h2>GM:{{gameMaster.playerName}}</h2>
      </div>
      <div v-if="this.localPlayer.playerName" class="green card">
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
  props: ["localPlayer", "otherPlayers", "gameMaster"],
}
</script>

<style>

</style>