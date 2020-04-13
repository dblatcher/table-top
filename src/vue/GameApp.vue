<template>
  <div id="app">
    
    <h2>{{gameName}}</h2>

    <form v-if="!isSignedIn && !amGamemaster" 
    @submit="signIn" 
    class="sign-in-form">
      <label for="playerName">User name:</label>
      <input type="text" name="playerName" />
      <input type="submit" value="go"/>
    </form>

    <div v-bind:class='{"modal":true, "modal--open":gameHasClosed}'>
      <div class="modal-content">
        <p>GAME CLOSED</p>
        <p><a href="/">return to homepage</a></p>
      </div>
    </div>

    <CloseGameButton v-if="isSignedIn && amGamemaster"  @close-game="requestGameClose"/>

    <div v-if="isSignedIn">

      <p>USER NAME:{{ displayName }}</p>


      <div class="roll-button-holder">
        <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
        <DiceButton @dice-result="reportRoll" dice="12,12" label="2d12"/>
      </div>

      <PlayersDisplay 
      v-bind:players="this.gameState.players" 
      v-bind:playerId="playerId" 
      v-bind:gameMasterId="gameMasterId"/>

      <MessageBox v-bind:messages="messages" @write-message="sendMessage" />
    </div>

  </div>
</template> 

<script>
import DiceButton from './components/DiceButton.vue'
import MessageBox from './components/MessageBox.vue'
import PlayersDisplay from './components/PlayersDisplay.vue'
import CloseGameButton from './components/CloseGameButton.vue'

var io = require('../../node_modules/socket.io-client/dist/socket.io')


export default {
  components: {DiceButton, MessageBox, PlayersDisplay, CloseGameButton},

  data() {

    const metaElement = document.querySelector('#gameMeta')
    const gameId = metaElement ? metaElement.getAttribute('gameId') : undefined
    const gameName = metaElement ? metaElement.getAttribute('gameName') : undefined
    const gameMasterId = metaElement ? metaElement.getAttribute('gameMasterId') : undefined
    const amGamemaster = metaElement ? metaElement.getAttribute('myStatus') === "GM" : undefined

    return {
      socket: io(),
      amGamemaster, gameId, gameMasterId, gameName,
      playerId : false,
      playerName : '',
      messages: [],
      gameState: {
        players: []
      },
      gameHasClosed:false,
    };
  },

  computed : {

    isSignedIn() {
      return !!this.playerId
    },

    displayName() {
      return this.playerName || 'NONE'
    },

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
    },

    requestGameClose() {
      const {gameId, playerId} = this
      console.log('requesting game close...')
      this.socket.emit('gm-closing-game',{gameId, playerId})
    },

    handleGameClosing (data) {
      console.log('game closing:', data)
      this.gameHasClosed = true;
    },

  },

  mounted() {
    this.socket.on('roll', this.handleRollReport );
    this.socket.on('state-update', this.handleStateUpdate );
    this.socket.on('player-message', this.handleMessage );
    this.socket.on('game-closed', this.handleGameClosing );

    if (this.amGamemaster) {
      console.log('I AM THE GM')
      this.socket.emit('gm-sign-in', {
        gameMasterId: this.gameMasterId,
        gameId:this.gameId
      }, this.handleSignInResponse)
    }

  }

};
</script>

<style>

  .roll-button-holder {
    display: flex;
  }

</style>