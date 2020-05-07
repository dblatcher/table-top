<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>

      <table class="character-sheet">
        <tr v-for="(datum,key_name) in localCharacterSheet.values" v-bind:key="key_name">
          <td>{{datum.name}}</td>
          <td><input @change="handleUpdate" type="text" v-model="datum.value"/> {{getTextAfterInput(datum)}}</td>
        </tr>
      </table>
      <button @click="saveSheet" >save</button>
      <button @click="loadSheet" >load</button>
      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";

export default {
    components : {RollZone},
    props: ["player", "color","gm", "rollData","characterSheet"],
    data() {
        return {
            localCharacterSheet: this.characterSheet,
        }
    },

    methods : {
        getTextAfterInput(datum){
          return SheetDatum.getDisplaySuffix(datum)
        },

        handleUpdate(event) {
          this.$emit('update-character-sheet', this.localCharacterSheet)
        },

        saveSheet() {
          if (!localStorage.getItem('storedSheets')) {
            localStorage.setItem('storedSheets', JSON.stringify({}) )
          }
          let storedSheets = JSON.parse (localStorage.getItem('storedSheets'))
          storedSheets['TEST'] = this.localCharacterSheet.serialise()
          localStorage.setItem('storedSheets', JSON.stringify(storedSheets) )
        },

        loadSheet() {
          let storedSheets = window.localStorage.getItem('storedSheets')
          if (!storedSheets) { return false}
          storedSheets = JSON.parse(storedSheets)
          this.localCharacterSheet = CharacterSheet.deserialise( storedSheets['TEST'] )
          this.handleUpdate()
          return storedSheets['TEST']
        }
    },

    mounted() {
        this.$emit('update-character-sheet', this.localCharacterSheet)
    }

}
</script>

<style scoped>

  table {
    font-size: smaller;
  }

</style>