<template>
  <div id="app">
    
    <p v-if="this.userName">USER NAME:{{ displayName }}</p>

    <form v-if="!this.userName" @submit="signIn" class="sign-in-form">
      <label for="userName">User name:</label>
      <input type="text" name="userName" />
      <input type="submit" value="go"/>
    </form>

    <div class="roll-button-holder">
      <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
      <DiceButton @dice-result="reportRoll" dice="12,12" label="2d12"/>
    </div>

    <MessageBox v-bind:messages="messages" />

  </div>
</template>

<script>
import DiceButton from './components/DiceButton.vue'
import MessageBox from './components/MessageBox.vue'

var io = require('../../node_modules/socket.io-client/dist/socket.io')


export default {
  components: {DiceButton, MessageBox},

  data() {
    return {
      message: 'Hello World - this is a test Vue app injected into index.ejs by app.js',
      socket: io(),
      userName : undefined,
      userId : undefined,
      messages: [],
    };
  },

  computed : {
    displayName() {
      return this.userName || 'NONE'
    },

    localPlayer() {
      return {userName: this.userName, userId:this.userId}
    }
  },

  methods : {

    log (input) {
      console.log(input)
    },

    handleRollReport (report) {
      this.messages.push  (report.localPlayer.userName + " " + report.rollData.message)
    },

    reportRoll(rollData) {
      const {diceList, results, total, message} = rollData
      this.messages.push("I " + rollData.message)

      this.socket.emit('roll', {localPlayer:this.localPlayer, rollData})
    },

    signIn(event) {

      event.preventDefault();

      if (this.userId) {
        this.messages.push (`You are already logged in as ${this.displayName}`)
        return false
      }

      // TO DO - SANITISE INPUT!!
      const form = event.target
      const userName = form.elements.userName.value
      this.socket.emit('sign-in', {userName}, this.handleSignInResponse)

    },

    handleSignInResponse (response) {
      console.log(response)
        if (response.type === 'REFUSAL') {
          this.messages.push (response.message)
          return false
        }
        this.userName = response.userName;
        this.userId = response.userId;
    }

  },

  mounted() {
    this.socket.on('roll', this.handleRollReport );
  }

};
</script>

<style>

  .roll-button-holder {
    display: flex;
  }

</style>