<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>

      <folding-panel v-bind="{ title:true, holderClass:'bordered', transitionClass:'corner-fold'}">

        <template v-slot:title>
          <h3 class="character-sheet-title">{{ currentSheetItemName || 'My Sheet'}}</h3>
        </template>

        <button v-if="currentSheetItemName" @click="()=>{saveSheet(currentSheetItemName)}">save {{currentSheetItemName}}</button>
        <button @click="openSaveSheetDialogue" >save as</button>
        <button @click="openLoadSheetDialogue" >load</button>

        <hr/>

        <character-sheet-section v-for="(section, index) in groupedData" v-bind:key="'_'+index" v-bind="{section}">
          <div class="display-cs-group__datum-wrapper" v-for="(datum, index2) in section.values" v-bind:key="index2">

            <span class="display-cs-group__datum" 
            v-if="datum.type ==='string'" >
              <span class="display-cs-group__key">{{datum.name}}:</span> 
              <input class="display-cs-group__value" @change="handleUpdate" type="text" v-model="datum.value"/>
            </span>

            <span class="display-cs-group__datum"
            v-if="datum.type ==='number'">
              <span class="display-cs-group__key">{{datum.name}}:</span> 
              <span class="display-cs-group__value">
                <input @change="handleUpdate" type="number" v-model="datum.value"/>
                <span v-if="typeof datum.max !== 'undefined'">
                  &nbsp;/&nbsp;<input @change="handleUpdate" type="number" v-model="datum.max"/>
                </span>
              </span>
            </span>

            <list-control  v-if="datum.type ==='list'"
            @change-quantity="(event)=>{handleListItemQuantityChange(event, datum)}" 
            @change-item="(event)=>{handleListItemChange(event, datum)}" 
            @delete-item="(event)=>{handleListItemDelete(event, datum)}"
            @new-item="(event)=>{handleListItemAdd(datum)}"
            v-bind="{datum}"/>
          </div>
        </character-sheet-section>

      </folding-panel>

      <roll-zone v-bind="{rollData, size:40}"/>

      <storage-dialogue v-bind="storageDialogueProps" 
      @close="cancelStorageAction" 
      @item-delete="handleDeletedSheet"
      @item-load="handleLoadedSheet"
      @item-save="handleSavedSheet"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";
import {save as storageSave} from "../../modules/storage";
import StorageDialogue from '../StorageDialogue.vue'
import ListControl from './ListControl.vue'
import CharacterSheetSection from './CharacterSheetSection.vue'
import FoldingPanel from '../FoldingPanel.vue'


export default {
    components : {RollZone, StorageDialogue, ListControl, CharacterSheetSection, FoldingPanel},
    props: ["player", "color","gm", "rollData","characterSheet"],
    data() {
        return {
            localCharacterSheet: this.characterSheet,
            storageDialogueProps: {
              isOpen: false,
              folderName: 'storedSheets',
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

        handleUpdate(event) {
          this.$emit('update-character-sheet', this.localCharacterSheet)
        },

        handleLoadedSheet(payload) {
          const {item, itemName} = payload;
          if (!itemName || !item) {return false}
          this.storageDialogueProps.isOpen = false
          this.localCharacterSheet = CharacterSheet.deserialise( item )
          this.currentSheetItemName = itemName
          this.handleUpdate()
        },

        handleSavedSheet(itemName) {
          this.storageDialogueProps.isOpen = false
          this.currentSheetItemName = itemName
        },

        handleListItemQuantityChange(event, datum) {
          datum.quantity[event.index] = Number(event.newValue)
          this.handleUpdate();
        },

        handleListItemChange(event, datum) {
          datum.value[event.index] = event.newValue
          this.handleUpdate();
        },

        handleListItemDelete(event, datum) {
          datum.value.splice(event.index,1)
          if (datum.quantity) {datum.quantity.splice(event.index,1)}
          this.handleUpdate();
        },

        handleListItemAdd(datum) {
          datum.value.push('')
          if (datum.quantity) {datum.quantity.push(1)}
          this.handleUpdate();
        },

        handleDeletedSheet(itemName) {
          if (this.currentSheetItemName === itemName) {this.currentSheetItemName = undefined}
        },

        openSaveSheetDialogue() {
          this.storageDialogueProps = {
              isOpen: true,
              title: 'Save Sheet',
              action: 'save',
              folderName: 'storedSheets',
              dataToSave: this.localCharacterSheet.serialise(),
          }
        },

        openLoadSheetDialogue() {
          this.storageDialogueProps = {
              isOpen: true,
              title: 'Load Sheet',
              action: 'load',
              folderName: 'storedSheets',
          }
        },

        saveSheet(itemName) {
          storageSave('storedSheets',itemName, this.localCharacterSheet.serialise())
          this.currentSheetItemName = itemName
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