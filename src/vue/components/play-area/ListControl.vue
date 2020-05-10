<template>
  <div>
    <ul>
        <li v-for="(item, index) in list" v-bind:key="index">
            <input @change="(event)=> {handleChange(event, index)}" type="text" v-bind:value="item"/>
            <span @click="()=> {handleDelete(index)}">X</span>
        </li>
    </ul>
    <p @click="handleAdd">+</p>
  </div> 
</template>

<script>
export default {
    props: ['list', 'quantified'],

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

<style>

</style>