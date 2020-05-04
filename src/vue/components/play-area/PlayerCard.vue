<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">
      <h2>{{player.playerName}}</h2>

      <table class="character-sheet" v-if="!gm">
        <tr v-for="(datum,key_name) in characterSheet" v-bind:key="key_name">
          <td>{{datum.name}}</td>
          <td>{{displayValue(datum)}}</td>
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
    props: ["player", "color","gm","local", "rollData","characterSheet"],

    methods : {
      displayValue(datum){
        return datum.value+SheetDatum.getDisplaySuffix(datum)
      },
    }
}
</script>

<style scoped>

  table {
    font-size: smaller;
  }

</style>