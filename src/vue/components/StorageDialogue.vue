<template>
    <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">
        <div class="close-button-holder">
            <h3>{{title}}</h3>
            <div @click="$emit('close')" class="close-button">X</div> 
        </div> 

        <nav v-if="allowCopyPasteControls && action === 'load'">
            <input hidden="" v-model="controlType" id="control-type-browser" value="BROWSER" type="radio"/>
            <label for="control-type-browser" class="radio-label">storage</label>
            <input hidden="" v-model="controlType" id="control-type-text" value="TEXT" type="radio"/>
            <label for="control-type-text" class="radio-label">text</label>
        </nav>

        <section v-show="controlType === 'BROWSER'">
            <ul class="storage-list">
                <li v-for="(itemName, index) in itemNameList" v-bind:key="index">
                    <p @click="() => {handleItemNameClick(itemName)}" >{{itemName}}</p>
                    <div @click="() => {handleDeleteButtonClick(itemName)}">x</div>
                </li>
                <li v-if="itemNameList.length === 0" class="empty-list-message">-no saved items-</li>
            </ul>

            <form class="file-name-form" v-if="action === 'save'" @submit="handleSaveButton">
                <input placeholder="enter file name" v-model="newItemName"/>
                <input type="submit" value="save"/>
            </form>
        </section>

        <section v-show="controlType === 'TEXT'">
            <data-import-form v-if="action === 'load'" 
            @submit="handleDataImport"
            v-bind="{
                importValidateFunction: this.importValidateFunction,
                convertToJson: true,
            }"
            placeholder="paste data here" 
            buttonText="load"/>
        </section>


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
            controlType: 'BROWSER',
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

    .modal-content {
        min-height: 20rem;
    }

    section {
        background-color: black;
        width: 100%;
        min-width: 15rem;
        box-sizing: border-box;
        margin-bottom: .5rem;
        min-height: 12rem;
        display: flex;
        flex-direction: column;
    }

    .storage-list {
        list-style: none;
        min-height: 8rem;
        padding: .5em;
        color: white;
        position: relative;
        margin: .5em 0;
    }

    .storage-list>li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .5em;
    }

    .storage-list>li.empty-list-message {
        justify-content: center;
        color: lightgray;
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

    .file-name-form {
        display: flex;
        justify-content: space-between;
        margin: 0 .25rem;
    }
</style>