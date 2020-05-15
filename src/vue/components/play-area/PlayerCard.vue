<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">
      <h2>{{gm? 'GAME MASTER - ': ''}}{{player.playerName}}</h2>

      <div v-if="!gm">

        <folding-panel v-bind="{title:'Character Sheet', holderClass:'bordered', transitionClass:'corner-fold'}">
          <character-sheet-section v-for="(section, index) in groupedData" v-bind:key="index" v-bind="{section}"/>
        </folding-panel>
      </div>

      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import CharacterSheetSection from './CharacterSheetSection.vue'
import FoldingPanel from '../FoldingPanel.vue'
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";

export default {
    components : {RollZone, CharacterSheetSection,FoldingPanel},
    props: ["player", "color","gm","local", "rollData","characterSheet"],

    computed : {
      groupedData() {
        let output = CharacterSheet.groupedData(this.characterSheet)

        output.forEach(grouping => {
          if (grouping.group && grouping.group.onlyDisplayNonEmpty) {
            grouping.values = grouping.values.filter(datum => {
              if (datum.value === "0") {return false}
              return !!datum.value
            })
          }
        })

        return output
      }
    },

}
</script>

<style scoped>

</style>