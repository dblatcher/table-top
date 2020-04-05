<template>
  <div id="app">
    
    <p v-if="this.userName">USER NAME:{{ displayName }}</p>

    <form v-if="!this.userName" @submit="signIn" class="sign-in-form">
      <label for="userName">User name:</label>
      <input type="text" name="userName" />
      <input type="submit" value="go"/>
    </form>

    <p class="new-message">{{ message }}</p>

    <div class="roll-button-holder">
      <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
      <DiceButton @dice-result="reportRoll" dice="12,12" label="2d12"/>
    </div>

  </div>
</template>

<script>
import DiceButton from './components/DiceButton.vue'

var io = require('../../node_modules/socket.io-client/dist/socket.io')


export default {
  components: {DiceButton},

  data() {
    return {
      message: 'Hello World - this is a test Vue app injected into index.ejs by app.js',
      socket: io(),
      userName : undefined,
      userId : undefined
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
      this.message = report.localPlayer.userName + " " + report.rollData.message
    },

    reportRoll(rollData) {
      const {diceList, results, total, message} = rollData
      console.log(message)

      this.socket.emit('roll', {localPlayer:this.localPlayer, rollData})
    },

    signIn(event) {

      event.preventDefault();

      if (this.userId) {
        alert (`You are already logged in as ${this.displayName}`)
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
          alert (response.message)
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
  .new-message {
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    color: blue;
  }

  .roll-button-holder {
    display: flex;
  }

  .roll-button-holder  p {
      border: 1px solid black;
      margin: 0 1rem;
      cursor: pointer;
  }

</style>