<template>
  <article v-bind:class="`${color} card`">
      <h2>{{gm?'GM:':''}}{{player.playerName}}</h2>

      <slot name="dice-control"></slot>

      <folding-panel v-if="!gm" v-bind="{ title:true, holderClass:'bordered', transitionClass:'corner-fold'}">

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
              </span>
            </span>

            <span class="display-cs-group__datum"
            v-if="datum.type ==='NUM_&_MAX'">
              <span class="display-cs-group__key">{{datum.name}}:</span> 
              <span class="display-cs-group__value">
                <input @change="handleUpdate" type="number" v-model="datum.value"/>
                &nbsp;/&nbsp;
                <input @change="handleUpdate" type="number" v-model="datum.max"/>
              </span>
            </span>

            <list-control  v-if="datum.isListType"
            @change-quantity="(event)=>{handleListItemQuantityChange(event, datum)}" 
            @change-item="(event)=>{handleListItemChange(event, datum)}" 
            @delete-item="(event)=>{handleListItemDelete(event, datum)}"
            @new-item="(event)=>{handleListItemAdd(datum)}"
            v-bind="{datum}"/>
          </div>
        </character-sheet-section>

      </folding-panel>

      <storage-dialogue v-if="!gm"  v-bind="storageDialogueProps" 
      @close="cancelStorageAction" 
      @item-delete="handleDeletedSheet"
      @item-load="handleLoadedSheet"
      @item-save="handleSavedSheet"/>
  </article>
</template>

<script>

import StorageDialogue from '../StorageDialogue.vue'
import ListControl from './ListControl.vue'
import CharacterSheetSection from './CharacterSheetSection.vue'
import FoldingPanel from '../FoldingPanel.vue'

import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";
import {save as storageSave} from "../../modules/storage";
import {
  handleListItemQuantityChange, 
  handleListItemChange,
  handleListItemDelete,
  handleListItemAdd,
} from "../../modules/listControlMethods"


export default {
    components : {StorageDialogue, ListControl, CharacterSheetSection, FoldingPanel},
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
        },

        handleListItemQuantityChange, 
        handleListItemChange,
        handleListItemDelete,
        handleListItemAdd,
    },

    mounted() {
      if( !this.gm) {
        this.$emit('update-character-sheet', this.localCharacterSheet)
      }
    }

}
</script>

<style scoped>

  table {
    font-size: smaller;
  }

</style>