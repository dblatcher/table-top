<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">

      <transition name="fade">
        <q v-if="bubbleTimer[0] && bubbleTimer[0].hasStarted" class="message-bubble">{{bubbleTimer[0].text}}</q>
      </transition>

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

class BubbleTimer {

  constructor(text, lifespan) {
    this.text = text
    this.frame = lifespan * 100
    this.hasStarted = false
  }

  start(vm, delay) {
    const animation = this

    setTimeout (function(){
      animation.hasStarted = true
      animation.timer = setInterval( function(){
        animation.frame -= 1
        if (animation.frame <= 0) { 
          clearInterval(animation.timer)
          vm.handleBubbleTimerFinish(animation)
        }
      }, 10)
    }, delay*1000)

    return this
  }
}

export default {
    components : {RollZone, CharacterSheetSection,FoldingPanel},
    props: ["player","messages", "color","gm", "rollData","characterSheet"],

    data() {
      return {
        bubbleTimer: []
      }
    },

    methods: {
      handleBubbleTimerFinish(bubbleTimer) {
        this.bubbleTimer.shift();
        if (this.bubbleTimer[0]) {this.bubbleTimer[0].start(this, 1.5)}
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
          if (this.bubbleTimer[0]) {
            this.bubbleTimer.push(new BubbleTimer(mostRecentMessage.text, 4))
            return
          }
          this.bubbleTimer.push (new BubbleTimer(mostRecentMessage.text, 4).start(this, 0))
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
    box-shadow: 2px 2px 4px 1px black;
    text-align: center;
    font-size: small;
    transform: translateY(-50%);
  }

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s, transform 1s;
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-150%);
}

.fade-enter {
  opacity: 0;
  transform: translateY(3em);
}


</style>