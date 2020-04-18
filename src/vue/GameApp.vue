<template>
  <div id="app">
    
    <h2>{{config.gameName}}</h2>

    <form v-if="!isSignedIn && !config.amGamemaster" 
    @submit="requestEntry" 
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

    <CloseGameButton v-if="isSignedIn && config.amGamemaster"  @close-game="requestGameClose"/>

    <div v-if="isSignedIn">

      <p>USER NAME:{{ displayName }}</p>

      <div class="roll-button-holder">
        <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
        <DiceButton @dice-result="reportRoll" dice="12,12" label="2d12"/>
      </div>

      <PlayersDisplay 
      v-bind:players="this.gameState.players" 
      v-bind:playerId="playerId" 
      v-bind:gameMasterId="config.gameMasterId"/>

      <MessageBox v-bind:messages="messages" @write-message="sendMessage" />
    </div>

  </div>
</template> 

<script>
import DiceButton from './components/DiceButton.vue'
import MessageBox from './components/MessageBox.vue'
import PlayersDisplay from './components/PlayersDisplay.vue'
import CloseGameButton from './components/CloseGameButton.vue'

export default {
  components: {DiceButton, MessageBox, PlayersDisplay, CloseGameButton},

  props: ['config', 'socket'],

  data() {
    return {
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
      this.socket.emit('request-state',this.config.gameId)
    },

    reportRoll(rollData) {
      const {diceList, results, total, message} = rollData
      this.messages.push("I " + rollData.message)

      this.socket.emit('roll', this.playerId, rollData)
    },

    requestEntry(event) {

      event.preventDefault();

      if (this.playerId) {
        this.messages.push (`You are already logged in as ${this.displayName}`)
        return false
      }

      // TO DO - SANITISE INPUT!!
      const form = event.target
      const playerName = form.elements.playerName.value
      this.socket.emit('request-entry', {playerName, gameId:this.config.gameId}, this.handleRequestEntryResponse)

    },

    handleRequestEntryResponse (response) {
        console.log('request-entry response', response)
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
      const {playerId} = this
      const {gameId} = this.config

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

    if (this.config.amGamemaster) {
      console.log('I AM THE GM')
      this.socket.emit('gm-sign-in', {
        gameMasterId: this.config.gameMasterId,
        gameId:this.config.gameId
      }, this.handleRequestEntryResponse)
    }

  }

};
</script>

<style>

  .roll-button-holder {
    display: flex;
  }

</style>