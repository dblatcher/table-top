<template>
    <form class="storage-control__load-form" @submit="handleSubmit">

        <textarea @input="handleInput"
        v-bind:placeholder="placeholder || ''" 
        name="data"/>

        <p class="warning">{{errorMessage}}</p>

        <button class="button" v-bind:class="{'button--disabled': !currentContent}" type="submit">{{buttonText}}</button>
    </form>
</template>

<script>
export default {

    props: ['placeholder', 'buttonText','importValidateFunction','convertToJson'],

    data() {
        return {
            errorMessage: '',
            currentContent: '',
        }
    },

    methods: {
        handleSubmit(event) {
            event.preventDefault()
            if (event.target.elements.data) {

                this.errorMessage = ""
                let data

                if (this.convertToJson) {
                    try {
                        data = JSON.parse(event.target.elements.data.value)
                    } catch (error) {
                        this.errorMessage = "Data is not in JSON format."
                        return false
                    }
                } else {
                    data = event.target.elements.data.value
                }

                if (typeof this.importValidateFunction === 'function' && !this.importValidateFunction(data)) {
                    this.errorMessage = "Incorrect data"
                    return false
                }

                this.$emit('submit',data)
            }
        },

        handleInput(event) {
            this.errorMessage = ""
            this.currentContent = event.target.value;
            this.$emit('input', event)
        },
    }

}
</script>

<style scoped>

    textarea {
        display: block;
        margin: 0;
        min-height: 5rem;
        resize: none;
    }

</style>