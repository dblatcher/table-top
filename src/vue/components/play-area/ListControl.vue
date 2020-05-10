<template>
    <ul>
        <li v-for="(item, index) in datum.value" v-bind:key="index">
            <input @change="(event)=> {handleChange(event, index)}" type="text" v-bind:value="item"/>
            <div class="list-control__button list-control__button--red" @click="()=> {handleDelete(index)}">
                <span>&times;</span>
            </div>
        </li>
        <li>
            <div class="list-control__button list-control__button--green" @click="handleAdd">
                <span>+</span>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: ['datum'],

    methods: {
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

    ul {
        margin: 0;
        padding: 0;
    }

    li {
        list-style: none;
        display: flex;
        margin-bottom: .2em;
        justify-content: flex-end;
    }

    input[type="text"] {
        border: none;
        border-bottom: 1px solid black;
        flex: 1;
        padding: 2px;
    }

    .list-control__button {
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: white;
        border-radius: 50%;
        width: 1em;

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