<template>
    <div class="list-control">
        <p class="list-control__item" v-for="(item, index) in datum.value" v-bind:key="index">


            <input v-if="datum.quantity" 
            type="number" 
            @change="(event)=> {handleQuantityChange(event, index)}"
            v-bind:value="datum.quantity[index]"/>

            <input @change="(event)=> {handleChange(event, index)}" type="text" v-bind:value="item"/>
            <span class="list-control__button list-control__button--red" @click="()=> {handleDelete(index)}">
                <span>&times;</span>
            </span>
        </p>
        <p class="list-control__item">
            <span class="list-control__button list-control__button--green" @click="handleAdd">
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

    .list-control__button {
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: white;
        border-radius: 50%;
        width: 1em;
        flex-shrink: 0;

        height: 1em;
        line-height: 1em;
        margin-left: .2em;
    }

    .list-control__button>span {
        font-size: small;
        text-align: center;
    } 

    .list-control__button--red {
        background-color: red;
    }

    .list-control__button--green {
        background-color: green;
    }


</style>