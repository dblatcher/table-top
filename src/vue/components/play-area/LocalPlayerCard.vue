<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>

        <section v-for="(section, index) in groupedData" v-bind:key="index">
          <h3 v-if="section.group && section.group.label">{{section.group.label}}</h3>
          <ul v-bind:class="getGroupClass(section.group)">
            <li class="display-cs-group__datum" v-for="(datum, index2) in section.values" v-bind:key="index2">
              <span class="display-cs-group__key">{{datum.name}}:</span> 
              <span class="display-cs-group__value">
                
                <input @change="handleUpdate" v-bind:type="datum.type === 'number' ? 'number' : 'text'" v-model="datum.value"/>

                <span v-if="typeof datum.max !== 'undefined'">
                  &nbsp;/&nbsp;<input @change="handleUpdate" type="number" v-model="datum.max"/>
                </span>
              </span>
            </li>
          </ul>
        </section>

      <button v-if="currentSheetItemName" @click="()=>{saveSheet(currentSheetItemName)}">save {{currentSheetItemName}}</button>
      <button @click="openSaveSheetDialogue" >save as</button>
      <button @click="openLoadSheetDialogue" >load</button>
      <roll-zone v-bind="{rollData, size:40}"/>

      <storage-dialogue v-bind="storageDialogueProps" 
      @close="cancelStorageAction" 
      @item-delete-request="deleteSavedSheet"
      @item-name-choice="handleStorageAction"/>
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
            },
            currentSheetItemName: undefined
        }
    },

    computed : {
      groupedData() {
        return CharacterSheet.groupedData(this.localCharacterSheet)
      }
    },

    methods : {
        getTextAfterInput(datum){
          return SheetDatum.getDisplaySuffix(datum)
        },

        getGroupClass(group) {
          if (!group) { return 'display-cs-group display-cs-group--general' }
          if (group.priority === 1) { return 'display-cs-group display-cs-group--two-col' }
          return 'display-cs-group'
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
          this.storageDialogueProps.itemNames = storage.getItemNames('storedSheets')
          this.currentSheetItemName = itemName
        },

        deleteSavedSheet(itemName) {
          storage.clear('storedSheets', itemName)
          if (this.currentSheetItemName === itemName) {this.currentSheetItemName = undefined}
          this.storageDialogueProps.itemNames = storage.getItemNames('storedSheets')
        },

        loadSheet(itemName) {
          let item = storage.load('storedSheets', itemName)
          if (!itemName) {
            alert('DID NOT FIND SHEET', itemName)
            return false
          }
          this.localCharacterSheet = CharacterSheet.deserialise( item )
          this.currentSheetItemName = itemName
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