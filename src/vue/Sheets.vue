<template>
  <div>
      <h2>Sheets App: {{currentSheetItemName || '[unnamed sheet]'}}</h2>

      <div class="frame-row">
        <div class="frame">
          <button class="button" @click="undo">undo {{history.length -1}}</button>
          <button class="button" @click="openSaveSheetDialogue">save as</button>
          <button class="button" @click="openLoadSheetDialogue">load</button>
        </div>

        <choice-menu class="frame" v-bind="{choices: templateChoices}" @submit="useTemplate">
          <span class="button">use template</span>
        </choice-menu>
      </div>

      <div class="frame-row">

        <div class="frame">
          <div style="width: 8rem; border: 1px dotted black"
          @drop="handleDropOn({ special:'bin' })" @dragover.prevent
          >
            <p>bin</p>
          </div>
        </div>

        <div class="frame">

          <div class="group-panels">
            <folding-panel v-for="(section, index) in groupedData" v-bind:key="'_'+index" 
            v-bind="{title: section.group ? section.group.label : '[main]', holderClass: 'editor'}">

              <table @drop="handleDropOn({ group: section.group || false})" @dragover.prevent>
                <thead v-if="section.group">
                  <tr>
                    <td colspan="2">
                      <span>label:</span>
                    </td>
                    <td >
                      <input @change="handleUpdate" type="text" v-model="section.group.label"/>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <span>don't display empty:</span>
                    </td>
                    <td>
                      <input @change="handleUpdate" type="checkbox" v-model="section.group.onlyDisplayNonEmpty"/>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2">
                      <span>layout</span>
                    </td>
                    <td>
                      <select @change="handleUpdate" v-model="section.group.layout">
                          <option v-for="(optionName, index) in layoutOptions" v-bind:key="optionName+index" 
                          >{{optionName}}</option>
                      </select>
                    </td>
                  </tr>
                </thead>

                <tbody>

                <tr v-for="(datum, index2) in section.values" v-bind:key="index2" 
                draggable="true" 
                @dragstart="setDragData(datum, index2)"
                @dragover.prevent 
                @drop="handleDropOn({datum, group: section.group || false})"
                >
                  <td>
                    <span>{{datum.name}}:</span> 
                  </td>
                  <td>
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

                      <list-control  v-if="datum.isListType"
                      @change-quantity="(event)=>{handleListItemQuantityChange(event, datum)}" 
                      @change-item="(event)=>{handleListItemChange(event, datum)}" 
                      @delete-item="(event)=>{handleListItemDelete(event, datum)}"
                      @new-item="(event)=>{handleListItemAdd(datum)}"
                      v-bind="{datum}"/>
                  </td>

                  <td>
                    <select @change="()=>{handleTypeChange(datum)}" v-model="datum.type">
                        <option v-for="(optionName, index) in datumTypeOptions" v-bind:key="optionName+index" 
                        >{{optionName}}</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td colspan="3">
                    <choice-menu v-bind="{choices:datumTypeOptions, hasTextInput: true}" 
                    @submit="($event) => { addNewItem(section, $event)}">
                      <span class="button">Add new value</span>
                    </choice-menu>
                  </td>
                </tr>
                </tbody>
              </table>

            </folding-panel>
          </div>

          <choice-menu v-bind="{hasTextInput: true}" @submit="addNewGroup">
            <span class="button">Add new group</span>
          </choice-menu>

        </div>
      </div>


      <storage-dialogue v-bind="storageDialogueProps" 
      @close="cancelStorageAction" 
      @item-delete="handleDeletedSheet"
      @item-load="handleLoadedSheet"
      @item-save="handleSavedSheet"/>
  </div>
</template>

<script>

import StorageDialogue from "./components/StorageDialogue.vue";
import ListControl from "./components/play-area/ListControl.vue"
import FoldingPanel from "./components/FoldingPanel.vue"
import ChoiceMenu from "./components/sheets/ChoiceMenu.vue"

import {CharacterSheet, SheetDatum, DataGroup} from "./modules/characterSheets"
import * as templates from "./modules/templateCharacterSheets"
import {
  handleListItemQuantityChange, 
  handleListItemChange,
  handleListItemDelete,
  handleListItemAdd,
} from "./modules/listControlMethods"


