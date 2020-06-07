<template>
  <article> 
      <ul ref="list">
        <li v-for="(message, index) in messages" v-bind:key="index"
        v-bind:class="{'text-message-holder': message.isTextMessage, 'update-message-holder': !message.isTextMessage}">
            <span v-if="message.isTextMessage" class="speaker-name">
                {{formatSpeaker(message)}}
            </span>
            <span v-bind:class="{'text-message': message.isTextMessage, 'update-message': !message.isTextMessage}">
                {{formatMessage(message)}}
            </span>
        </li>
      </ul>
      <form @submit="writeMessage">
        <input type="text" name="messageText" autocomplete="false"/>
        <input type="submit" value="send"/>
      </form>
  </article>
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
        },

        formatSpeaker(message) {
            if (message.isFromSelf) {
                return 'me: '
            }
            return `${message.player ? message.player.playerName : '??'}: `
        },

        formatMessage(message) {

            if (message.isTextMessage) {return message.text}
            let playerName = message.player ? message.player.playerName : '??'
            if (message.isFromSelf) { playerName = 'I'}

            if (message.text.includes('$playerName$')) {
                return message.text.replace('$playerName$', playerName) 
            }

            return `${playerName} ${message.text}`
        },
    },

    updated() {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
    }
}

</script>

<style scoped>

    .speaker-name {
        font-weight: bold;
    }

    .text-message {
        font-style: italic;
    }

    .update-message {
        font-style: italic;
    }

    article {
        min-width: 10rem;
    }

    ul {
        height: 10rem;
        overflow-y: scroll;
        margin: 0;
        list-style: none;
        padding: 0;
    }

    li {
        font-size: small;
        margin: .2rem .5rem;
    }

    li:last-child {
        border-bottom: 3px double black;
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