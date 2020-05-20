<template>
  <div>
      <h2>Sheets App</h2>

        <div class="widget">
        <article class="frame">
            <h3>values</h3>

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

        
        </article>

        <article class="frame"> 
            <h3>edit</h3>
        </article>
        
        </div>

      <storage-dialogue v-bind="storageDialogueProps"/>
  </div>
</template>

<script>

import StorageDialogue from "./components/StorageDialogue.vue";
import CharacterSheetSection from "./components/play-area/CharacterSheetSection.vue"
import ListControl from "./components/play-area/ListControl.vue"

import {CharacterSheet, SheetDatum, DataGroup} from "./modules/characterSheets"
import * as templates from "./modules/templateCharacterSheets"


export default {
    components: {StorageDialogue, CharacterSheetSection, ListControl},
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

    .widget {
        display: flex;
        flex-wrap: wrap;
    }

    .frame {
        min-width: 8rem;
        width: 50%;
        max-width: 14rem;
    }

</style>