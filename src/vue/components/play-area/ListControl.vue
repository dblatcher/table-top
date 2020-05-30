<template>
    <div class="list-control">
        <p class="list-control__item" v-for="(item, index) in datum.value" v-bind:key="index">


            <input v-if="datum.quantity" 
            type="number" 
            @change="(event)=> {handleQuantityChange(event, index)}"
            v-bind:value="datum.quantity[index]"/>

            <input @change="(event)=> {handleChange(event, index)}" type="text" v-bind:value="item"/>
            <span class="stud-button stud-button--red" @click="()=> {handleDelete(index)}">
                <span>&times;</span>
            </span>
        </p>
        <p class="list-control__item">
            <span class="stud-button stud-button--green" @click="handleAdd">
                <span>+</span>
            </span>
        </p>
    </div>
</template>

<script>
export default {
    props: ['datum'],

    methods: {
        handleQuantityChange(event, index) {
            this.$emit('change-quantity', {newValue:event.target.value, index})
        },
        handleChange(event, index) {
            this.$emit('change-item', {newValue:event.target.value, index})
        },
        handleDelete(index) {
            this.$emit('delete-item', {index})
        },
        handleAdd() {
            this.$emit('new-item')
        }
    }
}
</script>

<style scoped>

    .list-control {
        margin: 0;
        padding: 0;
        max-width: 100%;
        background-color: antiquewhite;
        width: 100%;
    }

    .list-control__item {
        max-width: 100%;
        list-style: none;
        display: flex;
        margin: 0;
        margin-bottom: .2em;
        justify-content: flex-end;
    }

    input {
        border: none;
        border-bottom: 1px solid black;
        padding: 2px;
    }

    input[type="text"] {
        width: 5em;
        flex-shrink: 1;
        flex-basis: 100%;
    }

    input[type="number"] {
        width: 3em;
        flex-shrink: 0;
        padding-right: .25em;
        margin-right: .2em;
    }



</style>