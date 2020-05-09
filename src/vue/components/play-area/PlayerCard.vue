<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">
      <h2>{{gm? 'GAME MASTER - ': ''}}{{player.playerName}}</h2>

      <div v-if="!gm">
        <section v-for="(section, index) in groupedData" v-bind:key="index">
          <h3 v-if="section.group && section.group.label">{{section.group.label}}</h3>
          <ul v-bind:class="getGroupClass(section.group)">
            <li class="display-cs-group__datum" v-for="(datum, index2) in section.values" v-bind:key="index2">
              <span class="display-cs-group__key">{{datum.name}}:</span> <span class="display-cs-group__value">{{getDisplayValue(datum)}}</span>
            </li>
          </ul>
        </section>
      </div>

      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";

export default {
    components : {RollZone},
    props: ["player", "color","gm","local", "rollData","characterSheet"],


    computed : {
      groupedData() {
        return CharacterSheet.groupedData(this.characterSheet)
      }
    },

    methods : {
      getDisplayValue(datum) {
        return datum.value+SheetDatum.getDisplaySuffix(datum)
      },
      getGroupClass(group) {
        if (!group) { return 'display-cs-group display-cs-group--general' }
        if (group.priority === 1) { return 'display-cs-group display-cs-group--two-col' }
        return 'display-cs-group'
      }
    },

    updated() {
      console.log(this.groupedData)
    },
}
</script>

<style scoped>



</style>