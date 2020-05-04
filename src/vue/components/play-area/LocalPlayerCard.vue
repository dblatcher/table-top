<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>

      <table class="character-sheet">
        <tr v-for="(datum,key_name) in localCharacterSheet" v-bind:key="key_name">
          <td>{{datum.name}}</td>
          <td><input @change="handleUpdate" type="text" v-model="datum.value"/> {{getTextAfterInput(datum)}}</td>
        </tr>
      </table>

      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import { SheetDatum } from "../../modules/characterSheets";

export default {
    components : {RollZone},
    props: ["player", "color","gm", "rollData","characterSheet"],
    data() {
        return {
            localCharacterSheet: this.characterSheet,
        }
    },

    methods : {
        getTextAfterInput(datum){
          return SheetDatum.getDisplaySuffix(datum)
        },

        handleUpdate(event) {
          this.$emit('update-character-sheet', this.localCharacterSheet)
        }
    },

    mounted() {
        this.$emit('update-character-sheet', this.localCharacterSheet)
    }

}
</script>

<style scoped>

  table {
    font-size: smaller;
  }

</style>