<template>
  <section class="frame">

    <PlayerCard v-if="(localPlayer !== gameMaster)"
    v-bind="{
      player: gameMaster,
      rollData: this.diceRolls[gameMaster.playerId] || null, 
      characterSheet: this.characterSheets[gameMaster.playerId] || {}, 
      color:'blue', 
      gm:true, 
      local:(localPlayer===gameMaster)}" />

    <local-player-card v-if="localPlayer"
    @update-character-sheet="$emit('update-character-sheet', $event)"
    v-bind="{
      player: localPlayer,
      rollData: this.diceRolls[localPlayer.playerId] || null,  
      characterSheet: this.characterSheets[localPlayer.playerId] || {},  
      color:'green', 
      gm:(localPlayer===gameMaster)}">
      <template v-slot:dice-control>
        <virtual-dice-control 
        @virtual-dice-roll="$emit('virtual-dice-roll', $event)"
        @secret-dice-roll="$emit('secret-dice-roll', $event)"
        v-bind="{amGamemaster: localPlayer===gameMaster}"/>
      </template>
    </local-player-card>

    <PlayerCard 
    v-for="(player, index) in otherPlayers" v-bind:key="index"
    v-bind="{
      player: player, 
      rollData: diceRolls[player.playerId] || null,  
      characterSheet: characterSheets[player.playerId] || {},  
      color:'red', 
      gm:false, 
      local:false}" />

  </section>
</template>

<script>


import PlayerCard from "./PlayerCard.vue";
import LocalPlayerCard from "./LocalPlayerCard.vue";
import VirtualDiceControl from "./VirtualDiceControl.vue";

export default {
  components: {PlayerCard, LocalPlayerCard, VirtualDiceControl},
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

  },
}
</script>

<style scoped>

  .frame {
      display: flex;
      flex-wrap: wrap;
  }

</style>