<template>
  <article v-bind:class="`${color} card ${gm ? 'card--gm' : 'card--local'}`">
      <h2>{{gm?'GM:':''}}{{player.playerName}}</h2>

      <slot name="dice-control"></slot>

      <folding-panel v-if="!gm" v-bind="{ title:true, holderClass:'bordered', transitionClass:'corner-fold'}">

        <template v-slot:title>
          <h3 class="character-sheet-title">{{ currentSheetItemName || 'My Sheet'}}</h3>
        </template>

        <button v-if="currentSheetItemName" @click="()=>{saveSheet(currentSheetItemName)}">save {{currentSheetItemName}}</button>
        <button @click="openSaveSheetDialogue" >save as</button>
        <button @click="openLoadSheetDialogue" >load</button>

        <choice-menu style="display:inline-flex" v-bind="{choices: templateChoices}" @submit="useTemplateCharacterSheet">
          <span class="stud-button" style="font-size:smaller">&#10004;</span>
        </choice-menu>

        <hr/>

        <character-sheet-section v-for="(section, index) in groupedData" v-bind:key="'_'+index" v-bind="{section}">
          <div class="display-cs-group__datum-wrapper" v-for="(datum, index2) in section.values" v-bind:key="index2">

            <span class="display-cs-group__datum" v-if="!datum.isListType">
              <span class="display-cs-group__key">{{datum.name}}:</span> 

              <span v-if="datum.isDerived" class="display-cs-group__value display-cs-group__value--derived">
                  <tool-tip-holder v-bind:content="datum.description">{{datum.value}}</tool-tip-holder>
              </span>

              <input v-if="datum.type ==='string'" class="display-cs-group__value" @change="handleUpdate" type="text" v-model="datum.value"/>
              <input v-if="datum.type ==='number'" class="display-cs-group__value" @change="handleUpdate" type="number" v-model.number="datum.value"/>

              <span v-if="datum.type ==='NUM_&_MAX'" class="display-cs-group__value">
                <input @change="handleUpdate" type="number" v-model.number="datum.value"/>
                &nbsp;/&nbsp;
                <input @change="handleUpdate" type="number" v-model.number="datum.max"/>
              </span>

              <action-button v-if="datum.action" v-bind="{datum}" @click="($event)=>{$emit('action-button',datum)}"/>
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
import ActionButton from './ActionButton.vue'
import CharacterSheetSection from './CharacterSheetSection.vue'
import FoldingPanel from '../FoldingPanel.vue'
import ChoiceMenu from '../ChoiceMenu.vue'
import ToolTipHolder from '../ToolTipHolder.vue'

import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";
import * as characterSheetTemplates from "../../modules/templateCharacterSheets"
import {save as storageSave} from "../../modules/storage";
import {
  handleListItemQuantityChange, 
  handleListItemChange,
  handleListItemDelete,
  handleListItemAdd,
} from "../../modules/listControlMethods"


export default {
    components : {StorageDialogue, ListControl, CharacterSheetSection, FoldingPanel,ChoiceMenu,ToolTipHolder, ActionButton},
    props: ["player", "color","gm", "rollData","characterSheet"],
    data() {
        return {
            localCharacterSheet: this.characterSheet,
            storageDialogueProps: {
              isOpen: false,
              folderName: 'storedSheets',
              importValidateFunction: CharacterSheet.validateSerialisedSheet,
              allowCopyPasteControls: true,
              allowFileControls: true,
            },
            currentSheetItemName: undefined
        }
    },

    computed : {
      groupedData() {
        return CharacterSheet.groupedData(this.localCharacterSheet)
      },
      templateChoices() {
        return Object.keys(characterSheetTemplates)
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
        this.storageDialogueProps.isOpen = true
        this.storageDialogueProps.title = 'Save Sheet'
        this.storageDialogueProps.action = 'save'
        this.storageDialogueProps.dataToSave = this.localCharacterSheet.serialise()
      },

      openLoadSheetDialogue() {
        this.storageDialogueProps.isOpen = true
        this.storageDialogueProps.title = 'Load Sheet'
        this.storageDialogueProps.action = 'load'
        this.storageDialogueProps.dataToSave = null
      },

        saveSheet(itemName) {
          storageSave('storedSheets',itemName, this.localCharacterSheet.serialise())
          this.currentSheetItemName = itemName
        },

        cancelStorageAction() {
          this.storageDialogueProps.isOpen = false
        },

        useTemplateCharacterSheet(event) {
          this.localCharacterSheet = characterSheetTemplates[event.choice]()
          this.handleUpdate()
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