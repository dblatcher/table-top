<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>

      <table class="character-sheet">
        <tr v-for="(datum,key_name) in localCharacterSheet.values" v-bind:key="key_name">
          <td>{{datum.name}}</td>
          <td><input @change="handleUpdate" type="text" v-model="datum.value"/> {{getTextAfterInput(datum)}}</td>
        </tr>
      </table>
      <button @click="openSaveSheetDialogue" >save as</button>
      <button @click="openLoadSheetDialogue" >load</button>
      <roll-zone v-bind="{rollData, size:40}"/>

      <storage-dialogue v-bind="storageDialogueProps" @close="cancelStorageAction" @item-name-choice="handleStorageAction"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";
import * as storage from "../../modules/storage";
import StorageDialogue from '../StorageDialogue.vue'

window.storage = storage

export default {
    components : {RollZone, StorageDialogue},
    props: ["player", "color","gm", "rollData","characterSheet"],
    data() {
        return {
            localCharacterSheet: this.characterSheet,
            storageDialogueProps: {
              isOpen: false,
            }
        }
    },

    methods : {
        getTextAfterInput(datum){
          return SheetDatum.getDisplaySuffix(datum)
        },

        handleUpdate(event) {
          this.$emit('update-character-sheet', this.localCharacterSheet)
        },

        handleStorageAction(itemName) {
          if (!itemName) {return false}
          this.storageDialogueProps.isOpen = false

          if (this.storageDialogueProps.action === 'save') {
            this.saveSheet(itemName)
          }
          if (this.storageDialogueProps.action === 'load') {
            this.loadSheet(itemName)
          }
        },

        openSaveSheetDialogue() {
          this.storageDialogueProps = {
              isOpen: true,
              title: 'Save Sheet',
              itemNames: storage.getItemNames('storedSheets'),
              action: 'save'
          }
        },

        openLoadSheetDialogue() {
          this.storageDialogueProps = {
              isOpen: true,
              title: 'Load Sheet',
              itemNames: storage.getItemNames('storedSheets'),
              action: 'load'
          }
        },

        saveSheet(itemName) {
          storage.save('storedSheets',itemName, this.localCharacterSheet.serialise())
        },

        loadSheet(itemName) {
          let item = storage.load('storedSheets', itemName)
          if (!itemName) {
            alert('DID NOT FIND SHEET', itemName)
            return false
          }
          this.localCharacterSheet = CharacterSheet.deserialise( item )
          this.handleUpdate()
        },

        cancelStorageAction() {
          this.storageDialogueProps.isOpen = false
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