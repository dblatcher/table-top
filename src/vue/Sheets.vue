<template>
  <div>
      <h2>Sheets App</h2>


      <folding-panel v-for="(section, index) in groupedData" v-bind:key="'_'+index" 
      v-bind="{title: section.group ? section.group.name : '[main]', holderClass: 'editor'}">

        <table>

          <thead v-if="section.group">
            <tr >
              <td colspan="2">
                <span>label:</span>
              </td>
              <td >
                <input @change="handleUpdate" type="text" v-model="section.group.label"/>
              </td>
            </tr>
            <tr >
              <td colspan="2">
                <span>don't display empty:</span>
              </td>
              <td>
                <input @change="handleUpdate" type="checkbox" v-model="section.group.onlyDisplayNonEmpty"/>
              </td>
            </tr>
          </thead>

          <tr v-for="(datum, index2) in section.values" v-bind:key="index2">

            <td>
              <span>{{datum.name}}:</span> 
            </td>

            <td>
              <div>

                  <span v-if="datum.type ==='string'" >
                    <input @change="handleUpdate" type="text" v-model="datum.value"/>
                  </span>

                  <span v-if="datum.type ==='number'">
                    <span >
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
            </td>

            <td>
              <div>
                {{datum.type}}
              </div>
            </td>

          </tr>


          <tr>
            <td colspan="3">
              <span>Add new value</span>
            </td>
          </tr>

        </table>

      </folding-panel>

      <storage-dialogue v-bind="storageDialogueProps"/>
  </div>
</template>

<script>

import StorageDialogue from "./components/StorageDialogue.vue";
import CharacterSheetSection from "./components/play-area/CharacterSheetSection.vue"
import ListControl from "./components/play-area/ListControl.vue"
import FoldingPanel from "./components/FoldingPanel.vue"

import {CharacterSheet, SheetDatum, DataGroup} from "./modules/characterSheets"
import * as templates from "./modules/templateCharacterSheets"


export default {
    components: {StorageDialogue, CharacterSheetSection, ListControl, FoldingPanel},
    props: ["config"],

    data() {
        return {
            localCharacterSheet: templates.dungeons(),
            storageDialogueProps :{
                isOpen: false,
                folderName: "storedSheets"
            }
        }
    },

    computed : {
      groupedData() {
        return CharacterSheet.groupedData(this.localCharacterSheet)
      }
    },

    methods : {
        handleUpdate(event) {
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
    }
}
</script>

<style scoped>

  table {
    width: 100%;
  }

  td {
    padding: .2em;
    border: 1px dashed blue;
  }

  thead>tr:last-child td {
    border-bottom: 2px solid blue;
  }


</style>