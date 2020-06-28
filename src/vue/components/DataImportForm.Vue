<template>
    <form @submit="handleImportData">
        <textarea v-bind:placeholder="placeholder || '' " name="data"></textarea>
        <button class="button" type="submit">{{buttonText}}</button>
    </form>
</template>

<script>
export default {

    props: ['placeholder', 'buttonText'],

    methods: {
        handleImportData(event) {
            event.preventDefault()
            if (event.target.elements.data) {
            this.$emit('submit',event.target.elements.data.value)
            }
        },
    }

}
</script>

<style scoped>

    form {
        display: block;
        margin: .5em 0;
    }

    textarea {
        display: block;
        margin: 0 .5em;
        min-height: 6rem;
        resize: none;
    }
</style>