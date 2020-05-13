<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">
      <h2>{{gm? 'GAME MASTER - ': ''}}{{player.playerName}}</h2>

      <div v-if="!gm">
        <section v-for="(section, index) in groupedData" v-bind:key="index">
          <h4 v-if="section.group && section.group.label"
          @click="()=>{toggleFolder(section.group)}">
            {{section.group.label}}
            <span>{{isFolded(section.group) ? '  &#710;' : '  &#711;'}}</span>
          </h4>

          <transition name="fold">
          <article v-bind:class="getGroupClass(section.group)"
          v-show="!isFolded(section.group)">

            <div class="display-cs-group__datum-wrapper" v-for="(datum, index2) in section.values" v-bind:key="index2">

              <p class="display-cs-group__datum" v-if="datum.type !=='list'">
                <span class="display-cs-group__key">{{datum.name}}:</span> 
                <span class="display-cs-group__value" v-bind:style="getAnimationState(datum)">{{getDisplayValue(datum)}}</span>
              </p>

              <div class="display-cs-group__list-datum" v-if="datum.type ==='list'">
                <p class="display-cs-group__key">{{datum.name}}:</p> 
                <ul class="display-cs-group__list">
                  <li class="display-cs-group__value display-cs-group__value--list"
                  v-for="(item, index) in datum.value" v-bind:key="index">
                    <span v-if="datum.quantity">{{datum.quantity[index]}}&nbsp;</span>{{item}}
                  </li>
                </ul>
              </div>

            </div>

          </article>
          </transition>

        </section>
      </div>

      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";

class ChangedValueAnimation {
  constructor (keyName) {
    this.keyName = keyName,
    this.frame = 10
    this.timer = undefined
  }

  start() {
    const animation = this

    animation.timer = setInterval( function(){
      animation.frame -= 1
      if (animation.frame <= 0) {
        clearInterval(animation.timer)
      }
    }, 20)
    return this
  }
}

export default {
    components : {RollZone},
    props: ["player", "color","gm","local", "rollData","characterSheet"],

    data() {
      return {
        changedValueAnimations: {},
        foldedGroups: [],
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

    methods : {
      getDisplayValue(datum) {
        return datum.value+SheetDatum.getDisplaySuffix(datum)
      },
      getAnimationState(datum) {
        let animationState = this.changedValueAnimations[datum.keyName] 
        if (!animationState || animationState.frame < 1) { return {}}
        return {transform: `scale(${animationState.frame})`}
      },
      getGroupClass(group) {
        if (!group) { return 'display-cs-group display-cs-group--general' }
        if (group.layout === '2-col') { return 'display-cs-group display-cs-group--two-col' }
        return 'display-cs-group'
      },
      toggleFolder(group) {
        let index = this.foldedGroups.indexOf(group.name)
        if (index == -1) {
          this.foldedGroups.push(group.name)
        } else {
          this.foldedGroups.splice(index,1)
        }
      },
      isFolded(group) {
        if (!group) {return false} // accounts for the section made of datums withou groups
        return this.foldedGroups.indexOf(group.name) !== -1
      },
    },

    watch : {
      characterSheet: function(newSheet, oldSheet) {
        if (!oldSheet.values) {return}

        const changedValues = []
        const newKeys = []
        const valueKeys = Object.keys(newSheet.values)
        let i = 0;

        valueKeys.forEach(key => {
          if (!oldSheet.values[key] ) {
            newKeys.push(key)
            
            return
          }

          if (newSheet.values[key].type !== 'list') {
            if (newSheet.values[key].value != oldSheet.values[key].value) {
              changedValues.push(key)
              this.$set(this.changedValueAnimations, key, new ChangedValueAnimation(key).start())
            }
          }
          //TO DO - list for changes in a list
        })
      }
    }

}
</script>

<style scoped>

.fold-enter-active, .fold-leave-active {
  transition: transform .5s;
  transform-origin: top;
}
.fold-enter, .fold-leave-to {
  transform: scaleY(0);
}

</style>