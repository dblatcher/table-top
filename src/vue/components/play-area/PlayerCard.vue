<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>

      <table>
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
        return SheetDatum.getDisplayValue(datum)
      },
    }
}
</script>

<style scoped>

  table {
    font-size: smaller;
  }

</style>