<template>
  <div id="app">
    
    <p v-if="isSignedIn">USER NAME:{{ displayName }}</p>

    <form v-if="!isSignedIn" @submit="signIn" class="sign-in-form">
      <label for="playerName">User name:</label>
      <input type="text" name="playerName" />
      <input type="submit" value="go"/>
    </form>

    <div class="roll-button-holder">
      <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
      <DiceButton @dice-result="reportRoll" dice="12,12" label="2d12"/>
    </div>

    <PlayersDisplay v-bind:localPlayer="localPlayer" v-bind:gameMaster="gameMaster" v-bind:otherPlayers="otherPlayers"/>

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

    const metaElement = document.querySelector('#gameMeta')
    const gameId = metaElement ? metaElement.getAttribute('gameId') : undefined
    const gameMasterId = metaElement ? metaElement.getAttribute('gameMasterId') : undefined

    return {
      socket: io(),
      playerName : '',
      playerId : undefined,
      gameId,
      gameMasterId,
      messages: [],
      gameState: {
        players: []
      }
    };
  },

  computed : {

    isSignedIn() {
      return !!this.playerId
    },

    displayName() {
      return this.playerName || 'NONE'
    },

    localPlayer() {
      return {playerName: this.playerName, playerId:this.playerId}
    },

    otherPlayers() {
      return this.gameState.players.filter(
        player => player.playerId !== this.playerId && player.playerId !== this.gameMasterId
      )
    },

    gameMaster() {
      return this.gameState.players.filter(player => player.playerId === this.gameMasterId)[0]
    }
  },

  methods : {

    log (input) {
      console.log('LOG:',input)
    },

    handleRollReport (report) {
      console.log('roll report:', report)
      this.messages.push  (report.player.playerName + " " + report.rollData.message)
    },

    handleStateUpdate (response) {
      console.log('state update:', response)
      if (response.type === 'REFUSAL') {
          this.messages.push (response.message)
          return false
      }
      this.$set(this.gameState, 'players', response.players)
    },

    requestStateUpdate() {
      this.socket.emit('request-state',this.gameId)
    },

    reportRoll(rollData) {
      const {diceList, results, total, message} = rollData
      this.messages.push("I " + rollData.message)

      this.socket.emit('roll', this.playerId, rollData)
    },

    signIn(event) {

      event.preventDefault();

      if (this.playerId) {
        this.messages.push (`You are already logged in as ${this.displayName}`)
        return false
      }

      // TO DO - SANITISE INPUT!!
      const form = event.target
      const playerName = form.elements.playerName.value
      this.socket.emit('sign-in', {playerName, gameId:this.gameId}, this.handleSignInResponse)

    },

    handleSignInResponse (response) {
        console.log('sign-in response', response)
        if (response.type === 'REFUSAL') {
          this.messages.push (response.message)
          return false
        }
        this.playerName = response.playerName;
        this.playerId = response.playerId;

        this.requestStateUpdate();
    },

    sendMessage (messageText) {
      this.messages.push(`${'me'}: ${messageText}`,)
      this.socket.send(this.playerId, messageText)
    },

    handleMessage (messageData) {
      let sendingPlayer
      this.messages.push(`${messageData.playerName}: ${messageData.messageText}`,)
    }

  },

  mounted() {
    this.socket.on('roll', this.handleRollReport );
    this.socket.on('state-update', this.handleStateUpdate );
    this.socket.on('player-message', this.handleMessage );

  }

};
</script>

<style>

  .roll-button-holder {
    display: flex;
  }

</style>