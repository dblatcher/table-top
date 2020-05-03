<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>
      <p v-for="(line,index) in characterSheetLines" v-bind:key="index">
        {{line}}
      </p>

      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'

export default {
    components : {RollZone},
    props: ["player", "color","gm","local", "rollData","characterSheet"],

    computed : {
      characterSheetLines (){
        if(!this.characterSheet) return []
        const lines = []

        Object.keys(this.characterSheet).forEach(key => {
          lines.push(`${key}: ${this.characterSheet[key].value}`)
        })

        return lines
      }
    }
}
</script>

<style>

</style>