<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm':''}`">
      <h2>{{gm? 'GAME MASTER - ': ''}}{{player.playerName}}</h2>

      <div v-if="!gm">
        <section v-for="(section, index) in groupedData" v-bind:key="index">
          <h3 v-if="section.group && section.group.label">{{section.group.label}}</h3>
          <article v-bind:class="getGroupClass(section.group)">

            <div class="display-cs-group__datum-wrapper" v-for="(datum, index2) in section.values" v-bind:key="index2">

              <p class="display-cs-group__datum" v-if="datum.type !=='list'">
                <span class="display-cs-group__key">{{datum.name}}:</span> 
                <span class="display-cs-group__value">{{getDisplayValue(datum)}}</span>
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
      getGroupClass(group) {
        if (!group) { return 'display-cs-group display-cs-group--general' }
        if (group.layout === '2-col') { return 'display-cs-group display-cs-group--two-col' }
        return 'display-cs-group'
      }
    },
}
</script>

<style scoped>



</style>