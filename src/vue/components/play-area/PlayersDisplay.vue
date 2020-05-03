<template>
  <section class="frame">

      <PlayerCard 
      v-if="gameMaster"
      v-bind="{
        player: gameMaster,
        rollData: this.diceRolls[gameMaster.playerId] || null, 
        characterSheet: this.characterSheets[gameMaster.playerId] || null, 
        color:'blue', 
        gm:true, 
        local:(localPlayer===gameMaster)}" />

      <PlayerCard 
      v-if="localPlayer !== gameMaster"
      v-bind="{
        player: localPlayer,
        rollData: this.diceRolls[localPlayer.playerId] || null,  
        characterSheet: this.characterSheets[localPlayer.playerId] || null,  
        color:'green', 
        gm:false, 
        local:true}" />

      <PlayerCard 
      v-for="player in otherPlayers" v-bind:key="player.playerId"
      v-bind="{
        player: player, 
        rollData: diceRolls[player.playerId] || null,  
        characterSheet: characterSheets[player.playerId] || null,  
        color:'red', 
        gm:false, 
        local:false}" />

  </section>
</template>

<script>


import PlayerCard from "./PlayerCard.vue";


export default {
  components: {PlayerCard},
  props: ["players", "playerId","gameMasterId", "diceRolls", "characterSheets"],

  computed: {
    gameMaster: function() {
      return this.players.filter(player => player.playerId === this.gameMasterId)[0]
    },

    localPlayer: function() {
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