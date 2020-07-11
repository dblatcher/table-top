<template>
    <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">
        <div class="close-button-holder">
            <h3>{{title}}</h3>
            <div @click="$emit('close')" class="close-button">X</div> 
        </div> 

        <nav v-if="(allowCopyPasteControls || allowFileControls) && action === 'load'">
            <input hidden="" v-model="loadControlType" id="control-type-browser" value="BROWSER" type="radio"/>
            <label for="control-type-browser" class="radio-label">storage</label>

            <input hidden="" v-if="allowCopyPasteControls" v-model="loadControlType" id="control-type-text" value="TEXT" type="radio"/>
            <label  v-if="allowCopyPasteControls" for="control-type-text" class="radio-label">text</label>

            <input hidden="" v-if="allowFileControls" v-model="loadControlType" id="control-type-file" value="FILE" type="radio"/>
            <label v-if="allowFileControls" for="control-type-file" class="radio-label">file</label>
        </nav>

        <section class="storage-control" v-show="loadControlType === 'BROWSER' || action === 'save'">
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

        <section  v-if="action === 'save' && allowFileControls">
            <DownloadButtonWithClipboardFallback v-bind="{
                fileContents: dataAsString,
                fileName: 'new file',
                downloadButtonText: 'download data file', 
                clipboardButtonText: 'copy data to clipboard',
            }"/>
        </section>

        <section class="storage-control" v-show="loadControlType === 'TEXT'">
            <data-import-form v-if="action === 'load'" 
            @submit="handleDataImport"
            v-bind="{
                importValidateFunction: this.importValidateFunction,
                convertToJson: true,
            }"
            placeholder="paste data here" 
            buttonText="load"/>
        </section>

        <section class="storage-control" v-show="loadControlType === 'FILE'">
            <FileUploadForm v-if="action === 'load'"
            @submit="handleDataImport"
            v-bind="{
                importValidateFunction: this.importValidateFunction,
                convertToJson: true,
            }"
            maxFileSize="100000"/>
        </section>

      </div>
    </aside>
</template>

<script>
import * as storage from "../modules/storage";

import DataImportForm from './DataImportForm.vue'
import FileUploadForm from './FileUploadForm.vue'
import DownloadButtonWithClipboardFallback from './DownloadButtonWithClipboardFallback.vue'



export default {
    components: {DataImportForm, FileUploadForm,DownloadButtonWithClipboardFallback},
    props: ['isOpen', 'title', 'action', 'folderName', 'dataToSave', 'specialTextVersionOfDataToSave ', 'importValidateFunction', 'allowCopyPasteControls', 'allowFileControls'],

    data() {
        return {
            newItemName: '',
            itemNameList: storage.getItemNames(this.folderName),
            loadControlType: 'BROWSER',
        }
    },

    computed: {
        dataAsString() {
            if (this.specialTextVersionOfDataToSave ) {
                return this.specialTextVersionOfDataToSave 
            }
            let stringifiedData
            try {
                stringifiedData = JSON.stringify(this.dataToSave)
                return stringifiedData
            } 
            catch (error) {
                console.warn('StorageDialoge failed to stringify data',error)
            }
            return ('ERROR')
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

    watch: {
        action(newValue,oldValue) {
            if (newValue === 'save') {
                this.loadControlType = 'BROWSER'
            }
        },
    }

}
</script>

<style scoped>

    .modal-content {
        min-height: 20rem;
    }

    .file-name-form {
        display: flex;
        justify-content: space-between;
        margin: 0 .25rem;
    }
</style>