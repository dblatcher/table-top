<template>
    <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">
        <div class="close-button-holder">
            <div  @click="$emit('close')" class="close-button">X</div> 
        </div> 
        <h3>{{title}}</h3>
        
            <ul>
                <li v-for="(itemName, index) in itemNames" 
                v-bind:key="index"
                @click="function(){newItemName=itemName}"
                >{{itemName}}</li> 
            </ul>
            <form @submit="handleSubmit">
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
        }
    }
}
</script>

<style>

</style>