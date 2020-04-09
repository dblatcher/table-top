<template>
  <section class="frame">
      <div v-if="this.localPlayer.userName" class="green card">
        <h2>{{localPlayer.userName}}</h2>
        <input type="text"/>
      </div>
      <div class="red card" v-for="player in otherPlayers" v-bind:key="player.playerId">
        <h2>{{player.userName}}</h2>
      </div>
  </section>
</template>

<script>
export default {
    props: ["localPlayer", "otherPlayers"],
}
</script>

<style>

</style>