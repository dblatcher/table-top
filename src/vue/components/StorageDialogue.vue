<template>
    <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">
        <div class="close-button-holder">
            <h3>{{title}}</h3>
            <div  @click="$emit('close')" class="close-button">X</div> 
        </div> 

        <ul class="storage-list">
            <li v-for="(itemName, index) in itemNameList" v-bind:key="index">
                <p @click="() => {handleItemNameClick(itemName)}" >{{itemName}}</p>
                <div @click="() => {handleDeleteButtonClick(itemName)}">x</div>
            </li>
        </ul>

        <form v-if="action === 'save'" @submit="handleSaveButton">
            <input v-model="newItemName"/>
            <input type="submit" value="save"/>
        </form>

        <data-import-form v-if="action === 'load' && allowCopyPasteControls" 
        @submit="handleDataImport"
        v-bind="{
            importValidateFunction: this.importValidateFunction,
            convertToJson: true,
        }"
        placeholder="paste data here" 
        buttonText="load"/>

      </div>
    </aside>
</template>

<script>
import * as storage from "../modules/storage";

import DataImportForm from './DataImportForm.vue'

export default {
    components: {DataImportForm},
    props: ['isOpen', 'title', 'action', 'folderName', 'dataToSave', 'importValidateFunction', 'allowCopyPasteControls'],

    data() {
        return {
            newItemName: '',
            itemNameList: storage.getItemNames(this.folderName),
        }
    },

    methods: {

        refreshItemNameList() {
            this.itemNameList.splice(0, this.itemNameList.length, ...storage.getItemNames(this.folderName))
        },

        handleSaveButton(event) {
            event.preventDefault()
            // to do - confirm overwrites before proceeding
            // to do - santise / validate save names?
            if (!this.newItemName) {return false}
            storage.save(this.folderName,this.newItemName, this.dataToSave)
            this.refreshItemNameList()
            this.$emit('item-save', this.newItemName)
        },

        handleDeleteButtonClick(itemName) {
            storage.clear(this.folderName, itemName)
            this.refreshItemNameList()
            this.$emit('item-delete', itemName)
        },

        handleItemNameClick(itemName) {
            if (this.action === 'save') {
                this.newItemName = itemName
            }

            if (this.action === 'load') {
                this.newItemName = itemName
                let item = storage.load(this.folderName, itemName)
                if (!item) {
                    alert('DID NOT FIND ITEM', itemName)
                    return false
                }
                this.$emit('item-load', {itemName, item})
            }
        },

        handleDataImport(data) {
            this.$emit('item-load', {itemName:"imported", item:data})
        }
    },

}
</script>

<style scoped>

    .storage-list {
        list-style: none;
        background-color: black;
        width: 100%;
        min-width: 12rem;
        min-height: 8rem;
        box-sizing: border-box;
        padding: .5em;
        color: white;
    }

    .storage-list>li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .5em;
    }

    .storage-list>li>p { 
        cursor: pointer;
        margin: 0;
    }

    .storage-list>li>div { 
        cursor: pointer;
        margin: 0;
        color: red;
    }
</style>