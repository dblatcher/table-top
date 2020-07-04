<template>
    <form @submit="handleSubmit">
        <textarea @input="handleInput"
        v-bind:placeholder="placeholder || ''" 
        name="data"
        ></textarea>
        <button class="button" type="submit">{{buttonText}}</button>
        <p class="warning" v-show="errorMessage">{{errorMessage}}</p>
    </form>
</template>

<script>
export default {

    props: ['placeholder', 'buttonText','importValidateFunction','convertToJson'],

    data() {
        return {
            errorMessage:'',
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
            this.$emit('input', event)
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