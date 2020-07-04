<template>
    <form @submit="handleSubmit">
        <div>
            <textarea @input="handleInput"
            v-bind:placeholder="placeholder || ''" 
            name="data"
            ></textarea>
            <button class="button" type="submit">{{buttonText}}</button>
        </div>
        <p class="warning">{{errorMessage}}</p>
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
        position: relative;
        background-color: black;
        margin: .5em 0;
        padding: .5em;
    }

    form>div {
        background: white;
        position: relative;
        margin-top: 1.5em;
        margin-bottom: .5em;
    }

    .button {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    textarea {
        display: block;
        margin: 0;
        min-height: 5rem;
        resize: none;
    }

    .warning {
        margin: 0;
        min-height: 1.5em;
        font-size: small;
        text-align: center;
    }
</style>