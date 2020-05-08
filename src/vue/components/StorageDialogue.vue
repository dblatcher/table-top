<template>
    <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">
        <div class="close-button-holder">
            <h3>{{title}}</h3>
            <div  @click="$emit('close')" class="close-button">X</div> 
        </div> 

            <ul class="storage-list">
                <li v-for="(itemName, index) in itemNames" v-bind:key="index">
                    <p @click="() => {handleItemNameClick(itemName)}" >{{itemName}}</p>
                    <div @click="() => {handleDeleteButtonClick(itemName)}">x</div>
                </li>
            </ul>

            <form v-if="action === 'save'" @submit="handleSubmit">
                <input v-model="newItemName"/>
                <input type="submit" v-bind:value="action"/>
            </form>
      </div>
    </aside>
</template>

<script>
export default {
    props: ['isOpen', 'title', 'itemNames', "action"],

    data() {
        return {
            newItemName: ''
        }
    },

    methods: {
        handleSubmit(event) {
            event.preventDefault()
            this.$emit('item-name-choice', this.newItemName)
        },

        handleDeleteButtonClick(itemName) {
            this.$emit('item-delete-request', itemName)
        },

        handleItemNameClick(itemName) {
            this.newItemName = itemName
            if (this.action !== 'save') {
                this.$emit('item-name-choice', this.newItemName)
            }
        },
    }
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