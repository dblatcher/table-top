<template>
  <section>
      <ul>
        <li v-for="(message, index) in messages" v-bind:key="index">{{message}}</li>
      </ul>
      <form @submit="writeMessage">
        <input type="text" name="messageText" autocomplete="false"/>
        <input type="submit" value="send"/>
      </form>
  </section>
</template>

<script>
export default {
    props: ['messages'],

    methods: {
        writeMessage(event) {
            event.preventDefault()
            // TO DO - SANITISE INPUT!!
            const form = event.target
            const messageText = form.elements.messageText.value
            this.$emit('write-message', messageText)
            form.elements.messageText.value = ""
        }
    },
}

</script>

<style scoped>

    section {
        border: 3px double black;
        background-color: lightslategray;
    }

    ul {
        height: 8rem;
        overflow-y: auto;
    }

    form {
        display: flex;
        margin: .5rem;
        justify-content: space-between;
    }

    input[type="text"] {
        flex: 1;
    }

    input[type="submit"] {
        margin-left: 1rem;
    }

</style>