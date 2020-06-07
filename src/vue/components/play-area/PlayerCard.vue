<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">
    <q v-show="bubbleText" class="message-bubble">{{bubbleText}}</q>
      <h2>{{gm? 'GM:': ''}}{{player.playerName}}</h2>

      <roll-zone v-bind="{rollData, zoneHeight:100}"/>

      <div v-if="!gm">
        <folding-panel v-bind="{title:'Character Sheet', holderClass:'bordered', transitionClass:'corner-fold'}">
          <template v-slot:title>
            <h3 class="character-sheet-title">{{'Character Sheet'}}</h3>
          </template>
          <character-sheet-section v-for="(section, index) in groupedData" v-bind:key="index" v-bind="{section}"/>
        </folding-panel>
      </div>

  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import CharacterSheetSection from './CharacterSheetSection.vue'
import FoldingPanel from '../FoldingPanel.vue'
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";

export default {
    components : {RollZone, CharacterSheetSection,FoldingPanel},
    props: ["player","messages", "color","gm", "rollData","characterSheet"],

    data() {
      return {
        bubbleText: "",
      }
    },

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

    watch: {
      messages(updatedMessages) {
        if (updatedMessages.length === 0) { return }
        let mostRecentMessage = updatedMessages[updatedMessages.length-1]

        if (mostRecentMessage.player.playerId === this.player.playerId && mostRecentMessage.isTextMessage) {
          this.bubbleText = mostRecentMessage.text
        }

      } 
    }

}
</script>

<style scoped>

  .message-bubble {
    position: absolute;
    margin: 0;
    top: 0;
    background: antiquewhite;
    right: 0;
    width: 8rem;
    padding: .75rem;
    border-radius: 40%;
    transform: translate(0%, -50%);
    box-shadow: 2px 2px 4px 1px black;
    text-align: center;
    font-size: small;
  }

</style>