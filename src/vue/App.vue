<template>
  <div id="app">
    
    <p v-if="isSignedIn">USER NAME:{{ displayName }}</p>

    <form v-if="!isSignedIn" @submit="signIn" class="sign-in-form">
      <label for="userName">User name:</label>
      <input type="text" name="userName" />
      <input type="submit" value="go"/>
    </form>

    <div class="roll-button-holder">
      <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
      <DiceButton @dice-result="reportRoll" dice="12,12" label="2d12"/>
    </div>

    <PlayersDisplay v-bind:localPlayer="localPlayer" v-bind:otherPlayers="otherPlayers"/>

    <MessageBox v-bind:messages="messages" @write-message="sendMessage" />

  </div>
</template> 

<script>
import DiceButton from './components/DiceButton.vue'
import MessageBox from './components/MessageBox.vue'
import PlayersDisplay from './components/PlayersDisplay.vue'

var io = require('../../node_modules/socket.io-client/dist/socket.io')


export default {
  components: {DiceButton, MessageBox, PlayersDisplay},

  data() {
    return {
      socket: io(),
      userName : '',
      playerId : undefined,
      messages: [],
      gameState: {
        players: []
      }
    };
  },

  computed : {

    isSignedIn() {
      return !!this.userId
    },

    displayName() {
      return this.userName || 'NONE'
    },

    localPlayer() {
      return {userName: this.userName, playerId:this.playerId}
    },

    otherPlayers() {
      return this.gameState.players.filter(player => player.playerId !== this.playerId)
    },
  },

  methods : {

    log (input) {
      console.log('LOG:',input)
    },

    handleRollReport (report) {
      this.messages.push  (report.localPlayer.userName + " " + report.rollData.message)
    },

    handleStateUpdate (stateData) {
      this.$set(this.gameState, 'players', stateData.players)
    },

    requestStateUpdate() {
      this.socket.emit('request-state')
    },

    reportRoll(rollData) {
      const {diceList, results, total, message} = rollData
      this.messages.push("I " + rollData.message)

      this.socket.emit('roll', {localPlayer:this.localPlayer, rollData})
    },

    signIn(event) {

      event.preventDefault();

      if (this.playerId) {
        this.messages.push (`You are already logged in as ${this.displayName}`)
        return false
      }

      // TO DO - SANITISE INPUT!!
      const form = event.target
      const userName = form.elements.userName.value
      this.socket.emit('sign-in', {userName}, this.handleSignInResponse)

    },

    handleSignInResponse (response) {
        if (response.type === 'REFUSAL') {
          this.messages.push (response.message)
          return false
        }
        this.userName = response.userName;
        this.playerId = response.playerId;
    },

    sendMessage (messageText) {
      this.messages.push(`${'me'}: ${messageText}`,)
      this.socket.send(this.playerId, messageText)
    },

    handleMessage (messageData) {
      let sendingPlayer
      this.messages.push(`${messageData.userName}: ${messageData.messageText}`,)
    }

  },

  mounted() {
    this.socket.on('roll', this.handleRollReport );
    this.socket.on('state-update', this.handleStateUpdate );
    this.socket.on('player-message', this.handleMessage );
    this.requestStateUpdate();
  }

};
</script>

<style>

  .roll-button-holder {
    display: flex;
  }

</style>