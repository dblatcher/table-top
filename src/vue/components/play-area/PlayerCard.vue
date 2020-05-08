<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">
      <h2>{{player.playerName}}</h2>

      <!-- <table class="character-sheet" v-if="!gm">
        <tr v-for="(datum,key_name) in characterSheet.values" v-bind:key="key_name">
          <td>{{datum.name}}</td>
          <td>{{getDisplayValue(datum)}}</td>
        </tr>
      </table> -->

      <div v-if="!gm">
        <section v-for="(grouping, index) in groupedData" v-bind:key="index">
          <h3 v-if="grouping.group && grouping.group.label">{{grouping.group.label}}</h3>
          <ul v-bind:class="getGroupClass(grouping.group)">
            <li v-for="(datum, index2) in grouping.values" v-bind:key="index2">
              <span class="group__key">{{datum.name}}:</span> <span class="group__value">{{getDisplayValue(datum)}}</span>
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
        if (!group) { return 'group group--general' }
        if (group.priority === 1) { return 'group group--p1' }
        return 'group'
      }
    },

    updated() {
      console.log(this.groupedData)
    },
}
</script>

<style scoped>

  .group {
      margin: 0;
      list-style: none;
      padding: 0;
      max-width: 8em;
  }

  .group--p1 {
    display: flex;
    flex-wrap: wrap;
  }

  .group--p1>li {
    display: inline-flex;
    margin-right: .5em;
    justify-content: space-between;
    min-width: 3em;
  }

  .group__key {
    font-size: smaller;
  }

  .group__value {
    font-size: small;
    font-weight: 700;
  }

</style>