export default {
    components: {StorageDialogue, ListControl, FoldingPanel,ChoiceMenu},
    props: ["config"],

    data() {
        const newSheet = templates.blank()
        return {
            localCharacterSheet: newSheet,
            currentSheetItemName: undefined,
            history: [newSheet.clone()],
            storageDialogueProps :{
                isOpen: false,
                folderName: "storedSheets"
            },
            dragData: null,
        }
    },

    computed : {
      groupedData() {
        return CharacterSheet.groupedData(this.localCharacterSheet)
      },
      layoutOptions() {
        return DataGroup.layoutOptions
      },
      datumTypeOptions() {
        return SheetDatum.validTypes
      },
      templateChoices() {
        return Object.keys(templates)
      }
    },

    methods : {

      setDragData (datum, index) {
        console.log('drag', datum, index)
        this.dragData = {datum, index}
      },

      handleDropOn (target) {
        if (!this.dragData) {return false}
        console.log('dropped ', this.dragData)
        console.log(' on', target)

        if (typeof target.group !== 'undefined') {
          this.dragData.datum.groupName = target.group ? target.group.name : undefined;
          this.localCharacterSheet = this.localCharacterSheet.clone()
        }

        if (target.special && target.special === 'bin') {
          console.log('BIN')
          this.localCharacterSheet.removeValue(this.dragData.datum.keyName)
          this.localCharacterSheet = this.localCharacterSheet.clone()
        }

        this.handleUpdate()
        this.dragData = null
      },

      handleTypeChange(datum) {
        //will create new type number_with_max (or similar)

        let oldType = this.history[this.history.length-1].values[datum.keyName].type
        console.log(`value is a ${oldType}, type is now ${datum.type}`)

        switch (datum.type) {
          case 'number' :
            datum.value = 1
            if (datum.max) { datum.max = 5}
            break;

          case 'string' :
            datum.value = datum.value.toString()
            break;

          case 'list' :
            if (oldType === 'QUANTIFIED_LIST') {
              datum.quantity = undefined
              this.$set(datum,'quantity',undefined)
            } else {
              datum.value= [datum.value]
            }
            break;

          case 'QUANTIFIED_LIST' :
            if (oldType === 'list') {
              this.$set(datum,'quantity',datum.value.map(item => 1))
            } else {
              datum.value= [datum.value]
              this.$set(datum,'quantity',[1])
            }
            break;
        }

        this.handleUpdate();
      },

      handleUpdate(event) {
        this.history.push(this.localCharacterSheet.clone())
      },

      addNewItem(section, dataInput ) {
        const name = dataInput.text
        if (!name) {return false}
        const type = dataInput.choice
        const groupName = section.group ? section.group.name : undefined

        this.localCharacterSheet.addDatum(new SheetDatum(name, undefined,{type, groupName}))
        this.localCharacterSheet = this.localCharacterSheet.clone()
        this.handleUpdate()
      },

      addNewGroup(dataInput ) {
        const name = dataInput.text
        if (!name) {return false}
        this.localCharacterSheet.groups.push(new DataGroup(name,{}))
        this.localCharacterSheet = this.localCharacterSheet.clone()
        this.handleUpdate()
      },

      handleListItemQuantityChange, 
      handleListItemChange,
      handleListItemDelete,
      handleListItemAdd,

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

      handleDeletedSheet(itemName) {
        if (this.currentSheetItemName === itemName) {this.currentSheetItemName = undefined}
      },

      cancelStorageAction() {
        this.storageDialogueProps.isOpen = false
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

      useTemplate(inputData) {
        const templateName = inputData.choice
        this.localCharacterSheet = templates[templateName]()
        this.$forceUpdate()
        this.handleUpdate()
      },

      undo() {
        if (this.history.length <= 1) { // history[0] is the clone of the current state
          console.log('no history to undo to')
          return false
        }

        // remove copy of current
        this.history.pop() 
        // copy the previous history item as new current 
        this.localCharacterSheet = this.history[this.history.length - 1].clone();
      }
    }
}
</script>

<style scoped>

  .frame-row {
    display: flex;
    flex-wrap: wrap;
  } 

  table {
    width: 100%;
  }

  td {
    padding: .2em;
    vertical-align: baseline;
    background-color: antiquewhite;
  }

  tbody>tr:not(:last-of-type) {
    cursor: grab;
  }

  thead>tr:last-child td {
    border-bottom: 2px dotted black;
  }


</style>